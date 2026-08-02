import { vi } from "vitest";
import {
  FIELD_MATERIAL,
  getTreatment,
  TREATMENTS,
  TREATMENT_PROFILES,
} from "../treatments";
import type { DrawContext, PigmentName } from "../types";

/**
 * Treatment coverage, ported from WaveLineVisualization.test.tsx.
 *
 * That suite asserted things like "uses the default vibrant palette" and
 * "reduces line count on mobile" by checking that a mocked react-three-fiber
 * canvas rendered, which never actually exercised the drawing. Treatments are
 * pure functions, so the same intent can be tested for real: give one a
 * recording context and assert on what it drew.
 *
 * jsdom has no 2D context, which is exactly why this records calls rather than
 * rasterising. Pixel-level guarantees (nothing inside the keep-out) are
 * verified against a real browser instead; see gates.js in the scratchpad.
 */

interface Recorder {
  ctx: CanvasRenderingContext2D;
  strokes: number;
  fills: number;
  colours: Set<string>;
  lineWidths: Set<number>;
  /** Every composite mode the treatment left behind, to catch leaks. */
  finalAlpha: () => number;
}

function recordingContext(): Recorder {
  let strokes = 0;
  let fills = 0;
  const colours = new Set<string>();
  const lineWidths = new Set<number>([1]);
  const state = {
    globalAlpha: 1,
    strokeStyle: "",
    fillStyle: "",
    lineWidth: 1,
  };

  const ctx = {
    get globalAlpha() {
      return state.globalAlpha;
    },
    set globalAlpha(v: number) {
      state.globalAlpha = v;
    },
    get strokeStyle() {
      return state.strokeStyle;
    },
    set strokeStyle(v: string) {
      state.strokeStyle = v;
      colours.add(v);
    },
    get fillStyle() {
      return state.fillStyle;
    },
    set fillStyle(v: string) {
      state.fillStyle = v;
      colours.add(v);
    },
    get lineWidth() {
      return state.lineWidth;
    },
    set lineWidth(v: number) {
      state.lineWidth = v;
      lineWidths.add(v);
    },
    lineCap: "butt",
    globalCompositeOperation: "source-over",
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    bezierCurveTo: vi.fn(),
    stroke: vi.fn(() => {
      strokes += 1;
    }),
    fill: vi.fn(() => {
      fills += 1;
    }),
    fillRect: vi.fn(() => {
      fills += 1;
    }),
  } as unknown as CanvasRenderingContext2D;

  return {
    ctx,
    get strokes() {
      return strokes;
    },
    get fills() {
      return fills;
    },
    colours,
    lineWidths,
    finalAlpha: () => state.globalAlpha,
  };
}

const PALETTE: Record<PigmentName, string> = {
  shu: "#d33c22",
  ai: "#2b4a8b",
  moegi: "#6f8f22",
  kihada: "#b8860b",
};

function drawContext(
  recorder: Recorder,
  overrides: Partial<DrawContext> = {}
): DrawContext {
  return {
    ctx: recorder.ctx,
    box: { x: 0, y: 0, width: 1440, height: 900 },
    keepOut: { x: 140, y: 250, width: 870, height: 470 },
    t: 3,
    density: 1,
    pigment: PALETTE.shu,
    palette: PALETTE,
    ink: "#16181c",
    dark: true,
    strength: 0.8,
    ...overrides,
  };
}

