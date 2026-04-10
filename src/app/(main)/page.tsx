import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import FaqAccordion from "@/components/home/FaqAccordion";
import WhiteAccordion from "@/components/home/WhiteAccordion";
import DoctorCarousel from "@/components/home/DoctorCarousel";

export const metadata: Metadata = {
  title: "mycleandent – Finden Sie Ihre CleanImplant-zertifizierte Zahnarztpraxis",
  description:
    "Finden Sie zertifizierte Zahnärzte und Implantologen in Ihrer Nähe. Geprüfte Profile aus Deutschland, Österreich und der Schweiz.",
};

async function getFeaturedDoctors() {
  return prisma.dentistProfile.findMany({
    where: { active: true },
    take: 15,
    select: {
      id: true, slug: true, citySlug: true, firstName: true, lastName: true,
      title: true, suffix: true, street: true, zip: true,
      city: true, country: true, imageUrl: true, openingHours: true,
      categories: { include: { category: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

const usps = [
  {
    title: "Kontrolliert",
    text: "Verwendung von Implantat-Systemen, die in unabhängigen, akkreditierten Prüflaboren auf hohe Sauberkeit überprüft wurden.",
  },
  {
    title: "Konsequent",
    text: "Zertifizierte Implantate und schonende Methoden für einen optimalen Heilungsverlauf und einen hochwertigen Zahnersatz.",
  },
  {
    title: "Kompetent",
    text: "Starkes Engagement für höchste Standards in der Patientenbehandlung.",
  },
  {
    title: "Klar",
    text: "Individualität und Wohlbefinden der Patienten im Fokus.",
  },
];

const werWirSindItems = [
  {
    q: "Was geprüft wird",
    a: "Die CleanImplant Foundation ist eine international anerkannte, unabhängige Institution, die sich mit der Bewertung der Sauberkeit von Zahnimplantaten befasst. Durch umfangreiche wissenschaftliche Tests und eigene Zertifizierungsprozesse untersucht die Stiftung Implantatsysteme anhand definierter Kriterien auf bestimmte Oberflächeneigenschaften und mögliche Produktionsrückstände. Die Ergebnisse dieser Prüfungen sowie die CleanImplant Qualitätsauszeichnung dienen der transparenzschaffenden Information von Zahnärztinnen und Zahnärzten und können diese bei der Auswahl von Implantatsystemen unterstützen. Das Prüfverfahren erfolgt ergänzend zu bestehenden gesetzlichen Zulassungsanforderungen und behördlichen Konformitätsprüfungen.",
  },
  {
    q: "Wissenschaftliche Grundlage",
    a: "Unterstützt wird die Arbeit der Stiftung durch einen internationalen wissenschaftlichen Beirat. Dieses Expertengremium definiert die Grenzwerte für einen besonders hohen Standard zur Sauberkeit von Implantaten, begleitet die Prüfungen und sorgt dafür, dass die Ergebnisse fachlich fundiert und überprüft sind. Durch den Austausch mit Zahnärzten, Kliniken und Fachgesellschaften entsteht ein starkes Netzwerk, das Qualität von Medizinprodukten und Sicherheit für Patienten in den Mittelpunkt stellt. Dieses Expertengremium definiert die Prüfkriterien und Grenzwerte für das CleanImplant-Prüfverfahren für besondere Sauberkeit, begleitet die Prüfungen und stellt sicher, dass die Ergebnisse fachlich fundiert und überprüfbar sind.",
  },
  {
    q: "Die Bedeutung für Patienten",
    a: "Über mycleandent finden Sie Zahnärzte und Kliniken, die nach den geprüften Standards des CleanImplant-Verfahrens arbeiten. Jede bei uns gelistete Praxis verwendet Implantate, die über die gesetzlichen Zulassungsanforderungen hinaus die Kriterien der CleanImplant-Konsensus-Richtlinie erfüllen und die im Rahmen des CleanImplant-Prüfverfahrens definierten Grenzwerte für besonders hohe Sauberkeit einhalten. Das gibt Ihnen Vertrauen und Klarheit bei einer Entscheidung, die für Ihre Gesundheit und Wohlbefinden von unschätzbarem Wert ist.",
  },
];

const faqItems = [
  { q: "Was genau ist ein Zahnimplantat?",               a: "Ein Zahnimplantat ist ein aus Titan/Keramik gefertigter, chirurgisch in den Kieferknochen eingesetzter Stift, der eine fehlende Zahnwurzel ersetzt und eine Krone, Brücke oder Prothese trägt." },
  { q: "Bin ich ein guter Kandidat für Zahnimplantate?",  a: "Sie sind ein guter Kandidat, wenn Sie über ausreichende Kieferknochendichte, gesundes Zahnfleisch und einen guten allgemeinen Gesundheitszustand verfügen. Bei Rauchern oder Menschen mit bestimmten Erkrankungen kann eine zusätzliche Untersuchung erforderlich sein." },
  { q: "Wie lange halten Zahnimplantate?",                a: "Bei richtiger Pflege können Zahnimplantate ein Leben lang halten, während die Krone alle 10 bis 15 Jahre ausgetauscht werden muss." },
  { q: "Sind Zahnimplantate sicher?",                     a: "Ja, Zahnimplantate sind ein bewährtes und sicheres Verfahren mit einer hohen Erfolgsquote, wenn sie von einem qualifizierten Facharzt durchgeführt werden." },
  { q: "Wie lange dauert der gesamte Prozess?",           a: "Der gesamte Prozess kann mehrere Monate in Anspruch nehmen, da er eine Operation, eine Heilungsphase (3–6 Monate für die Osseointegration) und das Einsetzen der endgültigen Krone umfasst. In bestimmten Fällen kann auch eine sofortige Implantation mit einer provisorischen Krone möglich sein." },
  { q: "Ist der Eingriff für ein Zahnimplantat schmerzhaft?", a: "Der Eingriff wird unter örtlicher Betäubung durchgeführt, sodass nur minimale Schmerzen zu erwarten sind. Leichte Beschwerden, Schwellungen und Blutergüsse können danach auftreten, lassen sich jedoch gut mit Schmerzmitteln behandeln." },
  { q: "Welche Schritte sind bei einem Zahnimplantat erforderlich?", a: "Der Ablauf umfasst eine Erstberatung, die chirurgische Implantation, eine Heilungsphase zur Knochenintegration und schließlich das Befestigen des Zahnersatzes (der Krone)." },
  { q: "Werde ich während der Heilungsphase eine Lücke im Lächeln haben?", a: "Je nach Situation kann ein provisorischer Zahnersatz eingesetzt werden, bis die endgültige Krone befestigt wird." },
  { q: "Wie lange dauert die Erholungsphase nach einer Zahnimplantat-Operation?", a: "Die anfängliche Heilung dauert etwa eine Woche, aber die vollständige Integration des Implantats in den Knochen (Osseointegration) benötigt etwa 3–6 Monate." },
];

const blogPosts = [
  { title: "Wie funktioniert ein Implantat?",            href: "/wissenswert/wie-funktioniert-ein-implantat", color: "#e8f0f5", image: "https://osjaiemxynbwaxkmclcl.supabase.co/storage/v1/object/public/posts/illu-1.jpg" },
  { title: "Die Vorteile einer Implantatversorgung",     href: "/wissenswert/vorteile-implantatversorgung",   color: "#f5ede8", image: "https://osjaiemxynbwaxkmclcl.supabase.co/storage/v1/object/public/posts/illu-13.jpg" },
  { title: "Wie Zahnimplantate sich unterscheiden",      href: "/wissenswert/zahnimplantate-unterschiede",    color: "#eaf5e8", image: "https://osjaiemxynbwaxkmclcl.supabase.co/storage/v1/object/public/posts/illu-12.jpg" },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #F4907B",
  borderRadius: 8,
  padding: "13px 16px 13px 40px",
  fontSize: 14,
  fontWeight: 500,
  color: "#00385E",
  background: "#fff",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

export default async function HomePage() {
  const doctors = await getFeaturedDoctors();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        style={{
          marginTop: "-72px",
          minHeight: "60vh",
          backgroundImage: "url('https://osjaiemxynbwaxkmclcl.supabase.co/storage/v1/object/public/posts/mycleandent-bg-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: 780, margin: "0 auto", padding: "100px 24px 60px", textAlign: "center" }}>
          <h1 style={{ color: "#fff", fontSize: "clamp(24px, 4vw, 52px)", fontWeight: 700, lineHeight: 1.2, marginBottom: 36 }}>
            Finden Sie Ihre
            <br />
            CleanImplant-zertifizierte Zahnarztpraxis
          </h1>
          {/* Search form: stacks vertically on mobile, row on sm+ */}
          <form
            action="/zahnarzt-finden"
            method="get"
            className="flex flex-col sm:flex-row sm:items-center gap-3"
            style={{ background: "#FDF5F2", borderRadius: 12, padding: "16px 20px" }}
          >
            {/* Name / Praxis field */}
            <div style={{ position: "relative", flex: 2, minWidth: 0 }}>
              <Search size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#F4907B", pointerEvents: "none" }} />
              <input type="text" name="q" placeholder="Suchen nach (Name, Praxis, Zahnarzt)" style={inputStyle} />
            </div>
            {/* Ort field */}
            <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
              <MapPin size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#F4907B", pointerEvents: "none" }} />
              <input type="text" name="city" placeholder="Nach Ort suchen" style={inputStyle} />
            </div>
            <button
              type="submit"
              className="btn-coral w-full sm:w-[50px] flex-shrink-0"
              style={{ background: "#F4907B", color: "#fff", border: "none", borderRadius: 8, height: 50, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: 8, fontWeight: 700, fontSize: 14, fontFamily: "inherit" }}
              aria-label="Suchen"
            >
              <Search size={18} />
              <span className="sm:hidden">Suchen</span>
            </button>
          </form>
        </div>
      </section>

      {/* ── 4 USPs ───────────────────────────────────────────── */}
      <section style={{ background: "#FDF5F2", padding: "60px 0" }}>
        <div style={{ width: "90%", margin: "0 auto", position: "relative" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 px-2 lg:px-12">
            {usps.map(({ title, text }, i) => (
              <div key={title} style={{ textAlign: "left", position: "relative" }}>
                {i === 0 && (
                  <Image
                    src="https://osjaiemxynbwaxkmclcl.supabase.co/storage/v1/object/public/posts/clean.png"
                    alt=""
                    width={260}
                    height={260}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "right center",
                      zIndex: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                    aria-hidden
                  />
                )}
                {i === 3 && (
                  <Image
                    src="https://osjaiemxynbwaxkmclcl.supabase.co/storage/v1/object/public/posts/siegel.png"
                    alt=""
                    width={260}
                    height={260}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "right center",
                      zIndex: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                    aria-hidden
                  />
                )}
                {i === 2 && (
                  <Image
                    src="https://osjaiemxynbwaxkmclcl.supabase.co/storage/v1/object/public/posts/controlled.png"
                    alt=""
                    width={260}
                    height={260}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "right center",
                      zIndex: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                    aria-hidden
                  />
                )}
                {i === 1 && (
                  <Image
                    src="https://osjaiemxynbwaxkmclcl.supabase.co/storage/v1/object/public/posts/committed.png"
                    alt=""
                    width={260}
                    height={260}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "right center",
                      zIndex: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                    aria-hidden
                  />
                )}
                <div style={{ position: "relative", zIndex: 1 }}>
                  <h3 style={{ color: "#F4907B", fontSize: 24, fontWeight: 700, marginBottom: 12, marginTop: 0 }}>{title}</h3>
                  <p style={{ color: "#00385E", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Willkommen bei mycleandent ────────────────────────── */}
      <section style={{ background: "#FDF5F2", padding: "72px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", borderRadius: 12, overflow: "hidden" }}>
              <Image src="https://osjaiemxynbwaxkmclcl.supabase.co/storage/v1/object/public/posts/mycleandent-willkommen.png" alt="Willkommen bei mycleandent" fill style={{ objectFit: "cover" }} />
            </div>
            <div>
              <h2 style={{ color: "#BEC4AB", fontSize: "clamp(22px, 3vmax, 42px)", fontWeight: 600, lineHeight: "1.2em", marginBottom: 20, marginTop: 0 }}>
                Willkommen bei <strong>mycleandent</strong>
              </h2>
              <p style={{ color: "#00385E", fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
                Bei uns finden Sie schnell und einfach Zahnärzte und Kliniken, die von CleanImplant zertifiziert sind. Unser Ziel ist es, Ihnen Sicherheit und Transparenz zu geben – damit Sie ganz entspannt den richtigen Behandler für Ihr gesundes Lächeln wählen können. Alle bei uns gelisteten Praxen arbeiten mit von der unabhängigen CleanImplant Foundation ausgezeichneten Implantatsystemen. Vertrauen Sie bei Ihrer Behandlung auf die aufwendig überprüfte Reinheit und Qualität. Mit unserer benutzerfreundlichen Suche finden Sie mühelos zertifizierte Zahnärzte in Ihrer Nähe. Unser Formular erleichtert Ihnen die direkte und schnelle Kontaktaufnahme.
              </p>
              <p style={{ color: "#00385E", fontSize: 14, fontWeight: 700, margin: 0 }}>
                Qualität, Sicherheit und Vertrauen – CleanImplant Certified Dentists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Wer wir sind ─────────────────────────────────────── */}
      <section style={{ background: "#FDF5F2", padding: "72px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: text + accordion — on mobile comes after image */}
            <div className="order-2 lg:order-1">
              <h2 style={{ color: "#BEC4AB", fontSize: "clamp(22px, 3vmax, 42px)", fontWeight: 600, lineHeight: "1.2em", marginTop: 0, marginBottom: 16 }}>
                Wer wir sind
              </h2>
              <p style={{ color: "#00385E", fontSize: 14, fontWeight: 700, lineHeight: 1.75, marginBottom: 12 }}>
                mycleandent – Ihre Plattform für geprüfte Qualität in der Implantologie auf Grundlage des unabhängigen CleanImplant-Prüfverfahrens.
              </p>
              <p style={{ color: "#00385E", fontSize: 14, lineHeight: 1.75, marginBottom: 0 }}>
                mycleandent wurde von der renommierten CleanImplant Foundation ins Leben gerufen, um Patienten mit qualifizierten Zahnärzten und modernen Implantatlösungen zu verbinden. Unser Anspruch ist es, Orientierung zu geben und den Zugang zu den von uns qualifizierten Behandlungseinrichtungen zu erleichtern.
              </p>
              <WhiteAccordion items={werWirSindItems} />
            </div>

            {/* Right: image — on mobile comes first */}
            <div className="order-1 lg:order-2" style={{ position: "relative", width: "100%", aspectRatio: "4/3", borderRadius: 12, overflow: "hidden" }}>
              <Image src="https://osjaiemxynbwaxkmclcl.supabase.co/storage/v1/object/public/posts/illu-2.png" alt="Wer wir sind" fill style={{ objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Neue zertifizierte Praxen ────────────────────────── */}
      <section
        style={{
          padding: "72px 0",
          backgroundImage: "url('https://osjaiemxynbwaxkmclcl.supabase.co/storage/v1/object/public/posts/mycleandent-bg-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div style={{ position: "relative", maxWidth: 1400, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(22px, 3vmax, 42px)", fontWeight: 700, textAlign: "center", marginBottom: 40, marginTop: 0 }}>
            Neue zertifizierte Praxen
          </h2>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <DoctorCarousel doctors={doctors as any} />
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link
              href="/zahnarzt-finden"
              className="btn-coral"
              style={{
                display: "inline-block",
                background: "#F4907B",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                padding: "12px 32px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Finden Sie Ihre Praxis in der Nähe
            </Link>
          </div>
        </div>
      </section>

      {/* ── Wissenswertes ────────────────────────────────────── */}
      <section style={{ background: "#FDF5F2", padding: "72px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ color: "#BEC4AB", fontSize: "clamp(22px, 3vmax, 42px)", fontWeight: 700, textAlign: "center", marginBottom: 40, marginTop: 0 }}>
            Wissenswertes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.href}
                href={post.href}
                style={{ display: "block", borderRadius: 10, overflow: "hidden", textDecoration: "none", background: "#fff", transition: "box-shadow 0.2s" }}
                className="hover:shadow-md"
              >
                <div style={{ background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative", aspectRatio: "4/3" }}>
                  {(post as typeof post & { image?: string }).image ? (
                    <Image
                      src={(post as typeof post & { image?: string }).image!}
                      alt={post.title}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <svg viewBox="0 0 120 80" style={{ width: 128, opacity: 0.4 }}>
                      <rect x="10" y="10" width="100" height="60" rx="8" fill="#BEC4AB" />
                      <circle cx="40" cy="40" r="20" fill="#F4907B" />
                      <path d="M70 30h30M70 45h25M70 55h20" stroke="white" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <div style={{ padding: 16 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 600, color: "#F4907B", lineHeight: 1.3, margin: 0, textAlign: "center" }}>{post.title}</h3>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link
              href="/wissenswert"
              className="btn-coral"
              style={{
                display: "inline-block",
                background: "#F4907B",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                padding: "12px 32px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Weitere Beiträge
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" style={{
          padding: "72px 0",
          backgroundImage: "url('https://osjaiemxynbwaxkmclcl.supabase.co/storage/v1/object/public/posts/mycleandent-bg-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(22px, 3vmax, 42px)", fontWeight: 600, lineHeight: "1.2em", textAlign: "center", marginBottom: 40, marginTop: 0 }}>
            Fragen &amp; Antworten
          </h2>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </section>
    </>
  );
}
