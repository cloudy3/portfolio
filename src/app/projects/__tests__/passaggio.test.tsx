import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import ProjectDetailPage, { generateMetadata } from "../[slug]/page";
import { ProjectsCatalog } from "../ProjectsCatalog";
import { sampleProjects } from "@/lib/projectData";
import sitemap from "@/app/sitemap";

vi.mock("@/app/_components/ui/Section", () => ({
  Section: ({ children }: { children: ReactNode }) => <section>{children}</section>,
}));
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

it("presents the personal story with opt-in video and no empty screenshot gallery", async () => {
  const { container } = render(await ProjectDetailPage({ params: Promise.resolve({ slug: "passaggio" }) }));
  expect(screen.getByRole("heading", { level: 1, name: "Passaggio" })).toBeInTheDocument();
  expect(screen.getAllByRole("heading", { level: 2 }).slice(0, 4).map((h) => h.textContent)).toEqual([
    "Why I built it", "From recordings to practice", "The engineering behind it", "What changed for me",
  ]);
  const video = screen.getByLabelText("Passaggio product teaser");
  expect(video).toHaveAttribute("controls");
  expect(video).toHaveAttribute("playsinline");
  expect(video).toHaveAttribute("preload", "none");
  expect(video).toHaveAttribute("poster", "/projects/passaggio/poster.webp");
  expect(video).not.toHaveAttribute("autoplay");
  expect(video).not.toHaveAttribute("loop");
  expect(container.querySelector('track[kind="captions"]')).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Open video directly" })).toHaveAttribute("href", "/projects/passaggio/teaser.mp4");
  expect(screen.getByRole("link", { name: "Source" })).toHaveAttribute("href", "https://github.com/cloudy3/passaggio");
  expect(container.querySelectorAll("img")).toHaveLength(0);
  expect(screen.queryByRole("link", { name: "Live" })).not.toBeInTheDocument();
});

it("keeps the existing detail content for projects without a case study or video", async () => {
  const { container } = render(await ProjectDetailPage({ params: Promise.resolve({ slug: "portfolio-website" }) }));
  expect(screen.getByRole("heading", { name: "Context" })).toBeInTheDocument();
  expect(container.querySelector("video")).toBeNull();
  expect(container.querySelectorAll("img").length).toBeGreaterThan(0);
});

it("includes Passaggio in mobile filtering and uses its poster as the preview", () => {
  const { container } = render(<ProjectsCatalog projects={sampleProjects} />);
  fireEvent.click(screen.getByRole("button", { name: "mobile" }));
  expect(screen.getByRole("link", { name: "Passaggio" })).toHaveAttribute("href", "/projects/passaggio");
  expect(container.querySelector('img[src="/projects/passaggio/poster.webp"]')).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "web" }));
  expect(screen.queryByRole("link", { name: "Passaggio" })).not.toBeInTheDocument();
});

it("publishes the correct canonical metadata and sitemap entry", async () => {
  const metadata = await generateMetadata({ params: Promise.resolve({ slug: "passaggio" }) });
  expect(metadata.title).toBe("Passaggio");
  expect(metadata.alternates?.canonical).toBe("/projects/passaggio");
  expect(sitemap().some(({ url }) => url.endsWith("/projects/passaggio"))).toBe(true);
});
