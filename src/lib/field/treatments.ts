import type {
  DrawContext,
  PigmentName,
  Treatment,
  TreatmentName,
} from "./types";

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
// lines: long fine strokes at two fixed angles, in all four pigments.
// Reference frames 600, 1370, 1404, 1470.
//
// The hero. Four qualities carry it, and dropping any one of them is what made
// the first attempt at a hero field read as tacky:
//
//   THIN. One or two CSS pixels. The reference never uses a thick diagonal.
//   LONG. Each stroke crosses most of the frame, so the composition is made of
//     relationships between lines rather than of isolated marks.
//   ANGLED COHERENTLY. Two families, not a scatter. Frames 600 and 1470 both
//     show exactly two angles crossing, and that is where the structure reads.
//   DENSE. Frame 1404 carries roughly thirty parallel strokes at once.
//
// This is also the one place on the site licensed to be polychrome, so it takes
// all four pigments rather than the section's single hue.
// ---------------------------------------------------------------------------

/** Two angle families, in radians. Shallow and steep, as in frames 600 and 1470. */
const LINE_ANGLES = [(-28 * Math.PI) / 180, (-63 * Math.PI) / 180];

/**
 * Pigment mix.
 *
 * Weighted rather than uniform: the reference's polychrome cards are never four
 * equal quarters. One hue dominates and the others read as exceptions, which is
 * what keeps a four-colour field from looking like a test pattern.
 */
const LINE_PIGMENT_MIX: PigmentName[] = [
  "shu",
  "shu",
  "shu",
  "ai",
  "ai",
  "moegi",
  "kihada",
];

const LINE_COUNT = 78;

interface FieldLine {
  family: number;
  /** Position along the perpendicular axis, 0..1, before drift. */
  offset: number;
  pigment: PigmentName;
  /** CSS pixels. Mostly hairlines. */
  width: number;
  /** Fraction of the frame diagonal this stroke spans. */
  length: number;
  /** Stable cull order. See the note on Bar.rank. */
  rank: number;
  /** Carries a chromatic fringe, as in frame 1370. */
  prismatic: boolean;
  /** Fringe partner, drawn one pixel off the stroke. */
  fringe: PigmentName;
}

const LINES: FieldLine[] = (() => {
  const rand = mulberry32(0x51ed270b);

  return Array.from({ length: LINE_COUNT }, (_, i) => ({
    // Alternating rather than random, so neither family ever thins out.
    family: i % 2,
    offset: rand(),
    pigment: LINE_PIGMENT_MIX[Math.floor(rand() * LINE_PIGMENT_MIX.length)],
    width: rand() > 0.86 ? 2 : 1,
    length: 0.45 + rand() * 0.85,
    rank: rand(),
    prismatic: rand() > 0.82,
    fringe: LINE_PIGMENT_MIX[Math.floor(rand() * LINE_PIGMENT_MIX.length)],
  }));
})();

/** Drift along the perpendicular axis, in diagonals per second. Per family. */
const LINE_DRIFT = [0.017, -0.011];

export const lines: Treatment = ({
  ctx,
  box,
  t,
  density,
  palette,
  dark,
  strength,
}) => {
  const cx = box.width / 2;
  const cy = box.height / 2;
  const diagonal = Math.hypot(box.width, box.height);
  const cull = 0.3 + 0.7 * density;

  ctx.lineCap = "butt";

  for (const line of LINES) {
    if (line.rank > cull) continue;

    const angle = LINE_ANGLES[line.family];
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    // The perpendicular, which is the axis the stroke slides along.
    const px = -dy;
    const py = dx;

    const travel =
      (wrap01(line.offset + t * LINE_DRIFT[line.family]) - 0.5) *
      diagonal *
      1.5;
    const mx = cx + px * travel;
    const my = cy + py * travel;
    const half = (diagonal * line.length) / 2;

    const x1 = mx - dx * half;
    const y1 = my - dy * half;
    const x2 = mx + dx * half;
    const y2 = my + dy * half;

    ctx.lineWidth = line.width;

    /*
     * The chromatic fringe from frame 1370: a companion stroke one pixel off
     * the perpendicular in a different pigment. At a hairline width the two
     * read as a single line with a colour split along its edge rather than as
     * two lines, which is exactly the effect in the reference.
     */
    if (line.prismatic) {
      ctx.globalAlpha = 0.5 * strength;
      ctx.strokeStyle = palette[line.fringe];
      ctx.beginPath();
      ctx.moveTo(x1 + px, y1 + py);
      ctx.lineTo(x2 + px, y2 + py);
      ctx.stroke();
    }

    // Near full in both modes. These are hairlines, so alpha buys nothing but
    // desaturation: at 0.8 the light-mode indigo and moegi read as washed
    // pastel rather than as pigment.
    ctx.globalAlpha = (dark ? 1 : 0.95) * strength;
    ctx.strokeStyle = palette[line.pigment];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
};

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
  lines,
  bars,
  // Added in the next step. Falling back rather than throwing keeps a
  // half-wired section rendering something instead of a blank canvas.
  rail: lines,
  ribbon: lines,
  lattice: lines,
  diagonal: lines,
  planes: lines,
};

export function getTreatment(name: TreatmentName): Treatment {
  return TREATMENTS[name] ?? lines;
}

export type { DrawContext };
