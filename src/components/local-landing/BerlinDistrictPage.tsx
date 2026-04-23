import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DoctorCard from "@/components/directory/DoctorCard";
import type { DentistWithRelations } from "@/types";
import type { BerlinDistrict } from "@/lib/berlin-districts";

// ── Design-Tokens (identisch zu den anderen Lokal-Landingpages) ─────────────
const NAVY = "#00385E";
const CORAL = "#F4907B";
const PEACH = "#FCD2B2";
const CREME_LIGHT = "#FEF9F5";
const CREME = "#FDF5EE";

const contentWidth: React.CSSProperties = { maxWidth: 820, margin: "0 auto", padding: "0 24px" };
const paragraph: React.CSSProperties = { color: NAVY, fontSize: 16, lineHeight: 1.8, margin: "0 0 20px" };
const h2Style: React.CSSProperties = {
  color: NAVY,
  fontSize: "clamp(22px, 3vw, 30px)",
  fontWeight: 700,
  lineHeight: 1.25,
  margin: "56px 0 20px",
  scrollMarginTop: 100,
};
const h3Style: React.CSSProperties = { color: NAVY, fontSize: 18, fontWeight: 700, margin: "28px 0 10px" };

// ── Daten-Loader ────────────────────────────────────────────────────────────
async function getDoctors(d: BerlinDistrict): Promise<{ doctors: DentistWithRelations[]; narrowed: boolean }> {
  if (d.zipPrefixes && d.zipPrefixes.length > 0) {
    const narrowed = await prisma.dentistProfile.findMany({
      where: {
        active: true,
        citySlug: "berlin",
        OR: d.zipPrefixes.map((zip) => ({ zip: { startsWith: zip } })),
      },
      include: { categories: { include: { category: true } }, socialLinks: true },
      orderBy: [{ featured: "desc" }, { lastName: "asc" }],
    });
    if (narrowed.length > 0) {
      return { doctors: narrowed as unknown as DentistWithRelations[], narrowed: true };
    }
  }

  const all = await prisma.dentistProfile.findMany({
    where: { active: true, citySlug: "berlin" },
    include: { categories: { include: { category: true } }, socialLinks: true },
    orderBy: [{ featured: "desc" }, { lastName: "asc" }],
  });
  return { doctors: all as unknown as DentistWithRelations[], narrowed: false };
}

