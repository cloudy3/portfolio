import type { PigmentName } from "./types";

/**
 * Traditional field pigments, read from CSS rather than duplicated as literals.
 *
 * The component this replaces carried the four hex values inline with a comment
 * saying "keep the two in step", which is a standing invitation to drift: the
 * palette is defined in globals.css, restated in the dark block, restated again
 * in the [data-theme] blocks, and was restated a fourth time in TypeScript.
 * Reading the computed value means there is one definition, and it also means
 * the field follows the theme toggle with no extra wiring.
 *
 * Cached because getComputedStyle forces a style recalculation; the cache is
 * dropped whenever the resolved theme changes.
 */

const CUSTOM_PROPERTY: Record<PigmentName, string> = {
  shu: "--lane-shu",
  ai: "--lane-ai",
  moegi: "--lane-moegi",
  kihada: "--lane-kihada",
};

/** Ink, for the achromatic elements a composition mixes with its pigment. */
const INK_PROPERTY = "--color-content-primary";

export interface Palette {
  pigments: Record<PigmentName, string>;
  ink: string;
}

let cache: Palette | null = null;

export function readPalette(): Palette {
  if (cache) return cache;

  const style = getComputedStyle(document.documentElement);
  const read = (property: string, fallback: string) =>
    style.getPropertyValue(property).trim() || fallback;

  cache = {
    pigments: {
      shu: read(CUSTOM_PROPERTY.shu, "#d33c22"),
      ai: read(CUSTOM_PROPERTY.ai, "#2b4a8b"),
      moegi: read(CUSTOM_PROPERTY.moegi, "#6f8f22"),
      kihada: read(CUSTOM_PROPERTY.kihada, "#b8860b"),
    },
    ink: read(INK_PROPERTY, "#16181c"),
  };

  return cache;
}

/** Call when the resolved theme changes. */
export function invalidatePalette(): void {
  cache = null;
}
