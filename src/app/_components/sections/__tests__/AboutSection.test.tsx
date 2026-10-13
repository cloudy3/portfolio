import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import AboutSection from "../AboutSection";

vi.mock("next/image", () => ({
  __esModule: true,
  default (props: { alt: string }) {
    return <img alt={props.alt || "photo"} src="/x.png" />;
  },
}));

vi.mock("motion/react", () => {
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
    // A plain link, so the download works before (or without) hydration.
    const resume = screen.getByRole("link", { name: /Download résumé/i });
    expect(resume).toHaveAttribute("href", "/resume.pdf");
    expect(resume).toHaveAttribute("download", "Cheah_Jing_Feng_Resume.pdf");
    expect(screen.getByRole("link", { name: /Contact/i })).toHaveAttribute(
      "href",
      "#contact"
    );
  });
});
