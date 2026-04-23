import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DoctorCard from "@/components/directory/DoctorCard";
import type { DentistWithRelations } from "@/types";

export const dynamic = "force-dynamic";

// ── SEO ──────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Implantologe Berlin finden | Zertifiziert & geprüft",
  description:
    "Implantologe Berlin finden leicht gemacht. Zertifizierte Spezialisten in allen Bezirken. Jetzt passende Praxis in Ihrer Nähe entdecken.",
  alternates: { canonical: "/implantologe-berlin" },
  openGraph: {
    title: "Implantologe Berlin finden | Zertifiziert & geprüft",
    description:
      "Zertifizierte Implantologen in Berlin – inkl. Überblick über Kosten, Kassenleistung und Tipps zur Praxiswahl.",
    type: "article",
  },
};

// ── Data ─────────────────────────────────────────────────────────────────────

async function getBerlinDoctors(): Promise<DentistWithRelations[]> {
  return prisma.dentistProfile.findMany({
    where: { active: true, citySlug: "berlin" },
    include: {
      categories: { include: { category: true } },
      socialLinks: true,
    },
    orderBy: [{ featured: "desc" }, { lastName: "asc" }],
  }) as unknown as Promise<DentistWithRelations[]>;
}

// ── Shared styles ────────────────────────────────────────────────────────────

const NAVY = "#00385E";
const CORAL = "#F4907B";
const PEACH = "#FCD2B2";
const CREME_LIGHT = "#FEF9F5";
const CREME = "#FDF5EE";

const contentWidth: React.CSSProperties = { maxWidth: 820, margin: "0 auto", padding: "0 24px" };

const paragraph: React.CSSProperties = {
  color: NAVY,
  fontSize: 16,
  lineHeight: 1.8,
  margin: "0 0 20px",
};

const h2Style: React.CSSProperties = {
  color: NAVY,
  fontSize: "clamp(22px, 3vw, 30px)",
  fontWeight: 700,
  lineHeight: 1.25,
  margin: "56px 0 20px",
  scrollMarginTop: 100,
};

