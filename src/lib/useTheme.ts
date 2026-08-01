"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  DARK_SCHEME_QUERY,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
} from "./theme";

/**
 * The resolved colour scheme, and a way to change it.
 *
 * An external store rather than a React context, because the two consumers sit
 * on opposite sides of the tree — the toggle in the nav and the pigment palette
 * in the hero canvas — and neither is a natural provider for the other. There
 * is no wrapper component to add and nothing to thread through `layout.tsx`.
 *
 * `useSyncExternalStore` (rather than `useState` + an effect) matters here for
 * the same reason `usePrefersReducedMotion` exists: a value latched in a state
 * initializer goes stale, and this one has three independent sources — the
 * toggle, the OS preference, and another tab.
 */

const listeners = new Set<() => void>();

/*
 * getSnapshot is called on every render and must be cheap and referentially
 * stable, so the computed value is cached and invalidated on change rather than
 * re-reading localStorage and allocating a MediaQueryList each time.
 */
let cached: ResolvedTheme | null = null;

function systemTheme(): ResolvedTheme {
  return window.matchMedia(DARK_SCHEME_QUERY).matches ? "dark" : "light";
}

function readStoredChoice(): ResolvedTheme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    // Private mode / blocked storage. Fall through to the system scheme.
    return null;
  }
}

function getSnapshot(): ResolvedTheme {
  if (cached === null) cached = readStoredChoice() ?? systemTheme();
  return cached;
}

/**
 * Light on the server. The markup this feeds is theme-independent (the mark
 * itself is painted by CSS), so there is nothing to mismatch at hydration.
 */
function getServerSnapshot(): ResolvedTheme {
  return "light";
}

function subscribe(onStoreChange: () => void): () => void {
  const handle = () => {
    cached = null;
    onStoreChange();
  };

  listeners.add(onStoreChange);
  const query = window.matchMedia(DARK_SCHEME_QUERY);
  query.addEventListener("change", handle);
  // Another tab toggled. `storage` does not fire in the tab that wrote it,
  // which is exactly right: setTheme notifies this one directly.
  window.addEventListener("storage", handle);

  return () => {
    listeners.delete(onStoreChange);
    query.removeEventListener("change", handle);
    window.removeEventListener("storage", handle);
  };
}

/**
 * Commits a choice.
 *
 * When the requested scheme already matches the OS, the stored key is REMOVED
 * rather than written. That is what keeps the toggle two-state without
 * stranding anyone: flipping back to your system scheme returns you to
 * following it live, so changing the OS setting later still moves the site.
 */
export function setTheme(next: ResolvedTheme): void {
  const followsSystem = systemTheme() === next;

  try {
    if (followsSystem) localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Storage unavailable: the attribute below still applies for this session.
  }

  if (followsSystem) delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = next;

  cached = null;
  for (const listener of listeners) listener();
}

export function useTheme(): { theme: ResolvedTheme; toggle: () => void } {
  const theme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const toggle = useCallback(() => {
    setTheme(getSnapshot() === "dark" ? "light" : "dark");
  }, []);

  return { theme, toggle };
}
