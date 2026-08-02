/**
 * The field: shared types.
 *
 * The field is one fixed canvas behind the whole site, recomposed as each
 * section scrolls past. The model comes from the Glass Heart title sequence:
 * a single graphic system re-skinned per card, with the type held still and
 * the composition built AROUND it rather than scrimmed behind it.
 */

/**
 * The compositions.
 *
 * `lines` is the hero. `bars` is deliberately NOT on the landing page: as a
 * hero it read as tacky, because vertical blocks are the wrong primitive at
 * that scale. It moves to the projects catalogue, where a denser, blockier
 * field suits a page that is already a grid.
 */
export type TreatmentName =
  | "lines"
  | "bars"
  | "rail"
  | "ribbon"
  | "lattice"
  | "diagonal"
  | "planes";

/**
 * Which traditional pigment a section's field draws in.
 *
 * These are defined in globals.css. They are the licensed exception to the
 * colour lock: UI chrome stays ink plus vermilion while the expressive field
 * may use the supporting palette.
 */
export type PigmentName = "shu" | "ai" | "moegi" | "kihada";

/**
 * The material contract shared by every field composition.
 *
 * Geometry remains treatment-specific, while these values keep apparent
 * energy, tempo, population and palette behavior coherent across sections.
 */
export interface TreatmentProfile {
  energy: number;
  tempo: number;
  populationFloor: number;
  paletteMode: "polychrome" | "pigment";
  inkShareLight: number;
  inkShareDark: number;
}

/** Viewport-relative, CSS pixels. */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DrawContext {
  ctx: CanvasRenderingContext2D;
  /** The viewport, in CSS pixels. The canvas is always viewport-sized. */
  box: Rect;
  /**
   * The region the composition must leave empty: the section's text.
   *
   * This is the load-bearing idea. The reference never scrims its type; it
   * pushes the field out to the margins and leaves the middle bare, which is
   * both why it stays legible at full strength and why it reads as composed
   * rather than decorated. Treatments are clipped to everything outside this.
   */
  keepOut: Rect;
  /** Seconds since this treatment became active. */
  t: number;
  /**
   * The breathing envelope, 0 to 1.
   *
   * Population and luminance collapse to near nothing and refill on
   * FIELD_PERIOD. Element velocity stays constant; only the count and the
   * opacity move. Measured off the reference, where dense frames sit directly
   * beside near-empty ones.
   */
  density: number;
  /** Resolved field pigment, as a CSS colour. The section's own hue. */
  pigment: string;
  /**
   * All four resolved pigments.
   *
   * Only the hero uses this complete palette. Every other section takes its
   * single `pigment`, keeping the sequence varied but coherent.
   */
  palette: Record<PigmentName, string>;
  /** Resolved ink, for the achromatic elements in a composition. */
  ink: string;
  /** True on a dark ground. Gates bloom, which the reference only uses there. */
  dark: boolean;
  /** Global strength dial, 0 to 1. The one constant to turn down if it shouts. */
  strength: number;
}

export type Treatment = (d: DrawContext) => void;
