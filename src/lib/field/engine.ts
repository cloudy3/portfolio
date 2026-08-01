import { readPalette, invalidatePalette } from "./pigments";
import { getFieldEntries, subscribeToFields, type FieldEntry } from "./registry";
import { getTreatment } from "./treatments";
import type { Rect } from "./types";

/**
 * The field engine.
 *
 * One canvas for the entire site, sized to the viewport and fixed behind the
 * page, recomposed as each registered section scrolls into view. Not one canvas
 * per section: the reference is a single graphic system re-photographed per
 * card, and a single element with a single rAF loop is also the only version of
 * this that is affordable on a site whose LCP is already the problem.
 */

/** Matches MAX_DPR in lib/keyboardStory.ts, the project's other canvas. */
const MAX_DPR = 2;

/**
 * The breathing period, in seconds.
 *
 * Element count and opacity fall to near nothing and refill on this cycle,
 * while velocity stays constant. That combination is what stops a generative
 * field reading as a screensaver, and it is where the ma lives: the composition
 * is allowed to become almost empty. Measured off the reference at roughly one
 * second; slowed here because a web page is read, not watched.
 */
const FIELD_PERIOD = 6;

/** Seconds for one composition to hand over to the next. */
const CROSSFADE = 0.7;

/**
 * The global strength dial.
 *
 * The plan's one judgement call: the compositions are bold rather than faint
 * background texture, because that is where the reference's impact lives and
 * the keep-out rect is what makes it safe. If it shouts, this is the constant
 * to turn down.
 */
const STRENGTH = 0.8;

/**
 * Breathing room around the type, in CSS pixels.
 *
 * Clipping flush to the text box lets strokes graze the descenders, which reads
 * as a near miss rather than as a decision. The reference always leaves a clear
 * margin around its credits.
 */
const KEEP_OUT_PAD = 28;

export interface FieldOptions {
  reduced: boolean;
  dark: boolean;
}

export interface FieldHandle {
  stop(): void;
  setTheme(dark: boolean): void;
  setReduced(reduced: boolean): void;
}

interface ActiveComposition {
  entry: FieldEntry;
  /** Seconds this composition has been drawing. */
  elapsed: number;
}

