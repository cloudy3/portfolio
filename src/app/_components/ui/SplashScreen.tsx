"use client";

import { useState, useEffect } from "react";

/**
 * SplashScreen Component
 *
 * Japanese-inspired music visualization themed splash screen.
 * Displays on initial page load with animated wave lines and vibrant colors.
 * Automatically exits when page resources are loaded and minimum display time has elapsed.
 *
 * State Management:
 * - isLoading: Controls visibility of splash screen
 * - isExiting: Controls exit animation state
 * - minimumTimeElapsed: Tracks if minimum display time has passed
 * - domReady: Tracks if DOM is fully loaded
 * - fontsReady: Tracks if fonts are loaded
 * - prefersReducedMotion: Tracks user's motion preference
 * - mounted: Tracks component mount for entrance animations
 *
 * Accessibility Features:
 * - ARIA attributes: role="status", aria-live="polite", aria-busy
 * - Semantic HTML: Uses proper heading hierarchy
 * - Progressbar role: Loading indicator has proper ARIA progressbar attributes
 * - Focus management: No focus trapping, non-interactive component
 * - Reduced motion support: Respects prefers-reduced-motion preference
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 3.3, 4.1, 4.2, 4.3, 4.4
 */
export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [minimumTimeElapsed, setMinimumTimeElapsed] = useState<boolean>(false);
  const [domReady, setDomReady] = useState<boolean>(false);
  const [fontsReady, setFontsReady] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Trigger mount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect prefers-reduced-motion preference
  // Requirement: 4.3
  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes to the preference
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add event listener
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Enforce minimum display time of 800ms
  useEffect(() => {
    const minimumTimeTimer = setTimeout(() => {
      setMinimumTimeElapsed(true);
    }, 800);

    return () => clearTimeout(minimumTimeTimer);
  }, []);

  // Monitor document.readyState for DOM ready state
  useEffect(() => {
    const checkDomReady = () => {
      if (document.readyState === "complete") {
        setDomReady(true);
      }
    };

    // Check immediately in case DOM is already ready
    checkDomReady();

    // Listen for readystatechange events
    document.addEventListener("readystatechange", checkDomReady);

    return () => {
      document.removeEventListener("readystatechange", checkDomReady);
    };
  }, []);

  // Handle font loading detection
  useEffect(() => {
    document.fonts.ready
      .then(() => {
        setFontsReady(true);
      })
      .catch((error) => {
        console.warn("Font loading detection failed:", error);
        // Set to true anyway to not block the splash screen
        setFontsReady(true);
      });
  }, []);

  // Timeout fallback mechanism - force exit after 5 seconds
  // Requirement: 3.4
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading && !isExiting) {
        console.warn(
          "Splash screen timeout reached (5s) - forcing exit to prevent blocking user access"
        );
        setIsExiting(true);
      }
    }, 5000);

    // Cleanup timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, [isLoading, isExiting]);

  // Monitor loading state and trigger exit when complete
  // Requirements: 1.4, 1.5, 3.1, 3.2
  useEffect(() => {
    /**
     * Check if all loading conditions are met
     */
    const checkLoadingComplete = (): boolean => {
      return domReady && fontsReady && minimumTimeElapsed;
    };

    if (checkLoadingComplete() && isLoading && !isExiting) {
      setIsExiting(true);
    }
  }, [domReady, fontsReady, minimumTimeElapsed, isLoading, isExiting]);

  // Handle exit animation and cleanup
  // Requirements: 1.4, 3.3
  useEffect(() => {
    if (isExiting) {
      // Wait for 600ms fade-out transition to complete before removing from DOM
      const exitTimer = setTimeout(() => {
        setIsLoading(false);
      }, 600);

      // Cleanup timer on component unmount
      return () => clearTimeout(exitTimer);
    }
  }, [isExiting]);

  // Don't render if not loading
  if (!isLoading) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-opacity duration-600 ${
        isExiting ? "opacity-0 pointer-events-none" : "opacity-100"
      } ${prefersReducedMotion ? "reduce-motion" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading website content"
      aria-busy={!isExiting}
    >
      {/* Light gradient background matching hero section */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 z-0"></div>

      {/* Animated wave lines background */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 z-10">
          {/* Top wave lines */}
          <div className="absolute top-1/4 left-0 right-0 flex flex-col gap-8 opacity-60">
            <div
              className={`h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent rounded-full transition-all duration-1000 ${
                mounted ? "animate-wave-slide" : "opacity-0"
              }`}
              style={{ animationDelay: "0ms" }}
              aria-hidden="true"
            ></div>
            <div
              className={`h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full transition-all duration-1000 ${
                mounted ? "animate-wave-slide" : "opacity-0"
              }`}
              style={{ animationDelay: "200ms" }}
              aria-hidden="true"
            ></div>
            <div
              className={`h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full transition-all duration-1000 ${
                mounted ? "animate-wave-slide" : "opacity-0"
              }`}
              style={{ animationDelay: "400ms" }}
              aria-hidden="true"
            ></div>
          </div>

          {/* Bottom wave lines */}
          <div className="absolute bottom-1/4 left-0 right-0 flex flex-col gap-8 opacity-60">
            <div
              className={`h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full transition-all duration-1000 ${
                mounted ? "animate-wave-slide-reverse" : "opacity-0"
              }`}
              style={{ animationDelay: "100ms" }}
              aria-hidden="true"
            ></div>
            <div
              className={`h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent rounded-full transition-all duration-1000 ${
                mounted ? "animate-wave-slide-reverse" : "opacity-0"
              }`}
              style={{ animationDelay: "300ms" }}
              aria-hidden="true"
            ></div>
            <div
              className={`h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full transition-all duration-1000 ${
                mounted ? "animate-wave-slide-reverse" : "opacity-0"
              }`}
              style={{ animationDelay: "500ms" }}
              aria-hidden="true"
            ></div>
          </div>
        </div>
      )}

      {/* Center content */}
      <div className="relative z-20 text-center px-4">
        {/* Animated logo/icon */}
        <div className="mb-8 flex justify-center" aria-hidden="true">
          <div className="relative w-20 h-20">
            {/* Outer ring */}
            <div
              className={`absolute inset-0 rounded-full border-4 transition-all duration-700 ${
                mounted && !prefersReducedMotion
                  ? "animate-spin-slow opacity-100"
                  : "opacity-0"
              }`}
              style={{
                borderImage:
                  "linear-gradient(135deg, #FF6B9D, #AA96DA, #4ECDC4) 1",
              }}
            ></div>
            {/* Inner ring */}
            <div
              className={`absolute inset-2 rounded-full border-4 border-amber-400 transition-all duration-700 ${
                mounted && !prefersReducedMotion
                  ? "animate-spin-slow-reverse opacity-80"
                  : "opacity-0"
              }`}
            ></div>
            {/* Center dot */}
            <div
              className={`absolute inset-0 m-auto w-4 h-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 transition-all duration-500 ${
                mounted && !prefersReducedMotion
                  ? "animate-pulse-slow opacity-100"
                  : mounted
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            ></div>
          </div>
        </div>

        {/* Loading text */}
        <div
          className={`transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h1 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-3">
            Loading
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Preparing your experience...
          </p>
        </div>

        {/* Animated dots */}
        <div
          className="flex justify-center gap-2 mt-6"
          role="progressbar"
          aria-label="Loading progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={undefined}
        >
          <div
            className={`w-2 h-2 rounded-full bg-pink-400 ${
              !prefersReducedMotion ? "animate-bounce" : ""
            }`}
            style={{ animationDelay: "0ms" }}
            aria-hidden="true"
          ></div>
          <div
            className={`w-2 h-2 rounded-full bg-purple-400 ${
              !prefersReducedMotion ? "animate-bounce" : ""
            }`}
            style={{ animationDelay: "150ms" }}
            aria-hidden="true"
          ></div>
          <div
            className={`w-2 h-2 rounded-full bg-cyan-400 ${
              !prefersReducedMotion ? "animate-bounce" : ""
            }`}
            style={{ animationDelay: "300ms" }}
            aria-hidden="true"
          ></div>
        </div>
      </div>

      {/* Decorative gradient orbs */}
      {!prefersReducedMotion && (
        <div
          className="absolute inset-0 z-5 pointer-events-none"
          aria-hidden="true"
        >
          <div
            className={`absolute top-1/4 left-1/4 w-64 h-64 bg-pink-200 rounded-full blur-3xl transition-all duration-1000 ${
              mounted ? "opacity-20" : "opacity-0"
            }`}
          ></div>
          <div
            className={`absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-200 rounded-full blur-3xl transition-all duration-1000 ${
              mounted ? "opacity-20" : "opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          ></div>
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full blur-3xl transition-all duration-1000 ${
              mounted ? "opacity-15" : "opacity-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          ></div>
        </div>
      )}
    </div>
  );
}
