"use client";

import { useState, useEffect } from "react";

/**
 * SplashScreen Component
 *
 * Displays a loading splash screen on initial page load.
 * Automatically exits when page resources are loaded and minimum display time has elapsed.
 *
 * State Management:
 * - isLoading: Controls visibility of splash screen
 * - isExiting: Controls exit animation state
 * - minimumTimeElapsed: Tracks if minimum display time has passed
 * - domReady: Tracks if DOM is fully loaded
 * - fontsReady: Tracks if fonts are loaded
 * - prefersReducedMotion: Tracks user's motion preference
 *
 * Accessibility Features:
 * - ARIA attributes: role="status", aria-live="polite", aria-busy
 * - Semantic HTML: Uses <h1> for proper heading hierarchy
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

    // Add event listener (with fallback for older browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
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
      className={`splash-screen ${isExiting ? "exiting" : ""} ${
        prefersReducedMotion ? "reduce-motion" : ""
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading website content"
      aria-busy={!isExiting}
    >
      <div className="splash-content">
        <h1 className="splash-logo" aria-label="Jing Feng Portfolio">
          Jing Feng
        </h1>
        <div
          className="splash-loader"
          aria-label="Loading"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={undefined}
        />
      </div>
    </div>
  );
}
