"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-surface-page text-content-primary">
        <section className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
          <p className="font-mono-label mb-3">Application error</p>
          <h1 className="text-3xl font-semibold tracking-tight mb-4">
            Something went wrong
          </h1>
          <p className="max-w-xl text-content-secondary mb-8">
            {error.message || "An unexpected error occurred."}
          </p>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-surface-inverse px-4 py-2 text-sm font-medium text-content-inverse hover:opacity-90 transition-opacity"
            onClick={reset}
          >
            Try again
          </button>
        </section>
      </body>
    </html>
  );
}
