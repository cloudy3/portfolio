import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navigation from "./_components/shared/Navigation";
import ScrollProvider from "./_components/shared/ScrollProvider";
import BrowserCompatibility from "./_components/ui/BrowserCompatibility";
import PerformanceMonitor from "./_components/shared/PerformanceMonitor";
import AccessibilityProvider from "./_components/shared/AccessibilityProvider";
import AccessibilityAuditor from "./_components/ui/AccessibilityAuditor";
import SplashScreen from "./_components/ui/SplashScreen";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jing Feng's Portfolio",
  description:
    "A modern portfolio website with Mont-Fort inspired design and smooth animations",
  keywords: "portfolio, web development, design, accessibility, performance",
  authors: [{ name: "Cheah Jing Feng" }],
  openGraph: {
    title: "Jing Feng's Portfolio",
    description:
      "A modern portfolio website with Mont-Fort inspired design and smooth animations",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jing Feng's Portfolio",
    description:
      "A modern portfolio website with Mont-Fort inspired design and smooth animations",
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
        className={`${poppins.variable} font-sans antialiased bg-white text-gray-900 overflow-x-hidden`}
      >
        <SplashScreen />
        <PerformanceMonitor />
        <AccessibilityAuditor />
        <AccessibilityProvider>
          <BrowserCompatibility />
          <Navigation />
          <ScrollProvider>
            <main id="main-content" className="relative">
              {children}
            </main>
          </ScrollProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
