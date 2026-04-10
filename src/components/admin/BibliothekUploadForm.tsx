"use client";

import { useState, useRef } from "react";
import { Upload, Loader2, FileIcon, X } from "lucide-react";
import { createMediaFile } from "@/app/actions/media";

const BRANDS = [
  { key: "mycleandent",  label: "mycleandent" },
  { key: "cleanimplant", label: "CleanImplant" },
];

export default function BibliothekUploadForm() {
  const [uploading, setUploading] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState("");
  const [file,      setFile]      = useState<{ url: string; name: string; type: string; size: number } | null>(null);
  const [dragging,  setDragging]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef  = useRef<HTMLFormElement>(null);

  async function uploadFile(f: File) {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", f);
      fd.append("folder", "bibliothek");
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload fehlgeschlagen");
      setFile({ url: data.url, name: data.fileName ?? f.name, type: data.fileType ?? f.type, size: data.fileSize ?? f.size });
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) { setError("Bitte zuerst eine Datei hochladen"); return; }
    setSaving(true);
    setError("");
    try {
      const fd = new FormData(e.currentTarget);
      fd.set("fileUrl",  file.url);
      fd.set("fileName", file.name);
      fd.set("fileType", file.type);
      fd.set("fileSize", String(file.size));
      fd.set("category", "bibliothek");
      await createMediaFile(fd);
      setSaved(true);
      setFile(null);
      formRef.current?.reset();
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  function formatSize(bytes: number) {
    if (bytes < 1024)      return `${bytes} B`;
    if (bytes < 1024*1024) return `${(bytes/1024).toFixed(1)} KB`;
    return `${(bytes/1024/1024).toFixed(1)} MB`;
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
      <h2 className="text-[13px] font-semibold text-[#555] uppercase tracking-wide">Neue Datei hochladen</h2>

      {/* Datei-Upload */}
      <div>
        <label className="label">Datei *</label>
        {file ? (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-200">
            <FileIcon size={20} className="text-[#30A2F1] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#333] truncate">{file.name}</p>
              <p className="text-[11px] text-[#999]">{file.type} · {formatSize(file.size)}</p>
            </div>
            <button type="button" onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500 transition-colors">
              <X size={16} />
            </button>
          </div>
        ) : (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) uploadFile(f); }}
            onClick={() => inputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 h-24 rounded border-2 border-dashed cursor-pointer transition-colors
              ${dragging ? "border-[#30A2F1] bg-[#EFF6FF]" : "border-gray-300 bg-gray-50 hover:border-[#30A2F1] hover:bg-[#EFF6FF]"}`}
          >
            {uploading ? (
              <Loader2 size={20} className="animate-spin text-[#30A2F1]" />
            ) : (
              <>
                <Upload size={18} className="text-gray-400" />
                <span className="text-[12px] text-gray-400">PDF oder Video hier ablegen oder klicken</span>
                <span className="text-[11px] text-gray-300">PDF, MP4, MOV …</span>
              </>
            )}
          </div>
        )}
        <input ref={inputRef} type="file" className="hidden" accept=".pdf,video/*" onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = ""; }} />
      </div>

      {/* Titel */}
      <div>
        <label className="label">Titel *</label>
        <input name="title" type="text" required className="input w-full" placeholder="z. B. CleanImplant Studie 2024" />
      </div>

      {/* Beschreibung */}
      <div>
        <label className="label">Beschreibung (optional)</label>
        <textarea name="description" rows={2} className="input w-full resize-none" placeholder="Kurze Beschreibung …" />
      </div>

      {/* Marken-Zuweisung */}
      <div>
        <label className="label">Marken-Zuweisung</label>
        <div className="flex gap-4 mt-1">
          {BRANDS.map(b => (
            <label key={b.key} className="flex items-center gap-2 text-[14px] text-[#333] cursor-pointer">
              <input type="checkbox" name="brands" value={b.key} className="rounded border-gray-300 text-[#30A2F1]" />
              {b.label}
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-[13px] text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>}

      <button
        type="submit"
        disabled={saving || uploading || !file}
        className="bg-[#30A2F1] hover:bg-[#1a8fd8] disabled:opacity-50 !text-white font-semibold px-6 py-2.5 rounded text-[13px] transition-colors"
      >
        {saving ? "Speichern …" : saved ? "✓ Gespeichert" : "Datei speichern"}
      </button>
    </form>
  );
}
