import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BerlinDistrictPage from "@/components/local-landing/BerlinDistrictPage";
import { findDistrict } from "@/lib/berlin-districts";

export const dynamic = "force-dynamic";

const SLUG = "mitte";
const district = findDistrict(SLUG);

export const metadata: Metadata = district
  ? {
      title: district.metaTitle,
      description: district.metaDescription,
      alternates: { canonical: `/implantologe-${SLUG}` },
      openGraph: {
        title: district.metaTitle,
        description: district.metaDescription,
        type: "article",
      },
    }
  : {};

export default function Page() {
  if (!district) notFound();
  return <BerlinDistrictPage district={district} />;
}
