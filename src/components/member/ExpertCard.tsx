"use client";

import { useState } from "react";
import { MapPin, Mail, Phone, Globe } from "lucide-react";
import type { Expert } from "@/generated/prisma/client";
import { EXPERT_CATEGORIES } from "@/lib/expertCategories";
import { ExpertCategory } from "@/generated/prisma/client";

export default function ExpertCard({ expert }: { expert: Expert }) {
  const [tab, setTab] = useState<"leistungen" | "benefits">("leistungen");

  const hasLeistungen = !!expert.leistungen;
  const hasBenefits   = expert.benefits.length > 0;
  const initials      = (expert.firstName[0] ?? "") + (expert.lastName[0] ?? "");
  const expertCats = expert.categories?.length ? expert.categories : [expert.category];

  type BLink = { label: string; url: string };
  const benefitLinks: BLink[] = Array.isArray(expert.benefitLinks)
    ? (expert.benefitLinks as BLink[])
    : [];

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#112240", border: "1px solid rgba(255,255,255,0.08)" }}>

      {/* ── Hero ── */}
      <div className="relative px-8 pt-8 pb-6" style={{ background: "linear-gradient(135deg, #0c1d33 0%, #1a3a5c 100%)" }}>
        <div className="flex items-center gap-6">
          {/* Foto */}
          <div
            className="flex-shrink-0 flex items-center justify-center overflow-hidden"
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              border: "3px solid rgba(48,162,241,0.4)",
              background: expert.imageUrl ? "transparent" : "#1e3a5c",
            }}
          >
            {expert.imageUrl ? (
              <img
                src={expert.imageUrl}
                alt={`${expert.firstName} ${expert.lastName}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ color: "#30A2F1", fontWeight: 700, fontSize: 26 }}>{initials}</span>
            )}
          </div>

          {/* Name + Info */}
          <div>
            <h3 style={{ color: "#fff", fontSize: 22, fontWeight: 700, lineHeight: 1.2, marginBottom: 6 }}>
              {expert.firstName} {expert.lastName}
            </h3>
            <div className="flex flex-wrap gap-2">
              {expert.company && (
                <span style={{ backgroundColor: "rgba(48,162,241,0.15)", color: "#30A2F1", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>
                  {expert.company}
                </span>
              )}
              {expertCats.map(cat => (
                <span key={cat} style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", borderRadius: 20, padding: "3px 12px", fontSize: 12 }}>
                  {EXPERT_CATEGORIES.find(c => c.key === cat)?.label ?? cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex gap-0 divide-x" style={{ borderColor: "rgba(255,255,255,0.06)" }}>

        {/* Links: Bio + Tabs */}
        <div className="flex-1 p-6 space-y-5 min-w-0">

          {/* Bio */}
          {expert.bio && (
            <div className="rounded-lg p-5" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.75 }}>{expert.bio}</p>
            </div>
          )}

          {/* Tabs */}
          {(hasLeistungen || hasBenefits) && (
            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {hasLeistungen && (
                  <button
                    onClick={() => setTab("leistungen")}
                    className="px-6 py-3 text-[13px] font-semibold transition-colors"
                    style={{
                      backgroundColor: tab === "leistungen" ? "#30A2F1" : "transparent",
                      color:           tab === "leistungen" ? "#fff"    : "rgba(255,255,255,0.4)",
                    }}
                  >
                    Leistungen
                  </button>
                )}
                {hasBenefits && (
                  <button
                    onClick={() => setTab("benefits")}
                    className="px-6 py-3 text-[13px] font-semibold transition-colors"
                    style={{
                      backgroundColor: tab === "benefits" ? "#1a5fa8" : "transparent",
                      color:           tab === "benefits" ? "#fff"    : "rgba(255,255,255,0.4)",
                    }}
                  >
                    Member Benefits
                  </button>
                )}
              </div>

              <div className="p-5" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                {tab === "leistungen" && hasLeistungen && (
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-line" }}>
                    {expert.leistungen}
                  </p>
                )}
                {tab === "benefits" && hasBenefits && (
                  <div className="space-y-4">
                    <ul className="space-y-2.5">
                      {expert.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-3" style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>
                          <span
                            className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: "#30A2F1" }}
                          >
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                    {benefitLinks.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {benefitLinks.map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-bold tracking-wide transition-opacity hover:opacity-85"
                            style={{ backgroundColor: "#30A2F1", color: "#fff" }}
                          >
                            {link.label} →
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Rechte Sidebar */}
        <div className="w-60 flex-shrink-0 p-5 space-y-4" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>

          {/* Name + Adresse */}
          <div className="flex items-start gap-2.5">
            <MapPin size={16} style={{ color: "#30A2F1", flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ color: "#30A2F1", fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                {expert.firstName} {expert.lastName}
              </p>
              {expert.address && (
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.6 }}>
                  {expert.address}
                </p>
              )}
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)" }} />

          {/* Kontakt-Buttons */}
          <div className="space-y-2">
            {expert.profileUrl && (
              <a
                href={expert.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-[12px] font-bold tracking-wide transition-opacity hover:opacity-85"
                style={{ backgroundColor: "#30A2F1", color: "#fff" }}
              >
                <Globe size={12} /> PROFIL ANSEHEN
              </a>
            )}
            {expert.email && (
              <a
                href={`mailto:${expert.email}`}
                className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-[12px] font-bold tracking-wide transition-opacity hover:opacity-85"
                style={{ backgroundColor: "rgba(48,162,241,0.15)", color: "#30A2F1", border: "1px solid rgba(48,162,241,0.3)" }}
              >
                <Mail size={12} /> E-MAIL
              </a>
            )}
            {expert.phone && (
              <a
                href={`tel:${expert.phone}`}
                className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-[12px] font-bold tracking-wide transition-opacity hover:opacity-85"
                style={{ backgroundColor: "rgba(48,162,241,0.15)", color: "#30A2F1", border: "1px solid rgba(48,162,241,0.3)" }}
              >
                <Phone size={12} /> {expert.phone}
              </a>
            )}
            {expert.website && (
              <a
                href={expert.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-[12px] font-bold tracking-wide transition-opacity hover:opacity-85"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Globe size={12} /> {expert.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            )}
            {expert.linkedin && (
              <a href={expert.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-[12px] font-bold tracking-wide transition-opacity hover:opacity-85"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Globe size={12} /> LINKEDIN
              </a>
            )}
            {expert.instagram && (
              <a href={expert.instagram} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-[12px] font-bold tracking-wide transition-opacity hover:opacity-85"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Globe size={12} /> INSTAGRAM
              </a>
            )}
            {expert.facebook && (
              <a href={expert.facebook} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-[12px] font-bold tracking-wide transition-opacity hover:opacity-85"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Globe size={12} /> FACEBOOK
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
