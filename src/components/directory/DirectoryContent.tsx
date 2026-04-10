"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Search, Map, X } from "lucide-react";
import DoctorCard from "./DoctorCard";
import type { DentistWithRelations, SearchParams } from "@/types";
import type { DocPin } from "./DoctorMap";

const DoctorMap = dynamic(() => import("./DoctorMap"), { ssr: false });

type Category = { slug: string; name: string };

type Props = {
  doctors: DentistWithRelations[];
  categories: Category[];
  params: SearchParams;
  domain: "DE" | "COM";
  total: number;
  page: number;
  pages: number;
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  border: "1px solid #F4907B",
  borderRadius: 8,
  padding: "11px 14px",
  fontSize: 14,
  fontWeight: 500,
  color: "#00385E",
  background: "#fff",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
  minWidth: 0,
};

function buildUrl(base: SearchParams, newParams: Partial<SearchParams>) {
  const merged = { ...base, ...newParams };
  const qs = Object.entries(merged)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
    .join("&");
  return `/zahnarzt-finden${qs ? "?" + qs : ""}`;
}

function paginationBtn(active: boolean): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 14px",
    border: `1px solid ${active ? "#F4907B" : "#e5e7eb"}`,
    borderRadius: 6,
    fontSize: 13,
    fontWeight: active ? 700 : 500,
    background: active ? "#F4907B" : "#fff",
    color: active ? "#fff" : "#00385E",
    textDecoration: "none",
    transition: "all 0.15s",
  };
}

export default function DirectoryContent({
  doctors,
  categories: _categories,
  params,
  domain: _domain,
  total,
  page,
  pages,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mapOpen, setMapOpen] = useState(false);

  const pins: DocPin[] = doctors.map((d) => ({
    id: d.id,
    lat: (d.lat as number | null) ?? null,
    lng: (d.lng as number | null) ?? null,
    name: [d.title, d.firstName, d.lastName].filter(Boolean).join(" "),
    slug: d.slug,
    citySlug: d.citySlug,
  }));

  return (
    /* ── Outer wrapper: stack on mobile/tablet, 3fr+2fr grid on desktop ── */
    <div
      className="flex flex-col lg:grid lg:gap-8 lg:items-start"
      style={{ gridTemplateColumns: "3fr 2fr" }}
    >
      {/* ── LEFT — Search + Results ─────────────────────────────────────── */}
      <div>

        {/* "Karte anzeigen" toggle — mobile & tablet only */}
        <div className="lg:hidden mb-3">
          <button
            type="button"
            onClick={() => setMapOpen((o) => !o)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: mapOpen ? "#00385E" : "#F4907B",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 18px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.03em",
            }}
          >
            {mapOpen ? <X size={16} /> : <Map size={16} />}
            {mapOpen ? "Karte schließen" : "Karte anzeigen"}
          </button>
        </div>

        {/* Collapsible map — mobile & tablet only */}
        {mapOpen && (
          <div
            className="lg:hidden mb-4"
            style={{ height: 320, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}
          >
            <DoctorMap doctors={pins} hoveredId={hoveredId} />
          </div>
        )}

        {/* Search form */}
        <form
          method="get"
          action="/zahnarzt-finden"
          style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: "1.5rem" }}
        >
          <input
            type="text"
            name="q"
            defaultValue={params.q}
            placeholder="Name, Praxis, Zahnarzt …"
            style={inputStyle}
          />
          <input
            type="text"
            name="city"
            defaultValue={params.city}
            placeholder="Stadt, Bundesland, Land …"
            style={inputStyle}
          />
          {params.country && <input type="hidden" name="country" value={params.country} />}
          {params.category && <input type="hidden" name="category" value={params.category} />}
          <button
            type="submit"
            style={{
              background: "#F4907B",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
            aria-label="Suchen"
          >
            <Search size={18} />
          </button>
        </form>

        {/* Cards */}
        {doctors.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#999" }}>
            <p style={{ fontSize: 16, marginBottom: 8 }}>Keine Ergebnisse gefunden.</p>
            <p style={{ fontSize: 13 }}>Versuchen Sie andere Suchbegriffe oder Filter.</p>
          </div>
        ) : (
          <>
            {/* 1 col mobile / 2 col tablet / 3 col desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  onMouseEnter={() => setHoveredId(doc.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ height: "100%" }}
                >
                  <DoctorCard doctor={doc} />
                </div>
              ))}
            </div>

            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {page > 1 && (
                  <a href={buildUrl(params, { page: String(page - 1) })} style={paginationBtn(false)}>
                    ← Zurück
                  </a>
                )}
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <a key={p} href={buildUrl(params, { page: String(p) })} style={paginationBtn(p === page)}>
                    {p}
                  </a>
                ))}
                {page < pages && (
                  <a href={buildUrl(params, { page: String(page + 1) })} style={paginationBtn(false)}>
                    Weiter →
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── RIGHT — Map, desktop only, sticky ──────────────────────────── */}
      <div className="hidden lg:block" style={{ position: "sticky", top: 100, height: "calc(100vh - 120px)" }}>
        <div style={{ height: "100%", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          <DoctorMap doctors={pins} hoveredId={hoveredId} />
        </div>
      </div>
    </div>
  );
}
