"use client";

import { useState } from "react";
import { Download } from "lucide-react";

const CATEGORIES = [
  { key: "logos",   label: "Logos",            color: "bg-purple-500/20 text-purple-300" },
  { key: "print",   label: "Print",            color: "bg-orange-500/20 text-orange-300" },
  { key: "social",  label: "Social Media",     color: "bg-pink-500/20 text-pink-300"     },
  { key: "digital", label: "Digitaler Content", color: "bg-cyan-500/20 text-cyan-300"    },
];

const BRAND_LABELS: Record<string, string> = {
  mycleandent:  "mycleandent",
  cleanimplant: "CleanImplant",
};

const BRAND_COLORS: Record<string, string> = {
  mycleandent:  "bg-[#30A2F1]/10 text-[#30A2F1]",
  cleanimplant: "bg-teal-500/10 text-teal-400",
};

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function fileIcon(type: string) {
  if (type.startsWith("image/"))  return "🖼";
  if (type === "application/pdf") return "📄";
  if (type.startsWith("video/"))  return "🎬";
  if (type.includes("zip") || type.includes("compressed")) return "📦";
  return "📁";
}

type MediaFile = {
  id:          string;
  title:       string;
  description: string | null;
  fileUrl:     string;
  fileType:    string;
  fileSize:    number | null;
  downloadUrl: string | null;
  category:    string;
  brands:      string[];
};

export default function LogosMediaOverview({ files }: { files: MediaFile[] }) {
  const [active, setActive] = useState("all");

  const availableCategories = CATEGORIES.filter(cat =>
    files.some(f => f.category === cat.key)
  );

  const filtered = active === "all"
    ? files
    : files.filter(f => f.category === active);

  return (
    <div className="space-y-8">
      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActive("all")}
          className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
            active === "all"
              ? "bg-white text-[#0c1d33]"
              : "bg-white/10 text-white/60 hover:bg-white/15 hover:text-white"
          }`}
        >
          Alle ({files.length})
        </button>
        {availableCategories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActive(cat.key)}
            className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
              active === cat.key
                ? "bg-white text-[#0c1d33]"
                : "bg-white/10 text-white/60 hover:bg-white/15 hover:text-white"
            }`}
          >
            {cat.label} ({files.filter(f => f.category === cat.key).length})
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white/5 rounded-xl p-16 text-center text-white/30 text-[14px]">
          Keine Dateien in dieser Kategorie.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(file => {
            const catColor = CATEGORIES.find(c => c.key === file.category)?.color ?? "bg-white/10 text-white/50";
            const catLabel = CATEGORIES.find(c => c.key === file.category)?.label ?? file.category;

            return (
              <div
                key={file.id}
                className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 rounded-xl p-4 flex flex-col gap-3 transition-colors"
              >
                {/* Preview */}
                {file.fileType.startsWith("image/") ? (
                  <div className="w-full h-32 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
                    <img src={file.fileUrl} alt={file.title} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-full h-32 rounded-lg bg-white/5 flex items-center justify-center">
                    <span className="text-4xl">{fileIcon(file.fileType)}</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-[13px] truncate">{file.title}</p>
                  {file.description && (
                    <p className="text-[12px] text-white/50 mt-0.5">{file.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${catColor}`}>
                      {catLabel}
                    </span>
                    {file.brands.map(br => (
                      <span key={br} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${BRAND_COLORS[br] ?? "bg-white/10 text-white/50"}`}>
                        {BRAND_LABELS[br] ?? br}
                      </span>
                    ))}
                    {file.fileSize ? (
                      <span className="text-[11px] text-white/30">{formatSize(file.fileSize)}</span>
                    ) : null}
                  </div>
                </div>

                <a
                  href={`/api/download?url=${encodeURIComponent(file.downloadUrl || file.fileUrl)}&filename=${encodeURIComponent(file.title || file.fileUrl.split("/").pop() || "download")}`}
                  className="flex items-center justify-center gap-2 bg-[#30A2F1] hover:bg-[#1a8fd8] text-white text-[12px] font-semibold py-2 rounded-lg transition-colors"
                >
                  <Download size={13} />
                  Herunterladen
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
