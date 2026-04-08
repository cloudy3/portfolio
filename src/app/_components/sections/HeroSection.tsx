"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { JING_FENG_PROFILE } from "@/lib/data/professional-profile";
import { fadeUp, staggerContainer, transitions } from "@/lib/motion";
import { cn } from "@/lib/utils";

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
  const element = document.getElementById(sectionId);
  if (!element) return;
  const offset = 80;
  const top =
    element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = "" }: HeroSectionProps) {
  const reduce = useReducedMotion();

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
        {reduce ? (
          <div className="max-w-3xl">
            <HeroCopy onScroll={scrollToSection} />
          </div>
        ) : (
          <motion.div
            className="max-w-3xl"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} transition={transitions.slow}>
              <p className="font-mono-label mb-4 text-content-muted">
                Software engineer · Full-stack
              </p>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              transition={transitions.slow}
              className="text-4xl sm:text-5xl md:text-[3.25rem] font-semibold tracking-tight text-content-primary leading-[1.08] mb-6"
            >
              Calm systems,
              <span className="text-content-muted"> shipped with care.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              transition={transitions.base}
              className="text-lg md:text-xl text-content-secondary leading-relaxed max-w-2xl mb-4"
            >
              {JING_FENG_PROFILE.name.split(" ").slice(-2).join(" ")} —{" "}
              {JING_FENG_PROFILE.title.toLowerCase()}. {JING_FENG_PROFILE.summary}
            </motion.p>
            <motion.div
              variants={fadeUp}
              transition={transitions.base}
              className="flex flex-col sm:flex-row gap-3 sm:items-center mt-10"
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
            </motion.div>
          </motion.div>
        )}
      </div>

      <div className="relative z-10 pb-10 flex justify-center">
        <button
          type="button"
          onClick={() => scrollToSection("about")}
          className="flex flex-col items-center gap-2 text-content-muted hover:text-accent-cyan transition-colors text-xs font-mono uppercase tracking-widest"
        >
          Scroll
          <span className="block w-px h-8 bg-gradient-to-b from-accent-cyan/60 to-transparent" />
        </button>
      </div>
    </section>
  );
}

function HeroCopy({
  onScroll,
}: {
  onScroll: (id: string) => void;
}) {
  return (
    <>
      <p className="font-mono-label mb-4 text-content-muted">
        Software engineer · Full-stack
      </p>
      <h1 className="text-4xl sm:text-5xl md:text-[3.25rem] font-semibold tracking-tight text-content-primary leading-[1.08] mb-6">
        Calm systems,
        <span className="text-content-muted"> shipped with care.</span>
      </h1>
      <p className="text-lg md:text-xl text-content-secondary leading-relaxed max-w-2xl mb-4">
        {JING_FENG_PROFILE.name.split(" ").slice(-2).join(" ")} —{" "}
        {JING_FENG_PROFILE.title.toLowerCase()}. {JING_FENG_PROFILE.summary}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center mt-10">
        <button
          type="button"
          onClick={() => onScroll("work")}
          className="inline-flex justify-center items-center px-5 py-3 rounded-md bg-surface-inverse text-content-inverse text-sm font-medium"
        >
          View selected work
        </button>
        <button
          type="button"
          onClick={() => onScroll("contact")}
          className="inline-flex justify-center items-center px-5 py-3 rounded-md border border-border-strong text-content-primary text-sm font-medium"
        >
          Contact
        </button>
        <Link
          href="/projects"
          className="inline-flex justify-center items-center px-2 py-3 text-sm font-medium text-accent-cyan sm:ml-2"
        >
          All projects →
        </Link>
      </div>
    </>
  );
}
