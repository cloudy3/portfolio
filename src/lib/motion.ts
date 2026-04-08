/**
 * Framer Motion presets and helpers. Single source for transition timing.
 */

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const transitions = {
  fast: { duration: 0.35, ease: EASE_OUT },
  base: { duration: 0.5, ease: EASE_OUT },
  slow: { duration: 0.65, ease: EASE_OUT },
} as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** Parent variant: stagger child `fadeUp` animations */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
} as const;
