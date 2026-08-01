"use client";

import { smoothScrollTo } from "@/lib/utils";

function scrollToSection(sectionId: string) {
  smoothScrollTo(sectionId, 80);
}

/**
 * The hero's two buttons.
 *
 * Split out so HeroSection itself can be a Server Component. These are the only
 * part of the hero that needs JavaScript, and the headline is the LCP element,
 * so the less of this block that waits on hydration the better.
 *
 * Two CTAs, one intent each. The hero previously carried four actions in a
 * single row: "View selected work" and "All projects" were the same portfolio
 * intent, and "Bonus: Keyboard story" was a fourth competing link. Both now live
 * in the Work section, where that intent belongs.
 *
 * No scroll cue below them. If the visitor has not scrolled yet, they are
 * looking at the hero; the bottom of the viewport does not need a label telling
 * them what a scrollbar is.
 */
export function HeroActions() {
  return (
    <div
      className="lane-enter mt-[calc(var(--rhythm)*10)] flex flex-col gap-3 sm:flex-row sm:items-center"
      style={{ "--enter-index": 2 } as React.CSSProperties}
    >
      <button
        type="button"
        onClick={() => scrollToSection("work")}
        className="inline-flex items-center justify-center rounded-control bg-surface-inverse px-6 py-3 text-sm font-medium text-content-inverse transition-opacity hover:opacity-90 active:translate-y-px"
      >
        View selected work
      </button>
      <button
        type="button"
        onClick={() => scrollToSection("contact")}
        className="inline-flex items-center justify-center rounded-control border border-border-strong px-6 py-3 text-sm font-medium text-content-primary transition-colors hover:border-accent active:translate-y-px"
      >
        Contact
      </button>
    </div>
  );
}
