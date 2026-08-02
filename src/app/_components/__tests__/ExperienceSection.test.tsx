import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import ExperienceSection from "../sections/ExperienceSection";
import {
  EDUCATION_DATA,
  EXPERIENCE_DATA,
  getTotalExperienceYears,
} from "@/lib/data/experience";

vi.mock("framer-motion", () => {
  const React = require("react");
  return {
    motion: {
      div: ({ children, ...props }: { children?: React.ReactNode }) => (
        <div {...props}>{children}</div>
      ),
    },
    useReducedMotion: () => true,
  };
});

describe("ExperienceSection", () => {
  it("presents one useful tenure signal without aggregate counters", () => {
    render(<ExperienceSection />);
    expect(screen.getByText(`${getTotalExperienceYears()}+`)).toBeInTheDocument();
    expect(screen.queryByText("Roles")).not.toBeInTheDocument();
    expect(screen.queryByText("Certifications")).not.toBeInTheDocument();
  });

  it("uses the current-role rule as meaningful state", () => {
    render(<ExperienceSection />);
    const current = screen.getByText("Current").closest("article");
    expect(current?.querySelector(".border-accent")).not.toBeNull();
  });

  it("switches between archive views", () => {
    render(<ExperienceSection />);
    const education = screen.getByRole("button", { name: "Education" });
    fireEvent.click(education);
    expect(education).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(EDUCATION_DATA[0].degree)).toBeInTheDocument();
    expect(screen.queryByText(EXPERIENCE_DATA[0].company)).not.toBeInTheDocument();
  });

  it("reveals and hides role highlights", () => {
    render(<ExperienceSection />);
    const disclosure = screen.getAllByRole("button", { name: "Highlights" })[0];
    fireEvent.click(disclosure);
    expect(disclosure).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByText(EXPERIENCE_DATA[0].achievements[0].description)
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Hide highlights" }));
    expect(
      screen.queryByText(EXPERIENCE_DATA[0].achievements[0].description)
    ).not.toBeInTheDocument();
  });
});
