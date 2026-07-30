"use client";

import { motion } from "framer-motion";
import { BEAT, ENTER_VIEWPORT, LANE_TRAVEL, LAND_SPRING } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * A note arriving on its lane.
 *
 * One gesture, one tempo. Travel is strictly along the lane axis (vertical) and
 * the only timing control is `beat`, a whole number of BEATs.
 *
 * The previous version took a free-form `delay` in seconds plus a `direction`
 * of "up" | "left" | "right" | "none", and its 23 call sites had drifted into
 * five different stagger values with horizontal entrances in two sections.
 * Horizontal travel is gone by design: a note that drifts sideways has left its
 * lane, which breaks the one structural idea the layout is built on.
 */
type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * Position in the sequence, in beats. Item `i` of a group passes `i`.
   * Fractional values are accepted but defeat the point.
   */
  beat?: number;
};

export function FadeIn({ children, className, beat = 0 }: FadeInProps) {
  // See usePrefersReducedMotion: framer's equivalent can latch a stale value.
  const reduce = usePrefersReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: LANE_TRAVEL }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={ENTER_VIEWPORT}
      transition={{ ...LAND_SPRING, delay: beat * BEAT }}
    >
      {children}
    </motion.div>
  );
}
