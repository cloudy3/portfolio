/**
 * Loading Component (Splash Screen)
 *
 * Matches the hero's calm cream surface: the faint site grid, a single soft
 * cyan accent, and a quiet pulse. Deliberately restrained — this is a brief
 * interstitial, not a showpiece.
 */
export default function Loading() {
  return (
    <div
      className="relative flex h-screen items-center justify-center overflow-hidden bg-surface-page"
      role="status"
      aria-label="Loading"
    >
      <div className="absolute inset-0 bg-grid-faint opacity-70" aria-hidden />
      <div
        className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-cyan/10 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 px-4 text-center">
        <p className="font-mono-label mb-4">Loading</p>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-content-primary mb-3">
          One moment
        </h2>
        <p className="text-content-secondary text-sm sm:text-base">
          Preparing the page.
        </p>

        <div className="mt-8 flex justify-center gap-2" aria-hidden>
          <span
            className="h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulse"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulse"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulse"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}