const h3Style: React.CSSProperties = {
  color: NAVY,
  fontSize: 18,
  fontWeight: 700,
  margin: "28px 0 10px",
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function ImplantologeBerlinPage() {
  const doctors = await getBerlinDoctors();

  // JSON-LD: Article + FAQPage
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Implantologe Berlin finden – zertifiziert & in Ihrer Nähe",
    description:
      "Zertifizierte Implantologen in Berlin – Überblick über Qualitätsmerkmale, Kosten, Kassenleistung und Bezirke.",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.mycleandent.de/implantologe-berlin" },
    inLanguage: "de-DE",
  };

  const faqs: { q: string; a: string }[] = [
    {
      q: "Wie finde ich einen guten Implantologen in Berlin?",
      a: "Achten Sie auf Zertifizierungen wie die DGI-Mitgliedschaft oder das Tätigkeitsschwerpunkt-Zertifikat der Bundeszahnärztekammer. Seriöse Implantologen in Berlin erstellen vor der Behandlung einen kostenlosen Heil- und Kostenplan und verfügen über moderne Diagnostikgeräte wie digitale Volumentomographie (DVT). Vergleichen Sie mindestens zwei Praxen, bevor Sie sich entscheiden.",
    },
    {
      q: "Was kostet ein Zahnimplantat beim Implantologen in Berlin?",
      a: "Die Gesamtkosten für ein einzelnes Zahnimplantat liegen in Berlin in der Regel zwischen 1.500 und 3.500 €. Der genaue Preis hängt von der Lage der Praxis, dem verwendeten Implantatsystem, den Laborkosten für die Krone sowie eventuell notwendigen Voruntersuchungen oder einem Knochenaufbau ab.",
    },
    {
      q: "Übernimmt die Krankenkasse die Kosten für Implantate in Berlin?",
      a: "Die gesetzliche Krankenversicherung (GKV) übernimmt die Kosten für das Implantat selbst nicht. Sie bezuschusst jedoch den Zahnersatz auf dem Implantat (z. B. die Krone) über den sogenannten Festzuschuss. Wer sein Bonusheft lückenlos geführt hat, erhält einen erhöhten Zuschuss von bis zu 65 %.",
    },
    {
      q: "Wie lange dauert eine Implantatbehandlung in Berlin?",
      a: "Eine Implantatbehandlung erstreckt sich in der Regel über drei bis sechs Monate. Nach dem Einsetzen des Implantats muss dieses erst in den Kieferknochen einheilen (Osseointegration – die natürliche Verbindung zwischen Implantat und Knochen), bevor der endgültige Zahnersatz befestigt werden kann. Bei Sofortimplantaten kann die Gesamtdauer kürzer sein.",
    },
    {
      q: "Gibt es Implantologen in Berlin, die auch Sofortimplantate anbieten?",
      a: "Ja, viele spezialisierte Praxen in Berlin bieten Sofortimplantate an – dabei wird das Implantat unmittelbar nach der Zahnentfernung eingesetzt. Diese Methode ist jedoch nicht für jeden Patienten geeignet und setzt einen ausreichenden Knochenstatus sowie das Fehlen aktiver Entzündungen voraus. Lassen Sie sich individuell beraten.",
    },
    {
      q: "In welchen Berliner Bezirken gibt es besonders viele Implantologen?",
      a: "Besonders gut versorgt sind die Bezirke Charlottenburg-Wilmersdorf (rund um den Kurfürstendamm), Mitte und Prenzlauer Berg. Auch in Friedrichshain-Kreuzberg, Neukölln und Tempelhof-Schöneberg gibt es eine gute Auswahl. In Randbezirken wie Spandau oder Reinickendorf ist die Praxisdichte geringer, aber es gibt gut erreichbare Zentren mit implantologischem Schwerpunkt.",
    },
    {
      q: "Was ist der Unterschied zwischen einem Zahnarzt und einem Implantologen in Berlin?",
      a: 'Jeder Implantologe ist Zahnarzt, aber nicht jeder Zahnarzt ist auf Implantologie spezialisiert. In Deutschland darf die Bezeichnung „Implantologe" ohne Zusatzqualifikation geführt werden. Ein echter Spezialist weist eine nachgewiesene Weiterbildung, Fallzahlen und idealerweise eine Zertifizierung durch die Deutsche Gesellschaft für Implantologie (DGI) oder eine vergleichbare Fachgesellschaft vor.',
    },
  ];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          marginTop: "-72px",
          paddingTop: "calc(72px + 80px)",
          paddingBottom: 60,
          background: `linear-gradient(180deg, ${PEACH} 0%, ${CREME_LIGHT} 100%)`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <p style={{ color: CORAL, fontSize: 13, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 16px" }}>
            Lokaler Ratgeber · Berlin
          </p>
          <h1
            style={{
              color: NAVY,
              fontSize: "clamp(30px, 5vw, 48px)",
              fontWeight: 800,
              lineHeight: 1.1,
              margin: "0 0 20px",
              maxWidth: 820,
            }}
          >
            Implantologe Berlin finden – zertifiziert & in Ihrer Nähe
          </h1>
          <p style={{ color: NAVY, fontSize: 18, lineHeight: 1.6, maxWidth: 780, margin: "0 0 32px", opacity: 0.9 }}>
            Berlin bietet eine der dichtesten Versorgungslagen Deutschlands –
            in fast jedem Bezirk finden sich spezialisierte Implantologen mit
            nachgewiesener Qualifikation. Hier erfahren Sie, worauf es bei der
            Praxiswahl ankommt.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a
              href="#berliner-implantologen"
              style={{
                background: CORAL,
                color: "#fff",
                padding: "14px 26px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Direkt zu den Praxen →
            </a>
            <Link
              href="/zahnarzt/berlin"
              style={{
                background: "transparent",
                color: NAVY,
                padding: "14px 26px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                border: `2px solid ${NAVY}`,
                display: "inline-block",
              }}
            >
              Alle Zahnärzte Berlin
            </Link>
          </div>
        </div>
      </section>

      {/* ── „Das Wichtigste zusammengefasst" ──────────────────────────────── */}
      <section style={{ background: CREME_LIGHT, padding: "50px 0" }}>
        <div style={contentWidth}>
          <div
            style={{
              background: "#fff",
              borderLeft: `4px solid ${CORAL}`,
              padding: "24px 28px",
              borderRadius: 8,
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            <h2 style={{ color: NAVY, fontSize: 18, fontWeight: 700, margin: "0 0 14px" }}>
              Das Wichtigste zusammengefasst
            </h2>
            <ul style={{ margin: 0, paddingLeft: 22, color: NAVY, fontSize: 15, lineHeight: 1.75 }}>
              <li style={{ marginBottom: 8 }}>
                <strong>Implantologe Berlin:</strong> In fast jedem Bezirk gibt es spezialisierte Implantologen mit nachgewiesener Qualifikation.
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Zertifizierung:</strong> Achten Sie auf anerkannte Zusatzqualifikationen, etwa das Tätigkeitsschwerpunkt-Zertifikat der Bundeszahnärztekammer oder eine Mitgliedschaft in der DGI.
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Kosten:</strong> Ein einzelnes Zahnimplantat kostet in Berlin in der Regel zwischen 1.500 und 3.500 € – abhängig von Lage, Praxis und notwendigen Vorbehandlungen.
              </li>
              <li>
                <strong>Kassenleistung:</strong> Die GKV übernimmt keinen Implantatanteil direkt, bezuschusst aber den Zahnersatz auf dem Implantat über den Festzuschuss.
              </li>
            </ul>
          </div>

          {/* TOC */}
          <nav aria-label="Inhaltsverzeichnis" style={{ marginTop: 36 }}>
            <h2 style={{ color: NAVY, fontSize: 16, fontWeight: 700, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 }}>
              Inhaltsverzeichnis
            </h2>
            <ol style={{ color: NAVY, fontSize: 15, lineHeight: 1.9, paddingLeft: 22, margin: 0 }}>
              <li><a href="#warum-berlin" style={{ color: NAVY }}>Warum Berlin für Implantatbehandlungen besonders gut aufgestellt ist</a></li>
              <li><a href="#implantologe-berlin-finden" style={{ color: NAVY }}>Implantologe Berlin finden – worauf Sie achten sollten</a></li>
              <li><a href="#kosten" style={{ color: NAVY }}>Kosten für Zahnimplantate in Berlin</a></li>
              <li><a href="#kassenleistung" style={{ color: NAVY }}>Kassenleistung und Zuschüsse in Berlin</a></li>
              <li><a href="#bezirke" style={{ color: NAVY }}>Implantologen in den Berliner Bezirken</a></li>
              <li><a href="#berliner-implantologen" style={{ color: NAVY }}>Zertifizierte Praxen in Berlin</a></li>
              <li><a href="#faq" style={{ color: NAVY }}>Häufig gestellte Fragen</a></li>
            </ol>
          </nav>
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <article style={{ background: "#fff", padding: "50px 0 70px" }}>
        <div style={contentWidth}>
          <h2 id="warum-berlin" style={h2Style}>Warum Berlin für Implantatbehandlungen besonders gut aufgestellt ist</h2>
          <p style={paragraph}>
            Berlin zählt mit über 3,6 Millionen Einwohnern zu den am dichtesten versorgten Städten Deutschlands, wenn es um zahnmedizinische Spezialbehandlungen geht. In keiner anderen deutschen Stadt gibt es eine vergleichbar hohe Konzentration an spezialisierten Zahnarztpraxen, Implantologiezentren und universitären Einrichtungen auf so engem Raum.
          </p>
          <p style={paragraph}>
            Für Patientinnen und Patienten bedeutet das: kurze Wege, eine breite Auswahl und gut etablierte Vergleichsmöglichkeiten. Wer einen Implantologen in Berlin sucht, muss in der Regel keine weiten Strecken zurücklegen – in fast jedem Berliner Bezirk sind mehrere spezialisierte Praxen ansässig.
          </p>
          <p style={paragraph}>
            Die Stadt beheimatet zudem mehrere universitäre Einrichtungen mit implantologischem Schwerpunkt, darunter die Charité – Universitätsmedizin Berlin, die zu den renommiertesten Forschungs- und Behandlungszentren Europas zählt. Das erhöht nicht nur die allgemeine Versorgungsqualität, sondern sorgt auch für einen ständigen Wissenstransfer in die Praxis.
          </p>
          <p style={paragraph}>
            Ein weiterer Vorteil: Der Wettbewerb unter Berliner Praxen führt dazu, dass viele Implantologen auf transparente Preisgestaltung, moderne Technologien (etwa digitale Volumentomographie, computergestützte Implantologie) und patientenfreundliche Abläufe setzen – was sich positiv auf Behandlungsqualität und Kosten auswirkt.
          </p>

          <h2 id="implantologe-berlin-finden" style={h2Style}>Implantologe Berlin finden – worauf Sie achten sollten</h2>
          <p style={paragraph}>
            Nicht jeder Zahnarzt ist ein Implantologe, und nicht jeder Implantologe ist gleich qualifiziert. In Berlin – wie überall in Deutschland – darf die Bezeichnung „Implantologe" ohne spezielle Zusatzqualifikation geführt werden. Es lohnt sich daher, bei der Praxiswahl gezielt auf bestimmte Qualitätsmerkmale zu achten.
          </p>

          <h3 style={h3Style}>Zertifizierung und Mitgliedschaften</h3>
          <p style={paragraph}>
            Ein verlässliches Qualitätsmerkmal ist die Mitgliedschaft in der <strong>Deutschen Gesellschaft für Implantologie (DGI)</strong> oder dem <strong>Bundesverband der implantologisch tätigen Zahnärzte in Europa (BVIZ)</strong>. Wer das Tätigkeitsschwerpunkt-Zertifikat „Implantologie" der Bundeszahnärztekammer besitzt, hat nachweislich Fortbildungen und eine Mindestanzahl dokumentierter Behandlungen absolviert.
          </p>

          <h3 style={h3Style}>Technische Ausstattung</h3>
          <p style={paragraph}>
            Moderne Implantatbehandlungen setzen auf digitale Diagnostik. Praxen mit <strong>digitaler Volumentomographie (DVT)</strong> können dreidimensionale Knochenbilder erstellen und Implantate präziser planen. Auch computergestützte Implantologie (geführte Implantation via Schablone) erhöht die Genauigkeit und reduziert Komplikationsrisiken.
          </p>

          <h3 style={h3Style}>Transparenz bei Kosten</h3>
          <p style={paragraph}>
            Seriöse Implantologen in Berlin erstellen vor jeder Behandlung einen detaillierten Heil- und Kostenplan (HKP). Dieser muss alle Leistungen einzeln ausweisen – inklusive Implantatkörper, Aufbau, Krone und eventueller Voruntersuchungen. Ein HKP ist kostenlos und unverbindlich.
          </p>

          <h3 style={h3Style}>Erfahrung und Fallzahlen</h3>
          <p style={paragraph}>
            Fragen Sie konkret nach der Erfahrung: Wie viele Implantate hat der Behandler pro Jahr gesetzt? Gibt es Langzeitergebnisse oder Patientenreferenzen? Praxen, die regelmäßig implantieren, haben in der Regel geringere Komplikationsraten als solche, die es nur gelegentlich tun.
          </p>

          <h2 id="kosten" style={h2Style}>Kosten für Zahnimplantate in Berlin</h2>
          <p style={paragraph}>
            Die Kosten für ein Zahnimplantat in Berlin bewegen sich in einem relativ breiten Spektrum. Das liegt daran, dass die Gesamtkosten aus mehreren einzelnen Leistungen bestehen, die je nach Praxis, Implantatmarke und individuellem Behandlungsbedarf variieren.
          </p>
          <p style={{ ...paragraph, marginBottom: 12, fontWeight: 600 }}>
            Typische Kostenbestandteile eines Zahnimplantats in Berlin:
          </p>

          <div style={{ overflowX: "auto", marginBottom: 24 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15, color: NAVY }}>
              <thead>
                <tr style={{ background: CREME }}>
                  <th style={{ textAlign: "left", padding: "12px 14px", fontWeight: 700, borderBottom: `2px solid ${PEACH}` }}>Leistung</th>
                  <th style={{ textAlign: "right", padding: "12px 14px", fontWeight: 700, borderBottom: `2px solid ${PEACH}` }}>Ungefähre Kosten</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Implantat (Titan, inkl. Einsetzen)", "800 – 1.500 €"],
                  ["Implantat-Aufbau (Abutment)", "200 – 500 €"],
                  ["Zahnkrone auf dem Implantat", "600 – 1.500 €"],
                  ["Röntgen / DVT-Diagnostik", "50 – 200 €"],
                  ["Knochenaufbau (falls nötig)", "300 – 1.500 €"],
                ].map(([leistung, kosten], i) => (
                  <tr key={i}>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #eee" }}>{leistung}</td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #eee", textAlign: "right" }}>{kosten}</td>
                  </tr>
                ))}
                <tr style={{ background: CREME_LIGHT, fontWeight: 700 }}>
                  <td style={{ padding: "12px 14px" }}>Gesamt (ohne Knochenaufbau)</td>
                  <td style={{ padding: "12px 14px", textAlign: "right" }}>1.500 – 3.500 €</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={paragraph}>
            Praxen in Berliner Innenstadtlagen (etwa Mitte, Charlottenburg oder Wilmersdorf) liegen tendenziell im oberen Preisbereich. Praxen in Randbezirken wie Marzahn, Spandau oder Reinickendorf sind häufig günstiger – ohne dass die Behandlungsqualität darunter leiden muss.
          </p>
          <p style={paragraph}>
            <strong>Tipp:</strong> Holen Sie bei größeren Behandlungen mindestens zwei Heil- und Kostenpläne ein und vergleichen Sie die einzelnen Positionen, nicht nur die Gesamtsumme. Unterschiede entstehen oft bei Materialwahl, Laborkosten oder der Auswahl des Implantatsystems.
          </p>

          <h2 id="kassenleistung" style={h2Style}>Kassenleistung und Zuschüsse in Berlin</h2>
          <p style={paragraph}>
            Ein weit verbreitetes Missverständnis: Die <strong>gesetzliche Krankenversicherung (GKV)</strong> übernimmt in Deutschland keine Implantatkosten. Das Implantat selbst gilt nicht als Regelleistung der GKV – weder in Berlin noch bundesweit.
          </p>
          <p style={paragraph}>
            Was die Kasse jedoch übernimmt, ist der <strong>Festzuschuss für den Zahnersatz</strong>, der auf dem Implantat sitzt (also etwa die Krone). Die Höhe dieses Zuschusses richtet sich nach dem Befund und dem sogenannten Bonusheft: Wer mindestens fünf Jahre lückenlos Vorsorgeuntersuchungen nachweisen kann, erhält 30 % Erhöhung auf den Festzuschuss; bei zehn Jahren sind es 65 % Erhöhung.
          </p>

          <div
            style={{
              background: CREME,
              borderRadius: 10,
              padding: "18px 22px",
              margin: "8px 0 24px",
              fontSize: 15,
              lineHeight: 1.8,
              color: NAVY,
            }}
          >
            <strong>Beispielrechnung (vereinfacht)</strong>
            <br />
            Standardfestzuschuss für eine Krone: ca. 300 €<br />
            Mit 5 Jahren Bonus: ca. 390 €<br />
            Mit 10 Jahren Bonus: ca. 495 €
          </div>

          <p style={paragraph}>
            Für das eigentliche Implantat bleibt der Patient selbst verantwortlich. Wer eine <strong>private Zahnzusatzversicherung</strong> abgeschlossen hat, kann – je nach Tarif – einen Teil der Implantatkosten erstattet bekommen. Hierbei gilt: Je früher der Abschluss, desto besser die Leistungen, da die meisten Tarife Wartezeiten und Leistungsstaffeln enthalten.
          </p>

          <h2 id="bezirke" style={h2Style}>Implantologen in den Berliner Bezirken</h2>
          <p style={paragraph}>
            Berlin ist in zwölf offizielle Verwaltungsbezirke aufgeteilt, die sich weiter in Ortsteile untergliedern. Für die Suche nach einem Implantologen ist vor allem die bezirkliche Lage entscheidend – kurze Wege machen Vor- und Nachsorgetermine deutlich komfortabler, da eine Implantatbehandlung in der Regel mehrere Sitzungen über mehrere Monate umfasst.
          </p>
          <ul style={{ ...paragraph, paddingLeft: 22, listStyle: "disc" }}>
            <li style={{ marginBottom: 8 }}><strong>Charlottenburg-Wilmersdorf:</strong> Einer der versorgungsreichsten Bezirke, insbesondere rund um den Kurfürstendamm und die Joachimsthaler Straße.</li>
            <li style={{ marginBottom: 8 }}><strong>Mitte:</strong> Hohe Praxisdichte im Zentrum der Stadt, viele Praxen mit internationaler Ausrichtung.</li>
            <li style={{ marginBottom: 8 }}><strong>Prenzlauer Berg / Pankow:</strong> Wachsender Bezirk mit mehreren modernen Implantologiepraxen.</li>
            <li style={{ marginBottom: 8 }}><strong>Friedrichshain-Kreuzberg:</strong> Gute Versorgung, besonders entlang der Frankfurter Allee und im Kiez rund um den Südstern.</li>
            <li style={{ marginBottom: 8 }}><strong>Neukölln / Tempelhof-Schöneberg:</strong> Breite Auswahl, teils günstigere Preisstrukturen.</li>
            <li style={{ marginBottom: 8 }}><strong>Marzahn-Hellersdorf:</strong> MVZ-Strukturen (Medizinische Versorgungszentren) mit breitem Leistungsangebot.</li>
            <li><strong>Spandau / Reinickendorf:</strong> Weniger Praxen, aber gut erreichbare Zentren mit implantologischem Schwerpunkt.</li>
          </ul>
        </div>
      </article>

      {/* ── Doctor Grid: Berliner Implantologen ──────────────────────────── */}
      <section id="berliner-implantologen" style={{ background: CREME_LIGHT, padding: "70px 0", scrollMarginTop: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto 40px", textAlign: "center" }}>
            <p style={{ color: CORAL, fontSize: 13, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 12px" }}>
              Zertifizierte Praxen
            </p>
            <h2 style={{ color: NAVY, fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, lineHeight: 1.2, margin: "0 0 16px" }}>
              {doctors.length > 0
                ? `${doctors.length} geprüfte Implantolog${doctors.length === 1 ? "e" : "en"} in Berlin`
                : "Geprüfte Implantologen in Berlin"}
            </h2>
            <p style={{ color: NAVY, fontSize: 16, lineHeight: 1.7, margin: 0, opacity: 0.9 }}>
              Alle hier gelisteten Praxen sind CleanImplant-zertifizierte Zahnärztinnen und Zahnärzte – mit dokumentierter Expertise in der Implantologie.
            </p>
          </div>

          {doctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gap: "1.25rem" }}>
              {doctors.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", color: NAVY, opacity: 0.7 }}>
              Derzeit sind in Berlin keine Praxen gelistet. Schauen Sie bald wieder vorbei.
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link
              href="/zahnarzt/berlin"
              style={{
                display: "inline-block",
                background: NAVY,
                color: "#fff",
                padding: "14px 28px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
              }}
            >
              Alle Zahnärzte in Berlin ansehen →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Fazit ─────────────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "60px 0" }}>
        <div style={contentWidth}>
          <h2 style={h2Style}>Fazit</h2>
          <p style={paragraph}>
            Wer einen Implantologen in Berlin sucht, hat die Qual der Wahl: Die Stadt bietet eine der dichtesten Versorgungslandschaften Deutschlands – in nahezu jedem Bezirk sind qualifizierte Spezialisten ansässig. Entscheidend ist nicht nur die Erreichbarkeit, sondern auch die Zertifizierung des Behandlers, die technische Ausstattung der Praxis und eine transparente Kostenaufstellung vor Behandlungsbeginn.
          </p>
          <p style={paragraph}>
            Nutzen Sie die Möglichkeit, mehrere Kostenpläne einzuholen, und prüfen Sie, ob Ihr Zahnarzt Mitglied in einer anerkannten Fachgesellschaft ist. Wer gut informiert in die Beratung geht, trifft die bessere Entscheidung.
          </p>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" style={{ background: CREME_LIGHT, padding: "60px 0 80px", scrollMarginTop: 100 }}>
        <style>{`
          .faq-item summary { list-style: none; }
          .faq-item summary::-webkit-details-marker { display: none; }
          .faq-item summary::marker { content: ""; }
          .faq-chevron { transition: transform 0.25s ease; flex-shrink: 0; }
          .faq-item[open] .faq-chevron { transform: rotate(180deg); }
          .faq-item[open] { background: #fff; }
          .faq-item:hover .faq-chevron { color: ${CORAL}; }
        `}</style>
        <div style={contentWidth}>
          <h2 style={{ ...h2Style, margin: "0 0 24px" }}>Häufig gestellte Fragen</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.map((f, i) => (
              <details
                key={i}
                className="faq-item"
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  padding: "18px 22px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <summary
                  style={{
                    color: NAVY,
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                  }}
                >
                  <span>{f.q}</span>
                  <svg
                    className="faq-chevron"
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <p style={{ color: NAVY, fontSize: 15, lineHeight: 1.75, margin: "12px 0 0", opacity: 0.9 }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
