/**
 * Accessibility utilities.
 *
 * Trimmed to what the app actually imports. The removed helpers (trapFocus,
 * announceToScreenReader, handleArrowKeyNavigation, prefersHighContrast,
 * enhanceFormAccessibility, makeModalAccessible) had no callers.
 */

/**
 * WCAG relative-luminance contrast ratio between two hex colors.
 * Returns 0 if either color can't be parsed.
 */
export const checkColorContrast = (
  foreground: string,
  background: string
): number => {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) return 0;

  const fgLuminance = getLuminance(fg.r, fg.g, fg.b);
  const bgLuminance = getLuminance(bg.r, bg.g, bg.b);

  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
};

/** Reduced motion detection (SSR-safe). */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/** ARIA live region manager — one polite and one assertive region. */
export class LiveRegionManager {
  private politeRegion: HTMLElement | null = null;
  private assertiveRegion: HTMLElement | null = null;

  constructor() {
    this.createRegions();
  }

  private createRegions() {
    if (typeof window === "undefined") return;

    this.politeRegion = document.createElement("div");
    this.politeRegion.setAttribute("aria-live", "polite");
    this.politeRegion.setAttribute("aria-atomic", "true");
    this.politeRegion.className = "sr-only";
    document.body.appendChild(this.politeRegion);

    this.assertiveRegion = document.createElement("div");
    this.assertiveRegion.setAttribute("aria-live", "assertive");
    this.assertiveRegion.setAttribute("aria-atomic", "true");
    this.assertiveRegion.className = "sr-only";
    document.body.appendChild(this.assertiveRegion);
  }

  announce(message: string, priority: "polite" | "assertive" = "polite") {
    const region =
      priority === "assertive" ? this.assertiveRegion : this.politeRegion;

    if (region) {
      region.textContent = message;

      setTimeout(() => {
        region.textContent = "";
      }, 1000);
    }
  }

  destroy() {
    if (this.politeRegion) {
      document.body.removeChild(this.politeRegion);
    }
    if (this.assertiveRegion) {
      document.body.removeChild(this.assertiveRegion);
    }
  }
}
