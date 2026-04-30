import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <p className="font-mono-label mb-3">404</p>
      <h1 className="text-3xl font-semibold tracking-tight text-content-primary mb-4">
        Page not found
      </h1>
      <p className="max-w-xl text-content-secondary mb-8">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-md bg-surface-inverse px-4 py-2 text-sm font-medium text-content-inverse hover:opacity-90 transition-opacity"
      >
        Back to home
      </Link>
    </section>
  );
}
