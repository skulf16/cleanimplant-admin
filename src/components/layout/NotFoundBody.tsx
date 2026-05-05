import Link from "next/link";

const NAVY = "#00385E";
const CORAL = "#F4907B";
const PEACH = "#FCD2B2";
const CREME_LIGHT = "#FEF9F5";

/**
 * Reine UI der 404-Seite – ohne Header/Footer, ohne Metadata.
 * Wird sowohl von app/not-found.tsx (catch-all) als auch von
 * (main)/not-found.tsx (innerhalb des Main-Layouts) verwendet.
 */
export default function NotFoundBody() {
  return (
    <section
      style={{
        marginTop: "-72px",
        paddingTop: "calc(72px + 80px)",
        paddingBottom: 100,
        background: `linear-gradient(180deg, ${PEACH} 0%, ${CREME_LIGHT} 60%, ${CREME_LIGHT} 100%)`,
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>

        {/* Coral ring */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div
            aria-hidden="true"
            style={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              border: `14px solid ${CORAL}`,
              borderRightColor: "transparent",
              transform: "rotate(45deg)",
            }}
          />
        </div>

        <p style={{ color: CORAL, fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>
          Fehler 404
        </p>

        <h1 style={{ color: NAVY, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 20px" }}>
          Diese Seite konnten wir nicht finden
        </h1>

        <p style={{ color: NAVY, fontSize: 17, lineHeight: 1.6, margin: "0 0 40px", opacity: 0.85 }}>
          Der aufgerufene Link ist vermutlich veraltet oder enthält einen Tippfehler. Kein Grund zur Sorge – wir helfen Ihnen, das Gesuchte zu finden.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 56 }}>
          <Link href="/zahnarzt-finden" style={{ background: CORAL, color: "#fff", padding: "14px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-block" }}>
            Zahnarzt finden →
          </Link>
          <Link href="/" style={{ background: "transparent", color: NAVY, padding: "14px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none", border: `2px solid ${NAVY}`, display: "inline-block" }}>
            Zur Startseite
          </Link>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, padding: "28px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", textAlign: "left" }}>
          <p style={{ color: NAVY, fontSize: 13, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 16px", textAlign: "center" }}>
            Beliebte Seiten
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            {[
              { label: "Zahnarzt Deutschland",  href: "/zahnarzt/deutschland" },
              { label: "Zahnarzt Österreich",   href: "/zahnarzt/oesterreich" },
              { label: "Zahnarzt Schweiz",      href: "/zahnarzt/schweiz" },
              { label: "Implantologe Berlin",   href: "/implantologe-berlin" },
              { label: "Wissenswertes (Blog)",  href: "/wissenswert" },
              { label: "Was wir tun",           href: "/was-wir-tun" },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} style={{ display: "block", padding: "10px 14px", borderRadius: 8, background: CREME_LIGHT, color: NAVY, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "background 0.2s" }}>
                  {item.label} →
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
