import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { slugifyRegion } from "@/lib/region";
import { BERLIN_DISTRICTS } from "@/lib/berlin-districts";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://mycleandent.de";

const COUNTRY_SLUGS: Record<string, string> = { DE: "deutschland", AT: "oesterreich", CH: "schweiz" };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let doctors: { slug: string; citySlug: string; updatedAt: Date }[] = [];
  let cities: { citySlug: string; updatedAt: Date }[] = [];
  let regions: { region: string | null; updatedAt: Date }[] = [];
  let countryCodes: { country: string | null; updatedAt: Date }[] = [];

  try {
    [doctors, cities, regions, countryCodes] = await Promise.all([
      prisma.dentistProfile.findMany({
        select: { slug: true, citySlug: true, updatedAt: true },
        where: { active: true },
      }),
      prisma.dentistProfile.findMany({
        where: { active: true, NOT: { citySlug: "" } },
        select: { citySlug: true, updatedAt: true },
        distinct: ["citySlug"],
      }),
      prisma.dentistProfile.findMany({
        where: { active: true, NOT: { region: null } },
        select: { region: true, updatedAt: true },
        distinct: ["region"],
      }),
      prisma.dentistProfile.findMany({
        where: { active: true, country: { in: ["DE", "AT", "CH"] } },
        select: { country: true, updatedAt: true },
        distinct: ["country"],
      }),
    ]);
  } catch {
    // DB not reachable during build — return static pages only
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/zahnarzt-finden`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/join-us`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/was-wir-tun`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/wissenswert`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/kontakt`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },

    // Lokale SEO-Landingpages (eine pro Stadt/Bezirk)
    { url: `${BASE_URL}/implantologe-berlin`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/implantologe-charlottenburg`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...BERLIN_DISTRICTS.map((d) => ({
      url: `${BASE_URL}/implantologe-${d.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  const countryPages: MetadataRoute.Sitemap = countryCodes
    .filter((c) => c.country !== null && COUNTRY_SLUGS[c.country as string] !== undefined)
    .map((c) => ({
      url: `${BASE_URL}/zahnarzt/${COUNTRY_SLUGS[c.country as string]}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

  const regionPages: MetadataRoute.Sitemap = regions
    .filter((r): r is { region: string; updatedAt: Date } => r.region !== null && r.region !== "")
    .map((r) => ({
      url: `${BASE_URL}/zahnarzt/${slugifyRegion(r.region)}`,
      lastModified: r.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.87,
    }));

  const cityPages: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${BASE_URL}/zahnarzt/${c.citySlug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const doctorPages: MetadataRoute.Sitemap = doctors.map((doc) => ({
    url: `${BASE_URL}/zahnarzt/${doc.citySlug}/${doc.slug}`,
    lastModified: doc.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...countryPages, ...regionPages, ...cityPages, ...doctorPages];
}
