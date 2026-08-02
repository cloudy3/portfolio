/**
 * Motion presets. Single source for transition timing.
 *
 * The site has ONE entrance gesture and ONE tempo. Before this, 23 `FadeIn`
 * call sites used five different ad-hoc stagger values (0.05, 0.06, 0.1, 0.15,
 * 0.2), which reads as noise rather than as rhythm.
 *
 * Everything staggers on whole multiples of BEAT. Rhythm is now cadence rather
 * than game imagery: related content arrives as one deliberate sequence instead
 * of a collection of arbitrary delays.
 */

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * One beat, in seconds. The only stagger unit on the site.
 *
 * 90ms is deliberately near the low end: fast enough that a group of six items
 * finishes arriving in about half a second, slow enough that the sequence still
 * reads as ordered rather than simultaneous.
 */
export const BEAT = 0.09;

/** Seconds for a whole number of beats. */
export const beats = (n: number) => n * BEAT;

/**
 * The entrance spring. Content settles with a little weight instead of merely
 * easing to a stop.
 */
export const LAND_SPRING = {
  type: "spring",
  stiffness: 120,
  damping: 22,
} as const;

export const transitions = {
  fast: { duration: 0.35, ease: EASE_OUT },
  base: { duration: 0.5, ease: EASE_OUT },
  slow: { duration: 0.65, ease: EASE_OUT },
} as const;

/**
 * Travel distance for entering content, in px.
 *
 * Entrances are vertical so they stay subordinate to the field's richer
 * geometry. Horizontal reveals would compete with the canvas and fragment the
 * shared motion language. The exported name is retained for API stability.
 */
export const LANE_TRAVEL = 20;

export const laneEnter = {
  hidden: { opacity: 0, y: LANE_TRAVEL },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** Parent variant: stagger children by exactly one beat. */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: BEAT, delayChildren: BEAT },
  },
} as const;

/**
 * Shared viewport config for scroll-triggered entrances.
 *
 * IntersectionObserver-backed (Motion's `whileInView`), never a scroll
 * listener. The bottom margin holds the trigger until the element is properly
 * in view rather than firing at the very edge.
 */
export const ENTER_VIEWPORT = {
  once: true,
  margin: "0px 0px -12% 0px",
} as const;
