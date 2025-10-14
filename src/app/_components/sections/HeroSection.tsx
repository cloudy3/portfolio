"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import WaveLineVisualization from "../shared/WaveLineVisualization";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { ANIMATION_CONFIG } from "@/lib/animations";
import { DURATIONS } from "@/lib/constants";
import { JING_FENG_PROFILE } from "@/lib/data/professional-profile";

/**
 * Props for the HeroSection component
 *
 * @property className - Optional CSS class name for additional styling
 */
interface HeroSectionProps {
  className?: string;
}

/**
 * HeroSection Component
 *
 * The main hero section of the portfolio featuring:
 * - Animated 3D wave line visualization background
 * - Personal introduction and title
 * - Call-to-action buttons for navigation
 * - Scroll indicator with smooth scrolling
 * - GSAP-powered entrance animations
 *
 * ## Features
 * - Full-screen responsive layout
 * - Staggered entrance animations for all elements
 * - Smooth scroll navigation to other sections
 * - Interactive 3D background visualization
 * - Mobile-optimized performance
 * - Error boundary protection for visualization
 *
 * ## Sections Linked
 * - "View My Work" button → Projects section
 * - "Get In Touch" button → Contact section
 * - Scroll indicator → About section
 *
 * @example
 * <HeroSection />
 *
 * @example
 * <HeroSection className="custom-hero" />
 */
