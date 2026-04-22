import type { MetadataRoute } from "next";
import { headers } from "next/headers";

const PUBLIC_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.mycleandent.de";

/**
 * robots.txt wird je nach aufrufender Subdomain unterschiedlich ausgeliefert:
 *
 * - www.mycleandent.de    → erlaubt alles außer Auth/Account/Admin-Pfade, linkt Sitemap
 * - admin.mycleandent.de  → blockiert komplett (admin darf nicht in Google)
 * - member.cleanimplant.com → blockiert komplett (member-Bereich nicht öffentlich)
 *
 * Ausgewertet wird der Host-Header, den die Middleware `src/proxy.ts` bereits
 * unter `x-is-admin-domain` / `x-is-member-domain` setzt.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  const isAdmin = h.get("x-is-admin-domain") === "1";
  const isMember = h.get("x-is-member-domain") === "1";

  // Admin & Member: komplett sperren
  if (isAdmin || isMember) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  // Öffentliche Seite
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/login",
          "/forgot",
          "/register",
          "/reset",
          "/account",
          "/account/",
          "/admin",
          "/admin/",
          "/api/",
        ],
      },
    ],
    sitemap: `${PUBLIC_BASE_URL}/sitemap.xml`,
    host: PUBLIC_BASE_URL,
  };
}
