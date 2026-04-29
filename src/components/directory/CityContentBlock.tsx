import Link from "next/link";

// Städte, für die eine eigene /implantologe-<slug>-Landingpage existiert.
// Bei Treffern wird ein zusätzlicher Cross-Link-CTA eingeblendet.
const CITIES_WITH_IMPLANTOLOGE_LANDING = new Set<string>([
  "berlin",
]);

const NAVY = "#00385E";
const CORAL = "#F4907B";
const PEACH = "#FCD2B2";
const CREME = "#FDF5EE";
const CREME_LIGHT = "#FEF9F5";

const contentWidth: React.CSSProperties = { maxWidth: 820, margin: "0 auto" };
const paragraph: React.CSSProperties = { color: NAVY, fontSize: 16, lineHeight: 1.8, margin: "0 0 18px" };
const h2Style: React.CSSProperties = {
  color: NAVY,
  fontSize: "clamp(22px, 3vw, 28px)",
  fontWeight: 700,
  lineHeight: 1.25,
  margin: "0 0 18px",
  scrollMarginTop: 100,
};

type Props = {
  cityName: string;
  citySlug: string;
  doctorCount: number;
  countryName: string | null;
  regionName: string | null;
};

export default function CityContentBlock({ cityName, citySlug, doctorCount, countryName, regionName }: Props) {
  const hasImplantologeLanding = CITIES_WITH_IMPLANTOLOGE_LANDING.has(citySlug);

  // Stadt-spezifischer Lokalbezug (z. B. "in Bayern" / "in Deutschland")
  const locationSuffix =
    regionName && countryName
      ? `${regionName}, ${countryName}`
      : countryName ?? regionName ?? "Deutschland";

  const faqs: { q: string; a: string }[] = [
    {
      q: `Wie finde ich einen guten Zahnarzt in ${cityName}?`,
      a: `Achten Sie bei der Praxiswahl auf nachgewiesene Qualifikationen, eine moderne Diagnostikausstattung und transparente Kostenpläne. In ${cityName} sind aktuell ${doctorCount} CleanImplant-zertifizierte Zahnarztpraxen gelistet – jede davon hat eine unabhängige Prüfung der verwendeten Implantatsysteme durchlaufen.`,
    },
    {
      q: `Was ist eine CleanImplant-Zertifizierung?`,
      a: `Die CleanImplant Foundation prüft Implantatsysteme unabhängig auf Oberflächenreinheit. Praxen, die ausschließlich oder bevorzugt mit zertifizierten Implantaten arbeiten, können CleanImplant Certified Dentist werden. Für Patientinnen und Patienten ist das ein zusätzliches Qualitätssignal über die reguläre Zulassung hinaus.`,
    },
    {
      q: `Welche Behandlungen bieten die Zahnärzte in ${cityName} an?`,
      a: `Das Behandlungsspektrum reicht von klassischer Zahnerhaltung und Prophylaxe über ästhetische Zahnmedizin bis hin zu Implantologie und Knochenaufbau. Die genauen Schwerpunkte entnehmen Sie den einzelnen Praxisprofilen oben – jede Praxis weist ihre Fachgebiete dort einzeln aus.`,
    },
    {
      q: `Übernimmt die Krankenkasse die Kosten?`,
      a: `Die gesetzliche Krankenversicherung übernimmt zahnerhaltende Regelleistungen vollständig. Privatleistungen wie Implantate, hochwertige Füllungen oder professionelle Zahnreinigung müssen meist selbst getragen werden – Bonusheft und private Zahnzusatzversicherung können hier aber spürbar entlasten.`,
    },
    {
      q: `Wie vereinbare ich einen Termin?`,
      a: `Sie können direkt aus dem Praxis-Profil heraus Kontakt aufnehmen – jede Praxis bietet ein Kontaktformular oder einen Online-Buchungslink. Bei akuten Beschwerden wenden Sie sich bitte direkt telefonisch an die jeweilige Praxis.`,
    },
  ];

  return (
    <section style={{ background: "#fff", padding: "60px 24px 70px" }}>
      <div style={contentWidth}>
        <h2 id="ueber-cityName" style={h2Style}>
          Zahnärzte in {cityName}: Versorgung & Qualität
        </h2>
        <p style={paragraph}>
          {cityName} verfügt über eine breite zahnmedizinische Versorgungslandschaft mit Praxen unterschiedlichster Schwerpunkte – von klassischer Allgemeinzahnheilkunde über Prophylaxe bis hin zu hochspezialisierter Implantologie. {doctorCount > 1
            ? `Aktuell sind ${doctorCount} Zahnärztinnen und Zahnärzte in ${cityName} gelistet, die ihre Implantatversorgung mit unabhängig geprüften, CleanImplant-zertifizierten Implantatsystemen durchführen.`
            : `Aktuell ist eine Praxis in ${cityName} gelistet, die ihre Implantatversorgung mit unabhängig geprüften, CleanImplant-zertifizierten Implantatsystemen durchführt.`}
        </p>
        <p style={paragraph}>
          Wer in {cityName} eine Zahnarztpraxis sucht, profitiert von der allgemeinen deutschen Versorgungsstruktur: hohe Praxisdichte, gute ÖPNV-Anbindung und ein etablierter Wettbewerb sorgen für transparente Kostenpläne und kurze Wartezeiten. Die hier aufgelisteten Praxen liegen in {cityName} und Umgebung ({locationSuffix}).
        </p>

        <h3 style={{ ...h2Style, fontSize: 20, margin: "32px 0 14px" }}>
          Was Zahnärzte in {cityName} auszeichnet
        </h3>
        <ul style={{ ...paragraph, paddingLeft: 22, listStyle: "disc", margin: "0 0 24px" }}>
          <li style={{ marginBottom: 8 }}>
            <strong>Geprüfte Materialien:</strong> Praxen, die mit CleanImplant-zertifizierten Implantaten arbeiten, setzen auf nachweislich rückstandsarme Oberflächen – ein Risikofaktor weniger für spätere Komplikationen wie Periimplantitis.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>Moderne Diagnostik:</strong> Viele Praxen in {cityName} nutzen digitale Volumentomographie (DVT) für eine dreidimensionale Planung, was die Sicherheit von Eingriffen deutlich erhöht.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>Transparente Kosten:</strong> Vor jedem größeren Eingriff erhalten Sie einen schriftlichen Heil- und Kostenplan (HKP), der alle Leistungen einzeln aufschlüsselt – kostenlos und unverbindlich.
          </li>
          <li>
            <strong>Fachliche Spezialisierung:</strong> In den einzelnen Profilen oben sehen Sie die Behandlungsschwerpunkte jeder Praxis – etwa Implantologie, ästhetische Zahnmedizin, Parodontologie oder Kieferorthopädie.
          </li>
        </ul>

        {hasImplantologeLanding && (
          <div
            style={{
              background: `linear-gradient(135deg, ${PEACH} 0%, ${CREME} 100%)`,
              borderRadius: 12,
              padding: "22px 26px",
              margin: "12px 0 32px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div style={{ flex: "1 1 280px" }}>
              <p style={{ color: CORAL, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 6px" }}>
                Spezialisten gesucht?
              </p>
              <p style={{ color: NAVY, fontSize: 16, fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
                Speziell für Zahnimplantate haben wir einen ausführlichen Ratgeber für {cityName} – mit Kostenübersicht, Bezirken und Auswahl-Kriterien.
              </p>
            </div>
            <Link
              href={`/implantologe-${citySlug}`}
              style={{
                background: NAVY,
                color: "#fff",
                padding: "12px 22px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Zum Implantologe-{cityName}-Ratgeber →
            </Link>
          </div>
        )}

        <h3 style={{ ...h2Style, fontSize: 20, margin: "32px 0 14px" }}>
          Häufig gestellte Fragen zur Zahnarztsuche in {cityName}
        </h3>

        <style>{`
          .city-faq summary { list-style: none; }
          .city-faq summary::-webkit-details-marker { display: none; }
          .city-faq summary::marker { content: ""; }
          .city-faq-chevron { transition: transform 0.25s ease; flex-shrink: 0; }
          .city-faq[open] .city-faq-chevron { transform: rotate(180deg); }
          .city-faq:hover .city-faq-chevron { color: ${CORAL}; }
        `}</style>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map((f, i) => (
            <details
              key={i}
              className="city-faq"
              style={{
                background: CREME_LIGHT,
                borderRadius: 8,
                padding: "16px 20px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              <summary style={{ color: NAVY, fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <span>{f.q}</span>
                <svg className="city-faq-chevron" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <p style={{ color: NAVY, fontSize: 14, lineHeight: 1.75, margin: "10px 0 0", opacity: 0.9 }}>
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Damit die Page-Komponente FAQPage-JSON-LD ergänzen kann, ohne die Texte zu duplizieren. */
export function buildCityFaqJsonLd(cityName: string, doctorCount: number) {
  const faqs = [
    {
      q: `Wie finde ich einen guten Zahnarzt in ${cityName}?`,
      a: `Achten Sie bei der Praxiswahl auf nachgewiesene Qualifikationen, eine moderne Diagnostikausstattung und transparente Kostenpläne. In ${cityName} sind aktuell ${doctorCount} CleanImplant-zertifizierte Zahnarztpraxen gelistet – jede davon hat eine unabhängige Prüfung der verwendeten Implantatsysteme durchlaufen.`,
    },
    {
      q: `Was ist eine CleanImplant-Zertifizierung?`,
      a: `Die CleanImplant Foundation prüft Implantatsysteme unabhängig auf Oberflächenreinheit. Praxen, die ausschließlich oder bevorzugt mit zertifizierten Implantaten arbeiten, können CleanImplant Certified Dentist werden. Für Patientinnen und Patienten ist das ein zusätzliches Qualitätssignal über die reguläre Zulassung hinaus.`,
    },
    {
      q: `Welche Behandlungen bieten die Zahnärzte in ${cityName} an?`,
      a: `Das Behandlungsspektrum reicht von klassischer Zahnerhaltung und Prophylaxe über ästhetische Zahnmedizin bis hin zu Implantologie und Knochenaufbau.`,
    },
    {
      q: `Übernimmt die Krankenkasse die Kosten?`,
      a: `Die gesetzliche Krankenversicherung übernimmt zahnerhaltende Regelleistungen vollständig. Privatleistungen wie Implantate, hochwertige Füllungen oder professionelle Zahnreinigung müssen meist selbst getragen werden – Bonusheft und private Zahnzusatzversicherung können hier aber spürbar entlasten.`,
    },
    {
      q: `Wie vereinbare ich einen Termin?`,
      a: `Sie können direkt aus dem Praxis-Profil heraus Kontakt aufnehmen – jede Praxis bietet ein Kontaktformular oder einen Online-Buchungslink.`,
    },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