// ── Rendered Page ───────────────────────────────────────────────────────────
export default async function BerlinDistrictPage({ district: d }: { district: BerlinDistrict }) {
  const { doctors, narrowed } = await getDoctors(d);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${d.keyphrase} – zertifiziert & in Ihrer Nähe`,
    description: `Zertifizierte Implantologen in ${d.districtName} – Überblick über Qualifikation, Kosten und Behandlungsablauf.`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.mycleandent.de/implantologe-${d.slug}` },
    inLanguage: "de-DE",
  };

  const faqs: { q: string; a: string }[] = [
    {
      q: `Wie finde ich einen zertifizierten Implantologen in ${d.districtName}?`,
      a: `Achten Sie auf Mitgliedschaften in der Deutschen Gesellschaft für Implantologie (DGI) oder das Tätigkeitsschwerpunkt-Zertifikat der Bundeszahnärztekammer. Seriöse Praxen in ${d.districtName} weisen diese Qualifikationen transparent aus und erstellen vor jeder Behandlung einen kostenlosen Heil- und Kostenplan.`,
    },
    {
      q: `Was kostet ein Zahnimplantat beim Implantologen in ${d.districtName}?`,
      a: `Die Gesamtkosten für ein einzelnes Zahnimplantat liegen in ${d.districtName} in der Regel zwischen ${d.priceMin} und ${d.priceMax} €. Der genaue Preis hängt vom verwendeten Implantatsystem, den Laborkosten für die Krone sowie eventuell notwendigen Vorbehandlungen wie einem Knochenaufbau ab.`,
    },
    {
      q: "Übernimmt meine Krankenkasse die Implantatkosten?",
      a: "Die gesetzliche Krankenversicherung (GKV) übernimmt das Implantat selbst nicht. Sie bezuschusst jedoch den Zahnersatz auf dem Implantat über den Festzuschuss. Wer das Bonusheft lückenlos geführt hat, erhält einen erhöhten Zuschuss von bis zu 65 %.",
    },
    {
      q: `Wie lange dauert eine Implantatbehandlung in ${d.districtName}?`,
      a: "Die Gesamtbehandlung erstreckt sich in der Regel über drei bis sechs Monate. Der größte Zeitanteil entfällt auf die Einheilphase des Implantats im Kieferknochen (Osseointegration). Der eigentliche Eingriff selbst ist ambulant und dauert je nach Befund 30 bis 90 Minuten.",
    },
    {
      q: `Gibt es in ${d.districtName} auch günstigere Implantologen?`,
      a: "Innerhalb des Bezirks gibt es Preisunterschiede zwischen den einzelnen Praxen. Ein transparenter Heil- und Kostenplan, der alle Positionen einzeln auflistet, ermöglicht einen fairen Vergleich. Holen Sie mindestens zwei Angebote ein, bevor Sie sich entscheiden.",
    },
    {
      q: `Was ist der Unterschied zwischen einem Zahnarzt und einem Implantologen in ${d.districtName}?`,
      a: 'Jeder Zahnarzt darf in Deutschland Implantate setzen – die Bezeichnung „Implantologe" ist gesetzlich nicht geschützt. Ein echter Spezialist verfügt über eine nachgewiesene Zusatzqualifikation, dokumentierte Fallzahlen und ist idealerweise Mitglied in einer Fachgesellschaft wie der DGI. Fragen Sie im Zweifel direkt nach diesen Nachweisen.',
    },
    {
      q: `Bietet ein Implantologe in ${d.districtName} auch Sofortimplantate an?`,
      a: `Einige spezialisierte Praxen in ${d.districtName} bieten Sofortimplantate an – dabei wird das Implantat direkt nach der Zahnentfernung eingesetzt. Diese Methode ist nicht für alle Patienten geeignet und setzt einen ausreichenden Knochenbestand sowie das Fehlen aktiver Entzündungen voraus. Eine individuelle Diagnostik ist zwingend notwendig.`,
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

      {/* Hero */}
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
            Lokaler Ratgeber · Berlin · {d.districtName}
          </p>
          <h1 style={{ color: NAVY, fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 20px", maxWidth: 820 }}>
            {d.keyphrase} – zertifiziert & in Ihrer Nähe
          </h1>
          <p style={{ color: NAVY, fontSize: 18, lineHeight: 1.6, maxWidth: 780, margin: "0 0 32px", opacity: 0.9 }}>
            {d.districtName} ist Teil des Berliner Bezirks {d.bezirk} und bietet seinen Einwohnerinnen und Einwohnern eine zunehmend gute zahnmedizinische Versorgung. Spezialisierte Praxen finden sich besonders {d.keyAddresses}.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a href="#praxen" style={{ background: CORAL, color: "#fff", padding: "14px 26px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-block" }}>
              Direkt zu den Praxen →
            </a>
            <Link href="/implantologe-berlin" style={{ background: "transparent", color: NAVY, padding: "14px 26px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none", border: `2px solid ${NAVY}`, display: "inline-block" }}>
              Berlin – alle Bezirke
            </Link>
          </div>
        </div>
      </section>

      {/* Wichtigstes + TOC */}
      <section style={{ background: CREME_LIGHT, padding: "50px 0" }}>
        <div style={contentWidth}>
          <div style={{ background: "#fff", borderLeft: `4px solid ${CORAL}`, padding: "24px 28px", borderRadius: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <h2 style={{ color: NAVY, fontSize: 18, fontWeight: 700, margin: "0 0 14px" }}>Das Wichtigste zusammengefasst</h2>
            <ul style={{ margin: 0, paddingLeft: 22, color: NAVY, fontSize: 15, lineHeight: 1.75 }}>
              <li style={{ marginBottom: 8 }}>
                <strong>{d.keyphrase}:</strong> {d.districtName} bietet eine solide Versorgung mit spezialisierten Zahnarztpraxen – besonders {d.keyAddresses} sind gut erreichbare Anlaufstellen zu finden.
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Zertifizierung:</strong> Achten Sie auf Mitgliedschaft in der Deutschen Gesellschaft für Implantologie (DGI) oder ein anerkanntes Tätigkeitsschwerpunkt-Zertifikat der Bundeszahnärztekammer.
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Kosten:</strong> Ein Zahnimplantat kostet in {d.districtName} in der Regel zwischen {d.priceMin} und {d.priceMax} € – abhängig von Praxis, Implantatsystem und notwendigen Vorbehandlungen.
              </li>
              <li>
                <strong>Kassenleistung:</strong> Die gesetzliche Krankenversicherung (GKV) übernimmt das Implantat selbst nicht, bezuschusst aber den Zahnersatz darauf über den Festzuschuss.
              </li>
            </ul>
          </div>

          <nav aria-label="Inhaltsverzeichnis" style={{ marginTop: 36 }}>
            <h2 style={{ color: NAVY, fontSize: 16, fontWeight: 700, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 }}>
              Inhaltsverzeichnis
            </h2>
            <ol style={{ color: NAVY, fontSize: 15, lineHeight: 1.9, paddingLeft: 22, margin: 0 }}>
              <li><a href="#versorgung" style={{ color: NAVY }}>Implantologie in {d.districtName} – Versorgung im Überblick</a></li>
              <li><a href="#kriterien" style={{ color: NAVY }}>{d.keyphrase} finden – diese Kriterien zählen</a></li>
              <li><a href="#kosten" style={{ color: NAVY }}>Kosten für Zahnimplantate in {d.districtName}</a></li>
              <li><a href="#kassenleistung" style={{ color: NAVY }}>Kassenleistung und Zuschüsse</a></li>
              <li><a href="#ablauf" style={{ color: NAVY }}>Behandlungsablauf beim Implantologen</a></li>
              <li><a href="#praxen" style={{ color: NAVY }}>Zertifizierte Praxen</a></li>
              <li><a href="#faq" style={{ color: NAVY }}>Häufig gestellte Fragen</a></li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Main content */}
      <article style={{ background: "#fff", padding: "50px 0 70px" }}>
        <div style={contentWidth}>
          <h2 id="versorgung" style={h2Style}>Implantologie in {d.districtName} – Versorgung im Überblick</h2>
          <p style={paragraph}>
            {d.districtName} ist Teil des Berliner Bezirks {d.bezirk} und bietet seinen Einwohnerinnen und Einwohnern eine zunehmend gute zahnmedizinische Versorgung. Wer einen Implantologen in {d.regionDescription} sucht, muss in der Regel keine weiten Wege auf sich nehmen – spezialisierte Praxen finden sich {d.keyAddresses}.
          </p>
          <p style={paragraph}>
            Ein wesentlicher Vorteil einer ortsnahen Praxis liegt im Behandlungsablauf selbst: Eine Implantatbehandlung erstreckt sich über mehrere Monate und umfasst mehrere Termine – von der Erstdiagnostik über das Einsetzen des Implantats bis zur abschließenden Versorgung mit Zahnersatz. Wer eine Praxis in der eigenen Nachbarschaft wählt, spart Zeit und macht die Nachsorgetermine deutlich entspannter.
          </p>
          <p style={paragraph}>
            Die Versorgungslage in {d.districtName} profitiert dabei von der allgemeinen Berliner Struktur: Viele Praxen sind gut mit öffentlichen Verkehrsmitteln erreichbar, und der Wettbewerb unter den Anbietern sorgt für eine insgesamt gute Preis-Leistungs-Transparenz.
          </p>

          <h2 id="kriterien" style={h2Style}>{d.keyphrase} finden – diese Kriterien zählen</h2>
          <p style={paragraph}>
            <strong>{d.keyphrase}</strong> ist kein gesetzlich geschützter Begriff – grundsätzlich darf jeder niedergelassene Zahnarzt Implantate setzen, unabhängig von einer Spezialisierung. Umso wichtiger ist es, bei der Wahl der Praxis auf konkrete und überprüfbare Qualitätsmerkmale zu achten.
          </p>

          <h3 style={h3Style}>Fachliche Qualifikation</h3>
          <p style={paragraph}>
            Ein verlässlicher Hinweis auf echte Expertise ist die <strong>Mitgliedschaft in der Deutschen Gesellschaft für Implantologie (DGI)</strong> oder das Tätigkeitsschwerpunkt-Zertifikat der Bundeszahnärztekammer. Beide Auszeichnungen setzen eine dokumentierte Weiterbildung, nachgewiesene Fallzahlen und eine fachliche Prüfung voraus. Praxen, die diese Qualifikationen ausweisen, haben eine formale Schwelle genommen, die über die reine Approbation hinausgeht.
          </p>

          <h3 style={h3Style}>Technische Ausstattung</h3>
          <p style={paragraph}>
            Moderne Implantatbehandlungen basieren auf präziser Diagnostik. Praxen mit <strong>digitaler Volumentomographie (DVT)</strong> können den Kieferknochen dreidimensional darstellen und die Implantatposition exakt planen – das erhöht die Sicherheit des Eingriffs und reduziert Komplikationsrisiken. Ergänzend ermöglicht die computergestützte Implantation mit individuellen Bohrschablonen eine noch genauere Ausführung.
          </p>

          <h3 style={h3Style}>Transparente Kostenplanung</h3>
          <p style={paragraph}>
            Vor jeder Implantatbehandlung haben Sie als Patient gesetzlichen Anspruch auf einen schriftlichen <strong>Heil- und Kostenplan (HKP)</strong>. Dieser muss alle Leistungen einzeln ausweisen – Implantatkörper, Aufbau, Krone, Röntgen und eventuelle Voruntersuchungen. Ein seriöser Implantologe in {d.districtName} erstellt diesen Plan kostenlos und ohne Verbindlichkeit.
          </p>

          <h2 id="kosten" style={h2Style}>Kosten für Zahnimplantate in {d.districtName}</h2>
          <p style={paragraph}>
            Die Kosten für ein Zahnimplantat in {d.districtName} setzen sich aus mehreren Einzelleistungen zusammen. Abhängig von der Praxis, dem verwendeten Implantatsystem und dem individuellen Behandlungsbedarf können die Gesamtkosten erheblich variieren.
          </p>
          <p style={{ ...paragraph, marginBottom: 12, fontWeight: 600 }}>Typische Kostenbestandteile:</p>
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
                  ["Implantat (Titan, inkl. Einsetzen)", `${d.implantPriceMin} – ${d.implantPriceMax} €`],
                  ["Implantat-Aufbau (Abutment)", "200 – 500 €"],
                  ["Zahnkrone auf dem Implantat", "650 – 1.400 €"],
                  ["Röntgen / DVT-Diagnostik", "60 – 220 €"],
                  ["Knochenaufbau (falls nötig)", "350 – 1.600 €"],
                ].map(([leistung, kosten], i) => (
                  <tr key={i}>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #eee" }}>{leistung}</td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #eee", textAlign: "right" }}>{kosten}</td>
                  </tr>
                ))}
                <tr style={{ background: CREME_LIGHT, fontWeight: 700 }}>
                  <td style={{ padding: "12px 14px" }}>Gesamt (ohne Knochenaufbau)</td>
                  <td style={{ padding: "12px 14px", textAlign: "right" }}>{d.priceMin} – {d.priceMax} €</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={paragraph}>
            Ob ein Knochenaufbau erforderlich ist, lässt sich erst nach einer gründlichen Diagnostik beurteilen. Wer längere Zeit ohne Implantat gelebt hat, weist häufig einen gewissen Knochenschwund auf – das kann den Behandlungsumfang und damit die Kosten erhöhen.
          </p>
          <p style={paragraph}>
            <strong>Empfehlung:</strong> Holen Sie bei größeren Behandlungen mindestens zwei Heil- und Kostenpläne ein und vergleichen Sie die Positionen im Detail – nicht nur die Gesamtsumme. Oft liegen die Unterschiede bei Materialwahl und Laborkosten.
          </p>

          <h2 id="kassenleistung" style={h2Style}>Kassenleistung und Zuschüsse</h2>
          <p style={paragraph}>
            Die <strong>gesetzliche Krankenversicherung (GKV)</strong> übernimmt die Kosten für das eigentliche Zahnimplantat in Deutschland grundsätzlich nicht. Das Implantat gilt als nicht zur Regelversorgung gehörig – unabhängig davon, ob die Behandlung in {d.districtName} oder anderswo in Berlin stattfindet.
          </p>
          <p style={paragraph}>
            Was die Kasse bezuschusst, ist der <strong>Zahnersatz auf dem Implantat</strong> – also in der Regel die Krone. Grundlage ist der Festzuschuss, der vom Befund abhängt und durch ein lückenlos geführtes Bonusheft erhöht werden kann:
          </p>
          <ul style={{ ...paragraph, paddingLeft: 22, listStyle: "disc" }}>
            <li style={{ marginBottom: 8 }}><strong>5 Jahre lückenlose Vorsorge:</strong> 30 % Erhöhung auf den Festzuschuss</li>
            <li><strong>10 Jahre lückenlose Vorsorge:</strong> 65 % Erhöhung auf den Festzuschuss</li>
          </ul>
          <p style={paragraph}>
            Wer eine <strong>private Zahnzusatzversicherung</strong> besitzt, kann je nach Tarif einen Teil der Implantatkosten erstattet bekommen. Wartezeiten von sechs bis zwölf Monaten sind dabei die Regel – ein Abschluss sollte daher nicht erst dann erfolgen, wenn ein Implantat bereits konkret geplant ist.
          </p>

          <h2 id="ablauf" style={h2Style}>Behandlungsablauf beim Implantologen in {d.districtName}</h2>

          <h3 style={h3Style}>Erstberatung und Diagnostik</h3>
          <p style={paragraph}>
            Die Behandlung beginnt mit einem ausführlichen Beratungsgespräch. Der Implantologe untersucht den Zahnstatus, prüft den Knochenstatus und erstellt bei Bedarf ein DVT zur dreidimensionalen Planung. Darauf aufbauend wird ein individueller Behandlungsplan erstellt – inklusive Heil- und Kostenplan.
          </p>

          <h3 style={h3Style}>Einsetzen des Implantats</h3>
          <p style={paragraph}>
            Der eigentliche Eingriff findet ambulant unter lokaler Betäubung statt. Das Titanimplantat wird präzise in den Kieferknochen eingebracht. Bei computergestützter Implantation mit Bohrschablone ist der Eingriff besonders exakt und gewebeschonend. Die Dauer liegt je nach Befund zwischen 30 und 90 Minuten.
          </p>

          <h3 style={h3Style}>Einheilung und Nachsorge</h3>
          <p style={paragraph}>
            Nach dem Einsetzen beginnt die <strong>Osseointegration</strong> (die natürliche Einheilung des Implantats in den Kieferknochen) – eine Phase von etwa zwei bis vier Monaten, in der das Implantat stabil mit dem Knochen verwächst. Regelmäßige Kontrolltermine in der Praxis begleiten diesen Prozess.
          </p>

          <h3 style={h3Style}>Abschluss mit Zahnersatz</h3>
          <p style={paragraph}>
            Erst wenn das Implantat vollständig eingeheilt ist, wird der endgültige Zahnersatz – in der Regel eine Krone – eingesetzt. Moderne Laborverfahren ermöglichen dabei eine natürlich wirkende Optik, die sich harmonisch ins Gesamtbild einfügt.
          </p>
        </div>
      </article>

      {/* Doctor Grid */}
      <section id="praxen" style={{ background: CREME_LIGHT, padding: "70px 0", scrollMarginTop: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto 40px", textAlign: "center" }}>
            <p style={{ color: CORAL, fontSize: 13, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 12px" }}>
              Zertifizierte Praxen
            </p>
            <h2 style={{ color: NAVY, fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, lineHeight: 1.2, margin: "0 0 16px" }}>
              {narrowed
                ? `${doctors.length} geprüfte Implantolog${doctors.length === 1 ? "e" : "en"} in ${d.districtName}`
                : `Geprüfte Implantologen in Berlin – auch für ${d.districtName}`}
            </h2>
            <p style={{ color: NAVY, fontSize: 16, lineHeight: 1.7, margin: 0, opacity: 0.9 }}>
              {narrowed
                ? `Alle hier gelisteten Praxen sind CleanImplant-zertifizierte Zahnärztinnen und Zahnärzte – mit Sitz in ${d.districtName}.`
                : `Aktuell sind in ${d.districtName} selbst keine CleanImplant-zertifizierten Praxen gelistet. Diese Berliner Praxen sind gut erreichbar und nehmen auch Patientinnen und Patienten aus ${d.districtName} auf.`}
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
            <Link href="/zahnarzt/berlin" style={{ display: "inline-block", background: NAVY, color: "#fff", padding: "14px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
              Alle Zahnärzte in Berlin ansehen →
            </Link>
          </div>
        </div>
      </section>

      {/* Fazit */}
      <section style={{ background: "#fff", padding: "60px 0" }}>
        <div style={contentWidth}>
          <h2 style={h2Style}>Fazit</h2>
          <p style={paragraph}>
            Wer einen <strong>{d.keyphrase}</strong> sucht, findet in {d.regionDescription} qualifizierte Spezialisten mit kurzen Wegen und guter ÖPNV-Anbindung. Entscheidend bei der Praxiswahl sind nachgewiesene Qualifikationen, moderne Diagnostikausstattung und eine transparente Kostenplanung vor dem ersten Eingriff.
          </p>
          <p style={paragraph}>
            Lassen Sie sich von mindestens zwei Praxen beraten und vergleichen Sie die Heil- und Kostenpläne im Detail. Ein guter Implantologe in {d.districtName} nimmt sich Zeit für Ihre Fragen – und gibt Ihnen alle Informationen an die Hand, die Sie für eine fundierte Entscheidung brauchen.
          </p>
        </div>
      </section>

      {/* FAQ */}
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
                style={{ background: "#fff", borderRadius: 8, padding: "18px 22px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
              >
                <summary style={{ color: NAVY, fontWeight: 700, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                  <span>{f.q}</span>
                  <svg className="faq-chevron" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <p style={{ color: NAVY, fontSize: 15, lineHeight: 1.75, margin: "12px 0 0", opacity: 0.9 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
