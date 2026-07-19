"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Subscribes to the reduced-motion preference.
 *
 * framer-motion's `useReducedMotion()` captures its value in a `useState`
 * initializer, so a component that renders before the preference is read keeps
 * the stale value for its whole life — the keyboard story kept its 400vh
 * scroll region under reduced motion because of exactly that. Use this hook
 * for structural decisions (what to render, what to fetch); framer's is fine
 * for animation config.
 *
 * Returns false on the server and on the first client render so markup
 * hydrates consistently, then updates from the media query.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(QUERY);
    const update = (e: MediaQueryListEvent | MediaQueryList) =>
      setPrefersReducedMotion(e.matches);

    update(query);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}
