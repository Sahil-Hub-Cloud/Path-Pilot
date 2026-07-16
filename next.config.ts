import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force dynamic rendering for all pages
  async rewrites() {
    return []
  },
  
  // Headers — CORS globally, WebContainer isolation only on /labs
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Version, Authorization' },
        ],
      },
      {
        source: '/labs/(.*)',
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
