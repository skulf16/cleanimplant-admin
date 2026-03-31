import Link from "next/link";

const footerLinks = {
  directory: [
    { href: "/zahnarzt-finden", label: "Zahnarzt finden" },
    { href: "/zahnarzt-finden?country=DE", label: "Zahnärzte Deutschland" },
    { href: "/zahnarzt-finden?country=AT", label: "Zahnärzte Österreich" },
    { href: "/zahnarzt-finden?country=CH", label: "Zahnärzte Schweiz" },
  ],
  info: [
    { href: "/was-wir-tun", label: "Was wir tun" },
    { href: "/join-us", label: "Mitglied werden" },
    { href: "/wissenswert", label: "Wissenswert" },
    { href: "/faq", label: "FAQ" },
    { href: "/kontakt", label: "Kontakt" },
  ],
  legal: [
    { href: "/impressum", label: "Impressum" },
    { href: "/datenschutz", label: "Datenschutz" },
    { href: "/terms-and-conditions", label: "AGB" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#333] text-white mt-auto">
      <div className="max-w-[1080px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="text-xl font-bold text-[#2EA3F2]">
              my<span className="text-white">clean</span>dent
            </span>
            <p className="mt-3 text-[13px] text-gray-400 leading-relaxed">
              Ihr Verzeichnis für zertifizierte Zahnärzte und Implantologen in Deutschland, Österreich und der Schweiz.
            </p>
          </div>

          {/* Directory */}
          <div>
            <h5 className="text-[13px] font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Verzeichnis
            </h5>
            <ul className="space-y-2">
              {footerLinks.directory.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-gray-400 hover:text-[#2EA3F2] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h5 className="text-[13px] font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Informationen
            </h5>
            <ul className="space-y-2">
              {footerLinks.info.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-gray-400 hover:text-[#2EA3F2] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="text-[13px] font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Rechtliches
            </h5>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-gray-400 hover:text-[#2EA3F2] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[12px] text-gray-500">
            © {new Date().getFullYear()} mycleandent – Alle Rechte vorbehalten
          </p>
          <p className="text-[12px] text-gray-600">
            Ein Projekt von{" "}
            <span className="text-gray-500">Fluks Media</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
