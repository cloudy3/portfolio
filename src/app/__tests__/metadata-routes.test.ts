import robots from "../robots";
import sitemap from "../sitemap";
import { getAllProjectSlugs } from "@/lib/projectData";
import { SITE_URL } from "@/lib/site";

describe("sitemap", () => {
  const urls = sitemap().map((entry) => entry.url);

  it("lists every project case study", () => {
    for (const slug of getAllProjectSlugs()) {
      expect(urls).toContain(`${SITE_URL}/projects/${slug}`);
    }
  });

  it("uses absolute URLs with no duplicates", () => {
    expect(urls.every((url) => url.startsWith(SITE_URL))).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe("robots", () => {
  it("allows crawling and points at the sitemap", () => {
    const result = robots();
    expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});
