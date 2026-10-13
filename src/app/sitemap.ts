import type { MetadataRoute } from "next";
import { getAllProjectSlugs } from "@/lib/projectData";
import { SITE_URL } from "@/lib/site";

/*
 * No lastModified. The only dates in the data are when each project was
 * completed, not when its page last changed, and Google ignores lastmod once
 * it proves unreliable.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/projects",
    ...getAllProjectSlugs().map((slug) => `/projects/${slug}`),
    "/keyboard-story",
  ];
  return paths.map((path) => ({ url: new URL(path, SITE_URL).href }));
}
