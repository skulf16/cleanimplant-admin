import Link from "next/link";
import Image from "next/image";

const footerSections = [
  {
    heading: "Für Patienten",
    links: [
      { href: "/wissenswert", label: "News & Beiträge" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    heading: "Für Zahnärzte",
    links: [
      { href: "https://member.cleanimplant.com/", label: "Login" },
      { href: "https://member.cleanimplant.com/support/", label: "Mitglieder Support" },
      { href: "https://cleanimplant.com/de/certified-approved/dentists-clinics/", label: "Noch nicht gelistet?" },
    ],
  },
  {
    heading: "Infos & Rechtliches",
    links: [
      { href: "/impressum", label: "Impressum" },
      { href: "/datenschutz", label: "Datenschutz" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: "#BEC4AB", padding: "40px 24px" }}>
      {/* Card */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          background: "#FDFAF6",
          borderRadius: 16,
          padding: "40px 48px",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 sm:gap-8 items-start">

          {/* Logo */}
          <div className="flex items-center justify-start sm:justify-start">
            <Link href="/">
              <Image
                src="https://osjaiemxynbwaxkmclcl.supabase.co/storage/v1/object/public/posts/mycleandent-logo.png"
                alt="mycleandent"
                width={180}
                height={60}
                style={{ width: "auto", height: 56, objectFit: "contain", filter: "brightness(0) saturate(100%) invert(76%) sepia(8%) saturate(470%) hue-rotate(58deg) brightness(92%) contrast(88%)" }}
              />
            </Link>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.heading}>
              <h5
                style={{
                  color: "#F4907B",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginTop: 0,
                  marginBottom: 16,
                }}
              >
                {section.heading}
              </h5>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      style={{
                        color: "#00385E",
                        fontSize: 13,
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        textDecoration: "none",
                      }}
                      className="hover:text-[#F4907B] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            marginTop: 36,
            paddingTop: 20,
            borderTop: "1px solid #e8e2d8",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, fontSize: 12, color: "#999" }}>
            © {new Date().getFullYear()} mycleandent – Alle Rechte vorbehalten
          </p>
        </div>
      </div>
    </footer>
  );
}
