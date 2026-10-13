"use client";

import { useSyncExternalStore } from "react";

/** Midnight UTC of the given instant, so values only change once a day. */
const startOfUtcDay = (date: Date): number =>
  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

/*
 * The day the site was built, inlined by next.config.ts `env`. The home page is
 * prerendered, so this is the "today" its static HTML was rendered with; using
 * it as the server snapshot lets hydration match that HTML exactly. Outside a
 * Next build (tests) it falls back to the moment this module loaded.
 */
const BUILD_DAY = new Date(
  startOfUtcDay(new Date(process.env.BUILD_DATE ?? Date.now()))
);

let cachedDay: Date | undefined;

/** Stable between calls on the same day, as useSyncExternalStore requires. */
function getSnapshot(): Date {
  const day = startOfUtcDay(new Date());
  if (cachedDay?.getTime() !== day) cachedDay = new Date(day);
  return cachedDay;
}

const getServerSnapshot = (): Date => BUILD_DAY;

// Nothing to subscribe to: the day is read once per render, not watched.
const subscribe = () => () => {};

/**
 * Today's date, safe to render in a prerendered page.
 *
 * Calling `new Date()` during render freezes the value at build time in the
 * static HTML, and once the real date moves on the browser's first render
 * disagrees with it and React reports a hydration mismatch. This renders the
 * build day during hydration, then switches to the visitor's today.
 */
export function useToday(): Date {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
