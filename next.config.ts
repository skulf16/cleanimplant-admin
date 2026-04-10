import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      // WordPress / mycleandent.de (bestehende Arztfotos)
      {
        protocol: "https",
        hostname: "mycleandent.de",
      },
      // Cloudinary (falls noch alte URLs vorhanden)
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
