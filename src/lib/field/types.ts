/**
 * The field: shared types.
 *
 * The field is one fixed canvas behind the whole site, recomposed as each
 * section scrolls past. The model comes from the Glass Heart title sequence:
 * a single graphic system re-skinned per card, with the type held still and
 * the composition built AROUND it rather than scrimmed behind it.
 */

/** The six compositions. One per home section; sub-pages reuse `rail`. */
export type TreatmentName =
  | "bars"
  | "rail"
  | "ribbon"
  | "lattice"
  | "diagonal"
  | "planes";

/**
 * Which lane pigment a section's field draws in.
 *
 * These are the four traditional pigments already defined in globals.css. They
 * are the licensed exception to the colour lock: UI chrome stays ink plus
 * vermilion everywhere, the field is polychrome.
 */
export type PigmentName = "shu" | "ai" | "moegi" | "kihada";

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
  /** Resolved lane pigment, as a CSS colour. */
  pigment: string;
  /** Resolved ink, for the achromatic elements in a composition. */
  ink: string;
  /** True on a dark ground. Gates bloom, which the reference only uses there. */
  dark: boolean;
  /** Global strength dial, 0 to 1. The one constant to turn down if it shouts. */
  strength: number;
}

export type Treatment = (d: DrawContext) => void;
