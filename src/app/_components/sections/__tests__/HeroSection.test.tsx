import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import HeroSection from "../HeroSection";

jest.mock("next/link", () => ({
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

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => {
    function MockWave() {
      return <div data-testid="wave-line-visualization">Wave</div>;
    }
    return MockWave;
  },
}));

jest.mock("framer-motion", () => {
  const passthrough = (Tag: "div" | "h1" | "p") =>
    function MotionTag({
      children,
      ...rest
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) {
      return React.createElement(Tag, rest, children);
    };
  const motion = {
    div: passthrough("div"),
    h1: passthrough("h1"),
    p: passthrough("p"),
  };
  return { motion, useReducedMotion: () => false };
});

jest.mock("../../shared/ErrorBoundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  ),
}));

describe("HeroSection", () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
    document.getElementById = jest.fn((id: string) => {
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
    expect(screen.getByRole("link", { name: /All projects/i })).toHaveAttribute(
      "href",
      "/projects"
    );
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
