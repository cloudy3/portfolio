"use client";

import { useEffect, ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/accessibility";

interface AccessibilityProviderProps {
  children: ReactNode;
}

/**
 * Accessibility provider that sets up global accessibility features
 */
const AccessibilityProvider = ({ children }: AccessibilityProviderProps) => {
  useEffect(() => {
    // NOTE: the skip link is rendered in JSX by Navigation — do not inject one here.

    // Add reduced motion class if user prefers reduced motion
    if (prefersReducedMotion()) {
      document.documentElement.classList.add("reduce-motion");
    }

    // Listen for reduced motion preference changes
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add("reduce-motion");
      } else {
        document.documentElement.classList.remove("reduce-motion");
      }
    };

    mediaQuery.addEventListener("change", handleMotionChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return <>{children}</>;
};

export default AccessibilityProvider;
