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
    console.error(error); // Optional: log to monitoring service
  }, [error]);

  return (
    <section
      className="flex min-h-[60vh] flex-col items-center justify-center p-8"
      aria-live="assertive"
    >
      <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
      <p className="mb-6">Unexpected error: {error.message}</p>
      <button
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
        onClick={() => reset()}
      >
        Try again
      </button>
    </section>
  );
}
