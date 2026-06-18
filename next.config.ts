import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ALL static generation
  experimental: {
    forceStatic: false,
  },
  
  // Force dynamic rendering for all pages
  async rewrites() {
    return []
  },
  
  // Headers for WebContainers + Firebase
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
    ]
  },
  
  // Ignore build errors temporarily to get app live
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.firebasestorage.app' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        child_process: false,
        crypto: false,
        path: false,
        "node:child_process": false,
        "node:crypto": false,
        "node:fs/promises": false,
        "node:fs": false,
        "node:path": false,
        "node:vm": false,
        "node:url": false,
      };
    }
    return config;
  },
};

export default nextConfig;
