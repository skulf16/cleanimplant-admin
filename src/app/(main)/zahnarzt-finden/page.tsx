import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import DoctorCard from "@/components/directory/DoctorCard";
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

  // Domain-Filter
  if (domain === "DE") {
    where.domains = { hasSome: ["DE"] };
    where.country = { in: ["DE", "AT", "CH"] };
  }

  // Search
  if (params.q) {
    where.OR = [
      { firstName: { contains: params.q, mode: "insensitive" } },
      { lastName: { contains: params.q, mode: "insensitive" } },
      { city: { contains: params.q, mode: "insensitive" } },
      { bio: { contains: params.q, mode: "insensitive" } },
    ];
  }

  if (params.city) {
    where.city = { contains: params.city, mode: "insensitive" };
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

  const buildUrl = (newParams: Partial<SearchParams>) => {
    const merged = { ...params, ...newParams };
    const qs = Object.entries(merged)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
      .join("&");
    return `/zahnarzt-finden${qs ? "?" + qs : ""}`;
  };

  return (
    <div className="max-w-[1080px] mx-auto px-4 py-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#333]">Zahnarzt finden</h1>
        <p className="text-[#666] mt-1 text-[14px]">
          {total} Arzt{total !== 1 ? "profil" : "profil"}e gefunden
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filter */}
        <aside className="lg:w-56 flex-shrink-0">
          <form method="get" action="/zahnarzt-finden" className="space-y-5">
            {/* Suche */}
            <div>
              <label className="block text-[12px] font-semibold text-[#333] uppercase tracking-wide mb-2">
                Suche
              </label>
              <input
                type="text"
                name="q"
                defaultValue={params.q}
                placeholder="Name oder Fachrichtung..."
                className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2EA3F2]"
              />
            </div>

            {/* Stadt */}
            <div>
              <label className="block text-[12px] font-semibold text-[#333] uppercase tracking-wide mb-2">
                Stadt
              </label>
              <input
                type="text"
                name="city"
                defaultValue={params.city}
                placeholder="z.B. Berlin..."
                className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2EA3F2]"
              />
            </div>

            {/* Land */}
            <div>
              <label className="block text-[12px] font-semibold text-[#333] uppercase tracking-wide mb-2">
                Land
              </label>
              <select
                name="country"
                defaultValue={params.country ?? ""}
                className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2EA3F2]"
              >
                <option value="">Alle Länder</option>
                <option value="DE">Deutschland</option>
                <option value="AT">Österreich</option>
                <option value="CH">Schweiz</option>
                {domain === "COM" && <option value="OTHER">Sonstige</option>}
              </select>
            </div>

            {/* Kategorie */}
            <div>
              <label className="block text-[12px] font-semibold text-[#333] uppercase tracking-wide mb-2">
                Fachrichtung
              </label>
              <select
                name="category"
                defaultValue={params.category ?? ""}
                className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2EA3F2]"
              >
                <option value="">Alle Fachrichtungen</option>
                {categories.map((cat: { slug: string; name: string }) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2EA3F2] text-white py-2 rounded text-[13px] font-semibold hover:bg-[#1a8fd8] transition-colors"
            >
              Suchen
            </button>

            {(params.q || params.city || params.country || params.category) && (
              <a
                href="/zahnarzt-finden"
                className="block text-center text-[12px] text-[#666] hover:text-[#333] transition-colors"
              >
                Filter zurücksetzen
              </a>
            )}
          </form>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {doctors.length === 0 ? (
            <div className="text-center py-16 text-[#999]">
              <p className="text-lg mb-2">Keine Ergebnisse gefunden.</p>
              <p className="text-[14px]">Versuchen Sie andere Suchbegriffe oder Filter.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {doctors.map((doc: Parameters<typeof DoctorCard>[0]["doctor"]) => (
                  <DoctorCard key={doc.id} doctor={doc as Parameters<typeof DoctorCard>[0]["doctor"]} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {page > 1 && (
                    <a
                      href={buildUrl({ page: String(page - 1) })}
                      className="px-4 py-2 border border-gray-300 rounded text-[13px] hover:border-[#2EA3F2] hover:text-[#2EA3F2] transition-colors"
                    >
                      ← Zurück
                    </a>
                  )}
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <a
                      key={p}
                      href={buildUrl({ page: String(p) })}
                      className={`px-4 py-2 border rounded text-[13px] transition-colors ${
                        p === page
                          ? "bg-[#2EA3F2] text-white border-[#2EA3F2]"
                          : "border-gray-300 hover:border-[#2EA3F2] hover:text-[#2EA3F2]"
                      }`}
                    >
                      {p}
                    </a>
                  ))}
                  {page < pages && (
                    <a
                      href={buildUrl({ page: String(page + 1) })}
                      className="px-4 py-2 border border-gray-300 rounded text-[13px] hover:border-[#2EA3F2] hover:text-[#2EA3F2] transition-colors"
                    >
                      Weiter →
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
