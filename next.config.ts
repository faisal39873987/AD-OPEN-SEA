import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  output: 'standalone', // Optimizes for production deployments
  distDir: '.next', // Explicitly define build output directory
  // Ensure environment variables validation is performed before build
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['images.unsplash.com', 'cceuyhebxxqafmrmnqhq.supabase.co', 'avatars.githubusercontent.com', 'adplus.app'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60,
  },
  // Configure PWA if needed
  // pwa: {
  //   dest: 'public',
  //   disable: process.env.NODE_ENV === 'development',
  // },
  // Production-specific configuration
  productionBrowserSourceMaps: true, // Helps with error tracking in production
  poweredByHeader: false, // Remove x-powered-by header for security
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
};

export default bundleAnalyzer(nextConfig);
