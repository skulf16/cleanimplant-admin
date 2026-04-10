"use client";

import { useState } from "react";
import { createWebinar } from "@/app/actions/events";
import ImageUpload from "@/components/admin/ImageUpload";
import Link from "next/link";

export default function NewWebinarPage() {
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
      await createWebinar(fd);
    } catch (err: unknown) {
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
        <h1 className="text-2xl font-bold text-[#333]">Neues Webinar</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <fieldset className="bg-white border border-gray-200 rounded-lg p-5">
          <legend className="text-[11px] font-semibold text-[#999] uppercase tracking-wide px-1">Webinar-Bild</legend>
          <ImageUpload value={imageUrl} onChange={setImageUrl} folder="practice-images" label="Bild hochladen" />
        </fieldset>

        <fieldset className="bg-white border border-gray-200 rounded-lg p-5">
          <legend className="text-[11px] font-semibold text-[#999] uppercase tracking-wide px-1">Details</legend>
          <div className="space-y-4">
            <div>
              <label className="label">Titel *</label>
              <input type="text" name="title" required className="input w-full" placeholder="Webinar-Titel" />
            </div>
            <div>
              <label className="label">Kurzbeschreibung</label>
              <textarea name="shortDescription" rows={3} className="input w-full resize-none" placeholder="Kurze Beschreibung …" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Datum & Uhrzeit</label>
                <input type="datetime-local" name="date" className="input w-full" />
              </div>
              <div>
                <label className="label">Dauer</label>
                <input type="text" name="duration" className="input w-full" placeholder="z. B. 60 Minuten" />
              </div>
            </div>
            <div>
              <label className="label">Tutor / Referent</label>
              <input type="text" name="tutorName" className="input w-full" placeholder="Name des Referenten" />
            </div>
            <div>
              <label className="label">Meeting-Link (Google Meet, Zoom etc.)</label>
              <input type="url" name="meetingUrl" className="input w-full" placeholder="https://meet.google.com/..." />
            </div>
            <div>
              <label className="label">Externes Anmeldeformular (optional)</label>
              <input type="url" name="registrationUrl" className="input w-full" placeholder="https://..." />
              <p className="text-[11px] text-[#999] mt-1">Wenn leer, wird das eingebaute Anmeldeformular genutzt.</p>
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
            {saving ? "Speichern …" : "Webinar erstellen"}
          </button>
        </div>
      </form>
    </div>
  );
}
