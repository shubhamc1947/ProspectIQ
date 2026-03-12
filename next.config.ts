import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Single project: UI + API in one Next.js app
  eslint: {
    ignoreDuringBuilds: true, // ESLint not installed as dev dep — skip during build
  },
};

export default nextConfig;
