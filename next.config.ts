import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
    localPatterns: [{ pathname: "/uploads/**" }],
  },
  async redirects() {
    return [];
  },
};

export default nextConfig;
