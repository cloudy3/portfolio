import { vi } from "vitest";
import { getAllProjectSlugs, getProjectBySlug } from "@/lib/projectData";

// notFound() throws in Next; mirror that so the page's control flow is testable.
const NOT_FOUND = new Error("NEXT_NOT_FOUND");
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw NOT_FOUND;
  }),
}));

import ProjectDetailPage, { generateStaticParams, generateMetadata } from "../[slug]/page";

describe("generateStaticParams", () => {
  it("emits a param for every project slug", () => {
    const params = generateStaticParams();
    const slugs = getAllProjectSlugs();

    expect(params).toHaveLength(slugs.length);
    expect(params.map((p) => p.slug).sort()).toEqual([...slugs].sort());
  });

  it("emits only slugs that actually resolve to a project", () => {
    for (const { slug } of generateStaticParams()) {
      expect(getProjectBySlug(slug)).toBeDefined();
    }
  });
});

describe("generateMetadata", () => {
  it("uses the project title and description for a known slug", async () => {
    const [slug] = getAllProjectSlugs();
    const project = getProjectBySlug(slug)!;

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug }),
    });

    expect(metadata.title).toContain(project.title);
    expect(metadata.description).toBe(project.description);
  });

  it("falls back to a generic title for an unknown slug", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "no-such-project" }),
    });

    expect(metadata.title).toBe("Project");
  });
});

describe("ProjectDetailPage", () => {
  it("calls notFound() for an unknown slug", async () => {
    await expect(
      ProjectDetailPage({ params: Promise.resolve({ slug: "no-such-project" }) })
    ).rejects.toThrow(NOT_FOUND);
  });

  it("renders for a known slug", async () => {
    const [slug] = getAllProjectSlugs();

    await expect(
      ProjectDetailPage({ params: Promise.resolve({ slug }) })
    ).resolves.toBeTruthy();
  });
});
