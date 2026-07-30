import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-custom flex min-h-[60vh] flex-col justify-center">
      {/* 404 is a number, so it belongs in mono. The old mono label above the
          headline was not. */}
      <p className="num text-sm text-content-muted">404</p>
      <h1 className="mt-[calc(var(--rhythm)*3)] text-3xl text-content-primary">
        Page not found
      </h1>
      <p className="mt-[calc(var(--rhythm)*4)] max-w-[50ch] text-content-secondary">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-[calc(var(--rhythm)*8)] inline-flex w-fit items-center rounded-control bg-surface-inverse px-6 py-3 text-sm font-medium text-content-inverse transition-opacity hover:opacity-90 active:translate-y-px"
      >
        Back to home
      </Link>
    </section>
  );
}
