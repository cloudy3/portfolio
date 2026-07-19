import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import AboutSection from "../AboutSection";

vi.mock("next/image", () => ({
  __esModule: true,
  default (props: { alt: string }) {
    return <img alt={props.alt || "photo"} src="/x.png" />;
  },
}));

vi.mock("framer-motion", () => {
  const React = require("react");
  return {
    motion: { div: ({ children, ...p }: { children?: React.ReactNode }) => <div {...p}>{children}</div> },
    useReducedMotion: () => true,
  };
});

describe("AboutSection", () => {
  it("renders summary and capabilities", () => {
    render(<AboutSection />);
    expect(
      screen.getByRole("heading", { name: /Builder mindset/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Technical breadth/i)).toBeInTheDocument();
  });

  it("renders résumé and contact actions", () => {
    render(<AboutSection />);
    expect(
      screen.getByRole("button", { name: /Download résumé/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Contact/i })).toHaveAttribute(
      "href",
      "#contact"
    );
  });
});
