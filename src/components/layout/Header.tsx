"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Search, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/zahnarzt-finden", label: "Zahnarzt finden" },
  { href: "/was-wir-tun", label: "Was wir tun" },
  { href: "/join-us", label: "Mitglied werden" },
  { href: "/wissenswert", label: "Wissenswert" },
  { href: "/faq", label: "FAQ" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1080px] mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <span className="text-2xl font-bold text-[#2EA3F2] tracking-tight">
            my<span className="text-[#333]">clean</span>dent
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] text-[#666] hover:text-[#2EA3F2] transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-[#666] hover:text-[#2EA3F2] transition-colors"
            aria-label="Suche"
          >
            <Search size={18} />
          </button>

          {/* Auth */}
          {session ? (
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href="/account"
                className="flex items-center gap-1.5 text-[14px] text-[#666] hover:text-[#2EA3F2] transition-colors"
              >
                <User size={16} />
                Mein Konto
              </Link>
              {(session.user as { role?: string })?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="text-[13px] bg-[#F5907C] text-white px-3 py-1.5 rounded hover:bg-[#e07360] transition-colors"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="text-[13px] text-[#999] hover:text-[#333] transition-colors"
              >
                Abmelden
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden lg:inline-flex text-[13px] border border-[#2EA3F2] text-[#2EA3F2] px-4 py-1.5 rounded hover:bg-[#2EA3F2] hover:text-white transition-colors"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-[#666]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-3">
          <div className="max-w-[1080px] mx-auto">
            <form action="/zahnarzt-finden" method="get">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="q"
                  placeholder="Name, Stadt oder Fachrichtung..."
                  className="flex-1 border border-gray-300 rounded px-4 py-2 text-[14px] focus:outline-none focus:border-[#2EA3F2]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-[#2EA3F2] text-white px-5 py-2 rounded hover:bg-[#1a8fd8] transition-colors text-[14px]"
                >
                  Suchen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <nav className="max-w-[1080px] mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] text-[#666] hover:text-[#2EA3F2] py-1 border-b border-gray-50"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              {session ? (
                <>
                  <Link
                    href="/account"
                    className="block text-[14px] text-[#2EA3F2] py-1"
                    onClick={() => setMenuOpen(false)}
                  >
                    Mein Konto
                  </Link>
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="text-[13px] text-[#999] py-1"
                  >
                    Abmelden
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="inline-block text-[13px] border border-[#2EA3F2] text-[#2EA3F2] px-4 py-1.5 rounded"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