describe("field treatments", () => {
  it("defines a calibrated profile for every treatment", () => {
    expect(Object.keys(TREATMENT_PROFILES).sort()).toEqual(
      Object.keys(TREATMENTS).sort()
    );

    for (const profile of Object.values(TREATMENT_PROFILES)) {
      expect(profile.energy).toBeGreaterThanOrEqual(0.55);
      expect(profile.energy).toBeLessThanOrEqual(1);
      expect(profile.tempo).toBeGreaterThanOrEqual(0.65);
      expect(profile.tempo).toBeLessThanOrEqual(1);
      expect(profile.populationFloor).toBeGreaterThan(0);
      expect(profile.populationFloor).toBeLessThan(1);
      expect(profile.inkShareLight).toBeLessThanOrEqual(0.2);
      expect(profile.inkShareDark).toBeLessThanOrEqual(0.12);
    }

    expect(
      Object.entries(TREATMENT_PROFILES)
        .filter(([, profile]) => profile.paletteMode === "polychrome")
        .map(([name]) => name)
    ).toEqual(["lines"]);
  });

  it.each(["lines", "ribbon", "diagonal"] as const)(
    "%s uses only the shared stroke scale",
    (name) => {
      const recorder = recordingContext();
      getTreatment(name)(drawContext(recorder));
      expect(
        [...recorder.lineWidths].every((width) =>
          [FIELD_MATERIAL.hairline, FIELD_MATERIAL.emphasisStroke].includes(
            width as 1 | 1.5
          )
        )
      ).toBe(true);
    }
  );

  it("exposes every declared treatment", () => {
    for (const name of Object.keys(TREATMENTS)) {
      expect(typeof getTreatment(name as never)).toBe("function");
    }
  });

  describe.each(Object.keys(TREATMENTS))("%s", (name) => {
    const treatment = getTreatment(name as never);

    it("draws something at full density", () => {
      const recorder = recordingContext();
      treatment(drawContext(recorder));
      expect(recorder.strokes + recorder.fills).toBeGreaterThan(0);
    });

    it("leaves globalAlpha at 1", () => {
      // Compositions share one context and cross-fade into each other, so a
      // treatment that returns with alpha still lowered silently dims whatever
      // draws next.
      const recorder = recordingContext();
      treatment(drawContext(recorder));
      expect(recorder.finalAlpha()).toBe(1);
    });

    it("draws less at the trough than at full breath", () => {
      const full = recordingContext();
      treatment(drawContext(full, { density: 1 }));

      const trough = recordingContext();
      treatment(drawContext(trough, { density: 0 }));

      expect(trough.strokes + trough.fills).toBeLessThan(
        full.strokes + full.fills
      );
    });
  });

  describe("lines", () => {
    it("draws the polychrome field", () => {
      const recorder = recordingContext();
      getTreatment("lines")(drawContext(recorder));

      expect(recorder.strokes).toBeGreaterThan(20);
      // The hero is the one licensed polychrome composition, so a single-hue
      // result would mean the palette wiring has broken.
      const used = Object.values(PALETTE).filter((c) =>
        recorder.colours.has(c)
      );
      expect(used.length).toBeGreaterThanOrEqual(3);
    });

    it("thins the field as the breathing envelope closes", () => {
      // Density is the site's substitute for a beat: population collapses and
      // refills rather than anything changing speed.
      const full = recordingContext();
      getTreatment("lines")(drawContext(full, { density: 1 }));

      const trough = recordingContext();
      getTreatment("lines")(drawContext(trough, { density: 0 }));

      expect(trough.strokes).toBeLessThan(full.strokes);
      // But never empties: the reference's quietest frames still carry marks.
      expect(trough.strokes).toBeGreaterThan(0);
    });

    it("restores globalAlpha so the next composition starts clean", () => {
      const recorder = recordingContext();
      getTreatment("lines")(drawContext(recorder));
      expect(recorder.finalAlpha()).toBe(1);
    });

  });

  describe("bars", () => {
    it("draws blocks rather than strokes", () => {
      const recorder = recordingContext();
      getTreatment("bars")(drawContext(recorder));

      expect(recorder.fills).toBeGreaterThan(5);
      expect(recorder.strokes).toBe(0);
    });

    it("mixes ink on light grounds and stays in pigment on dark", () => {
      // Cutting bars with black is the best thing about reference frame 22. The
      // same move on a dark ground produces grey, which is just noise next to
      // white body copy, so dark cards stay essentially monochrome.
      const light = recordingContext();
      getTreatment("bars")(drawContext(light, { dark: false }));
      expect(light.colours.has("#16181c")).toBe(true);

      const dark = recordingContext();
      getTreatment("bars")(drawContext(dark, { dark: true }));
      expect(dark.colours.has(PALETTE.shu)).toBe(true);
    });
  });
});
