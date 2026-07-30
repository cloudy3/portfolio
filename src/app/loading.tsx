/**
 * Loading interstitial.
 *
 * Deliberately restrained: a brief interstitial, not a showpiece. The three
 * pulsing accent dots this replaces were decorative status dots, and the mono
 * uppercase "Loading" label above the headline was the section-eyebrow tell in
 * miniature. One accent segment on a track carries the same signal in the page's
 * own language, and it degrades to a static rule under reduced motion.
 *
 * min-h-[100dvh] rather than h-screen: h-screen jumps when the mobile Safari
 * address bar collapses.
 */
export default function Loading() {
  return (
    <div
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-surface-page"
      role="status"
      aria-label="Loading"
    >
      <div className="absolute inset-0 bg-grid-faint opacity-70" aria-hidden />

      <div className="relative z-10 px-4">
        <h2 className="text-2xl text-content-primary sm:text-3xl">
          One moment
        </h2>
        <p className="mt-[calc(var(--rhythm)*3)] text-sm text-content-secondary sm:text-base">
          Preparing the page.
        </p>

        <div
          className="mt-[calc(var(--rhythm)*8)] h-px w-40 bg-border-strong"
          aria-hidden
        >
          <span className="block h-px w-1/3 animate-pulse bg-accent" />
        </div>
      </div>
    </div>
  );
}
