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

  // Permanente 301-Weiterleitungen für URLs aus der alten WordPress-Seite.
  // Wichtig, damit Google-Rankings der alten URLs auf die neuen übertragen
  // werden. Reihenfolge zählt: spezifischere Regeln oben, generische unten.
  async redirects() {
    return [
      // ── Zahnarzt-Profile ──────────────────────────────────────────────────
      { source: "/places/henriette-lerner",  destination: "/zahnarzt/baden-baden/henriette-lerner", permanent: true },
      { source: "/places/peter-randelzhofer", destination: "/zahnarzt/muenchen/peter-randelzhofer", permanent: true },
      { source: "/places/florian-beuer",     destination: "/zahnarzt/berlin/prof-florian-beuer",    permanent: true },
      { source: "/places/ralf-smeets",       destination: "/zahnarzt/hamburg/prof-ralf-smeets",     permanent: true },

      // ── Länder- / Regionen- / Stadt-Übersichten (spezifisch → generisch) ──
      { source: "/places/austria/wien",                            destination: "/zahnarzt/oesterreich",        permanent: true },
      { source: "/location/germany/baden-wurttemberg",             destination: "/zahnarzt/baden-wuerttemberg", permanent: true },
      { source: "/location/switzerland/sankt-gallen/wil",          destination: "/zahnarzt/schweiz",            permanent: true },
      { source: "/places/germany/baden-wurttemberg/tubingen",      destination: "/zahnarzt/baden-wuerttemberg", permanent: true },
    ];
  },
};

export default nextConfig;
