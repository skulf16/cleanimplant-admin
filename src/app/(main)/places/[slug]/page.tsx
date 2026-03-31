import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildDoctorName } from "@/lib/utils";
import {
  MapPin,
  Phone,
  Globe,
  Mail,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

async function getDoctor(slug: string) {
  return prisma.dentistProfile.findUnique({
    where: { slug, active: true },
    include: {
      categories: { include: { category: true } },
      socialLinks: true,
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDoctor(slug);
  if (!doc) return {};

  const name = buildDoctorName(doc.title, doc.firstName, doc.lastName, doc.suffix);
  const location = [doc.city, doc.country].filter(Boolean).join(", ");

  return {
    title: `${name} – Zahnarzt in ${doc.city}`,
    description:
      doc.metaDesc ??
      `${name} – Zahnarzt${doc.city ? ` in ${doc.city}` : ""}. ${
        doc.categories.length > 0
          ? doc.categories.map((c: { category: { name: string } }) => c.category.name).join(", ") + ". "
          : ""
      }Profil auf mycleandent.`,
    openGraph: {
      title: `${name} | mycleandent`,
      description: `Zahnarzt-Profil: ${name} in ${location}`,
      images: doc.imageUrl ? [{ url: doc.imageUrl }] : [],
    },
  };
}

export async function generateStaticParams() {
  const slugs = await prisma.dentistProfile.findMany({
    select: { slug: true },
    where: { active: true },
  });
  return slugs.map(({ slug }: { slug: string }) => ({ slug }));
}

export default async function DoctorProfilePage({ params }: Props) {
  const { slug } = await params;
  const doc = await getDoctor(slug);
  if (!doc) notFound();

  const fullName = buildDoctorName(doc.title, doc.firstName, doc.lastName, doc.suffix);
  const address = [doc.street, doc.zip, doc.city, doc.region, doc.country]
    .filter(Boolean)
    .join(", ");

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: fullName,
    description: doc.bio ?? undefined,
    image: doc.imageUrl ?? undefined,
    url: doc.website ?? undefined,
    telephone: doc.phone ?? undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: doc.street ?? undefined,
      postalCode: doc.zip ?? undefined,
      addressLocality: doc.city,
      addressRegion: doc.region ?? undefined,
      addressCountry: doc.country,
    },
    ...(doc.lat && doc.lng
      ? { geo: { "@type": "GeoCoordinates", latitude: doc.lat, longitude: doc.lng } }
      : {}),
    medicalSpecialty: doc.categories.map((c: { category: { name: string } }) => c.category.name),
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-[1080px] mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[12px] text-[#999] mb-6">
          <Link href="/" className="hover:text-[#2EA3F2]">Startseite</Link>
          <ChevronRight size={12} />
          <Link href="/zahnarzt-finden" className="hover:text-[#2EA3F2]">Zahnarzt finden</Link>
          {doc.country && (
            <>
              <ChevronRight size={12} />
              <Link
                href={`/zahnarzt-finden?country=${doc.country}`}
                className="hover:text-[#2EA3F2]"
              >
                {doc.country === "DE" ? "Deutschland" : doc.country === "AT" ? "Österreich" : "Schweiz"}
              </Link>
            </>
          )}
          {doc.city && (
            <>
              <ChevronRight size={12} />
              <Link
                href={`/zahnarzt-finden?city=${encodeURIComponent(doc.city)}`}
                className="hover:text-[#2EA3F2]"
              >
                {doc.city}
              </Link>
            </>
          )}
          <ChevronRight size={12} />
          <span className="text-[#666]">{fullName}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex gap-5 items-start">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-[#e8f5fe] flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {doc.imageUrl ? (
                    <img
                      src={doc.imageUrl}
                      alt={fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[#2EA3F2] font-bold text-3xl">
                      {doc.firstName[0]}
                      {doc.lastName[0]}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-[#333]">{fullName}</h1>
                    {doc.verified && (
                      <span className="flex items-center gap-1 text-[12px] text-green-600 bg-green-50 px-2.5 py-1 rounded-full mt-1">
                        <ShieldCheck size={12} /> Verifiziert
                      </span>
                    )}
                  </div>

                  {/* Kategorien */}
                  {doc.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {doc.categories.map(({ category }: { category: { id: string; name: string; slug: string } }) => (
                        <Link
                          key={category.id}
                          href={`/zahnarzt-finden?category=${category.slug}`}
                          className="text-[12px] bg-[#e8f5fe] text-[#2EA3F2] px-3 py-1 rounded-full hover:bg-[#2EA3F2] hover:text-white transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  <p className="text-[13px] text-[#666] mt-2 flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#2EA3F2]" />
                    {address}
                  </p>
                </div>
              </div>
            </div>

            {/* Über */}
            {doc.bio && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-[#333] mb-3">
                  Über {fullName}
                </h2>
                <p className="text-[14px] text-[#666] leading-relaxed whitespace-pre-line">
                  {doc.bio}
                </p>
              </div>
            )}

            {/* Öffnungszeiten */}
            {doc.openingHours && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-[#333] mb-4">
                  Öffnungszeiten
                </h2>
                <OpeningHours hours={doc.openingHours as Record<string, string>} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Kontakt */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-[#333] mb-4">Kontakt</h3>
              <ul className="space-y-3">
                {doc.phone && (
                  <li className="flex items-center gap-3">
                    <Phone size={15} className="text-[#2EA3F2] flex-shrink-0" />
                    <a
                      href={`tel:${doc.phone.replace(/\s/g, "")}`}
                      className="text-[14px] text-[#666] hover:text-[#2EA3F2] transition-colors"
                    >
                      {doc.phone}
                    </a>
                  </li>
                )}
                {doc.email && (
                  <li className="flex items-center gap-3">
                    <Mail size={15} className="text-[#2EA3F2] flex-shrink-0" />
                    <a
                      href={`mailto:${doc.email}`}
                      className="text-[14px] text-[#666] hover:text-[#2EA3F2] transition-colors break-all"
                    >
                      {doc.email}
                    </a>
                  </li>
                )}
                {doc.website && (
                  <li className="flex items-center gap-3">
                    <Globe size={15} className="text-[#2EA3F2] flex-shrink-0" />
                    <a
                      href={doc.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[14px] text-[#2EA3F2] hover:underline break-all"
                    >
                      {doc.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  </li>
                )}
                {doc.street && (
                  <li className="flex items-start gap-3">
                    <MapPin size={15} className="text-[#2EA3F2] flex-shrink-0 mt-0.5" />
                    <address className="not-italic text-[14px] text-[#666] leading-relaxed">
                      {doc.street && <span>{doc.street}<br /></span>}
                      {doc.zip && doc.city && <span>{doc.zip} {doc.city}<br /></span>}
                      {doc.country && <span>{doc.country}</span>}
                    </address>
                  </li>
                )}
              </ul>
            </div>

            {/* Social Links */}
            {doc.socialLinks.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="font-semibold text-[#333] mb-3">Online</h3>
                <ul className="space-y-2">
                  {doc.socialLinks.map((link: { id: string; url: string; platform: string }) => (
                    <li key={link.id}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] text-[#2EA3F2] hover:underline"
                      >
                        {link.platform.charAt(0) + link.platform.slice(1).toLowerCase()}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function OpeningHours({ hours }: { hours: Record<string, string> }) {
  const days = [
    { key: "mo", label: "Montag" },
    { key: "di", label: "Dienstag" },
    { key: "mi", label: "Mittwoch" },
    { key: "do", label: "Donnerstag" },
    { key: "fr", label: "Freitag" },
    { key: "sa", label: "Samstag" },
    { key: "so", label: "Sonntag" },
  ];

  return (
    <dl className="space-y-2">
      {days.map(({ key, label }) => (
        <div key={key} className="flex justify-between text-[13px]">
          <dt className="text-[#666]">{label}</dt>
          <dd className="font-medium text-[#333]">
            {hours[key] ?? "Geschlossen"}
          </dd>
        </div>
      ))}
    </dl>
  );
}
