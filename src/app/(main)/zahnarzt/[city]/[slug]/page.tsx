import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildDoctorName } from "@/lib/utils";
import { MapPin, Clock, MessageSquare } from "lucide-react";
import GallerySlider from "@/components/doctor/GallerySlider";
import ProfileTabs from "@/components/doctor/ProfileTabs";
import ContactForm from "@/components/doctor/ContactForm";
import OpeningHoursStatus, { type OpeningHoursData } from "@/components/doctor/OpeningHoursStatus";

// ── Language map (slug → { label, flag }) ────────────────────────────────────

const LANGUAGES: Record<string, { label: string; flag: string }> = {
  englisch:       { label: "Englisch",                  flag: "🇬🇧" },
  deutsch:        { label: "Deutsch",                   flag: "🇩🇪" },
  french:         { label: "Französisch",               flag: "🇫🇷" },
  spanish:        { label: "Spanisch",                  flag: "🇪🇸" },
  italian:        { label: "Italienisch",               flag: "🇮🇹" },
  portuguese:     { label: "Portugiesisch",             flag: "🇵🇹" },
  dutch:          { label: "Niederländisch",            flag: "🇳🇱" },
  russian:        { label: "Russisch",                  flag: "🇷🇺" },
  polish:         { label: "Polnisch",                  flag: "🇵🇱" },
  ukrainian:      { label: "Ukrainisch",                flag: "🇺🇦" },
  romanian:       { label: "Rumänisch",                 flag: "🇷🇴" },
  czech:          { label: "Tschechisch",               flag: "🇨🇿" },
  hungarian:      { label: "Ungarisch",                 flag: "🇭🇺" },
  greek:          { label: "Griechisch",                flag: "🇬🇷" },
  bulgarian:      { label: "Bulgarisch",                flag: "🇧🇬" },
  serbian:        { label: "Serbisch",                  flag: "🇷🇸" },
  croatian:       { label: "Kroatisch",                 flag: "🇭🇷" },
  bosnian:        { label: "Bosnisch",                  flag: "🇧🇦" },
  slovenian:      { label: "Slowenisch",                flag: "🇸🇮" },
  slovak:         { label: "Slowakisch",                flag: "🇸🇰" },
  swedish:        { label: "Schwedisch",                flag: "🇸🇪" },
  danish:         { label: "Dänisch",                   flag: "🇩🇰" },
  norwegian:      { label: "Norwegisch",                flag: "🇳🇴" },
  finnish:        { label: "Finnisch",                  flag: "🇫🇮" },
  estonian:       { label: "Estnisch",                  flag: "🇪🇪" },
  latvian:        { label: "Lettisch",                  flag: "🇱🇻" },
  lithuanian:     { label: "Litauisch",                 flag: "🇱🇹" },
  turkish:        { label: "Türkisch",                  flag: "🇹🇷" },
  albanian:       { label: "Albanisch",                 flag: "🇦🇱" },
  macedonian:     { label: "Mazedonisch",               flag: "🇲🇰" },
  georgian:       { label: "Georgisch",                 flag: "🇬🇪" },
  armenian:       { label: "Armenisch",                 flag: "🇦🇲" },
  belarusian:     { label: "Weißrussisch",              flag: "🇧🇾" },
  catalan:        { label: "Katalanisch",               flag: "🏴󠁥󠁳󠁣󠁴󠁿" },
  basque:         { label: "Baskisch",                  flag: "🏴" },
  irish:          { label: "Irisch (Gälisch)",          flag: "🇮🇪" },
  scottishgaelic: { label: "Schottisch-Gälisch",        flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  welsh:          { label: "Walisisch",                 flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  icelandic:      { label: "Isländisch",                flag: "🇮🇸" },
  maltese:        { label: "Maltesisch",                flag: "🇲🇹" },
  hebrew:         { label: "Hebräisch",                 flag: "🇮🇱" },
  arabic:         { label: "Arabisch",                  flag: "🇸🇦" },
  farsi:          { label: "Farsi (Persisch)",          flag: "🇮🇷" },
  kurdish:        { label: "Kurdisch",                  flag: "🏳️" },
  chinese:        { label: "Chinesisch (Mandarin)",     flag: "🇨🇳" },
  cantonese:      { label: "Chinesisch (Kantonesisch)", flag: "🇭🇰" },
  japanese:       { label: "Japanisch",                 flag: "🇯🇵" },
  korean:         { label: "Koreanisch",                flag: "🇰🇷" },
  hindi:          { label: "Hindi",                     flag: "🇮🇳" },
  urdu:           { label: "Urdu",                      flag: "🇵🇰" },
  bengali:        { label: "Bengali",                   flag: "🇧🇩" },
  tamil:          { label: "Tamil",                     flag: "🇱🇰" },
  telugu:         { label: "Telugu",                    flag: "🇮🇳" },
  malayalam:      { label: "Malayalam",                 flag: "🇮🇳" },
  thai:           { label: "Thai",                      flag: "🇹🇭" },
  vietnamese:     { label: "Vietnamesisch",             flag: "🇻🇳" },
  indonesian:     { label: "Indonesisch",               flag: "🇮🇩" },
  malay:          { label: "Malaiisch",                 flag: "🇲🇾" },
  swahili:        { label: "Swahili",                   flag: "🇰🇪" },
  zulu:           { label: "Zulu",                      flag: "🇿🇦" },
  afrikaans:      { label: "Afrikaans",                 flag: "🇿🇦" },
  filipino:       { label: "Filipino (Tagalog)",        flag: "🇵🇭" },
  pashto:         { label: "Paschtu",                   flag: "🇦🇫" },
  punjabi:        { label: "Punjabi",                   flag: "🇮🇳" },
  nepali:         { label: "Nepali",                    flag: "🇳🇵" },
  lao:            { label: "Laotisch",                  flag: "🇱🇦" },
  khmer:          { label: "Khmer",                     flag: "🇰🇭" },
  mongolian:      { label: "Mongolisch",                flag: "🇲🇳" },
  burmese:        { label: "Burmesisch",                flag: "🇲🇲" },
  tigrinya:       { label: "Tigrinya",                  flag: "🇪🇷" },
  amharic:        { label: "Amharisch",                 flag: "🇪🇹" },
  somali:         { label: "Somali",                    flag: "🇸🇴" },
};

// ── Data fetching ─────────────────────────────────────────────────────────────

type Props = { params: Promise<{ city: string; slug: string }>; searchParams: Promise<{ preview?: string }> };

async function getDoctor(slug: string, preview = false) {
  return prisma.dentistProfile.findUnique({
    where: preview ? { slug } : { slug, active: true },
    include: {
      categories: { include: { category: true } },
      socialLinks: true,
    },
  });
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDoctor(slug, false);
  if (!doc) return {};

  const name = buildDoctorName(doc.title, doc.firstName, doc.lastName, doc.suffix);
  const COUNTRY_NAMES: Record<string, string> = { DE: "Deutschland", AT: "Österreich", CH: "Schweiz" };
  const countryName = doc.country ? (COUNTRY_NAMES[doc.country] ?? doc.country) : null;
  const location = [doc.city, countryName].filter(Boolean).join(", ");

  return {
    title: `${name} – Zahnarzt in ${doc.city}`,
    description:
      doc.metaDesc ??
      `${name} – Zahnarzt${doc.city ? ` in ${doc.city}` : ""}. ${
        doc.categories.length > 0
          ? doc.categories
              .map((c: { category: { name: string } }) => c.category.name)
              .join(", ") + ". "
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
  const doctors = await prisma.dentistProfile.findMany({
    select: { slug: true, citySlug: true },
    where: { active: true },
  });
  return doctors.map(({ slug, citySlug }: { slug: string; citySlug: string }) => ({
    city: citySlug,
    slug,
  }));
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DoctorProfilePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const doc = await getDoctor(slug, preview === "1");
  if (!doc) notFound();

  const fullName = buildDoctorName(doc.title, doc.firstName, doc.lastName, doc.suffix);
  const COUNTRY_NAMES: Record<string, string> = { DE: "Deutschland", AT: "Österreich", CH: "Schweiz" };
  const countryLabel = doc.country ? (COUNTRY_NAMES[doc.country] ?? doc.country) : null;
  const fullAddress = [doc.street, doc.zip && doc.city ? `${doc.zip} ${doc.city}` : doc.city, countryLabel]
    .filter(Boolean)
    .join(", ");

  const initials =
    (doc.firstName?.[0] ?? "") + (doc.lastName?.[0] ?? "");

  const openingHours = doc.openingHours as OpeningHoursData;

  const languageList = (doc.languages as string[]).map((l) => {
    const key = l.toLowerCase();
    return LANGUAGES[key] ?? { label: l, flag: "🌐" };
  });

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
    medicalSpecialty: doc.categories.map(
      (c: { category: { name: string } }) => c.category.name
    ),
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden flex items-end lg:items-center"
        style={{
          height: "40vh",
          minHeight: 260,
          marginTop: "-72px",
          backgroundImage: "url('https://osjaiemxynbwaxkmclcl.supabase.co/storage/v1/object/public/posts/mycleandent-bg-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        {/* Hero content */}
        <div
          className="relative w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-6"
          style={{ paddingLeft: "2em", paddingRight: "1rem", paddingBottom: "1.5rem", marginTop: "2em" }}
        >
          {/* Profile image / initials */}
          <div
            className="flex-shrink-0 flex items-center justify-center overflow-hidden"
            style={{
              width: "clamp(110px, 15vw, 180px)",
              height: "clamp(110px, 15vw, 180px)",
              borderRadius: "50%",
              border: "3px solid #fff",
              background: doc.imageUrl ? "transparent" : "#6b7a5a",
            }}
          >
            {doc.imageUrl ? (
              <img
                src={doc.imageUrl}
                alt={fullName}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <span style={{ color: "#fff", fontWeight: 700, fontSize: "clamp(20px, 4vw, 48px)" }}>
                {initials}
              </span>
            )}
          </div>

          {/* Name + categories */}
          <div className="min-w-0">
            <h1
              style={{
                color: "#FEF9F5",
                fontSize: "2.8vmax",
                fontWeight: 600,
                lineHeight: 1.15,
                marginBottom: 10,
                fontFamily: "var(--font-sans), Montserrat, sans-serif",
              }}
            >
              {fullName}
            </h1>
            {doc.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {doc.categories.map(
                  ({ category }: { category: { id: string; name: string } }) => (
                    <span
                      key={category.id}
                      style={{
                        background: "rgba(255,255,255,0.25)",
                        color: "#fff",
                        borderRadius: 20,
                        padding: "3px 12px",
                        fontSize: "clamp(11px, 2.5vw, 13px)",
                        fontWeight: 500,
                      }}
                    >
                      {category.name}
                    </span>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div style={{ background: "#FEF9F5", padding: "2rem 0 4rem" }}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          {/* Mobile: single column — SideCard first, then content */}
          {/* Desktop: 3fr + 2fr side by side */}
          <div className="flex flex-col lg:grid lg:gap-8 lg:items-start"
            style={{ gridTemplateColumns: "3fr 2fr" }}>

            {/* ── LEFT column ────────────────────────────────────────────── */}
            <div className="mt-6 lg:mt-0 space-y-6">
              {/* Gallery slider */}
              {(doc.galleryImages as string[]).filter(Boolean).length > 0 && (
                <GallerySlider images={(doc.galleryImages as string[]).filter(Boolean)} />
              )}

              {/* Profile tabs */}
              <ProfileTabs
                bio={doc.bio}
                treatments={doc.treatments as string[]}
              />

              {/* Contact form — desktop only, below tabs */}
              <div id="contact-form" className="hidden lg:block">
                <ContactForm practiceEmail={doc.email ?? null} practiceName={doc.practiceName ?? fullName} />
              </div>
            </div>

            {/* ── RIGHT column — SideCard ─────────────────────────────── */}
            <div className="lg:-mt-20">
              <div
                className="bg-white lg:sticky"
                style={{
                  borderRadius: 10,
                  padding: "1.5rem",
                  top: 100,
                }}
              >
                {/* Practice name + address */}
                <div className="flex items-start gap-2 mb-1">
                  <MapPin
                    size={18}
                    style={{ color: "#BEC3AA", flexShrink: 0, marginTop: 2 }}
                  />
                  <div>
                    {doc.practiceName && (
                      <p
                        style={{
                          color: "#F4907B",
                          fontWeight: 600,
                          fontSize: 18,
                          marginBottom: 4,
                          lineHeight: 1.3,
                        }}
                      >
                        {doc.practiceName}
                      </p>
                    )}
                    <address
                      className="not-italic"
                      style={{ color: "#00385E", fontSize: 15, lineHeight: 1.6, fontWeight: 500 }}
                    >
                      {doc.street && <span>{doc.street}<br /></span>}
                      {(doc.zip || doc.city) && (
                        <span>
                          {[doc.zip, doc.city].filter(Boolean).join(" ")}
                          <br />
                        </span>
                      )}
                      {countryLabel && <span>{countryLabel}</span>}
                    </address>
                  </div>
                </div>

                <hr style={{ border: "none", borderTop: "1px solid #f0ede8", margin: "16px 0" }} />

                {/* Opening hours */}
                <div className="flex items-start gap-2 mb-1">
                  <Clock
                    size={18}
                    style={{ color: "#BEC3AA", flexShrink: 0, marginTop: 2 }}
                  />
                  <div className="flex-1">
                    <OpeningHoursStatus hours={openingHours} />
                  </div>
                </div>

                <hr style={{ border: "none", borderTop: "1px solid #f0ede8", margin: "16px 0" }} />

                {/* Languages */}
                {languageList.length > 0 && (
                  <>
                    <div className="flex items-start gap-2">
                      <MessageSquare
                        size={18}
                        style={{ color: "#BEC3AA", flexShrink: 0, marginTop: 2 }}
                      />
                      <div className="flex-1">
                        <p
                          style={{
                            color: "#F5907B",
                            fontWeight: 600,
                            fontSize: 18,
                            marginBottom: 8,
                          }}
                        >
                          Sprachen
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {languageList.map(({ label, flag }) => (
                            <span
                              key={label}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                background: "#FEF9F5",
                                border: "1px solid #f0ede8",
                                borderRadius: 20,
                                padding: "3px 10px",
                                fontSize: 13,
                                color: "#00385E",
                                fontWeight: 500,
                              }}
                            >
                              <span style={{ fontSize: 15 }}>{flag}</span>
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <hr style={{ border: "none", borderTop: "1px solid #f0ede8", margin: "16px 0" }} />
                  </>
                )}

                {/* CTA buttons */}
                <a
                  href="#contact-form"
                  className="btn-coral"
                  style={{
                    display: "block",
                    width: "100%",
                    background: "#F4907B",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "12px 0",
                    fontWeight: 700,
                    fontSize: 13,
                    textAlign: "center",
                    letterSpacing: "0.05em",
                    textDecoration: "none",
                    boxSizing: "border-box",
                  }}
                >
                  PRAXIS KONTAKTIEREN
                </a>

                {doc.appointmentUrl && (
                  <a
                    href={doc.appointmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      width: "100%",
                      background: "#F4907B",
                      color: "#fff",
                      borderRadius: 8,
                      padding: "12px 0",
                      fontWeight: 700,
                      fontSize: 13,
                      textAlign: "center",
                      letterSpacing: "0.05em",
                      textDecoration: "none",
                      marginTop: 8,
                      boxSizing: "border-box",
                    }}
                  >
                    TERMIN ONLINE BUCHEN
                  </a>
                )}

                <hr style={{ border: "none", borderTop: "1px solid #f0ede8", margin: "16px 0" }} />

                {/* Google Maps embed — square */}
                <div style={{ borderRadius: 10, overflow: "hidden", aspectRatio: "1 / 1", width: "100%" }}>
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: "none", display: "block" }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Karte: ${fullName}`}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── Contact form — mobile/tablet only (bottom) ──────────── */}
        <div id="contact" className="lg:hidden" style={{ paddingBottom: "2rem" }}>
          <ContactForm practiceEmail={doc.email ?? null} practiceName={doc.practiceName ?? fullName} />
        </div>
      </div>

      {/* ── Mobile fixed bottom CTA bar ──────────────────────────────────── */}
      <div
        className="lg:hidden"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "transparent",
          padding: "10px 16px",
          paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
        }}
      >
        <div style={{ display: "flex", gap: 10 }}>
          <a
            href="#contact"
            style={{
              flex: 1,
              background: "#F4907B",
              color: "#fff",
              borderRadius: 8,
              padding: "13px 8px",
              fontWeight: 700,
              fontSize: 12,
              textAlign: "center",
              letterSpacing: "0.06em",
              textDecoration: "none",
              display: "block",
            }}
          >
            PRAXIS KONTAKTIEREN
          </a>
          {doc.appointmentUrl && (
            <a
              href={doc.appointmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                background: "#00385E",
                color: "#fff",
                borderRadius: 8,
                padding: "13px 8px",
                fontWeight: 700,
                fontSize: 12,
                textAlign: "center",
                letterSpacing: "0.06em",
                textDecoration: "none",
                display: "block",
              }}
            >
              ONLINE TERMIN BUCHEN
            </a>
          )}
        </div>
      </div>

      {/* Spacer so fixed bar doesn't overlap content on mobile */}
      <div className="lg:hidden" style={{ height: 70 }} />
    </>
  );
}
