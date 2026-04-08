import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ProjectsSection } from "../sections/ProjectsSection";
import { Project } from "@/types";

jest.mock("next/image", () => ({
  __esModule: true,
  default (props: { alt: string; src: string }) {
    return <img alt={props.alt} src={props.src} />;
  },
}));

jest.mock("framer-motion", () => {
  const React = require("react");
  return {
    motion: { div: ({ children, ...p }: { children?: React.ReactNode }) => <div {...p}>{children}</div> },
    useReducedMotion: () => true,
  };
});

const mockProjects: Project[] = [
  {
    id: "test-1",
    title: "Test Web Project",
    description: "A test web project description",
    longDescription: "Longer text",
    technologies: ["React", "TypeScript", "Next.js"],
    category: "web",
    images: ["/test-image-1.jpg"],
    liveUrl: "https://test-web.example.com",
    githubUrl: "https://github.com/test/web-project",
    featured: true,
    completedAt: new Date("2024-01-15"),
  },
  {
    id: "test-2",
    title: "Test Mobile App",
    description: "A test mobile app description",
    technologies: ["React Native", "TypeScript"],
    category: "mobile",
    images: ["/test-image-2.jpg"],
    featured: true,
    completedAt: new Date("2023-06-01"),
  },
];

describe("ProjectsSection", () => {
  it("renders featured work heading", () => {
    render(<ProjectsSection projects={mockProjects} limit={3} />);
    expect(
      screen.getByText("Systems that hold up in production")
    ).toBeInTheDocument();
  });

  it("links to project detail and index", () => {
    render(<ProjectsSection projects={mockProjects} limit={3} />);
    expect(screen.getByRole("link", { name: /View all projects/i })).toHaveAttribute(
      "href",
      "/projects"
    );
    expect(screen.getByRole("link", { name: /Test Web Project/i })).toHaveAttribute(
      "href",
      "/projects/test-1"
    );
  });
});
