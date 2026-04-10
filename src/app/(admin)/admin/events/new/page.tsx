"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/app/actions/events";
import ImageUpload from "@/components/admin/ImageUpload";
import Link from "next/link";

export default function NewEventPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const fd = new FormData(e.currentTarget);
      fd.set("imageUrl", imageUrl);
      await createEvent(fd);
    } catch (err: unknown) {
      // createEvent redirects on success — errors land here
      const msg = (err as Error).message;
      if (!msg.includes("NEXT_REDIRECT")) setError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/events" className="text-[13px] text-[#999] hover:text-[#30A2F1] mb-2 inline-block">
          ← Zurück zu Events & Webinare
        </Link>
        <h1 className="text-2xl font-bold text-[#333]">Neues Event</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <fieldset className="bg-white border border-gray-200 rounded-lg p-5">
          <legend className="text-[11px] font-semibold text-[#999] uppercase tracking-wide px-1">Event-Bild</legend>
          <ImageUpload value={imageUrl} onChange={setImageUrl} folder="practice-images" label="Bild hochladen" />
        </fieldset>

        <fieldset className="bg-white border border-gray-200 rounded-lg p-5">
          <legend className="text-[11px] font-semibold text-[#999] uppercase tracking-wide px-1">Details</legend>
          <div className="space-y-4">
            <div>
              <label className="label">Titel *</label>
              <input type="text" name="title" required className="input w-full" placeholder="Event-Titel …" />
            </div>
            <div>
              <label className="label">Beschreibung *</label>
              <textarea name="description" required rows={4} className="input w-full resize-none" placeholder="Beschreibung des Events …" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Datum von</label>
                <input type="date" name="dateFrom" className="input w-full" />
              </div>
              <div>
                <label className="label">Datum bis (optional)</label>
                <input type="date" name="dateTo" className="input w-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Stadt</label>
                <input type="text" name="city" className="input w-full" placeholder="z. B. Berlin" />
              </div>
              <div>
                <label className="label">Land</label>
                <input type="text" name="country" className="input w-full" placeholder="z. B. Deutschland" />
              </div>
            </div>
            <div>
              <label className="label">Status</label>
              <select name="active" defaultValue="true" className="input w-full">
                <option value="true">Aktiv</option>
                <option value="false">Inaktiv</option>
              </select>
            </div>
          </div>
        </fieldset>

        {error && <p className="text-[13px] text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#30A2F1] hover:bg-[#1a8fd8] disabled:opacity-50 !text-white font-semibold px-6 py-2.5 rounded text-[13px] transition-colors"
          >
            {saving ? "Speichern …" : "Event erstellen"}
          </button>
        </div>
      </form>
    </div>
  );
}
