"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Logged, never rendered — see error.tsx.
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-surface-page text-content-primary">
        <section className="container-custom flex min-h-[100dvh] flex-col justify-center">
          <h1 className="text-3xl">Something went wrong</h1>
          <p className="mt-[calc(var(--rhythm)*4)] max-w-[50ch] text-content-secondary">
            An unexpected error occurred. Reloading usually resolves it.
          </p>
          <button
            type="button"
            className="mt-[calc(var(--rhythm)*8)] inline-flex w-fit items-center rounded-control bg-surface-inverse px-6 py-3 text-sm font-medium text-content-inverse transition-opacity hover:opacity-90 active:translate-y-px"
            onClick={reset}
          >
            Try again
          </button>
        </section>
      </body>
    </html>
  );
}
