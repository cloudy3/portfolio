"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import { LAND_SPRING } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn, smoothScrollTo } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

interface NavigationProps {
  className?: string;
}

/** Matches the nav's own height, so a section counts as active once it clears it. */
const ACTIVE_BAND_TOP = 140;

export default function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const reduce = usePrefersReducedMotion();
  const isHome = pathname === "/";

  /*
   * Scroll position, via Motion's useScroll rather than a raw
   * `window.addEventListener("scroll")`. The listener this replaces ran on
   * every scroll frame and, on top of that, called getBoundingClientRect()
   * across all six sections inside the handler — a forced synchronous layout
   * per frame. useMotionValueEvent keeps the work off the React render path,
   * and setState only fires when the boolean actually flips.
   */
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 24;
    setIsScrolled((prev) => (prev === next ? prev : next));
  });

  /*
   * Active section, via IntersectionObserver rather than per-frame geometry.
   * The observed band starts just below the nav and ends 55% up the viewport,
   * so the active item changes when a section genuinely occupies the reading
   * area. Entries are sorted by document order and the last one to have
   * entered the band wins, which matches how the old rect check behaved.
   */
  useEffect(() => {
    if (!isHome) {
      setActiveSection(pathname.startsWith("/projects") ? "work" : "");
      return;
    }

    const ids = NAVIGATION_ITEMS.map((item) => item.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Document order, so overlapping sections resolve to the lower one.
        const current = ids.filter((id) => visible.has(id)).pop();
        setActiveSection(current ?? "hero");
      },
      { rootMargin: `-${ACTIVE_BAND_TOP}px 0px -55% 0px` }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [isHome, pathname]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const id = href.replace("#", "");
    if (isHome) {
      smoothScrollTo(id, 80);
    }
  };

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const nav = document.getElementById("mobile-nav");
      const btn = document.getElementById("mobile-menu-button");
      if (
        isOpen &&
        nav &&
        btn &&
        !nav.contains(event.target as Node) &&
        !btn.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [isOpen]);

  // Escape closes the mobile menu and returns focus to the trigger, so
  // keyboard users aren't stranded inside a closed menu.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      menuButtonRef.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const isActive = (id: string, path?: string) => {
    if (isHome) return activeSection === id;
    return Boolean(path && pathname.startsWith(path));
  };

  /*
   * `text-accent-cyan` is a deprecated alias that resolves to the one locked
   * accent. It stays on this element specifically because Navigation.test.tsx
   * asserts the literal class name for the active Work link.
   */
  const navLinkClass = (id: string, path?: string) =>
    cn(
      "relative flex h-full items-center px-3 text-[0.8125rem] font-medium transition-colors",
      isActive(id, path)
        ? "text-accent-cyan"
        : "text-content-secondary hover:text-content-primary"
    );

  /**
   * The active section mark. A vermilion segment travels along the nav's bottom
   * hairline as the reader changes sections. It slides
   * between items via layoutId, which is the state transition made visible
   * instead of a new indicator blinking in somewhere else.
   */
  const LaneMark = () =>
    reduce ? (
      <span
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
        aria-hidden
      />
    ) : (
      <motion.div
        layoutId="nav-lane-mark"
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
        transition={LAND_SPRING}
        aria-hidden
      />
    );

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300",
        isScrolled || !isHome
          ? "bg-surface-elevated/92 backdrop-blur-md border-border-subtle"
          : "bg-transparent border-transparent",
        className
      )}
      aria-label="Main"
    >
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="container-custom max-w-content">
        <div className="flex h-16 items-center justify-between">
          {/* Monogram at display weight. Previously text-sm font-semibold with
              a drop shadow, which read as placeholder text rather than a mark. */}
          <Link
            href="/"
            className="text-[0.9375rem] font-black tracking-[-0.05em] text-content-primary transition-colors hover:text-accent-ink"
          >
            JF
          </Link>

          <div className="hidden h-full items-center md:flex">
            {NAVIGATION_ITEMS.map((item) =>
              isHome ? (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.href)}
                  className={navLinkClass(item.id)}
                >
                  {item.label}
                  {isActive(item.id) ? <LaneMark /> : null}
                </button>
              ) : "path" in item && item.path ? (
                <Link
                  key={item.id}
                  href={item.path}
                  className={navLinkClass(item.id, item.path)}
                >
                  {item.label}
                  {isActive(item.id, item.path) ? <LaneMark /> : null}
                </Link>
              ) : (
                <Link
                  key={item.id}
                  href={`/${item.href}`}
                  className={navLinkClass(item.id)}
                >
                  {item.label}
                </Link>
              )
            )}

            {/* The toggle is a control, not a destination, so a hairline
                separates it from the nav items rather than letting it read as
                a seventh link. */}
            <span className="mx-2 h-4 w-px bg-border-subtle" aria-hidden />
            <ThemeToggle />
          </div>

          {/* On mobile the toggle stays outside the menu: changing the theme
              should not cost two taps and a panel that covers the page you are
              trying to look at. */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              id="mobile-menu-button"
              ref={menuButtonRef}
              type="button"
              aria-controls="mobile-nav"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-control p-2 text-content-primary hover:bg-surface-subtle"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <span className="sr-only">
                {isOpen ? "Close" : "Open"} main menu
              </span>
              <div className="flex h-5 w-6 flex-col justify-center gap-1.5">
                <span
                  className={cn(
                    "h-0.5 w-full origin-center bg-content-primary transition-transform",
                    isOpen && "translate-y-2 rotate-45"
                  )}
                />
                <span
                  className={cn(
                    "h-0.5 w-full bg-content-primary transition-opacity",
                    isOpen && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "h-0.5 w-full origin-center bg-content-primary transition-transform",
                    isOpen && "-translate-y-2 -rotate-45"
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "overflow-hidden border-b border-border-subtle bg-surface-elevated transition-all duration-300 md:hidden",
          isOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {/* One lane per row: the active row carries the accent on its left edge,
            which is the vertical form of the same lane mark used on desktop. */}
        <div className="flex flex-col py-2">
          {NAVIGATION_ITEMS.map((item) =>
            isHome ? (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  "border-l-2 px-5 py-3 text-left text-base font-medium transition-colors",
                  isActive(item.id)
                    ? "border-accent text-content-primary"
                    : "border-transparent text-content-secondary hover:border-border-strong hover:text-content-primary"
                )}
              >
                {item.label}
              </button>
            ) : "path" in item && item.path ? (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "border-l-2 px-5 py-3 text-left text-base font-medium transition-colors",
                  isActive(item.id, item.path)
                    ? "border-accent text-content-primary"
                    : "border-transparent text-content-secondary hover:border-border-strong hover:text-content-primary"
                )}
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.id}
                href={`/${item.href}`}
                onClick={() => setIsOpen(false)}
                className="border-l-2 border-transparent px-5 py-3 text-left text-base font-medium text-content-secondary transition-colors hover:border-border-strong hover:text-content-primary"
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
