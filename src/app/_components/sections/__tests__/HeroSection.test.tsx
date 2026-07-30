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

vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => {
    function MockWave() {
      return <div data-testid="wave-line-visualization">Wave</div>;
    }
    return MockWave;
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

vi.mock("../../shared/ErrorBoundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  ),
}));

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

  it("renders wave visualization slot", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("wave-line-visualization")).toBeInTheDocument();
  });

  it("scrolls when primary CTA clicked", () => {
    render(<HeroSection />);
    fireEvent.click(screen.getByRole("button", { name: /View selected work/i }));
    expect(window.scrollTo).toHaveBeenCalled();
  });
});
