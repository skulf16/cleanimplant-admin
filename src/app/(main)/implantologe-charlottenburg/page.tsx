import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DoctorCard from "@/components/directory/DoctorCard";
import type { DentistWithRelations } from "@/types";

export const dynamic = "force-dynamic";

// ── SEO ──────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Implantologe Charlottenburg | Zertifiziert & geprüft",
  description:
    "Implantologe Charlottenburg finden: Zertifizierte Spezialisten rund um den Kudamm. Jetzt passende Praxis im Bezirk entdecken.",
  alternates: { canonical: "/implantologe-charlottenburg" },
  openGraph: {
    title: "Implantologe Charlottenburg | Zertifiziert & geprüft",
    description:
      "Zertifizierte Implantologen in Charlottenburg-Wilmersdorf – inkl. Qualitätsmerkmale, Kosten und Behandlungsablauf.",
    type: "article",
  },
};

// ── Data ─────────────────────────────────────────────────────────────────────
//
// Charlottenburg-Wilmersdorf umfasst im Wesentlichen die PLZ-Bereiche 10*** und
// 14*** rund um den Kurfürstendamm. Da die DB keinen Bezirk speichert, filtern
// wir Berliner Ärzte anhand ihrer Postleitzahl. Finden wir niemanden, fallen
// wir auf alle Berliner Ärzte zurück, damit der Grid nicht leer bleibt.
const CHARLOTTENBURG_ZIP_PREFIXES = [
  "10585", "10587", "10589",
  "10623", "10625", "10627", "10629",
  "10707", "10709", "10711", "10713", "10715", "10717", "10719",
  "14050", "14052", "14053", "14055", "14057", "14059",
  "14193", "14195", "14197", "14199",
];

async function getCharlottenburgDoctors(): Promise<{
  doctors: DentistWithRelations[];
  narrowed: boolean;
}> {
  const narrowed = await prisma.dentistProfile.findMany({
    where: {
      active: true,
      citySlug: "berlin",
      OR: CHARLOTTENBURG_ZIP_PREFIXES.map((zip) => ({ zip: { startsWith: zip } })),
    },
    include: {
      categories: { include: { category: true } },
      socialLinks: true,
    },
    orderBy: [{ featured: "desc" }, { lastName: "asc" }],
  });

  if (narrowed.length > 0) {
    return { doctors: narrowed as unknown as DentistWithRelations[], narrowed: true };
  }

  // Fallback: alle Berliner Ärzte
  const all = await prisma.dentistProfile.findMany({
    where: { active: true, citySlug: "berlin" },
    include: {
      categories: { include: { category: true } },
      socialLinks: true,
    },
    orderBy: [{ featured: "desc" }, { lastName: "asc" }],
  });

  return { doctors: all as unknown as DentistWithRelations[], narrowed: false };
}

// ── Shared styles (identisch zu /implantologe-berlin) ────────────────────────

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

