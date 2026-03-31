import type { Metadata } from "next";
import Link from "next/link";
import { Search, MapPin, ShieldCheck, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buildDoctorName } from "@/lib/utils";

export const metadata: Metadata = {
  title: "mycleandent – Zahnärzte & Implantologen in Ihrer Nähe",
  description:
    "Finden Sie zertifizierte Zahnärzte und Implantologen in Ihrer Nähe. Geprüfte Profile aus Deutschland, Österreich und der Schweiz.",
};

async function getStats() {
  const [doctorCount, cityCount] = await Promise.all([
    prisma.dentistProfile.count({ where: { active: true } }),
    prisma.dentistProfile.groupBy({ by: ["city"], where: { active: true } }).then((r: unknown[]) => r.length),
  ]);
  return { doctorCount, cityCount };
}

async function getFeaturedDoctors() {
  return prisma.dentistProfile.findMany({
    where: { active: true, featured: true },
    take: 6,
    include: { categories: { include: { category: true } } },
    orderBy: { updatedAt: "desc" },
  });
}

const categories = [
  { slug: "zahnarzt", label: "Zahnarzt", icon: "🦷" },
  { slug: "implantologe", label: "Implantologe", icon: "⚙️" },
  { slug: "kieferchirurg", label: "Kieferchirurg", icon: "🏥" },
  { slug: "kieferorthopaedie", label: "Kieferorthopädie", icon: "😬" },
  { slug: "parodontologie", label: "Parodontologie", icon: "🔬" },
  { slug: "aesthetische-zahnmedizin", label: "Ästhetische Zahnmedizin", icon: "✨" },
];

export default async function HomePage() {
  const [stats, featured] = await Promise.all([getStats(), getFeaturedDoctors()]);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2EA3F2] to-[#1a8fd8] text-white py-16 md:py-24">
        <div className="max-w-[1080px] mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight text-white">
            Zahnärzte & Implantologen<br className="hidden md:block" /> in Ihrer Nähe
          </h1>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            Finden Sie zertifizierte Zahnärzte in Deutschland, Österreich und der Schweiz.
            Geprüfte Profile – direkt und kostenlos.
          </p>

          {/* Search */}
          <form
            action="/zahnarzt-finden"
            method="get"
            className="max-w-2xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-2 bg-white rounded-lg p-2 shadow-lg">
              <div className="flex items-center flex-1 gap-2 px-3">
                <Search size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  name="q"
                  placeholder="Name oder Fachrichtung..."
                  className="flex-1 text-[14px] text-gray-700 outline-none placeholder-gray-400"
                />
              </div>
              <div className="flex items-center flex-1 gap-2 px-3 border-l border-gray-200">
                <MapPin size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  name="city"
                  placeholder="Stadt oder PLZ..."
                  className="flex-1 text-[14px] text-gray-700 outline-none placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                className="bg-[#2EA3F2] hover:bg-[#1a8fd8] text-white font-semibold px-8 py-3 rounded-md transition-colors text-[14px] whitespace-nowrap"
              >
                Suchen
              </button>
            </div>
          </form>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-10 text-blue-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.doctorCount}+</div>
              <div className="text-sm">geprüfte Ärzte</div>
            </div>
            <div className="w-px bg-blue-300/30" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.cityCount}+</div>
              <div className="text-sm">Städte & Regionen</div>
            </div>
            <div className="w-px bg-blue-300/30" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">3</div>
              <div className="text-sm">Länder (DACH)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Kategorien */}
      <section className="py-14 bg-white">
        <div className="max-w-[1080px] mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-[#333] mb-8">
            Fachrichtungen
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/zahnarzt-finden?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-[#2EA3F2] hover:shadow-md transition-all group text-center"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-[13px] font-medium text-[#666] group-hover:text-[#2EA3F2] transition-colors leading-tight">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      {featured.length > 0 && (
        <section className="py-14 bg-[#f8f9fa]">
          <div className="max-w-[1080px] mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[#333]">
                Empfohlene Ärzte
              </h2>
              <Link
                href="/zahnarzt-finden"
                className="text-[13px] text-[#2EA3F2] hover:underline"
              >
                Alle anzeigen →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {featured.map((doc: typeof featured[0]) => (
                <Link
                  key={doc.id}
                  href={`/places/${doc.slug}`}
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-[#2EA3F2] transition-all p-5 flex gap-4"
                >
                  <div className="w-14 h-14 rounded-full bg-[#e8f5fe] flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {doc.imageUrl ? (
                      <img
                        src={doc.imageUrl}
                        alt={buildDoctorName(doc.title, doc.firstName, doc.lastName, doc.suffix)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[#2EA3F2] font-bold text-lg">
                        {doc.firstName[0]}{doc.lastName[0]}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[14px] text-[#333] truncate">
                      {buildDoctorName(doc.title, doc.firstName, doc.lastName, doc.suffix)}
                    </h3>
                    <p className="text-[13px] text-[#666] mt-0.5 flex items-center gap-1">
                      <MapPin size={12} className="flex-shrink-0" />
                      {doc.city}{doc.country !== "DE" ? `, ${doc.country}` : ""}
                    </p>
                    {doc.categories.length > 0 && (
                      <p className="text-[12px] text-[#2EA3F2] mt-1 truncate">
                        {doc.categories[0].category.name}
                      </p>
                    )}
                    {doc.verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-green-600 mt-1">
                        <ShieldCheck size={11} /> Verifiziert
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* USPs */}
      <section className="py-14 bg-white">
        <div className="max-w-[1080px] mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-[#333] mb-10">
            Warum mycleandent?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck size={32} className="text-[#2EA3F2]" />,
                title: "Geprüfte Profile",
                text: "Alle Arztprofile werden von unserem Team manuell geprüft und verifiziert.",
              },
              {
                icon: <MapPin size={32} className="text-[#2EA3F2]" />,
                title: "Regional & Präzise",
                text: "Finden Sie Ärzte nach Stadt, Region oder Land – im gesamten DACH-Raum.",
              },
              {
                icon: <Star size={32} className="text-[#2EA3F2]" />,
                title: "Kostenlos für Patienten",
                text: "Die Suche und alle Profilinformationen sind für Patienten vollständig kostenlos.",
              },
            ].map((usp) => (
              <div key={usp.title} className="text-center px-4">
                <div className="flex justify-center mb-4">{usp.icon}</div>
                <h3 className="text-lg font-semibold text-[#333] mb-2">{usp.title}</h3>
                <p className="text-[14px] text-[#666] leading-relaxed">{usp.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Mitglied werden */}
      <section className="py-14 bg-[#F5907C]">
        <div className="max-w-[1080px] mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Sie sind Zahnarzt?
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto text-[15px]">
            Erstellen Sie Ihr Profil auf mycleandent und werden Sie von tausenden Patienten gefunden.
          </p>
          <Link
            href="/join-us"
            className="inline-block bg-white text-[#F5907C] font-semibold px-8 py-3 rounded-lg hover:shadow-lg transition-all text-[15px]"
          >
            Jetzt Mitglied werden
          </Link>
        </div>
      </section>
    </>
  );
}
