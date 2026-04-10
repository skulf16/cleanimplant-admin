"use client";

import { useState } from "react";
import ExpertCard from "@/components/member/ExpertCard";
import { EXPERT_CATEGORIES } from "@/lib/expertCategories";
import type { Expert } from "@/generated/prisma/client";
import { X } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  KI_IT:                "bg-violet-500/20 text-violet-300",
  ONLINE_MARKETING:     "bg-blue-500/20 text-blue-300",
  VIDEO_FOTO:           "bg-pink-500/20 text-pink-300",
  COACHING_CONSULTING:  "bg-amber-500/20 text-amber-300",
  PERSONAL_FUEHRUNG:    "bg-green-500/20 text-green-300",
  PRAEVENTION:          "bg-teal-500/20 text-teal-300",
};

export default function NetzwerkOverview({ experts }: { experts: Expert[] }) {
  const [selected, setSelected] = useState<Expert | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = EXPERT_CATEGORIES.filter(c =>
    experts.some(e => e.categories.includes(c.key) || e.category === c.key)
  );

  const filtered = activeCategory === "all"
    ? experts
    : experts.filter(e => e.categories.includes(activeCategory as never) || e.category === activeCategory);

  return (
    <div>
      {/* ─── Kategorie-Filter ─── */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
            activeCategory === "all"
              ? "bg-white text-[#0c1d33]"
              : "bg-white/10 text-white/60 hover:bg-white/15 hover:text-white"
          }`}
        >
          Alle ({experts.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
              activeCategory === cat.key
                ? "bg-white text-[#0c1d33]"
                : "bg-white/10 text-white/60 hover:bg-white/15 hover:text-white"
            }`}
          >
            {cat.label} ({experts.filter(e => e.categories.includes(cat.key as never) || e.category === cat.key).length})
          </button>
        ))}
      </div>

      {/* ─── Übersichtsgrid ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map(expert => {
          const initials = (expert.firstName[0] ?? "") + (expert.lastName[0] ?? "");
          const expertCats = expert.categories.length ? expert.categories : [expert.category];

          return (
            <button
              key={expert.id}
              onClick={() => setSelected(expert)}
              className="bg-white/5 hover:bg-white/10 rounded-xl p-5 text-left transition-colors group border border-white/5 hover:border-white/15"
            >
              {/* Foto */}
              <div className="flex justify-center mb-4">
                <div
                  className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                  style={{ border: "2px solid rgba(255,255,255,0.15)" }}
                >
                  {expert.imageUrl ? (
                    <img
                      src={expert.imageUrl}
                      alt={`${expert.firstName} ${expert.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white/60 font-bold text-2xl">{initials}</span>
                  )}
                </div>
              </div>

              {/* Name */}
              <p className="text-white font-semibold text-[14px] text-center leading-tight group-hover:text-[#30A2F1] transition-colors">
                {expert.firstName} {expert.lastName}
              </p>
              {expert.company && (
                <p className="text-white/50 text-[11px] text-center mt-0.5 truncate">{expert.company}</p>
              )}

              {/* Kategorien */}
              <div className="flex flex-wrap justify-center gap-1 mt-3">
                {expertCats.map(cat => {
                  const label = EXPERT_CATEGORIES.find(c => c.key === cat)?.label ?? cat;
                  return (
                    <span key={cat} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[cat] ?? "bg-white/10 text-white/50"}`}>
                      {label}
                    </span>
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── Detail-Overlay ─── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-6 overflow-y-auto"
          style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-3xl my-8"
            onClick={e => e.stopPropagation()}
          >
            {/* Schließen */}
            <div className="flex justify-end mb-3">
              <button
                onClick={() => setSelected(null)}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <ExpertCard expert={selected} />
          </div>
        </div>
      )}
    </div>
  );
}
