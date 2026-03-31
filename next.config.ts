import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // Placeholder / lokale Entwicklung
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },

  // Weiterleitungen: /places → /places (behält WordPress-URLs kompatibel)
  async redirects() {
    return [];
  },
};

export default nextConfig;
