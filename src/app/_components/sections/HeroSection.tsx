"use client";

import dynamic from "next/dynamic";
import { MotionConfig, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { JING_FENG_PROFILE } from "@/lib/data/professional-profile";
import { laneEnter, staggerContainer, transitions } from "@/lib/motion";
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
  // See usePrefersReducedMotion: framer's equivalent can latch a stale value.
  const reduce = usePrefersReducedMotion();

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

      {/* Full-height lane rails, aligned to the content column. */}
      <div
        className="container-custom pointer-events-none absolute inset-0 z-[3]"
        aria-hidden
      >
        <div className="lane-rails h-full" />
      </div>

      <div className="container-custom relative z-10 w-full">
        {/*
         * One copy of the hero markup for both motion modes. `initial={false}`
         * renders reduced-motion users straight at the final state (no fade, no
         * stuck opacity-0), and MotionConfig keeps any remaining animation
         * honest about the user's preference.
         */}
        <MotionConfig reducedMotion="user">
          <div className="lane-grid">
            <motion.div
              className="md:col-span-6 md:pr-[var(--lane-inset)]"
              initial={reduce ? false : "hidden"}
              animate="visible"
              variants={staggerContainer}
            >
              {/*
               * Weight contrast carries the headline: 900 against 300, one
               * family. The old version greyed the second clause out, which is
               * the standard two-tone headline trick and also gave away
               * contrast. Both clauses are full-strength ink now.
               */}
              <motion.h1
                variants={laneEnter}
                transition={transitions.slow}
                className="text-content-primary"
              >
                <span className="block">Calm systems,</span>
                <span className="block font-light">shipped with care.</span>
              </motion.h1>

              <motion.p
                variants={laneEnter}
                transition={transitions.base}
                className="mt-[calc(var(--rhythm)*6)] max-w-[44ch] text-content-secondary"
              >
                {SHORT_NAME}. {LEAD_SENTENCE}.
              </motion.p>

              {/*
               * Two CTAs, one intent each. The hero previously carried four
               * actions in a single row: "View selected work" and "All projects"
               * were the same portfolio intent, and "Bonus: Keyboard story" was
               * a fourth competing link. Both now live in the Work section,
               * where that intent belongs.
               *
               * No scroll cue below them. If the visitor has not scrolled yet,
               * they are looking at the hero; the bottom of the viewport does
               * not need a label telling them what a scrollbar is.
               */}
              <motion.div
                variants={laneEnter}
                transition={transitions.base}
                className="mt-[calc(var(--rhythm)*10)] flex flex-col gap-3 sm:flex-row sm:items-center"
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
              </motion.div>
            </motion.div>
          </div>
        </MotionConfig>
      </div>
    </section>
  );
}
