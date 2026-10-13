import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * True when the visitor asked for reduced motion, either through the OS
 * preference or the `.reduce-motion` class AccessibilityProvider mirrors onto
 * <html>.
 */
const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
  document.documentElement.classList.contains("reduce-motion");

/**
 * Scrolls to a section. An explicit `behavior: "smooth"` would override the
 * `scroll-behavior: auto` that the reduced-motion CSS sets, so the behaviour
 * is chosen here too.
 *
 * Focus follows the scroll. Without that, keyboard focus stayed on the button
 * that was pressed, so the next Tab went back to the header instead of into
 * the section the visitor had just moved to. The heading takes focus rather
 * than the section so a screen reader announces where they landed.
 * `preventScroll` keeps focus() from jumping ahead of the smooth scroll.
 */
export const smoothScrollTo = (elementId: string, offset: number = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = Math.max(0, elementPosition - offset);

    window.scrollTo({
      top: offsetPosition,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });

    const target = element.querySelector<HTMLElement>("h1, h2") ?? element;
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }
};

/**
 * `2024.02`, the month stamp used across the Work and Experience sections.
 *
 * Read in UTC on purpose. Dates in the data are ISO strings such as
 * "2023-07-01", which parse as midnight UTC; local getters turn that into
 * June 30 for anyone west of UTC, and the prerendered (UTC) HTML would then
 * disagree with the browser during hydration.
 */
export const formatMonthStamp = (date: Date): string =>
  `${date.getUTCFullYear()}.${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
