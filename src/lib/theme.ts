/**
 * Colour-scheme choice: constants and the pre-paint bootstrap.
 *
 * Deliberately NOT marked "use client" and deliberately free of React imports:
 * `layout.tsx` is a Server Component and needs THEME_INIT_SCRIPT, while the
 * toggle and the hero canvas need the same storage key from the client. Keeping
 * this module neutral is what lets one definition serve both graphs. The React
 * hook lives in `useTheme.ts`.
 */

/** What the visitor has actually chosen. `system` means "no choice stored". */
export type ThemeChoice = "system" | "light" | "dark";

/** What the page is actually painted as, once `system` has been resolved. */
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "jf-theme";

export const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

/**
 * Runs in <head>, before first paint, ahead of React.
 *
 * Without this the document renders at the system scheme and then snaps to the
 * stored one the moment the bundle hydrates — the white flash that every
 * hand-rolled theme switch ships with. Setting `data-theme` here means the
 * override in globals.css is already matching when the first pixel is painted.
 *
 * `system` is stored as the ABSENCE of a key, so a visitor who has never
 * touched the toggle (and one who has toggled back to their system scheme) gets
 * no attribute at all and keeps following `prefers-color-scheme` live.
 *
 * Kept to one statement, no dependencies, and wrapped in try/catch because
 * localStorage throws outright in Safari private mode and under blocked
 * third-party storage — an exception here would abort the whole inline script.
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}`;
