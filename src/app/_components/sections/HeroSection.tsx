"use client";

import dynamic from "next/dynamic";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { JING_FENG_PROFILE } from "@/lib/data/professional-profile";
import { cn, smoothScrollTo } from "@/lib/utils";

const WaveLineVisualization = dynamic(
  () => import("../shared/WaveLineVisualization"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-surface-page bg-grid-faint opacity-60" />
    ),
  }
);

function scrollToSection(sectionId: string) {
  smoothScrollTo(sectionId, 80);
}

/**
 * Lead line of the profile summary.
 *
 * The hero used to print the name, the title AND the entire summary, which
 * rendered as "Jing Feng - full-stack software engineer. Full-stack software
 * engineer with 3+ years..." (the title duplicated verbatim by the summary's own
 * opening) across six lines. Hero subtext is capped at 20 words and 4 lines, so
 * only the first sentence appears here; the full summary still runs in About.
 * Derived from the data rather than rewritten, so the two cannot drift.
 */
const LEAD_SENTENCE = JING_FENG_PROFILE.summary.split(". ")[0];
const SHORT_NAME = JING_FENG_PROFILE.name.split(" ").slice(-2).join(" ");

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = "" }: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-[100dvh] items-center overflow-hidden -mt-16 pt-16",
        className
      )}
      id="hero"
    >
      <div className="absolute inset-0 bg-surface-page" />

      {/*
       * The lane field, at full strength. It was previously wrapped in
       * opacity-[0.35], on top of the canvas's own 0.55 line opacity, under a
       * three-stop vertical scrim — effectively invisible. It is the hero's
       * primary visual now, so it gets the whole frame.
       */}
      <div className="absolute inset-0 z-[1]">
        <ErrorBoundary
          fallback={
            <div className="absolute inset-0 bg-surface-subtle bg-grid-faint" />
          }
        >
          <WaveLineVisualization
            className="h-full w-full"
            animationSpeed={0.55}
          />
        </ErrorBoundary>
      </div>

      {/*
       * Scrims run HORIZONTALLY, not vertically. The copy sits on the left
       * lanes, so the page colour holds solid there for contrast and clears to
       * nothing on the right where the field should read. A vertical scrim has
       * to flatten the entire field to protect centred text, which is exactly
       * what the old centred hero did.
       */}
      <div
        className="absolute inset-0 z-[2] bg-gradient-to-r from-surface-page via-surface-page/70 to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 z-[2] h-1/5 bg-gradient-to-t from-surface-page to-transparent"
        aria-hidden
      />

      {/* Full-height lane rails, aligned to the content column, fading out on
          the same axis as the scrim above so they never cross the live field.
          See .lane-rails-fade in globals.css. */}
      <div
        className="container-custom pointer-events-none absolute inset-0 z-[3]"
        aria-hidden
      >
        <div className="lane-rails lane-rails-fade h-full" />
      </div>

      <div className="container-custom relative z-10 w-full">
        {/*
         * The hero entrance is CSS (`.lane-enter` in globals.css), not Motion,
         * and that is a measured performance decision.
         *
         * Motion applies its `initial` state during server rendering, so this
         * copy used to ship as `style="opacity:0"` and stayed invisible until
         * framer-motion hydrated, behind the three.js chunk. Chrome will not
         * take an LCP candidate while an element is fully transparent, so the
         * largest text on the page reported ~6s while actually painting at
         * ~0.9s. A CSS animation starts at first paint with no JS involved.
         *
         * Everything below the fold still uses Motion via FadeIn, where waiting
         * for hydration costs nothing. Reduced motion is handled in the
         * stylesheet, so no JS branch is needed here either.
         */}
        <div className="lane-grid">
          <div className="md:col-span-6 md:pr-[var(--lane-inset)]">
            {/*
             * Weight contrast carries the headline: 900 against 300, one
             * family. The old version greyed the second clause out, which is
             * the standard two-tone headline trick and also gave away contrast.
             * Both clauses are full-strength ink now.
             */}
            <h1
              className="lane-enter text-content-primary"
              style={{ "--enter-index": 0 } as React.CSSProperties}
            >
              <span className="block">Calm systems,</span>
              <span className="block font-light">shipped with care.</span>
            </h1>

            <p
              className="lane-enter mt-[calc(var(--rhythm)*6)] max-w-[44ch] text-content-secondary"
              style={{ "--enter-index": 1 } as React.CSSProperties}
            >
              {SHORT_NAME}. {LEAD_SENTENCE}.
            </p>

            {/*
             * Two CTAs, one intent each. The hero previously carried four
             * actions in a single row: "View selected work" and "All projects"
             * were the same portfolio intent, and "Bonus: Keyboard story" was a
             * fourth competing link. Both now live in the Work section, where
             * that intent belongs.
             *
             * No scroll cue below them. If the visitor has not scrolled yet,
             * they are looking at the hero; the bottom of the viewport does not
             * need a label telling them what a scrollbar is.
             */}
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
          </div>
        </div>
      </div>
    </section>
  );
}
