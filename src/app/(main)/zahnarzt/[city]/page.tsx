import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { slugifyRegion, normalizeRegionName } from "@/lib/region";
import DoctorCard from "@/components/directory/DoctorCard";
import type { DentistWithRelations } from "@/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ city: string }> };

const COUNTRY_MAP: Record<string, { code: string; name: string }> = {
  deutschland: { code: "DE", name: "Deutschland" },
  oesterreich: { code: "AT", name: "Österreich" },
  schweiz:     { code: "CH", name: "Schweiz" },
};

const COUNTRY_SLUG_MAP: Record<string, string> = {
  DE: "deutschland", AT: "oesterreich", CH: "schweiz",
};

const COUNTRY_NAME_MAP: Record<string, string> = {
  DE: "Deutschland", AT: "Österreich", CH: "Schweiz",
};

// ── Detect page type ──────────────────────────────────────────────────────────

type PageType =
  | { type: "country"; code: string; name: string }
  // `regionDb` ist der rohe Wert aus der DB (für Filter-Queries).
  // `regionName` ist der Anzeigename (für Title/Breadcrumb/H1).
  | { type: "region";  regionDb: string; regionName: string }
  | { type: "city";    citySlug: string };

async function detectPageType(slug: string): Promise<PageType | null> {
  // 1. Country?
  const countryEntry = COUNTRY_MAP[slug];
  if (countryEntry) return { type: "country", code: countryEntry.code, name: countryEntry.name };

  // 2. Region?
  const allRegions = await prisma.dentistProfile.findMany({
    where: { active: true, NOT: { region: null } },
    select: { region: true },
    distinct: ["region"],
  });
  const match = allRegions.find(
    (r): r is { region: string } => r.region !== null && slugifyRegion(r.region) === slug
  );
  if (match) return { type: "region", regionDb: match.region, regionName: normalizeRegionName(match.region) };

  // 3. City?
  const cityDoc = await prisma.dentistProfile.findFirst({
    where: { active: true, citySlug: slug },
    select: { citySlug: true },
  });
  if (cityDoc) return { type: "city", citySlug: slug };

  return null;
}

// ── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const [cities, regions] = await Promise.all([
    prisma.dentistProfile.findMany({
      where: { active: true, NOT: { citySlug: "" } },
      select: { citySlug: true },
      distinct: ["citySlug"],
    }),
    prisma.dentistProfile.findMany({
      where: { active: true, NOT: { region: null } },
      select: { region: true },
      distinct: ["region"],
    }),
  ]);

  const citySlugs = cities.map((c) => ({ city: c.citySlug }));
  const regionSlugs = regions
    .filter((r): r is { region: string } => r.region !== null && r.region !== "")
    .map((r) => ({ city: slugifyRegion(r.region) }));
  const countrySlugs = Object.keys(COUNTRY_MAP).map((s) => ({ city: s }));

  return [...countrySlugs, ...regionSlugs, ...citySlugs];
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const pageType = await detectPageType(slug);
  if (!pageType) return {};

  if (pageType.type === "country") {
    return {
      title: `Zahnarzt ${pageType.name} – Geprüfte Zahnärzte in ${pageType.name}`,
      description: `Alle zertifizierten Zahnärzte und Implantologen in ${pageType.name}. Öffnungszeiten, Adressen und Behandlungsschwerpunkte auf einen Blick.`,
      alternates: { canonical: `/zahnarzt/${slug}` },
    };
  }

  if (pageType.type === "region") {
    const count = await prisma.dentistProfile.count({
      where: { active: true, region: pageType.regionDb },
    });
    return {
      title: `Zahnarzt ${pageType.regionName} – ${count} geprüfte Zahnärzte`,
      description: `${count} zertifizierte Zahnärzte und Implantologen in ${pageType.regionName}. Öffnungszeiten, Adressen und Behandlungsschwerpunkte auf einen Blick.`,
      alternates: { canonical: `/zahnarzt/${slug}` },
    };
  }

  // city
  const doctors = await prisma.dentistProfile.findMany({
    where: { active: true, citySlug: slug },
    select: { city: true },
    take: 1,
  });
  if (doctors.length === 0) return {};
  const cityName = doctors[0].city ?? slug;
  const count = await prisma.dentistProfile.count({ where: { active: true, citySlug: slug } });
  return {
    title: `Zahnarzt ${cityName} – ${count} geprüfte Zahnärzte`,
    description: `${count} zertifizierte Zahnärzte und Implantologen in ${cityName}. Öffnungszeiten, Adressen und Behandlungsschwerpunkte auf einen Blick.`,
    alternates: { canonical: `/zahnarzt/${slug}` },
    openGraph: { title: `Zahnarzt ${cityName} – mycleandent`, description: `Geprüfte Zahnärzte in ${cityName}` },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ArchivePage({ params }: Props) {
  const { city: slug } = await params;
  const pageType = await detectPageType(slug);
  if (!pageType) notFound();

  // ── COUNTRY ──────────────────────────────────────────────────────────────
  if (pageType.type === "country") {
    const doctors = await prisma.dentistProfile.findMany({
      where: { active: true, country: pageType.code as "DE" | "AT" | "CH" },
      include: { categories: { include: { category: true } }, socialLinks: true },
      orderBy: [{ featured: "desc" }, { lastName: "asc" }],
    });
    if (doctors.length === 0) notFound();

    const regions = await prisma.dentistProfile.findMany({
      where: { active: true, country: pageType.code as "DE" | "AT" | "CH", NOT: { region: null } },
      select: { region: true },
      distinct: ["region"],
      orderBy: { region: "asc" },
    });

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Zahnärzte in ${pageType.name}`,
      numberOfItems: doctors.length,
      itemListElement: doctors.map((doc, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `/zahnarzt/${doc.citySlug}/${doc.slug}`,
        name: [doc.title, doc.firstName, doc.lastName].filter(Boolean).join(" "),
      })),
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <HeroSection
          breadcrumb={[{ label: pageType.name }]}
          h1={`Zahnarzt ${pageType.name}`}
          subtitle={`${doctors.length} geprüfte Zahnärzte in ${pageType.name}`}
        />
        <div style={{ background: "#FEF9F5", padding: "2.5rem 2rem 4rem" }}>
          <DoctorGrid doctors={doctors as DentistWithRelations[]} />

          {regions.filter(r => r.region).length > 0 && (
            <PillSection
              title={pageType.code === "CH" ? "Zahnärzte nach Kanton" : "Zahnärzte nach Bundesland"}
              pills={regions.filter(r => r.region).map(r => ({
                label: normalizeRegionName(r.region!),
                href: `/zahnarzt/${slugifyRegion(r.region!)}`,
              }))}
            />
          )}
          <PillSection
            title="Zahnärzte in anderen Ländern"
            pills={Object.entries(COUNTRY_MAP)
              .filter(([s]) => s !== slug)
              .map(([s, c]) => ({ label: c.name, href: `/zahnarzt/${s}` }))}
          />
        </div>
      </>
    );
  }

  // ── REGION ───────────────────────────────────────────────────────────────
  if (pageType.type === "region") {
    const doctors = await prisma.dentistProfile.findMany({
      where: { active: true, region: pageType.regionDb },
      include: { categories: { include: { category: true } }, socialLinks: true },
      orderBy: [{ featured: "desc" }, { lastName: "asc" }],
    });
    if (doctors.length === 0) notFound();

    const countryCode = doctors[0].country ?? "DE";
    const countrySlug = COUNTRY_SLUG_MAP[countryCode] ?? null;
    const countryName = COUNTRY_NAME_MAP[countryCode] ?? null;

    const relatedRegions = await prisma.dentistProfile.findMany({
      where: { active: true, NOT: [{ region: null }, { region: "" }] },
      select: { region: true },
      distinct: ["region"],
      orderBy: { region: "asc" },
    });

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Zahnärzte in ${pageType.regionName}`,
      numberOfItems: doctors.length,
      itemListElement: doctors.map((doc, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `/zahnarzt/${doc.citySlug}/${doc.slug}`,
        name: [doc.title, doc.firstName, doc.lastName].filter(Boolean).join(" "),
      })),
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <HeroSection
          breadcrumb={[
            ...(countrySlug && countryName ? [{ label: countryName, href: `/zahnarzt/${countrySlug}` }] : []),
            { label: pageType.regionName },
          ]}
          h1={`Zahnarzt ${pageType.regionName}`}
          subtitle={`${doctors.length} geprüfte Zahnärzte in ${pageType.regionName}${countryName ? `, ${countryName}` : ""}`}
        />
        <div style={{ background: "#FEF9F5", padding: "2.5rem 2rem 4rem" }}>
          <DoctorGrid doctors={doctors as DentistWithRelations[]} />
          <PillSection
            title="Zahnärzte in anderen Bundesländern"
            pills={relatedRegions
              .filter((r): r is { region: string } => r.region !== null && slugifyRegion(r.region) !== slug)
              .map(r => ({ label: normalizeRegionName(r.region), href: `/zahnarzt/${slugifyRegion(r.region)}` }))}
          />
        </div>
      </>
    );
  }

  // ── CITY ─────────────────────────────────────────────────────────────────
  const [doctors, relatedCities] = await Promise.all([
    prisma.dentistProfile.findMany({
      where: { active: true, citySlug: slug },
      include: { categories: { include: { category: true } }, socialLinks: true },
      orderBy: [{ featured: "desc" }, { lastName: "asc" }],
    }),
    prisma.dentistProfile.findMany({
      where: { active: true, NOT: { citySlug: "" }, citySlug: { not: slug } },
      select: { citySlug: true, city: true },
      distinct: ["citySlug"],
      orderBy: { city: "asc" },
      take: 20,
    }),
  ]);

  if (doctors.length === 0) notFound();

  const cityName = doctors[0].city ?? slug;
  const countryCode = doctors[0].country ?? "DE";
  const countrySlug = COUNTRY_SLUG_MAP[countryCode] ?? null;
  const countryName = COUNTRY_NAME_MAP[countryCode] ?? null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Zahnärzte in ${cityName}`,
    numberOfItems: doctors.length,
    itemListElement: doctors.map((doc, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `/zahnarzt/${doc.citySlug}/${doc.slug}`,
      name: [doc.title, doc.firstName, doc.lastName].filter(Boolean).join(" "),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroSection
        breadcrumb={[
          ...(countrySlug && countryName ? [{ label: countryName, href: `/zahnarzt/${countrySlug}` }] : []),
          { label: cityName },
        ]}
        h1={`Zahnarzt ${cityName}`}
        subtitle={`${doctors.length} geprüfte${doctors.length !== 1 ? "" : "r"} Zahnarzt${doctors.length !== 1 ? "ärzte" : ""}${countryName ? ` in ${cityName}, ${countryName}` : ` in ${cityName}`}`}
      />
      <div style={{ background: "#FEF9F5", padding: "2.5rem 2rem 4rem" }}>
        <DoctorGrid doctors={doctors as DentistWithRelations[]} />
        <PillSection
          title="Zahnärzte in anderen Städten"
          pills={relatedCities.map(c => ({ label: c.city ?? c.citySlug, href: `/zahnarzt/${c.citySlug}` }))}
        />
      </div>
    </>
  );
}

// ── Shared UI components ──────────────────────────────────────────────────────

function HeroSection({
  breadcrumb,
  h1,
  subtitle,
}: {
  breadcrumb: { label: string; href?: string }[];
  h1: string;
  subtitle: string;
}) {
  return (
    <section
      style={{
        marginTop: "-72px",
        backgroundImage: "url('https://osjaiemxynbwaxkmclcl.supabase.co/storage/v1/object/public/posts/mycleandent-bg-hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "flex-end",
        paddingTop: "72px",
        paddingBottom: "2rem",
        minHeight: 280,
      }}
    >
      <div style={{ width: "100%", padding: "0 2rem" }}>
        <nav style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginBottom: 10 }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Startseite</Link>
          {" / "}
          <Link href="/zahnarzt-finden" style={{ color: "inherit", textDecoration: "none" }}>Zahnarzt finden</Link>
          {breadcrumb.map((crumb) => (
            <span key={crumb.label}>
              {" / "}
              {crumb.href ? (
                <Link href={crumb.href} style={{ color: "inherit", textDecoration: "none" }}>{crumb.label}</Link>
              ) : (
                <span style={{ color: "#fff" }}>{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 style={{ color: "#FEF9F5", fontSize: "clamp(26px, 4vw, 46px)", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
          {h1}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, marginTop: 6, fontWeight: 500 }}>
          {subtitle}
        </p>
      </div>
    </section>
  );
}

function DoctorGrid({ doctors }: { doctors: DentistWithRelations[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gap: "1.25rem" }}>
      {doctors.map((doc) => (
        <DoctorCard key={doc.id} doctor={doc} />
      ))}
    </div>
  );
}

function PillSection({ title, pills }: { title: string; pills: { label: string; href: string }[] }) {
  if (pills.length === 0) return null;
  return (
    <div style={{ marginTop: "4rem" }}>
      <h2 style={{ color: "#00385E", fontSize: 18, fontWeight: 700, marginBottom: "1rem" }}>{title}</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {pills.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            style={{
              background: "#fff",
              border: "1px solid #f0ede8",
              borderRadius: 20,
              padding: "5px 14px",
              fontSize: 13,
              color: "#00385E",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {p.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