export default async function ImplantologeCharlottenburgPage() {
  const { doctors, narrowed } = await getCharlottenburgDoctors();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Implantologe Charlottenburg – zertifiziert & in Ihrer Nähe",
    description:
      "Zertifizierte Implantologen in Charlottenburg-Wilmersdorf – Überblick über Qualifikation, Kosten und Behandlungsablauf.",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.mycleandent.de/implantologe-charlottenburg" },
    inLanguage: "de-DE",
  };

  const faqs: { q: string; a: string }[] = [
    {
      q: "Wie finde ich einen zertifizierten Implantologen in Charlottenburg?",
      a: "Achten Sie auf Mitgliedschaften in anerkannten Fachgesellschaften wie der Deutschen Gesellschaft für Implantologie (DGI) oder auf das Tätigkeitsschwerpunkt-Zertifikat der Bundeszahnärztekammer. Seriöse Praxen in Charlottenburg stellen diese Qualifikationen transparent auf ihrer Website dar und erstellen vor jeder Behandlung einen kostenlosen Heil- und Kostenplan.",
    },
    {
      q: "Was kostet ein Zahnimplantat beim Implantologen in Charlottenburg?",
      a: "In Charlottenburg liegen die Gesamtkosten für ein einzelnes Zahnimplantat in der Regel zwischen 1.800 und 3.500 €. Die genaue Summe hängt vom verwendeten Implantatsystem, den Laborkosten für die Krone und eventuell notwendigen Vorbehandlungen wie einem Knochenaufbau ab.",
    },
    {
      q: "Übernimmt meine Krankenkasse die Implantatkosten in Charlottenburg?",
      a: "Die gesetzliche Krankenversicherung (GKV) übernimmt die Kosten für das Implantat selbst nicht. Sie bezuschusst jedoch den Zahnersatz auf dem Implantat über den Festzuschuss. Wer das Bonusheft lückenlos geführt hat, erhält einen erhöhten Zuschuss von bis zu 65 %.",
    },
    {
      q: "Wie lange dauert eine Implantatbehandlung in Charlottenburg?",
      a: "Die Gesamtbehandlung dauert in der Regel drei bis sechs Monate. Der größte Teil dieser Zeit entfällt auf die Einheilphase des Implantats im Kieferknochen (Osseointegration). Der eigentliche Eingriff selbst ist ambulant und dauert je nach Befund zwischen 30 und 90 Minuten.",
    },
    {
      q: "Gibt es in Charlottenburg auch günstigere Implantologen?",
      a: "Ja – auch innerhalb des Bezirks gibt es Preisspannen. Praxen abseits der Hauptachsen am Kurfürstendamm oder Hohenzollerndamm rechnen teils günstiger ab. Entscheidend ist ein transparenter Heil- und Kostenplan, der alle Positionen einzeln aufführt. Vergleichen Sie mindestens zwei Angebote.",
    },
    {
      q: "Was ist der Unterschied zwischen einem Zahnarzt und einem Implantologen in Charlottenburg?",
      a: 'Jeder Zahnarzt darf in Deutschland Implantate setzen – die Bezeichnung „Implantologe" ist gesetzlich nicht geschützt. Ein echter Spezialist verfügt über eine nachgewiesene Zusatzqualifikation, dokumentierte Fallzahlen und ist idealerweise Mitglied in einer Fachgesellschaft wie der DGI. Diese Qualifikation sollte aktiv kommuniziert werden – fragen Sie im Zweifel direkt nach.',
    },
    {
      q: "Bieten Implantologen in Charlottenburg auch Sofortimplantate an?",
      a: "Einige spezialisierte Praxen in Charlottenburg bieten Sofortimplantate an, bei denen das Implantat direkt nach der Zahnentfernung eingesetzt wird. Diese Methode verkürzt die Gesamtbehandlungszeit, ist aber nicht für jeden Patienten geeignet. Voraussetzung sind ein ausreichender Knochenbestand und das Fehlen aktiver Entzündungen – eine individuelle Diagnostik ist zwingend erforderlich.",
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
            Lokaler Ratgeber · Berlin · Charlottenburg
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
            Implantologe Charlottenburg – zertifiziert & in Ihrer Nähe
          </h1>
          <p style={{ color: NAVY, fontSize: 18, lineHeight: 1.6, maxWidth: 780, margin: "0 0 32px", opacity: 0.9 }}>
            Charlottenburg-Wilmersdorf gehört zu den am besten versorgten
            Bezirken Berlins – entlang des Kurfürstendamms und des
            Hohenzollerndamms sind zahlreiche spezialisierte
            Implantologiepraxen ansässig.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a
              href="#charlottenburg-implantologen"
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
              href="/implantologe-berlin"
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
              Berlin – alle Bezirke
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
                <strong>Implantologe Charlottenburg:</strong> Einer der am besten versorgten Bezirke Berlins – entlang des Kurfürstendamms und Hohenzollerndamms sind zahlreiche spezialisierte Praxen ansässig.
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Zertifizierung:</strong> Mitgliedschaft in der DGI oder ein Tätigkeitsschwerpunkt-Zertifikat der Bundeszahnärztekammer sind verlässliche Qualitätsmerkmale.
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Kosten:</strong> Ein Zahnimplantat kostet in Charlottenburg in der Regel zwischen 1.800 und 3.500 € – Praxen in Innenstadtlage tendieren zum oberen Preisbereich.
              </li>
              <li>
                <strong>Kassenleistung:</strong> Die GKV übernimmt das Implantat selbst nicht, bezuschusst aber den Zahnersatz darauf über den Festzuschuss.
              </li>
            </ul>
          </div>

          {/* TOC */}
          <nav aria-label="Inhaltsverzeichnis" style={{ marginTop: 36 }}>
            <h2 style={{ color: NAVY, fontSize: 16, fontWeight: 700, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 }}>
              Inhaltsverzeichnis
            </h2>
            <ol style={{ color: NAVY, fontSize: 15, lineHeight: 1.9, paddingLeft: 22, margin: 0 }}>
              <li><a href="#versorgung" style={{ color: NAVY }}>Implantologie in Charlottenburg – Versorgung im Überblick</a></li>
              <li><a href="#kriterien" style={{ color: NAVY }}>Implantologe Charlottenburg finden – diese Kriterien zählen</a></li>
              <li><a href="#kosten" style={{ color: NAVY }}>Kosten für Zahnimplantate in Charlottenburg</a></li>
              <li><a href="#kassenleistung" style={{ color: NAVY }}>Kassenleistung und Zuschüsse</a></li>
              <li><a href="#ablauf" style={{ color: NAVY }}>Behandlungsablauf beim Implantologen in Charlottenburg</a></li>
              <li><a href="#charlottenburg-implantologen" style={{ color: NAVY }}>Zertifizierte Praxen in Charlottenburg</a></li>
              <li><a href="#faq" style={{ color: NAVY }}>Häufig gestellte Fragen</a></li>
            </ol>
          </nav>
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <article style={{ background: "#fff", padding: "50px 0 70px" }}>
        <div style={contentWidth}>

          <h2 id="versorgung" style={h2Style}>Implantologie in Charlottenburg – Versorgung im Überblick</h2>
          <p style={paragraph}>
            Charlottenburg-Wilmersdorf zählt nicht ohne Grund zu den gefragtesten Adressen für zahnmedizinische Spezialbehandlungen in Berlin. Der Bezirk vereint eine hohe Praxisdichte mit einer gut situierten Patientenstruktur, was dazu geführt hat, dass sich hier überdurchschnittlich viele Zahnarztpraxen mit implantologischem Schwerpunkt angesiedelt haben.
          </p>
          <p style={paragraph}>
            Besonders die Achse entlang des <strong>Kurfürstendamms</strong> und des <strong>Hohenzollerndamms</strong> weist eine bemerkenswerte Konzentration an Zahnarzt- und Implantologiepraxen auf. Wer in Charlottenburg, Wilmersdorf oder den angrenzenden Ortsteilen wie Halensee oder Grunewald wohnt, findet fußläufig oder mit einem kurzen ÖPNV-Weg mehrere spezialisierte Anlaufstellen.
          </p>
          <p style={paragraph}>
            Das ist kein Zufall: Eine Implantatbehandlung erstreckt sich über mehrere Monate und erfordert mehrere Sitzungen – von der Erstdiagnostik über das Einsetzen des Implantats bis zur Eingliederung des endgültigen Zahnersatzes. Kurze Wege zur Praxis machen diesen Prozess deutlich angenehmer.
          </p>

          <h2 id="kriterien" style={h2Style}>Implantologe Charlottenburg finden – diese Kriterien zählen</h2>
          <p style={paragraph}>
            <strong>Implantologe Charlottenburg</strong> ist kein geschützter Begriff – jeder niedergelassene Zahnarzt darf Implantate setzen, auch ohne spezialisierte Weiterbildung. Umso wichtiger ist es, bei der Praxiswahl auf überprüfbare Qualitätsmerkmale zu achten.
          </p>

          <h3 style={h3Style}>Fachliche Qualifikation</h3>
          <p style={paragraph}>
            Das verlässlichste Qualitätsmerkmal ist eine dokumentierte Weiterbildung in der Implantologie. In Deutschland gibt es hierfür zwei anerkannte Wege:
          </p>
          <ul style={{ ...paragraph, paddingLeft: 22, listStyle: "disc" }}>
            <li style={{ marginBottom: 8 }}><strong>DGI-Zertifikat:</strong> Die Deutsche Gesellschaft für Implantologie vergibt Zertifikate auf Basis nachgewiesener Fallzahlen, Fortbildungsstunden und geprüfter klinischer Kenntnisse.</li>
            <li><strong>Tätigkeitsschwerpunkt-Zertifikat</strong> der Bundeszahnärztekammer: Verlangt ebenfalls den Nachweis einer strukturierten Weiterbildung und einer Mindestanzahl dokumentierter Behandlungen.</li>
          </ul>
          <p style={paragraph}>
            Praxen, die mit diesen Zertifikaten werben, haben eine formale Hürde genommen – das schafft eine erste verlässliche Orientierung.
          </p>

          <h3 style={h3Style}>Technische Ausstattung</h3>
          <p style={paragraph}>
            Moderne Implantologie setzt auf digitale Diagnostik. Praxen in Charlottenburg, die mit <strong>digitaler Volumentomographie (DVT)</strong> arbeiten, können den Kieferknochen dreidimensional darstellen und Implantate präziser planen. Ergänzt wird dies häufig durch <strong>computergestützte Implantation</strong> mit individuell gefertigten Bohrschablonen, die das Einsetzen exakter und schonender machen.
          </p>

          <h3 style={h3Style}>Transparenz und Beratungsqualität</h3>
          <p style={paragraph}>
            Seriöse Implantologen nehmen sich Zeit für die Erstberatung. Ein seriöser Behandler erstellt vor jeder Implantatbehandlung einen vollständigen <strong>Heil- und Kostenplan (HKP)</strong>, der alle Leistungen und Materialien einzeln aufschlüsselt. Dieser Plan ist für Sie als Patient kostenlos und unverbindlich – und das Recht darauf ist gesetzlich verankert.
          </p>

          <h2 id="kosten" style={h2Style}>Kosten für Zahnimplantate in Charlottenburg</h2>
          <p style={paragraph}>
            Charlottenburg ist ein innerstädtischer Bezirk mit hohem Mietniveau – das spiegelt sich auch in den Praxiskosten wider. Implantologen rund um den Kurfürstendamm oder Hohenzollerndamm rechnen tendenziell im oberen Bereich der Berliner Preisspanne ab.
          </p>
          <p style={{ ...paragraph, marginBottom: 12, fontWeight: 600 }}>
            Typische Kostenbestandteile in Charlottenburg:
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
                  ["Implantat (Titan, inkl. Einsetzen)", "1.000 – 1.600 €"],
                  ["Implantat-Aufbau (Abutment)", "250 – 550 €"],
                  ["Zahnkrone auf dem Implantat", "700 – 1.500 €"],
                  ["Röntgen / DVT-Diagnostik", "80 – 250 €"],
                  ["Knochenaufbau (falls nötig)", "400 – 1.800 €"],
                ].map(([leistung, kosten], i) => (
                  <tr key={i}>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #eee" }}>{leistung}</td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #eee", textAlign: "right" }}>{kosten}</td>
                  </tr>
                ))}
                <tr style={{ background: CREME_LIGHT, fontWeight: 700 }}>
                  <td style={{ padding: "12px 14px" }}>Gesamt (ohne Knochenaufbau)</td>
                  <td style={{ padding: "12px 14px", textAlign: "right" }}>1.800 – 3.500 €</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={paragraph}>
            Ein Knochenaufbau wird notwendig, wenn der Kieferknochen nach einem Zahnverlust zu stark abgebaut ist, um ein Implantat stabil zu verankern. Ob ein solcher Eingriff nötig ist, lässt sich nur nach einer gründlichen Diagnostik – idealerweise per DVT – beurteilen.
          </p>
          <p style={paragraph}>
            <strong>Tipp:</strong> Holen Sie bei einer größeren Behandlung mindestens zwei Heil- und Kostenpläne ein. Vergleichen Sie nicht nur die Gesamtsumme, sondern auch die einzelnen Positionen – Unterschiede entstehen oft bei der Materialwahl (z. B. Implantatmarke, Keramik vs. Metallkrone) und den Laborkosten.
          </p>

          <h2 id="kassenleistung" style={h2Style}>Kassenleistung und Zuschüsse</h2>
          <p style={paragraph}>
            Die <strong>gesetzliche Krankenversicherung (GKV)</strong> übernimmt in Deutschland keine Kosten für das Implantat selbst – das gilt bundesweit und damit auch in Charlottenburg. Das Implantat zählt nicht zur zahnärztlichen Regelversorgung der Kassen.
          </p>
          <p style={paragraph}>
            Was die Kasse jedoch bezuschusst, ist der <strong>Zahnersatz</strong>, der auf dem Implantat befestigt wird – also in der Regel die Krone. Grundlage ist der sogenannte Festzuschuss, dessen Höhe vom Befund abhängt. Wer sein Bonusheft lückenlos geführt hat, erhält einen erhöhten Zuschuss:
          </p>
          <ul style={{ ...paragraph, paddingLeft: 22, listStyle: "disc" }}>
            <li style={{ marginBottom: 8 }}><strong>5 Jahre lückenlose Vorsorge:</strong> 30 % Erhöhung auf den Festzuschuss</li>
            <li><strong>10 Jahre lückenlose Vorsorge:</strong> 65 % Erhöhung auf den Festzuschuss</li>
          </ul>
          <p style={paragraph}>
            Wer zusätzlich eine <strong>private Zahnzusatzversicherung</strong> abgeschlossen hat, kann je nach Tarif einen Teil der Implantatkosten erstattet bekommen. Wichtig: Die meisten Tarife sehen Wartezeiten von sechs bis zwölf Monaten vor. Ein Abschluss sollte also nicht erst dann erfolgen, wenn ein Implantat bereits absehbar ist.
          </p>

          <h2 id="ablauf" style={h2Style}>Behandlungsablauf beim Implantologen in Charlottenburg</h2>
          <p style={paragraph}>
            Eine Implantatbehandlung ist kein einmaliger Eingriff, sondern ein mehrstufiger Prozess. Wer die einzelnen Phasen kennt, kann realistisch planen – zeitlich wie finanziell.
          </p>

          <h3 style={h3Style}>Erstberatung und Diagnostik</h3>
          <p style={paragraph}>
            Am Anfang steht ein ausführliches Beratungsgespräch. Der Implantologe erhebt den Befund, begutachtet Knochenstruktur und Zahnfleischzustand und erstellt bei Bedarf ein DVT. Auf dieser Grundlage wird der individuelle Behandlungsplan erstellt.
          </p>

          <h3 style={h3Style}>Implantat-Einsetzen</h3>
          <p style={paragraph}>
            Der eigentliche Eingriff findet ambulant unter lokaler Betäubung statt. Das Titanimplantat wird präzise in den Kieferknochen eingebracht – bei computergestützter Implantation mit einer individuellen Bohrschablone. Der Eingriff selbst dauert je nach Befund zwischen 30 und 90 Minuten.
          </p>

          <h3 style={h3Style}>Einheilphase</h3>
          <p style={paragraph}>
            Nach dem Einsetzen beginnt die <strong>Osseointegration</strong> (die natürliche Einheilung des Implantats in den Kieferknochen). Diese Phase dauert in der Regel zwei bis vier Monate und erfordert regelmäßige Kontrolltermine. Erst wenn das Implantat stabil eingewachsen ist, wird der endgültige Zahnersatz befestigt.
          </p>

          <h3 style={h3Style}>Versorgung mit Zahnersatz</h3>
          <p style={paragraph}>
            Im letzten Schritt wird die individuelle Zahnkrone oder Brücke auf dem Implantat verankert. Moderne Laborverfahren ermöglichen dabei hohe Ästhetik und eine natürlich wirkende Optik.
          </p>
        </div>
      </article>

      {/* ── Doctor Grid: Charlottenburger Implantologen ──────────────────── */}
      <section id="charlottenburg-implantologen" style={{ background: CREME_LIGHT, padding: "70px 0", scrollMarginTop: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto 40px", textAlign: "center" }}>
            <p style={{ color: CORAL, fontSize: 13, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 12px" }}>
              Zertifizierte Praxen
            </p>
            <h2 style={{ color: NAVY, fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, lineHeight: 1.2, margin: "0 0 16px" }}>
              {narrowed
                ? `${doctors.length} geprüfte Implantolog${doctors.length === 1 ? "e" : "en"} in Charlottenburg-Wilmersdorf`
                : `Geprüfte Implantologen in Berlin – auch für Charlottenburg`}
            </h2>
            <p style={{ color: NAVY, fontSize: 16, lineHeight: 1.7, margin: 0, opacity: 0.9 }}>
              {narrowed
                ? "Alle hier gelisteten Praxen sind CleanImplant-zertifizierte Zahnärztinnen und Zahnärzte – mit Sitz im Bezirk Charlottenburg-Wilmersdorf."
                : "Aktuell sind in Charlottenburg selbst keine CleanImplant-zertifizierten Praxen gelistet. Diese Berliner Praxen sind gut erreichbar und nehmen auch Patientinnen und Patienten aus Charlottenburg auf."}
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
            Charlottenburg-Wilmersdorf bietet eine ausgezeichnete Ausgangslage für alle, die einen qualifizierten Implantologen in Berlin suchen. Die hohe Praxisdichte entlang des Kurfürstendamms und des Hohenzollerndamms ermöglicht kurze Wege und eine breite Auswahl – entscheidend ist jedoch nicht die Adresse, sondern die Qualifikation des Behandlers und die Transparenz der Kostenplanung.
          </p>
          <p style={paragraph}>
            Lassen Sie sich von mindestens zwei Praxen beraten, bevor Sie sich festlegen. Ein guter Implantologe in Charlottenburg nimmt sich Zeit für Ihre Fragen und legt alle Kosten offen dar – schon vor dem ersten Eingriff.
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
