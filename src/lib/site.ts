import type { Metadata } from "next";

/*
 * Absolute base for the canonical, og:image, robots.txt and sitemap URLs.
 * NEXT_PUBLIC_SITE_URL wins when set. Otherwise every Vercel build, production
 * or preview, uses the production domain: production shipped
 * `http://localhost:3000` as its canonical for months because the variable was
 * never set there. Previews pointing at production is intended, since they
 * must not be canonical. The www host is the one the apex redirects to.
 */
const PRODUCTION_URL = "https://www.jingfeng-cheah.me";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL ? PRODUCTION_URL : "http://localhost:3000");

export const SITE_NAME = "Jing Feng Portfolio";

/*
 * The site-wide Open Graph fields. Metadata merges shallowly, so a page that
 * sets `openGraph` at all replaces the layout's object rather than extending
 * it; pages spread this and override title, description and url.
 */
export const SHARED_OPEN_GRAPH = {
  title: "Jing Feng - Software Engineer",
  description:
    "Full-stack engineer. Flutter, Python, Google Cloud, and product-minded delivery.",
  type: "website",
  locale: "en_US",
  siteName: SITE_NAME,
} satisfies Metadata["openGraph"];
