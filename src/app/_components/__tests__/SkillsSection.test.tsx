import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import SkillsSection from "../sections/SkillsSection";
import { SKILLS_DATA } from "@/lib/data/skills";

vi.mock("framer-motion", () => {
  const React = require("react");
  return {
    motion: { div: ({ children, ...p }: { children?: React.ReactNode }) => <div {...p}>{children}</div> },
    useReducedMotion: () => true,
  };
});

describe("SkillsSection", () => {
  it("renders section title and filters", () => {
    render(<SkillsSection />);
    expect(screen.getByText("Tools I ship with")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^All$/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Frontend" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cloud" })).toBeInTheDocument();
  });

  it("lists Next.js in skills", () => {
    render(<SkillsSection />);
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("shows the editorial groups without dashboard counters", () => {
    render(<SkillsSection />);
    expect(screen.getByText(SKILLS_DATA[0].name)).toBeInTheDocument();
    expect(screen.queryByText("Total")).not.toBeInTheDocument();
    expect(screen.queryByText("Areas")).not.toBeInTheDocument();
  });

  it("switches active filter", () => {
    render(<SkillsSection />);
    fireEvent.click(screen.getByRole("button", { name: "Frontend" }));
    const fe = screen.getByRole("button", { name: "Frontend" });
    expect(fe.className).toMatch(/border-accent/);
    expect(fe).toHaveAttribute("aria-pressed", "true");
  });

  it("Cloud filter shows only cloud skills group", () => {
    render(<SkillsSection />);
    fireEvent.click(screen.getByRole("button", { name: "Cloud" }));
    expect(screen.getByRole("list", { name: "Cloud skills" })).toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "Frontend skills" })).not.toBeInTheDocument();
  });

  it("wraps terms instead of using horizontal skill tracks", () => {
    render(<SkillsSection />);
    const list = screen.getByRole("list", { name: "Frontend skills" });
    expect(list.className).toMatch(/flex-wrap/);
    expect(list.className).not.toMatch(/overflow-x-auto/);
  });
});
