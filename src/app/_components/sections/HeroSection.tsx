"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
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
      <div className="absolute inset-0 bg-surface-page bg-grid-faint opacity-50" />
    ),
  }
);

function scrollToSection(sectionId: string) {
  smoothScrollTo(sectionId, 80);
}

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = "" }: HeroSectionProps) {
  // See usePrefersReducedMotion: framer's equivalent can latch a stale value.
  const reduce = usePrefersReducedMotion();

  return (
    <section
      className={cn(
        "relative min-h-[100dvh] flex flex-col justify-center overflow-hidden -mt-16 pt-16",
        className
      )}
      id="hero"
    >
      <div className="absolute inset-0 bg-surface-page" />
      <div className="absolute inset-0 z-[1] opacity-[0.35]">
        <ErrorBoundary
          fallback={
            <div className="absolute inset-0 bg-surface-subtle bg-grid-faint" />
          }
        >
          <WaveLineVisualization className="w-full h-full" />
        </ErrorBoundary>
      </div>
      <div
        className="absolute inset-0 z-[2] bg-gradient-to-b from-surface-page/80 via-surface-page/40 to-surface-page"
        aria-hidden
      />

      <div className="relative z-10 container-custom py-20 md:py-28">
        {/*
         * One copy of the hero markup for both motion modes. `initial={false}`
         * renders reduced-motion users straight at the final state (no fade, no
         * stuck opacity-0), and MotionConfig keeps any remaining animation
         * honest about the user's preference. Previously this markup was
         * duplicated and the two branches had already drifted apart.
         */}
        <MotionConfig reducedMotion="user">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={reduce ? false : "hidden"}
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={laneEnter} transition={transitions.slow}>
              <p className="font-mono-label mb-4 text-content-muted">
                Software engineer · Full-stack
              </p>
            </motion.div>
            <motion.h1
              variants={laneEnter}
              transition={transitions.slow}
              className="text-4xl sm:text-5xl md:text-[3.25rem] font-semibold tracking-tight text-content-primary leading-[1.08] mb-6"
            >
              Calm systems,
              <span className="text-content-muted"> shipped with care.</span>
            </motion.h1>
            <motion.p
              variants={laneEnter}
              transition={transitions.base}
              className="text-lg md:text-xl text-content-secondary leading-relaxed max-w-2xl mx-auto mb-4"
            >
              {JING_FENG_PROFILE.name.split(" ").slice(-2).join(" ")} —{" "}
              {JING_FENG_PROFILE.title.toLowerCase()}.{" "}
              {JING_FENG_PROFILE.summary}
            </motion.p>
            <motion.div
              variants={laneEnter}
              transition={transitions.base}
              className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-center mt-10"
            >
              <button
                type="button"
                onClick={() => scrollToSection("work")}
                className="inline-flex justify-center items-center px-5 py-3 rounded-md bg-surface-inverse text-content-inverse text-sm font-medium hover:opacity-90 transition-opacity"
              >
                View selected work
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                className="inline-flex justify-center items-center px-5 py-3 rounded-md border border-border-strong text-content-primary text-sm font-medium hover:border-accent-cyan/40 transition-colors"
              >
                Contact
              </button>
              <Link
                href="/projects"
                className="inline-flex justify-center items-center px-2 py-3 text-sm font-medium text-accent-cyan hover:underline underline-offset-4 sm:ml-2"
              >
                All projects →
              </Link>
              <Link
                href="/keyboard-story"
                className="inline-flex justify-center items-center px-2 py-3 text-sm font-medium text-content-secondary hover:text-accent-cyan transition-colors"
              >
                Bonus: Keyboard story
              </Link>
            </motion.div>
          </motion.div>
        </MotionConfig>
      </div>

      <div className="relative z-10 pb-10 flex justify-center">
        <button
          type="button"
          onClick={() => scrollToSection("work")}
          className="flex flex-col items-center gap-2 text-content-muted hover:text-accent-cyan transition-colors text-xs font-mono uppercase tracking-widest"
        >
          Scroll
          <span className="block w-px h-8 bg-gradient-to-b from-accent-cyan/60 to-transparent" />
        </button>
      </div>
    </section>
  );
}
