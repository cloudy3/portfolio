import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import type { Project } from "@/types";
import { ProjectsCatalog } from "../ProjectsCatalog";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

const project = (overrides: Partial<Project> & Pick<Project, "id">): Project =>
  ({
    title: `Project ${overrides.id}`,
    description: "A description",
    technologies: ["TypeScript"],
    category: "web",
    featured: false,
    images: [],
    completedAt: new Date("2024-01-01"),
    ...overrides,
  }) as Project;

const PROJECTS: Project[] = [
  project({ id: "web-a", category: "web", title: "Web A" }),
  project({ id: "web-b", category: "web", title: "Web B", featured: true }),
  project({ id: "mobile-a", category: "mobile", title: "Mobile A" }),
];

describe("ProjectsCatalog", () => {
  it("shows every project under the default 'all' filter", () => {
    render(<ProjectsCatalog projects={PROJECTS} />);

    expect(screen.getByText("Web A")).toBeInTheDocument();
    expect(screen.getByText("Web B")).toBeInTheDocument();
    expect(screen.getByText("Mobile A")).toBeInTheDocument();
  });

  it("narrows the list to the selected category", () => {
    render(<ProjectsCatalog projects={PROJECTS} />);

    fireEvent.click(screen.getByRole("button", { name: "mobile" }));

    expect(screen.getByText("Mobile A")).toBeInTheDocument();
    expect(screen.queryByText("Web A")).not.toBeInTheDocument();
    expect(screen.queryByText("Web B")).not.toBeInTheDocument();
  });

  it("returns to the full list when 'All' is reselected", () => {
    render(<ProjectsCatalog projects={PROJECTS} />);

    fireEvent.click(screen.getByRole("button", { name: "mobile" }));
    fireEvent.click(screen.getByRole("button", { name: "All" }));

    expect(screen.getByText("Web A")).toBeInTheDocument();
    expect(screen.getByText("Mobile A")).toBeInTheDocument();
  });

  it("renders an empty state for a category with no projects", () => {
    render(<ProjectsCatalog projects={PROJECTS} />);

    fireEvent.click(screen.getByRole("button", { name: "desktop" }));

    expect(
      screen.getByText(/No projects in this category/i)
    ).toBeInTheDocument();
  });

  it("sorts featured projects ahead of the rest", () => {
    render(<ProjectsCatalog projects={PROJECTS} />);

    const titles = screen
      .getAllByRole("heading")
      .map((heading) => heading.textContent);

    expect(titles.indexOf("Web B")).toBeLessThan(titles.indexOf("Web A"));
  });
});
