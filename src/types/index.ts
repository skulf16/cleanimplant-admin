import type { DentistProfile, Category, SocialLink, User } from "@/generated/prisma/client";

export type DentistWithRelations = DentistProfile & {
  categories: { category: Category }[];
  socialLinks: SocialLink[];
  user?: User | null;
};

export type SearchParams = {
  q?: string;
  city?: string;
  region?: string;
  country?: string;
  category?: string;
  page?: string;
};

export type Domain = "DE" | "COM";
