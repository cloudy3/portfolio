"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onStoreChange: () => void): () => void {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

const getSnapshot = (): boolean => window.matchMedia(QUERY).matches;

// The server cannot know, so assume motion and let hydration correct it.
const getServerSnapshot = (): boolean => false;

/**
 * Subscribes to the reduced-motion preference.
 *
 * Motion's `useReducedMotion()` captures its value in a `useState`
 * initializer, so a component that renders before the preference is read keeps
 * the stale value for its whole life. Use this hook for structural decisions
 * (what to render, what to fetch); Motion's is fine
 * for animation config.
 *
 * Returns false on the server and during hydration so markup matches, then
 * reads the media query live.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