export function createField(
  canvas: HTMLCanvasElement,
  options: FieldOptions
): FieldHandle {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    // No 2D context is a genuinely broken environment rather than an old one.
    // The page is fully readable without the field, so fail quiet.
    return {
      stop: () => {},
      setTheme: () => {},
      setReduced: () => {},
    };
  }

  let { reduced, dark } = options;
  let width = 0;
  let height = 0;
  let frame: number | null = null;
  let lastTime = 0;
  let stopped = false;

  let current: ActiveComposition | null = null;
  let outgoing: ActiveComposition | null = null;
  let crossfade = 0;

  const visible = new Set<HTMLElement>();

  /* ---- sizing ---------------------------------------------------------- */

  function resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (reduced) drawOnce();
  }

  /* ---- which section owns the field ------------------------------------ */

  let observer: IntersectionObserver | null = null;

  function pickActive(): void {
    const entries = getFieldEntries();
    // Document order, so overlapping sections resolve to the lower one. Same
    // rule the nav's active-section observer uses.
    const next = entries.find((entry) => visible.has(entry.el)) ?? null;

    if (next?.el === current?.entry.el) return;

    if (current) {
      outgoing = current;
      crossfade = 1;
    }
    current = next ? { entry: next, elapsed: 0 } : null;

    if (reduced) drawOnce();
  }

  function rebuildObserver(): void {
    observer?.disconnect();
    visible.clear();

    observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          const el = record.target as HTMLElement;
          if (record.isIntersecting) visible.add(el);
          else visible.delete(el);
        }
        pickActive();
        ensureRunning();
      },
      // A section owns the field once it occupies the reading area, not the
      // moment its top edge appears.
      { rootMargin: "-25% 0px -25% 0px" }
    );

    for (const entry of getFieldEntries()) observer.observe(entry.el);
    pickActive();
  }

  /* ---- drawing --------------------------------------------------------- */

  /**
   * The keep-out rect, in viewport pixels.
   *
   * One getBoundingClientRect per frame, on one element. The forced layout this
   * would normally cost is nearly free here because the only thing the loop
   * touches is the canvas bitmap, which never invalidates layout, so every read
   * hits a clean tree. This is not the pattern the nav's old scroll listener
   * was replaced for: that ran six rects per scroll EVENT, unthrottled, which
   * is many per frame.
   *
   * Falls back to an empty rect in the middle of the viewport when a section
   * declares no keep-out, which simply means the composition uses the whole
   * frame.
   */
  function keepOutRect(entry: FieldEntry): Rect {
    if (!entry.keepOut) return { x: 0, y: 0, width: 0, height: 0 };
    const r = entry.keepOut.getBoundingClientRect();

    if (entry.keepOutMode === "column") {
      // Horizontal extent only, full height. The composition sits beside the
      // text rather than also wrapping above and below it, which is what stops
      // elements terminating at an invisible horizontal line in mid-frame.
      return { x: r.left - KEEP_OUT_PAD, y: 0, width: r.width + KEEP_OUT_PAD * 2, height };
    }

    return {
      x: r.left - KEEP_OUT_PAD,
      y: r.top - KEEP_OUT_PAD,
      width: r.width + KEEP_OUT_PAD * 2,
      height: r.height + KEEP_OUT_PAD * 2,
    };
  }

  function paint(composition: ActiveComposition, density: number): void {
    const { entry, elapsed } = composition;
    const palette = readPalette();
    const keepOut = keepOutRect(entry);

    ctx!.save();

    // Everything outside the type. even-odd turns the two rects into a frame
    // with a hole in it, which is the whole composition-around-the-type idea in
    // one call: treatments draw freely and are cut where the words are.
    if (keepOut.width > 0 && keepOut.height > 0) {
      const clip = new Path2D();
      clip.rect(0, 0, width, height);
      clip.rect(keepOut.x, keepOut.y, keepOut.width, keepOut.height);
      ctx!.clip(clip, "evenodd");
    }

    getTreatment(entry.treatment)({
      ctx: ctx!,
      box: { x: 0, y: 0, width, height },
      keepOut,
      t: elapsed,
      density,
      pigment: palette.pigments[entry.pigment],
      palette: palette.pigments,
      ink: palette.ink,
      dark,
      strength: STRENGTH,
    });

    ctx!.restore();
  }

  /** The breathing envelope. Never quite reaches zero, never quite rests at full. */
  function envelope(elapsed: number): number {
    const phase = (elapsed / FIELD_PERIOD) * Math.PI * 2;
    return 0.05 + 0.95 * (0.5 - 0.5 * Math.cos(phase));
  }

  function render(): void {
    ctx!.clearRect(0, 0, width, height);

    if (outgoing && crossfade > 0) {
      // The outgoing composition collapses faster than the incoming one builds,
      // so there is a real trough between sections rather than a dissolve.
      paint(outgoing, envelope(outgoing.elapsed) * crossfade * crossfade);
    }
    if (current) {
      paint(current, envelope(current.elapsed) * (1 - crossfade));
    }
  }

  /** Reduced motion: one static frame of the current composition, no loop. */
  function drawOnce(): void {
    if (!current) {
      ctx!.clearRect(0, 0, width, height);
      return;
    }
    ctx!.clearRect(0, 0, width, height);
    // A composed still rather than an unrelated gradient. Reduced-motion
    // visitors get the design, just held.
    paint({ entry: current.entry, elapsed: FIELD_PERIOD / 4 }, 0.85);
  }

  /* ---- the loop -------------------------------------------------------- */

  function tick(now: number): void {
    frame = null;
    if (stopped) return;

    const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 0;
    lastTime = now;

    if (current) current.elapsed += delta;
    if (outgoing) {
      outgoing.elapsed += delta;
      crossfade = Math.max(0, crossfade - delta / CROSSFADE);
      if (crossfade === 0) outgoing = null;
    }

    render();

    if (shouldRun()) {
      frame = requestAnimationFrame(tick);
    } else {
      markRunning(false);
    }
  }

  function shouldRun(): boolean {
    return !stopped && !reduced && !document.hidden && current !== null;
  }

  function markRunning(running: boolean): void {
    // Read by the verification probe. Asserting on a data attribute is the only
    // way to check the loop actually parks without reaching into internals.
    canvas.dataset.fieldRunning = running ? "true" : "false";
  }

  function ensureRunning(): void {
    if (reduced) {
      drawOnce();
      markRunning(false);
      return;
    }
    if (frame !== null || !shouldRun()) return;
    lastTime = 0;
    markRunning(true);
    frame = requestAnimationFrame(tick);
  }

  /* ---- wiring ---------------------------------------------------------- */

  const onVisibility = () => {
    if (document.hidden) {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      markRunning(false);
    } else {
      ensureRunning();
    }
  };

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", onVisibility);
  const unsubscribe = subscribeToFields(() => {
    rebuildObserver();
    ensureRunning();
  });

  resize();
  rebuildObserver();
  ensureRunning();

  return {
    stop() {
      stopped = true;
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      observer?.disconnect();
      unsubscribe();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      markRunning(false);
    },
    setTheme(nextDark: boolean) {
      dark = nextDark;
      invalidatePalette();
      if (reduced) drawOnce();
    },
    setReduced(nextReduced: boolean) {
      reduced = nextReduced;
      if (reduced && frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
      ensureRunning();
    },
  };
}