export default function HeroSection({ className = "" }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaButtonsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  /**
   * Scrolls smoothly to a section by ID
   *
   * Uses native browser smooth scrolling with fallback to scrollIntoView.
   * Accounts for fixed navigation header offset.
   *
   * @param sectionId - The ID of the target section element
   */
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    console.log("Scrolling to section:", sectionId, "Element found:", element);

    if (element) {
      // Calculate the target scroll position
      const elementTop = element.offsetTop;
      const offset = 80; // Account for fixed navigation header height
      const targetPosition = Math.max(0, elementTop - offset);

      console.log(
        "Element offsetTop:",
        elementTop,
        "Target position:",
        targetPosition
      );

      // Use native smooth scroll (preferred method)
      try {
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
        console.log("Using native smooth scroll");
      } catch (error) {
        // Fallback to scrollIntoView for older browsers
        console.error("Native scroll failed, trying scrollIntoView:", error);
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      console.error("Element not found for section:", sectionId);
    }
  };

  /**
   * Initialize GSAP animations on component mount
   *
   * Creates a staggered entrance animation for all hero elements:
   * 1. Title fades in and slides up
   * 2. Subtitle follows with slight delay
   * 3. Description animates in
   * 4. CTA buttons appear
   * 5. Scroll indicator fades in and starts floating
   *
   * Uses GSAP context for automatic cleanup on unmount.
   */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states for all animated elements
      // Elements start invisible and offset downward
      gsap.set(titleRef.current, {
        opacity: 0,
        y: 50,
      });

      gsap.set(subtitleRef.current, {
        opacity: 0,
        y: 80, // Start further down to account for spacing
      });

      gsap.set(descriptionRef.current, {
        opacity: 0,
        y: 50,
      });

      gsap.set(ctaButtonsRef.current, {
        opacity: 0,
        y: 30,
      });

      gsap.set(scrollIndicatorRef.current, {
        opacity: 0,
        y: 20,
      });

      // Create entrance animation timeline with 0.5s initial delay
      // This allows the page to settle before animations start
      const tl = gsap.timeline({ delay: 0.5 });

      // Animate title first (most important element)
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: DURATIONS.slow / 1000, // Convert ms to seconds
        ease: ANIMATION_CONFIG.ease,
      })
        // Animate subtitle with overlap for smooth flow
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: DURATIONS.normal / 1000,
            ease: ANIMATION_CONFIG.ease,
          },
          "-=0.2" // Start 0.2s before previous animation ends
        )
        // Animate description
        .to(
          descriptionRef.current,
          {
            opacity: 1,
            y: 0,
            duration: DURATIONS.normal / 1000,
            ease: ANIMATION_CONFIG.ease,
          },
          "-=0.2"
        )
        // Animate CTA buttons
        .to(
          ctaButtonsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: DURATIONS.normal / 1000,
            ease: ANIMATION_CONFIG.ease,
          },
          "-=0.1"
        )
        // Animate scroll indicator last
        .to(
          scrollIndicatorRef.current,
          {
            opacity: 1,
            y: 0,
            duration: DURATIONS.fast / 1000,
            ease: ANIMATION_CONFIG.ease,
          },
          "-=0.1"
        );

      // Add continuous floating animation to scroll indicator
      // Creates subtle up-down motion to draw attention
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        duration: 1.5,
        ease: "power2.inOut",
        yoyo: true, // Reverse animation on each repeat
        repeat: -1, // Infinite loop
      });

      // Note: ScrollTrigger animations removed to prevent scroll conflicts
      // This ensures smooth, uninterrupted scrolling behavior
    }, heroRef);

    // Cleanup function: reverts all GSAP animations on unmount
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className={`relative h-screen flex items-center justify-center overflow-hidden ${className}`}
      id="hero"
    >
      {/* Light Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 z-0"></div>

      {/* Wave Line Visualization */}
      <div className="absolute inset-0 z-10">
        <ErrorBoundary
          fallback={
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-200 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-200 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full blur-3xl"></div>
              </div>
            </div>
          }
          onError={(error, errorInfo) => {
            console.error(
              "HeroSection: WaveLineVisualization error caught by ErrorBoundary:",
              error,
              errorInfo
            );
          }}
        >
          <WaveLineVisualization className="w-full h-full" />
        </ErrorBoundary>
      </div>

      {/* Light gradient overlay for subtle depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20 z-20"></div>

      {/* Hero Content */}
      <div className="relative z-30 text-center px-4 sm:px-6 md:px-8 lg:px-12 max-w-5xl mx-auto pt-24 sm:pt-28 md:pt-32">
        {/* Main Title */}
        <h1
          ref={titleRef}
          className="text-slate-900 mb-8 sm:mb-12 md:mb-16 leading-relaxed"
        >
          <span className="block">Hi,</span>
          <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
            I&apos;m Jing Feng
          </span>
        </h1>

        {/* Subtitle */}
        <h3
          ref={subtitleRef}
          className="text-slate-700 mb-3 sm:mb-4 mt-12 sm:mt-16 md:mt-20 font-light px-2"
        >
          {JING_FENG_PROFILE.title}
        </h3>

        {/* Description */}
        <p
          ref={descriptionRef}
          className="text-slate-600 mb-8 sm:mb-10 md:mb-12 mt-4 sm:mt-6 md:mt-8 max-w-3xl mx-auto leading-relaxed px-2"
        >
          {JING_FENG_PROFILE.summary}
        </p>

        {/* Call-to-Action Buttons */}
        <div
          ref={ctaButtonsRef}
          className="flex flex-col xs:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center mb-12 sm:mb-14 md:mb-16 px-2"
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log("View My Work button clicked");
              scrollToSection("projects");
            }}
            className="group relative w-full xs:w-auto min-w-[160px] px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/25 active:scale-95 touch-manipulation"
          >
            <span className="relative z-10">View My Work</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              console.log("Get In Touch button clicked");
              scrollToSection("contact");
            }}
            className="group w-full xs:w-auto min-w-[160px] px-6 sm:px-8 py-3 sm:py-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg backdrop-blur-sm transition-all duration-300 hover:border-amber-500 hover:bg-amber-50 active:scale-95 touch-manipulation"
          >
            <span className="group-hover:text-amber-600 transition-colors duration-300">
              Get In Touch
            </span>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div
          ref={scrollIndicatorRef}
          className="flex flex-col items-center cursor-pointer touch-manipulation"
          onClick={(e) => {
            e.preventDefault();
            console.log("Scroll indicator clicked");
            scrollToSection("about");
          }}
        >
          <span className="text-slate-500 text-xs sm:text-sm mb-2 hover:text-amber-500 transition-colors duration-300">
            Scroll to explore
          </span>
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-slate-400 rounded-full flex justify-center hover:border-amber-500 transition-colors duration-300 active:scale-95">
            <div className="w-1 h-2 sm:h-3 bg-slate-400 rounded-full mt-1.5 sm:mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-25"></div>
    </section>
  );
}
