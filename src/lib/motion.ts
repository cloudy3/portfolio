/**
 * Motion presets. Single source for transition timing.
 *
 * The site has ONE entrance gesture and ONE tempo. Before this, 23 `FadeIn`
 * call sites used five different ad-hoc stagger values (0.05, 0.06, 0.1, 0.15,
 * 0.2), which reads as noise rather than as rhythm.
 *
 * Everything now staggers on whole multiples of BEAT. That is the point of the
 * note-lane language: content arrives quantized, like notes on a chart, not on
 * arbitrary timings.
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
 * The entrance spring. Notes land with a little weight instead of easing to a
 * stop, which is what separates "arrived" from "faded in".
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
 * Travel distance for an entering note, in px.
 *
 * Motion is strictly along the lane axis (vertical). There is no horizontal
 * entrance anywhere on this site: a note that drifts sideways has left its
 * lane, which breaks the one structural idea the layout is built on.
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
