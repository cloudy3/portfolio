import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./_components/shared/Navigation";
import ScrollProvider from "./_components/shared/ScrollProvider";
import BrowserCompatibility from "./_components/ui/BrowserCompatibility";
import PerformanceMonitor from "./_components/shared/PerformanceMonitor";
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
  title: {
    default: "Jing Feng — Software Engineer",
    template: "%s | Jing Feng",
  },
  description:
    "Full-stack engineer building calm, reliable systems with Flutter, Python, and Google Cloud.",
  keywords:
    "Jing Feng, software engineer, Flutter, Python, Google Cloud, full-stack, portfolio",
  authors: [{ name: "Cheah Jing Feng" }],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Jing Feng — Software Engineer",
    description:
      "Full-stack engineer — Flutter, Python, Google Cloud, and product-minded delivery.",
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

export const viewport = {
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
        <PerformanceMonitor />
        <AccessibilityAuditor />
        <AccessibilityProvider>
          <BrowserCompatibility />
          <Navigation />
          <ScrollProvider>
            <main id="main-content" className="relative pt-16">
              {children}
            </main>
          </ScrollProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
