"use client";

import { motion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * The judgment line: the hairline a section opens on, and the site's one
 * signature motion device.
 *
 * WHY THIS ANIMATES (the only justification test that matters): it announces
 * arrival at a new section and it is the rhythm-game "hit" on the judgment
 * line. State transition plus hierarchy. Nothing else on the home page is
 * scroll-triggered at this scale, which is what keeps it a signature rather
 * than decoration.
 *
 * The accent sweeps left to right, holds for a beat, then fades out, leaving
 * the neutral hairline underneath. The hairline is a real element rather than
 * an animation end-state, so reduced-motion users and no-JS visitors get the
 * structure with none of the flash.
 *
 * IntersectionObserver-backed via `whileInView` with a tight symmetric margin,
 * so the sweep fires as the section crosses the middle of the viewport. That is
 * the "fixed viewport line" the concept calls for, with no scroll listener.
 */
export function JudgmentLine({ className }: { className?: string }) {
  const reduce = usePrefersReducedMotion();

  return (
    <div className={cn("judgment-line", className)} aria-hidden>
      {reduce ? null : (
        /*
         * motion.div, not motion.span: the section test suites mock
         * framer-motion with only `motion.div`, so any other element type
         * resolves to undefined and throws at render.
         */
        <motion.div
          className="absolute inset-0 bg-accent"
          style={{ transformOrigin: "left center" }}
          initial={{ scaleX: 0, opacity: 1 }}
          whileInView={{ scaleX: 1, opacity: 0 }}
          viewport={{ once: true, margin: "-45% 0px -45% 0px" }}
          transition={{
            scaleX: { duration: 0.55, ease: EASE_OUT },
            opacity: { duration: 0.45, delay: 0.7, ease: "linear" },
          }}
        />
      )}
    </div>
  );
}
