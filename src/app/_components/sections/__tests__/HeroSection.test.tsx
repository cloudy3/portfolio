import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import HeroSection from "../HeroSection";

vi.mock("next/link", () => ({
  __esModule: true,
  default ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  },
}));

vi.mock("framer-motion", () => {
  // Motion-only props must not reach the DOM or React warns about them.
  const MOTION_PROPS = new Set([
    "initial",
    "animate",
    "exit",
    "variants",
    "transition",
    "whileInView",
    "viewport",
  ]);

  const passthrough = (Tag: "div" | "h1" | "p") =>
    function MotionTag({
      children,
      ...rest
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) {
      const domProps = Object.fromEntries(
        Object.entries(rest).filter(([key]) => !MOTION_PROPS.has(key))
      );
      return React.createElement(Tag, domProps, children);
    };

  const motion = {
    div: passthrough("div"),
    h1: passthrough("h1"),
    p: passthrough("p"),
  };

  return {
    motion,
    useReducedMotion: () => false,
    MotionConfig: ({ children }: { children?: React.ReactNode }) => children,
  };
});

describe("HeroSection", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    document.getElementById = vi.fn((id: string) => {
      if (id === "work" || id === "contact" || id === "about") {
        return document.createElement("div");
      }
      return null;
    });
  });

  it("renders headline and primary actions", () => {
    render(<HeroSection />);
    expect(screen.getByText(/Calm systems/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /View selected work/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Contact/i })).toBeInTheDocument();
  });

  it("keeps the hero to two CTAs, one intent each", () => {
    // "View selected work" and "All projects" were both portfolio intent, and
    // a fourth "Bonus: Keyboard story" link competed with all of them. Those
    // two links now live in the Work section instead.
    render(<HeroSection />);
    expect(
      screen.queryByRole("link", { name: /All projects/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Keyboard story/i })
    ).not.toBeInTheDocument();
  });

  it("opts into the site field and marks its copy as keep-out", () => {
    // Replaces an assertion on the hero's own three.js canvas, which no longer
    // exists: the background visual is the shared field, mounted in the layout.
    // The hero's side of that contract is these two attributes, so this is the
    // same guarantee expressed against the current architecture.
    const { container } = render(<HeroSection />);

    const section = container.querySelector("[data-field]");
    expect(section).toBeTruthy();
    expect(section?.querySelector("[data-keepout]")).toHaveAttribute(
      "data-keepout",
      "soft"
    );
  });

  it("scrolls when primary CTA clicked", () => {
    render(<HeroSection />);
    fireEvent.click(screen.getByRole("button", { name: /View selected work/i }));
    expect(window.scrollTo).toHaveBeenCalled();
  });
});
