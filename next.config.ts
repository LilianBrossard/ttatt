import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.graphassets.com", // Hygraph CDN assets
      },
    ],
  },
};

export default nextConfig;
