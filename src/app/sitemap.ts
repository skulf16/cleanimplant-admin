import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://mycleandent.de";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const doctors = await prisma.dentistProfile.findMany({
    select: { slug: true, updatedAt: true },
    where: { active: true },
  });

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/zahnarzt-finden`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/join-us`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/was-wir-tun`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/wissenswert`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/kontakt`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
  ];

  const doctorPages: MetadataRoute.Sitemap = doctors.map((doc: { slug: string; updatedAt: Date }) => ({
    url: `${BASE_URL}/places/${doc.slug}`,
    lastModified: doc.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...doctorPages];
}
