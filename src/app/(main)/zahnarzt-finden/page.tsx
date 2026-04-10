import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import DirectoryContent from "@/components/directory/DirectoryContent";
import { headers } from "next/headers";
import type { SearchParams } from "@/types";

export const metadata: Metadata = {
  title: "Zahnarzt finden",
  description:
    "Durchsuchen Sie unser Verzeichnis von geprüften Zahnärzten und Implantologen in Deutschland, Österreich und der Schweiz.",
};

const PER_PAGE = 12;

async function getDoctors(params: SearchParams, domain: "DE" | "COM") {
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const skip = (page - 1) * PER_PAGE;

  const where: Record<string, unknown> = { active: true };

  if (domain === "DE") {
    where.domains = { hasSome: ["DE"] };
    where.country = { in: ["DE", "AT", "CH"] };
  }

  if (params.q) {
    where.OR = [
      { firstName: { contains: params.q, mode: "insensitive" } },
      { lastName: { contains: params.q, mode: "insensitive" } },
      { practiceName: { contains: params.q, mode: "insensitive" } },
      { city: { contains: params.q, mode: "insensitive" } },
      { bio: { contains: params.q, mode: "insensitive" } },
    ];
  }

  if (params.city) {
    // Map country names → codes
    const countryCodeMap: Record<string, string> = {
      deutschland: "DE", germany: "DE",
      österreich: "AT", oesterreich: "AT", austria: "AT",
      schweiz: "CH", switzerland: "CH", suisse: "CH",
    };
    const countryCode = countryCodeMap[params.city.toLowerCase().trim()];

    if (countryCode) {
      where.country = countryCode;
    } else {
      // Search city OR region (Bundesland)
      where.OR = [
        { city:   { contains: params.city, mode: "insensitive" } },
        { region: { contains: params.city, mode: "insensitive" } },
      ];
    }
  }

  if (params.country) {
    where.country = params.country.toUpperCase();
  }

  if (params.category) {
    where.categories = {
      some: { category: { slug: params.category } },
    };
  }

  const [doctors, total] = await Promise.all([
    prisma.dentistProfile.findMany({
      where,
      skip,
      take: PER_PAGE,
      include: {
        categories: { include: { category: true } },
        socialLinks: true,
      },
      orderBy: [{ featured: "desc" }, { lastName: "asc" }],
    }),
    prisma.dentistProfile.count({ where }),
  ]);

  return { doctors, total, page, pages: Math.ceil(total / PER_PAGE) };
}

async function getCategories() {
  return prisma.category.findMany({ orderBy: { order: "asc" } });
}

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const hdrs = await headers();
  const domain = (hdrs.get("x-domain") as "DE" | "COM") ?? "DE";

  const [{ doctors, total, page, pages }, categories] = await Promise.all([
    getDoctors(params, domain),
    getCategories(),
  ]);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section
        style={{
          height: "25vh",
          minHeight: 180,
          marginTop: "-72px",
          backgroundImage: "url('https://osjaiemxynbwaxkmclcl.supabase.co/storage/v1/object/public/posts/mycleandent-bg-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "flex-end",
          paddingBottom: "2rem",
        }}
      >
        <div style={{ width: "98%", margin: "0 auto", paddingLeft: "1%", paddingRight: "1%" }}>
          <h1
            style={{
              color: "#FEF9F5",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Finden Sie Zahnärzte in Ihrer Nähe
          </h1>
          {(params.city || params.q) && (
            <p
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: 16,
                marginTop: 6,
                fontWeight: 500,
              }}
            >
              {total} Ergebnis{total !== 1 ? "se" : ""} gefunden
              {params.city ? ` in ${params.city}` : ""}
              {params.q ? ` für „${params.q}"` : ""}
            </p>
          )}
        </div>
      </section>

      {/* ── Content ───────────────────────────────────────────────────────────── */}
      <div style={{ background: "#FEF9F5", padding: "2.5rem 1rem 4rem" }}>
        <div style={{ width: "100%", boxSizing: "border-box" }}>
          <DirectoryContent
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            doctors={doctors as any}
            categories={categories}
            params={params}
            domain={domain}
            total={total}
            page={page}
            pages={pages}
          />
        </div>
      </div>
    </>
  );
}
