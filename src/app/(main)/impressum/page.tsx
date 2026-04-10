import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum – mycleandent",
};

export default function ImpressumPage() {
  return (
    <section style={{ background: "#FEF9F5", padding: "80px 0 100px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px" }}>
        <h1 style={{ color: "#00385E", fontSize: 32, fontWeight: 700, marginBottom: 40, marginTop: 0 }}>
          Impressum
        </h1>

        <Block title="Angaben gemäß § 5 TMG">
          <p>CleanImplant Foundation CIF GmbH</p>
          <p>Pariser Platz 4a</p>
          <p>10117 Berlin</p>
          <br />
          <p>Handelsregister: HRB 179652 B</p>
          <p>Registergericht: Amtsgericht Charlottenburg</p>
          <br />
          <p><strong>Vertreten durch:</strong></p>
          <p>Dr. Dirk Duddeck</p>
        </Block>

        <Block title="Kontakt">
          <p>Telefon: +49 (0) 30 2000 30190</p>
          <p>E-Mail: <a href="mailto:info@cleanimplant.org" style={{ color: "#F5907B" }}>info@cleanimplant.org</a></p>
        </Block>

        <Block title="Redaktionell verantwortlich">
          <p>CleanImplant Foundation CIF GmbH</p>
          <p>Pariser Platz 4a, 10117 Berlin</p>
        </Block>

        <Block title="Verbraucherstreitbeilegung / Universalschlichtungsstelle">
          <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </Block>

        <Block title="Zentrale Kontaktstelle nach dem Digital Services Act – DSA (Verordnung (EU) 2022/2065)">
          <p>
            Unsere zentrale Kontaktstelle für Nutzer und Behörden nach Art. 11, 12 DSA erreichen
            Sie wie folgt:
          </p>
          <br />
          <p>E-Mail: <a href="mailto:info@cleanimplant.org" style={{ color: "#F5907B" }}>info@cleanimplant.org</a></p>
          <p>Telefon: +49 (0) 30 2000 30190</p>
          <br />
          <p>Die für den Kontakt zur Verfügung stehenden Sprachen sind: Deutsch, Englisch.</p>
        </Block>
      </div>
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ color: "#00385E", fontSize: 18, fontWeight: 700, marginBottom: 12, marginTop: 0 }}>
        {title}
      </h2>
      <div style={{ color: "#00385E", fontSize: 14, lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  );
}
