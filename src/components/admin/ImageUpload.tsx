"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";

// Max 2000px lange Kante, Ziel ~400 KB, Original-Format beibehalten
const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.4,
  maxWidthOrHeight: 2000,
  useWebWorker: true,
  initialQuality: 0.85,
  alwaysKeepResolution: false,
};

// Harte Obergrenze für den Upload (Vercel-Body-Limit liegt bei ~4.5 MB)
const MAX_UPLOAD_BYTES = 4.5 * 1024 * 1024;

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: "square" | "free";
  folder?: string;
};

export default function ImageUpload({
  value,
  onChange,
  label,
  aspectRatio = "square",
  folder = "doctor-images",
}: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Nur Bilddateien erlaubt");
        return;
      }
      setError("");

      // ── Komprimieren (SVG und GIF bleiben unangetastet) ────────────────
      let toUpload: File = file;
      if (!/svg|gif/.test(file.type) && file.size > 400 * 1024) {
        setCompressing(true);
        try {
          toUpload = await imageCompression(file, COMPRESSION_OPTIONS);
        } catch (e) {
          console.warn("[ImageUpload] Compression failed, using original:", e);
        } finally {
          setCompressing(false);
        }
      }

      // Wenn auch nach Kompression zu groß: Abbruch mit klarer Meldung
      if (toUpload.size > MAX_UPLOAD_BYTES) {
        setError(
          `Bild zu groß (${(toUpload.size / 1024 / 1024).toFixed(1)} MB nach Kompression). Bitte kleineres Bild wählen.`
        );
        return;
      }

      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", toUpload);
        fd.append("folder", folder);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          console.error("[ImageUpload] Upload failed:", res.status, data);
          throw new Error(data.error ?? `Upload fehlgeschlagen (${res.status})`);
        }
        const { url } = data;
        if (!url) throw new Error("Keine URL in der Antwort");
        onChange(url);
      } catch (e: unknown) {
        setError((e as Error).message);
        console.error("[ImageUpload] Error:", e);
      } finally {
        setUploading(false);
      }
    },
    [onChange, folder]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  };

  return (
    <div>
      {label && <label className="label">{label}</label>}

      {value ? (
        /* Preview */
        <div className="relative inline-block group">
          <div
            className={`relative overflow-hidden rounded border border-gray-200 bg-gray-50 ${
              aspectRatio === "square" ? "w-24 h-24" : "w-40 h-28"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            {(uploading || compressing) && (
              <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center gap-1">
                <Loader2 size={20} className="animate-spin text-[#30A2F1]" />
                {compressing && <span className="text-[9px] text-[#30A2F1] font-medium">Optimiere…</span>}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={11} />
          </button>
          {/* Click to replace */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-0 left-0 right-0 text-[10px] text-white bg-black/40 text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Ersetzen
          </button>
        </div>
      ) : (
        /* Drop zone */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 rounded border-2 border-dashed cursor-pointer transition-colors select-none
            ${aspectRatio === "square" ? "w-24 h-24" : "w-40 h-28"}
            ${dragging ? "border-[#30A2F1] bg-[#EFF6FF]" : "border-gray-300 bg-gray-50 hover:border-[#30A2F1] hover:bg-[#EFF6FF]"}`}
        >
          {(uploading || compressing) ? (
            <>
              <Loader2 size={20} className="animate-spin text-[#30A2F1]" />
              {compressing && <span className="text-[9px] text-[#30A2F1] font-medium">Optimiere…</span>}
            </>
          ) : (
            <>
              <Upload size={18} className="text-gray-400" />
              <span className="text-[10px] text-gray-400 text-center leading-tight px-1">
                {dragging ? "Loslassen" : "Bild hier\nhochladen"}
              </span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      {error && (
        <div className="mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded text-[12px] text-red-600 max-w-[200px]">
          ⚠ {error}
        </div>
      )}
    </div>
  );
}
