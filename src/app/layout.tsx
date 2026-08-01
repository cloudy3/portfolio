import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./_components/shared/Navigation";
import AccessibilityProvider from "./_components/shared/AccessibilityProvider";
import AccessibilityAuditor from "./_components/ui/AccessibilityAuditor";
import Field from "./_components/shared/Field";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

/*
 * Zen Kaku Gothic New. One family for the whole site: hierarchy comes from
 * weight contrast (300 against 900), not from a second face or from raw scale,
 * so all five weights are genuinely in use and none is dead payload.
 *
 * SELF-HOSTED ON PURPOSE — do not move this back to next/font/google.
 *
 * This is a full Japanese face, and Google serves it as 121 unicode-range
 * chunks per weight. `subsets: ["latin"]` does not reduce that (verified
 * against the CSS API: the subset parameter is ignored for CJK families). Via
 * next/font/google the five weights produced 606 @font-face rules, a 155 KB
 * gzipped RENDER-BLOCKING stylesheet, and 8.6 MB of self-hosted woff2 — on a
 * site whose mobile Lighthouse score is already 62-65. Google also distributes
 * ASCII across several chunks mixed with kanji, so the latin coverage cannot
 * simply be lifted out of them.
 *
 * The files here came from the CSS API's `text=` parameter, which returns a
 * single pre-subset woff2 per weight. Inventory: printable ASCII, the Latin-1
 * supplement, typographic punctuation, currency, arrows, math and 間. Total
 * 53 KB for all five weights.
 *
 * If a glyph outside that inventory ever needs to render, re-run the fetch with
 * it added rather than reverting to the Google loader. Visitor-typed text in
 * the contact form falls back to system-ui, which is expected.
 *
 * `variable` deliberately reuses Tailwind's own `--font-sans` / `--font-mono`
 * theme keys. next/font redefines them on <body>, which is why the `font-sans`
 * and `font-mono` utilities resolve to these faces rather than to Tailwind's
 * default stacks.
 */
const zenKaku = localFont({
  src: [
    { path: "../fonts/ZenKakuGothicNew-300.woff2", weight: "300", style: "normal" },
    { path: "../fonts/ZenKakuGothicNew-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ZenKakuGothicNew-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/ZenKakuGothicNew-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/ZenKakuGothicNew-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

/* Numbers only. See the mono rule in globals.css. */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Jing Feng - Software Engineer",
    template: "%s | Jing Feng",
  },
  description:
    "Full-stack engineer building calm, reliable systems with Flutter, Python, and Google Cloud.",
  keywords:
    "Jing Feng, software engineer, Flutter, Python, Google Cloud, full-stack, portfolio",
  authors: [{ name: "Cheah Jing Feng" }],
  // Icons come from the app/ file conventions (favicon.ico, icon.svg,
  // apple-icon.png) — declaring metadata.icons here would override them.
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "JF Portfolio",
  },
  openGraph: {
    title: "Jing Feng - Software Engineer",
    description:
      "Full-stack engineer. Flutter, Python, Google Cloud, and product-minded delivery.",
    type: "website",
    locale: "en_US",
    siteName: "Jing Feng Portfolio",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jing Feng - Software Engineer",
    description:
      "Full-stack engineer. Flutter, Python, Google Cloud, and product-minded delivery.",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `overflow-x-hidden` sits on <body> rather than <html> deliberately.
    // Because <html> keeps `overflow: visible`, the body's overflow propagates
    // up to the viewport and the body itself is treated as `visible` — so it
    // does not become a scroll container, and `position: sticky` descendants
    // (the keyboard story) still stick to the viewport. Moving this to <html>
    // would break that; if it ever needs to move, use `overflow-x: clip`,
    // which never establishes a scroll container.
    // suppressHydrationWarning covers exactly one attribute: `data-theme`,
    // written onto <html> by the bootstrap below before React ever sees the
    // document. It is scoped to this element and does not extend to children.
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/*
         * Applies the stored colour scheme before first paint. Must stay inline
         * and render-blocking — an external or deferred script would run after
         * the first frame, which is the flash it exists to prevent.
         */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        className={`${zenKaku.variable} ${jetbrainsMono.variable} font-sans antialiased bg-surface-page text-content-primary overflow-x-hidden`}
      >
        <AccessibilityAuditor />
        <AccessibilityProvider>
          {/*
           * One canvas for the whole site, behind everything. Sections opt in
           * with a FieldAnchor; this only mounts the surface they draw on.
           */}
          <Field />
          <Navigation />
          {/* z-10 so the content column always sits above the field. */}
          <main id="main-content" className="relative z-10 pt-16">
            {children}
          </main>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
