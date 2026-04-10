"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, User, ArrowLeft } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Startseite" },
  { href: "/was-wir-tun", label: "Was wir tun" },
  { href: "/wissenswert", label: "Wissenswert" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    setIsPreview(new URLSearchParams(window.location.search).get("preview") === "1");
  }, [pathname]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Transparent on homepage and doctor profile pages; solid on all other pages
  const isHeroPage = pathname === "/" || pathname.startsWith("/zahnarzt/");
  const headerBg = (scrolled || !isHeroPage) ? "#BEC4AB" : "transparent";
  const textColor = "#fff";

  // Preview-Modus: einfacher Banner statt normaler Navigation
  if (isPreview) {
    const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";
    const backHref = isAdmin ? "/admin/doctors" : "/account/profil";
    const backLabel = isAdmin ? "Zurück zum Admin" : "Zurück zum Member-Bereich";
    return (
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{ backgroundColor: "rgba(0,56,94,0.92)", backdropFilter: "blur(8px)" }}
      >
        <div className="w-full px-6 flex items-center justify-between h-[56px]">
          <span className="text-white/70 text-[13px]">
            Vorschau des Profils
          </span>
          <Link
            href={backHref}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-white bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full transition-colors"
          >
            <ArrowLeft size={13} />
            {backLabel}
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
      style={{ backgroundColor: headerBg }}
    >
      <div className="w-full px-8 flex items-center justify-between h-[72px]">

        {/* ── Logo ─────────────────────────────────────────── */}
        <Link href="/" className="flex-shrink-0 flex items-center">
          <Image
            src="https://osjaiemxynbwaxkmclcl.supabase.co/storage/v1/object/public/posts/mycleandent-logo.png"
            alt="mycleandent"
            width={280}
            height={70}
            priority
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* ── Desktop Nav ───────────────────────────────────── */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-[13px] font-bold uppercase tracking-wide transition-colors"
                style={{
                  color: active ? "#F4907B" : textColor,
                }}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Auth links */}
          {session ? (
            <>
              <Link
                href="/account"
                className="px-3 py-2 text-[13px] font-bold uppercase tracking-wide transition-colors flex items-center gap-1.5"
                style={{ color: textColor }}
              >
                <User size={14} />
                Mein Konto
              </Link>
              {(session.user as { role?: string })?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="ml-1 text-[13px] font-bold uppercase tracking-wide text-white bg-[#333] px-3 py-1.5 rounded-[3px] hover:bg-[#555] transition-colors"
                >
                  Admin
                </Link>
              )}
            </>
          ) : null}

          {/* CTA Button */}
          <Link
            href="/zahnarzt-finden"
            className="ml-3 bg-[#F4907B] hover:bg-[#e07360] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(245,144,124,0.4)] text-[13px] font-bold uppercase tracking-wide px-5 py-2.5 rounded-[8px] transition-all whitespace-nowrap"
            style={{ color: "#ffffff" }}
          >
            Zahnarzt finden
          </Link>
        </nav>

        {/* ── Mobile hamburger ──────────────────────────────── */}
        <button
          className="lg:hidden p-2 transition-colors"
          style={{ color: textColor }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menü"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile menu ───────────────────────────────────── */}
      {menuOpen && (
        <div style={{ backgroundColor: "#BEC4AB" }} className="lg:hidden border-t border-white/20">
          <nav className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col">
            {navLinks.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-2.5 text-[13px] font-bold uppercase tracking-wide border-b border-white/20 last:border-0 transition-colors"
                  style={{ color: active ? "#F4907B" : "#fff" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/zahnarzt-finden"
              className="mt-3 bg-[#F4907B] hover:bg-[#e07360] text-[13px] font-bold uppercase tracking-wide px-5 py-2.5 rounded-[8px] text-center transition-colors"
              style={{ color: "#ffffff" }}
              onClick={() => setMenuOpen(false)}
            >
              Zahnarzt finden
            </Link>
            {session && (
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  href="/account"
                  className="text-[13px] text-white font-medium flex items-center gap-1.5"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={14} />
                  Mein Konto
                </Link>
                <button
                  onClick={() => { signOut(); setMenuOpen(false); }}
                  className="text-left text-[13px] text-white/70 hover:text-white transition-colors"
                >
                  Abmelden
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
