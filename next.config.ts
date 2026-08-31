import type { NextConfig } from "next";

const securityHeaders = [
  // Block MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Clickjacking protection
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Stop leaking referrer info to external sites
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable dangerous browser features we don't use
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Opt out of FLoC / Topics API
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dgjgpraenrinbbubeuvq.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [];
  },
};

export default nextConfig;
