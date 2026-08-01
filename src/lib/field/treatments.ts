import type { DrawContext, Treatment, TreatmentName } from "./types";

/**
 * The compositions.
 *
 * Each is a pure draw function. The engine has already sized the canvas,
 * cleared it, and clipped to everything outside the keep-out rect, so a
 * treatment can draw across the whole viewport and trust that it will not land
 * on the type.
 *
 * Every composition here is taken from the reference rather than invented. The
 * frame numbers in each doc comment are the ones it was read from.
 */

/**
 * Deterministic PRNG (mulberry32).
 *
 * The element table is built once at module scope and never regenerated, so a
 * composition is identical across frames, resizes and remounts. Random
 * placement per frame would boil, and random placement per mount would mean the
 * hero looked different on every reload, which is the opposite of designed.
 */
function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Wraps to 0..1 for elements that drift and re-enter from the far side. */
function wrap01(value: number): number {
  return value - Math.floor(value);
}

/**
 * No bloom, deliberately.
 *
 * Two versions were tried and both were worse than none. A wide low-alpha rect
 * in source-over paints a grey box around every bar. The same rect in `lighter`
 * does add light rather than covering, but a hard-edged rectangle has no
 * falloff, so on a near-black ground it reads as a dark maroon slab with a
 * visible border, not as glow.
 *
 * Real falloff needs either a per-bar gradient or a canvas blur filter, both of
 * which are per-element allocations in the hot loop for an effect the
 * composition does not depend on. The reference's own light cards have no glow
 * at all, and its dark cards read primarily as flat colour; flat is the honest
 * version of this at the budget available.
 */

// ---------------------------------------------------------------------------
// bars: vertical segments on the lane grid, drifting horizontally.
// Reference frames 5, 22, 1396.
//
// The defining detail is that a bar is not one solid colour. In frame 22 a
// single bar runs magenta at the top, black in the middle and blue at the
// bottom: bars are small stacks, not fills. Thickness ranges from a hairline to
// a 40px block and reads as an amplitude envelope across the row.
// ---------------------------------------------------------------------------

interface Bar {
  /** Which slot on the regular pitch this bar occupies. */
  slot: number;
  /** 0, 1 or 2. Bars group into horizontal bands rather than scattering. */
  band: number;
  /** Offset from the band centre, as a fraction of viewport height. */
  drift: number;
  /** Extent, as a fraction of viewport height. */
  length: number;
  /** 0 is a hairline, 1 is a block. Squared on use, so most bars stay thin. */
  weight: number;
  /** How many stacked colour segments this bar is cut into. */
  segments: number;
  /** Segments alternate from this starting colour. */
  startsInk: boolean;
  /** Rolled once so ink placement is stable rather than reshuffling per frame. */
  inkRoll: number;
  /**
   * Cull order, 0..1. A bar is drawn while `rank < density`.
   *
   * This exists because culling by array index removes bars in slot order,
   * which means the breathing envelope eats the composition from one side of
   * the frame to the other. With the keep-out taking the middle of the
   * viewport, that emptied the entire right-hand strip and left three bars on
   * the left. A stable random rank thins the field evenly across space.
   */
  rank: number;
}

/** Slots across the wrap width. Occupancy is sparse, the pitch is not. */
const SLOT_COUNT = 72;

/** Band centres, as fractions of viewport height. */
const BANDS = [0.17, 0.5, 0.83];

/**
 * One shared drift rate, in wrap widths per second.
 *
 * Every bar moves together. Per-bar speeds were the first version and were
 * wrong: they turn a composition into a screensaver, because nothing holds its
 * relationship to anything else. The reference sweeps its bars as one coherent
 * pass (frames 1 through 12) and lets thickness and length carry the variation.
 */
const DRIFT = 0.011;

const BARS: Bar[] = (() => {
  const rand = mulberry32(0x9e3779b9);
  const bars: Bar[] = [];

  for (let slot = 0; slot < SLOT_COUNT; slot += 1) {
    // Sparse occupancy on a regular pitch is what makes it read as composed
    // rather than sprinkled.
    if (rand() > 0.62) continue;

    bars.push({
      slot,
      band: Math.floor(rand() * BANDS.length),
      drift: (rand() - 0.5) * 0.16,
      length: 0.08 + rand() * rand() * 0.42,
      weight: rand(),
      segments: 1 + Math.floor(rand() * rand() * 3),
      startsInk: rand() > 0.5,
      inkRoll: rand(),
      rank: rand(),
    });
  }

  return bars;
})();

export const bars: Treatment = ({
  ctx,
  box,
  t,
  density,
  pigment,
  ink,
  dark,
  strength,
}) => {
  // Population is the primary breathing mechanism, opacity the secondary one.
  // Measured off the reference: between frames 1396 and 1408 the element count
  // drops by roughly two thirds while the survivors keep their velocity.
  const cull = 0.25 + 0.75 * density;
  const wrapWidth = box.width + 360;

  /*
   * How often a bar mixes in ink rather than pigment.
   *
   * On a cream ground the reference cuts its bars with black and it is the best
   * thing about frame 22. On a dark ground the same move produces grey, which
   * is just noise next to white body copy, so dark cards there stay essentially
   * monochrome in the pigment with only one or two exceptions (frame 1400 is
   * all magenta but for two blue bars).
   */
  const inkShare = dark ? 0.12 : 0.42;

  for (const bar of BARS) {
    if (bar.rank > cull) continue;

    const x = wrap01(bar.slot / SLOT_COUNT + t * DRIFT) * wrapWidth - 180;
    const thickness = (1.5 + bar.weight ** 2.4 * 30) * strength;
    const height = bar.length * box.height * (0.45 + 0.55 * density);
    const top = (BANDS[bar.band] + bar.drift) * box.height - height / 2;

    const segmentHeight = height / bar.segments;
    const usesInk = bar.inkRoll < inkShare;

    for (let s = 0; s < bar.segments; s += 1) {
      const isInk = usesInk && (bar.startsInk ? s % 2 === 0 : s % 2 === 1);
      const colour = isInk ? ink : pigment;
      // Opaque. The reference's bars are flat fills; earlier passes here at
      // 0.55 and then 0.87 both read as washed-out salmon rather than as
      // vermilion, because alpha over the ground desaturates before it dims.
      // Presence comes from `strength` and from the breathing envelope, not
      // from painting every element half-there.
      const alpha = strength;
      const segmentTop = top + s * segmentHeight;

      ctx.fillStyle = colour;
      ctx.globalAlpha = alpha;
      ctx.fillRect(x - thickness / 2, segmentTop, thickness, segmentHeight);
    }
  }

  ctx.globalAlpha = 1;
};

export const TREATMENTS: Record<TreatmentName, Treatment> = {
  bars,
  // Added in the next step. Falling back to `bars` rather than throwing keeps a
  // half-wired section rendering something instead of a blank canvas.
  rail: bars,
  ribbon: bars,
  lattice: bars,
  diagonal: bars,
  planes: bars,
};

export function getTreatment(name: TreatmentName): Treatment {
  return TREATMENTS[name] ?? bars;
}

export type { DrawContext };
