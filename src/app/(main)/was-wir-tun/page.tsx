import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Was wir tun – mycleandent",
  description:
    "Die CleanImplant Foundation bietet Zahnmedizinern eine umfangreiche Datenbank mit Analysen zu Zahnimplantaten.",
};

export default function WasWirTunPage() {
  return (
    <section style={{ background: "#FEF9F5", padding: "80px 0 60px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

        {/* Headline + Intro */}
        <h1 style={{ color: "#00385E", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, lineHeight: 1.2, margin: "0 0 28px" }}>
          Was wir tun
        </h1>
        <p style={{ color: "#00385E", fontSize: 15, lineHeight: 1.9, maxWidth: 900, margin: "0 0 60px" }}>
          Auf einer professionellen Plattform bietet die unabhängige Initiative der CleanImplant Foundation
          Zahnmedizinern eine umfangreiche Datenbank mit Analysen zu Zahnimplantaten, um sie bei der Auswahl
          der im Rahmen des CleanImplant Prüfverfahrens als sauber qualifizierten Zahnimplantate für ihre
          tägliche Arbeit zu unterstützen. Finden Sie Ihren qualifizierten, von CleanImplant zertifizierten
          Zahnarzt.{" "}
          <sup style={{ fontSize: 11 }}>*</sup>
        </p>

        {/* 50/50 split */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>

          {/* Left – „Saubere" Zahnimplantate */}
          <div>
            <h2 style={{ color: "#F5907B", fontSize: 22, fontWeight: 700, lineHeight: 1.3, margin: "0 0 20px" }}>
              „Saubere" Zahnimplantate – für Ihr sicheres Lächeln
            </h2>
            <p style={{ color: "#00385E", fontSize: 15, lineHeight: 1.9, margin: "0 0 16px" }}>
              Zahnärztinnen und Zahnärzten stehen heute verschiedene Implantatsysteme zur Verfügung, zu denen
              ergänzende unabhängige Prüfinformationen vorliegen. Für die Auswahl eines Implantats mag es
              hilfreich sein, dass der behandelnde Zahnarzt neben den Zulassungsanforderungen auch die
              Ergebnisse unabhängiger Prüfverfahren berücksichtigt, in denen die Implantate auf mögliche
              Produktionsrückstände untersucht werden.
            </p>
            <p style={{ color: "#00385E", fontSize: 15, lineHeight: 1.9, margin: "0 0 16px" }}>
              Zahnärzte und Kliniken, deren Implantatsysteme im CleanImplant-Prüfverfahren bewertet wurden,
              können die dort erhobenen Analysedaten als zusätzliche fachliche Orientierung für ihre tägliche
              Praxis heranziehen. Für Sie bedeutet das: Ihr Zahnarzt trifft eine bewusste Entscheidung für
              mehr Transparenz und Sicherheit im Bereich der Implantatauswahl.
            </p>
            <p style={{ color: "#00385E", fontSize: 15, lineHeight: 1.9, margin: 0 }}>
              Finden Sie auf dieser Seite von CleanImplant Foundation zertifizierte Zahnärzte in Ihrer Nähe.
            </p>
          </div>

          {/* Right – Zahnimplantate und Verunreinigungen */}
          <div>
            <h2 style={{ color: "#F5907B", fontSize: 22, fontWeight: 700, lineHeight: 1.3, margin: "0 0 20px" }}>
              Zahnimplantate und Verunreinigungen
            </h2>
            <p style={{ color: "#00385E", fontSize: 15, lineHeight: 1.9, margin: "0 0 16px" }}>
              Viele Patienten gehen davon aus, dass ein steril verpacktes Implantat automatisch auch frei von
              Rückständen aus dem Produktionsprozess ist. Tatsächlich beziehen sich Angaben auf der Verpackung
              zur Sterilität oder zur regulatorischen Zulassung – etwa durch eine CE-Kennzeichnung oder eine
              FDA-Zulassung – auf unterschiedliche Anforderungen. Diese Angaben erlauben für sich genommen
              keine weitergehenden Aussagen zu spezifischen Oberflächeneigenschaften oder zur besonderen
              Sauberkeit bzw. zur Abwesenheit von Produktionsrückständen eines Implantats.
            </p>
            <p style={{ color: "#00385E", fontSize: 15, lineHeight: 1.9, margin: "0 0 16px" }}>
              In wissenschaftlichen Studien der Universität Zürich wurde unlängst bestätigt, dass bestimmte
              Rückstände aus Produktionsprozessen – abhängig von Art und Ausprägung – negative Auswirkungen
              auf das umliegende Gewebe haben. Vor diesem Hintergrund ist es für Zahnärztinnen und Zahnärzte
              sinnvoll, ergänzend zu den gesetzlichen Zulassungsanforderungen auf zusätzliche unabhängige
              Prüfinformationen zurückzugreifen.
            </p>
            <p style={{ color: "#00385E", fontSize: 15, lineHeight: 1.9, margin: 0 }}>
              Das CleanImplant-Prüfverfahren stellt solche ergänzenden Informationen bereit. In unabhängigen
              Prüflaboratorien werden Implantatsysteme anhand definierter Kriterien auf bestimmte
              Oberflächeneigenschaften und mögliche Produktionsrückstände gründlich untersucht. Die Ergebnisse
              dieser Prüfungen dienen der Transparenz und können Zahnärzte bei ihrer fachlichen
              Entscheidungsfindung unterstützen.
            </p>
          </div>

        </div>

        {/* Footnote */}
        <p style={{ color: "#00385E", fontSize: 12, lineHeight: 1.7, textAlign: "center", marginTop: 60, opacity: 0.7 }}>
          * Die Zertifizierung zum CleanImplant Certified Dentist ist optionaler Teil der entgeltlichen
          Fördermitgliedschaft der CleanImplant Foundation. Nur Fördermitglieder, die nachweislich Nutzer von
          von CleanImplant überprüften und ausgezeichneten Implantatsystemen sind, können auf dieser
          Informationsseite kostenfrei gelistet werden.
        </p>

      </div>
    </section>
  );
}
