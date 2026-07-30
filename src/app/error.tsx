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
      className="container-custom flex min-h-[60vh] flex-col justify-center"
      aria-live="assertive"
    >
      <h1 className="text-3xl text-content-primary">Something went wrong</h1>
      <p className="mt-[calc(var(--rhythm)*4)] max-w-[50ch] text-content-secondary">
        An unexpected error occurred while loading this page. Trying again
        usually resolves it.
      </p>
      <button
        type="button"
        className="mt-[calc(var(--rhythm)*8)] inline-flex w-fit items-center rounded-control bg-surface-inverse px-6 py-3 text-sm font-medium text-content-inverse transition-opacity hover:opacity-90 active:translate-y-px"
        onClick={() => reset()}
      >
        Try again
      </button>
    </section>
  );
}
