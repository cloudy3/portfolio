"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS, Z_INDEX } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface NavigationProps {
  className?: string;
}

function scrollToSectionId(id: string) {
  const element = document.getElementById(id);
  if (!element) return;
  const headerOffset = 80;
  const top =
    element.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

export default function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
      if (!isHome) return;

      if (window.scrollY < 80) {
        setActiveSection("hero");
        return;
      }

      const sections = NAVIGATION_ITEMS.map((item) => item.id);
      let current = "hero";
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            current = sectionId;
          }
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  useEffect(() => {
    if (!isHome) {
      if (pathname.startsWith("/projects")) setActiveSection("work");
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        let best = "";
        let ratio = 0;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > ratio) {
            const id = entry.target.id;
            if (NAVIGATION_ITEMS.some((item) => item.id === id)) {
              best = id;
              ratio = entry.intersectionRatio;
            }
          }
        });
        if (best) setActiveSection(best);
      },
      { root: null, rootMargin: "-8% 0px -55% 0px", threshold: [0, 0.1, 0.25] }
    );

    const t = setTimeout(() => {
      NAVIGATION_ITEMS.forEach((item) => {
        const el = document.getElementById(item.id);
        if (el && observerRef.current) observerRef.current.observe(el);
      });
    }, 300);

    return () => {
      clearTimeout(t);
      observerRef.current?.disconnect();
    };
  }, [isHome, pathname]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const id = href.replace("#", "");
    if (isHome) {
      scrollToSectionId(id);
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

  const navLinkClass = (id: string, path?: string) => {
    const onProjects = pathname.startsWith("/projects");
    const active =
      (path && onProjects && id === "work") ||
      (!path && isHome && activeSection === id);
    return cn(
      "relative px-3 py-2 text-sm font-medium transition-colors rounded-md",
      active
        ? "text-accent-cyan"
        : "text-content-secondary hover:text-content-primary"
    );
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b",
        isScrolled || !isHome
          ? "bg-surface-elevated/92 backdrop-blur-md border-border-subtle shadow-sm"
          : "bg-transparent border-transparent",
        className
      )}
      style={{ zIndex: Z_INDEX.fixed }}
      aria-label="Main"
    >
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="container-custom max-w-content">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className={cn(
              "text-sm font-semibold tracking-tight transition-colors",
              isScrolled || !isHome
                ? "text-content-primary"
                : "text-content-primary drop-shadow-sm"
            )}
          >
            JF
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAVIGATION_ITEMS.map((item) =>
              "path" in item && item.path ? (
                <Link
                  key={item.id}
                  href={item.path}
                  className={navLinkClass(item.id, item.path)}
                >
                  {item.label}
                  {pathname.startsWith("/projects") && item.id === "work" ? (
                    <span
                      className="absolute bottom-1 left-3 right-3 h-px bg-accent-cyan/80"
                      aria-hidden
                    />
                  ) : null}
                </Link>
              ) : isHome ? (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.href)}
                  className={navLinkClass(item.id)}
                >
                  {item.label}
                  {activeSection === item.id ? (
                    <span
                      className="absolute bottom-1 left-3 right-3 h-px bg-accent-cyan/80"
                      aria-hidden
                    />
                  ) : null}
                </button>
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
          </div>

          <div className="md:hidden">
            <button
              id="mobile-menu-button"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-content-primary hover:bg-surface-subtle"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <span className="sr-only">
                {isOpen ? "Close" : "Open"} main menu
              </span>
              <div className="flex h-5 w-6 flex-col justify-center gap-1.5">
                <span
                  className={cn(
                    "h-0.5 w-full bg-content-primary transition-transform origin-center",
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
                    "h-0.5 w-full bg-content-primary transition-transform origin-center",
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
          "md:hidden overflow-hidden border-b border-border-subtle bg-surface-elevated transition-all duration-300",
          isOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {NAVIGATION_ITEMS.map((item) =>
            "path" in item && item.path ? (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-3 text-left text-base font-medium text-content-primary hover:bg-surface-subtle"
              >
                {item.label}
              </Link>
            ) : isHome ? (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.href)}
                className="rounded-md px-3 py-3 text-left text-base font-medium text-content-primary hover:bg-surface-subtle"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.id}
                href={`/${item.href}`}
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-3 text-left text-base font-medium text-content-primary hover:bg-surface-subtle"
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
