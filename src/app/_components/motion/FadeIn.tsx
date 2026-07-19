"use client";

import { motion } from "framer-motion";
import { transitions } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/** Direction the element travels *from* as it fades in. */
export type FadeInDirection = "up" | "left" | "right" | "none";

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Defaults to "up" — the site's standard entrance. */
  direction?: FadeInDirection;
  /** Travel distance in px. */
  offset?: number;
};

const hiddenOffset = (direction: FadeInDirection, offset: number) => {
  switch (direction) {
    case "up":
      return { y: offset };
    case "left":
      return { x: -offset };
    case "right":
      return { x: offset };
    case "none":
      return {};
  }
};

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  offset = 24,
}: FadeInProps) {
  // See usePrefersReducedMotion: framer's equivalent can latch a stale value.
  const reduce = usePrefersReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const variants = {
    hidden: { opacity: 0, ...hiddenOffset(direction, offset) },
    visible: { opacity: 1, x: 0, y: 0 },
  };

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants}
      transition={{ ...transitions.base, delay }}
    >
      {children}
    </motion.div>
  );
}
