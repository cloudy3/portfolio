import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

// Bundle analyzer for performance monitoring
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
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
