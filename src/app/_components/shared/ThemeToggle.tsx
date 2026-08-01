"use client";

import { useTheme } from "@/lib/useTheme";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

/**
 * Light/dark switch.
 *
 * The site follows `prefers-color-scheme` until this is pressed; after that the
 * choice is stored, and flipping back to the system scheme clears the store so
 * the page follows the OS again (see `setTheme`). That is why there is no third
 * "system" position to hunt for — the default state already is system, and the
 * toggle returns to it on its own.
 *
 * The mark is CSS (`.theme-mark`), so it paints correctly on the first frame
 * with no JavaScript. React is only here for the click and the label — hence
 * the label being the one thing that settles after hydration.
 */
export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      // Hit target is 40px; the mark inside it is 14px. Padding does the work
      // rather than a larger glyph, so the nav row stays quiet.
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-control text-content-primary transition-colors hover:bg-surface-subtle",
        className
      )}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <span className="theme-mark" aria-hidden />
    </button>
  );
}
