import type { PigmentName, TreatmentName } from "./types";

/**
 * Which sections want a field, and where their type sits.
 *
 * Sections register themselves rather than the engine scanning the DOM. The
 * home page loads its sections through next/dynamic, so anything scan-based
 * would need a MutationObserver and a debounce to catch them arriving; an
 * explicit register/unregister pair gets the exact lifecycle for free and
 * cannot go stale.
 *
 * `Section` stays a Server Component. The registration happens in FieldAnchor,
 * a client leaf it renders, which walks up to the section element.
 */

/**
 * How much of the frame the type protects.
 *
 * `box` clips the element's own rectangle. `column` clips its horizontal extent
 * for the full viewport height, so the composition lives strictly beside the
 * text rather than also above and below it. `soft` attenuates the field through
 * the element and feathers it back in around the edge, avoiding a visible cut.
 *
 * `column` exists because `box` leaves a visible arbitrary edge: bars stop dead
 * in mid-air at the top of the copy block, which reads as a clipping bug rather
 * than as a composition. The reference never does this. Its fields are bounded
 * by the frame, or they run the full height beside the type (frames 380, 1130).
 */
export type KeepOutMode = "box" | "column" | "soft";

export interface FieldEntry {
  /** The <section>. Observed for visibility. */
  el: HTMLElement;
  treatment: TreatmentName;
  pigment: PigmentName;
  /** The element the composition must not draw over. Usually the content column. */
  keepOut: HTMLElement | null;
  keepOutMode: KeepOutMode;
}

const entries = new Set<FieldEntry>();
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

/** Returns an unregister function, for the effect cleanup. */
export function registerField(entry: FieldEntry): () => void {
  entries.add(entry);
  notify();

  return () => {
    entries.delete(entry);
    notify();
  };
}

export function getFieldEntries(): FieldEntry[] {
  return Array.from(entries);
}

/** The engine rebuilds its IntersectionObserver when the set changes. */
export function subscribeToFields(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
