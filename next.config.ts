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
    // Enable lazy loading by default
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Optimize for better performance
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  devIndicators: false,

  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["@/components", "@/lib"],
  },

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
    // Turbopack handles code splitting and optimizations automatically
    // Most webpack optimizations are built-in to Turbopack
  },

  // Webpack optimizations (fallback for webpack builds)
  webpack: (config, { isServer, dev }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        chunks: "all",
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            priority: 10,
            reuseExistingChunk: true,
          },
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: "three",
            chunks: "all",
            priority: 20,
            reuseExistingChunk: true,
          },
          gsap: {
            test: /[\\/]node_modules[\\/]gsap[\\/]/,
            name: "gsap",
            chunks: "all",
            priority: 20,
            reuseExistingChunk: true,
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            priority: 5,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };

      // Tree shaking optimization
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }

    // Optimize for development
    if (dev) {
      config.optimization.removeAvailableModules = false;
      config.optimization.removeEmptyChunks = false;
      config.optimization.splitChunks = false;
    }

    return config;
  },

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
