"use client";

import { useEffect, useRef } from "react";
import { createField, type FieldHandle } from "@/lib/field/engine";
import { useTheme } from "@/lib/useTheme";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * The site's one graphic field: a single fixed canvas behind every page.
 *
 * Mounted once in the root layout. Sections opt in by rendering a FieldAnchor,
 * which is what decides the composition and pigment; nothing is wired here.
 *
 * The engine is created once and then driven through its handle, rather than
 * being torn down and rebuilt whenever the theme or the motion preference
 * changes. Recreating it would restart every composition's clock and reset the
 * breathing envelope, which would show as a visible stutter the moment someone
 * used the theme toggle.
 */
export default function Field() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<FieldHandle | null>(null);
  const { theme } = useTheme();
  const reduced = usePrefersReducedMotion();

  // Deliberately empty deps: create once, drive through the handle below.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handle = createField(canvas, {
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      dark: document.documentElement.dataset.theme
        ? document.documentElement.dataset.theme === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches,
    });
    handleRef.current = handle;

    return () => {
      handle.stop();
      handleRef.current = null;
    };
  }, []);

  useEffect(() => {
    handleRef.current?.setTheme(theme === "dark");
  }, [theme]);

  useEffect(() => {
    handleRef.current?.setReduced(reduced);
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      // z-0 rather than a negative index: a negative z would put it behind the
      // body background, which is opaque.
      className="pointer-events-none fixed inset-0 z-0"
      data-testid="field-canvas"
      aria-hidden
    />
  );
}
