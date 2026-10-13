import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

// Bundle analyzer for performance monitoring
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const isDev = process.env.NODE_ENV === "development";

/*
 * Static CSP, so every page can stay prerendered. A nonce-based policy would
 * force each request through the server, which costs more than it protects on
 * a site with no user content and no logins.
 *
 * The trade-off is script-src 'unsafe-inline': the theme bootstrap in
 * layout.tsx and Next's own RSC payload are inline scripts. The policy still
 * blocks scripts from any other origin, and connect-src limits where a page
 * can send data to this site and EmailJS (the contact form).
 * 'unsafe-eval' is development only; React uses eval for its error overlay.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self' https://api.emailjs.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  // Inlined into both server and client bundles at build time, so the
  // prerendered HTML and the hydrating browser agree on "today" (see
  // src/lib/useToday.ts).
  env: {
    BUILD_DATE: new Date().toISOString(),
  },

  // Image optimization configuration
  images: {
    // Enable image optimization
    formats: ["image/webp", "image/avif"],
    // Configure image sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Optimize for better performance
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  devIndicators: false,

  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Performance optimizations
  poweredByHeader: false,
  compress: true,

  // Turbopack configuration (Next.js 16+)
  turbopack: {
    root: process.cwd(),
    // Turbopack handles code splitting and optimizations automatically
    // Most webpack optimizations are built-in to Turbopack
  },

  // No webpack() block: this project builds with Turbopack, which handles
  // chunking itself, so the config was dead. It also set
  // `optimization.sideEffects = false` globally, which can strip
  // side-effectful imports (CSS in particular) if webpack ever did run.

  // Headers for better performance and security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          // Nothing here uses these, so no embedded or injected script can
          // ask for them either.
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default bundleAnalyzer(nextConfig);
