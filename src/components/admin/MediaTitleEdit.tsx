"use client";

import { useState, useRef } from "react";
import { Pencil, Check, X } from "lucide-react";
import { updateMediaFile } from "@/app/actions/media";

type Props = {
  id:          string;
  title:       string;
  description: string | null;
  category:    string;
  brands:      string[];
  downloadUrl: string | null;
};

export default function MediaTitleEdit({ id, title, description, category, brands, downloadUrl }: Props) {
  const [editing, setEditing] = useState(false);
  const [value,   setValue]   = useState(title);
  const [saving,  setSaving]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function startEdit() {
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function cancel() {
    setValue(title);
    setEditing(false);
  }

  async function save() {
    if (!value.trim() || value.trim() === title) { setEditing(false); return; }
    setSaving(true);
    const fd = new FormData();
    fd.set("title", value.trim());
    if (description) fd.set("description", description);
    fd.set("category", category);
    brands.forEach(br => fd.append("brands", br));
    if (downloadUrl) fd.set("downloadUrl", downloadUrl);
    await updateMediaFile(id, fd);
    setSaving(false);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel(); }}
          className="border border-[#30A2F1] rounded px-2 py-0.5 text-[13px] text-[#333] outline-none w-full max-w-[220px]"
          disabled={saving}
          autoFocus
        />
        <button onClick={save} disabled={saving} className="text-green-600 hover:text-green-700 transition-colors flex-shrink-0">
          <Check size={14} />
        </button>
        <button onClick={cancel} disabled={saving} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 group/title">
      <span className="font-medium text-[#333]">{value}</span>
      <button
        onClick={startEdit}
        className="text-gray-300 hover:text-[#30A2F1] transition-colors opacity-0 group-hover/title:opacity-100 flex-shrink-0"
        title="Titel bearbeiten"
      >
        <Pencil size={12} />
      </button>
    </div>
  );
}
