import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./_components/shared/Navigation";
import AccessibilityProvider from "./_components/shared/AccessibilityProvider";
import AccessibilityAuditor from "./_components/ui/AccessibilityAuditor";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

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
    default: "Jing Feng — Software Engineer",
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
    title: "Jing Feng — Software Engineer",
    description:
      "Full-stack engineer — Flutter, Python, Google Cloud, and product-minded delivery.",
    type: "website",
    locale: "en_US",
    siteName: "Jing Feng Portfolio",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jing Feng — Software Engineer",
    description:
      "Full-stack engineer — Flutter, Python, Google Cloud, and product-minded delivery.",
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
    <html lang="en" className="scroll-smooth">
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased bg-surface-page text-content-primary overflow-x-hidden`}
      >
        <AccessibilityAuditor />
        <AccessibilityProvider>
          <Navigation />
          <main id="main-content" className="relative pt-16">
            {children}
          </main>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
