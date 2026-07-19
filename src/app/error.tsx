"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep the full error (including digest) in the console for debugging;
    // never render it — messages can carry internal detail.
    console.error(error);
  }, [error]);

  return (
    <section
      className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center"
      aria-live="assertive"
    >
      <p className="font-mono-label mb-3">Error</p>
      <h1 className="text-3xl font-semibold tracking-tight text-content-primary mb-4">
        Something went wrong
      </h1>
      <p className="max-w-xl text-content-secondary mb-8">
        An unexpected error occurred while loading this page. Trying again
        usually resolves it.
      </p>
      <button
        type="button"
        className="inline-flex items-center rounded-md bg-surface-inverse px-4 py-2 text-sm font-medium text-content-inverse hover:opacity-90 transition-opacity"
        onClick={() => reset()}
      >
        Try again
      </button>
    </section>
  );
}
