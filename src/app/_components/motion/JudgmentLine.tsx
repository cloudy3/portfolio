"use client";

import { motion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * The section pulse: the hairline that marks a new editorial chapter.
 * `JudgmentLine` is retained as a legacy component name for API stability.
 *
 * WHY THIS ANIMATES (the only justification test that matters): it announces
 * arrival at a new section and briefly connects the static layout to the
 * moving field. State transition plus hierarchy. Nothing else on the home page is
 * scroll-triggered at this scale, which is what keeps it a signature rather
 * than decoration.
 *
 * The accent sweeps left to right, holds for a beat, then fades out, leaving
 * the neutral hairline underneath. The hairline is a real element rather than
 * an animation end-state, so reduced-motion users and no-JS visitors get the
 * structure with none of the flash.
 *
 * IntersectionObserver-backed via `whileInView`, so there is no scroll listener.
 *
 * The trigger fires when the line crosses 70% of the viewport height. It was
 * originally a symmetric
 * `-45% 0px -45% 0px` margin to put that line dead centre, but that leaves only
 * a 10%-tall band: on a fast scroll or a short viewport the observer can miss it
 * entirely and the sweep silently never happens. A one-sided margin always
 * fires.
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
          viewport={{ once: true, margin: "0px 0px -30% 0px" }}
          transition={{
            scaleX: { duration: 0.55, ease: EASE_OUT },
            opacity: { duration: 0.45, delay: 0.7, ease: "linear" },
          }}
        />
      )}
    </div>
  );
}
