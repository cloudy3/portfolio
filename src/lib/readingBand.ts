/**
 * Which section the reader is on.
 *
 * Shared by the nav's active item and the field engine. They used to watch
 * different bands of the viewport and break ties differently, so at a section
 * boundary the canvas could draw one section's composition while the nav
 * marked the next.
 */

/**
 * IntersectionObserver rootMargin for the reading band: from just below the
 * nav down to 45% of the viewport height. A section counts once it reaches
 * this band, not the moment its top edge appears at the bottom of the screen.
 */
export const READING_BAND = "-140px 0px -55% 0px";

/**
 * The last of `elements` in document order, or null if there are none.
 *
 * When two sections overlap the band, the lower one is the one being
 * scrolled into, so it wins. Document order rather than the order elements
 * were observed in: the home sections arrive as separate dynamic chunks and
 * register in whatever order they load.
 */
export function lastInDocument<T extends Node>(elements: Iterable<T>): T | null {
  let last: T | null = null;
  for (const el of elements) {
    if (
      last === null ||
      last.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING
    ) {
      last = el;
    }
  }
  return last;
}
