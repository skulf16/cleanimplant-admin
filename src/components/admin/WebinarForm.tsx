"use client";

import { useState } from "react";
import { updateWebinar, deleteWebinar } from "@/app/actions/events";
import ImageUpload from "@/components/admin/ImageUpload";

type WebinarData = {
  id:               string;
  imageUrl:         string | null;
  title:            string;
  shortDescription: string | null;
  duration:         string | null;
  date:             Date | null;
  tutorName:        string | null;
  meetingUrl:       string | null;
  registrationUrl:  string | null;
  active:           boolean;
};

function toDatetimeInput(d: Date | null): string {
  if (!d) return "";
  const dt = new Date(d);
  // format: YYYY-MM-DDTHH:mm
  return dt.toISOString().slice(0, 16);
}

export default function WebinarForm({ webinar }: { webinar: WebinarData }) {
  const [imageUrl, setImageUrl] = useState(webinar.imageUrl ?? "");
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const fd = new FormData(e.currentTarget);
      fd.set("imageUrl", imageUrl);
      await updateWebinar(webinar.id, fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Bild */}
      <fieldset className="bg-white border border-gray-200 rounded-lg p-5">
        <legend className="text-[11px] font-semibold text-[#999] uppercase tracking-wide px-1">Webinar-Bild</legend>
        <ImageUpload
          value={imageUrl}
          onChange={setImageUrl}
          folder="practice-images"
          label="Bild hochladen"
        />
      </fieldset>

      {/* Details */}
      <fieldset className="bg-white border border-gray-200 rounded-lg p-5">
        <legend className="text-[11px] font-semibold text-[#999] uppercase tracking-wide px-1">Details</legend>
        <div className="space-y-4">
          <div>
            <label className="label">Titel *</label>
            <input type="text" name="title" required defaultValue={webinar.title} className="input w-full" placeholder="Webinar-Titel" />
          </div>
          <div>
            <label className="label">Kurzbeschreibung</label>
            <textarea
              name="shortDescription"
              rows={3}
              defaultValue={webinar.shortDescription ?? ""}
              className="input w-full resize-none"
              placeholder="Kurze Beschreibung des Webinars …"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Datum & Uhrzeit</label>
              <input type="datetime-local" name="date" defaultValue={toDatetimeInput(webinar.date)} className="input w-full" />
            </div>
            <div>
              <label className="label">Dauer</label>
              <input type="text" name="duration" defaultValue={webinar.duration ?? ""} className="input w-full" placeholder="z. B. 60 Minuten" />
            </div>
          </div>
          <div>
            <label className="label">Tutor / Referent</label>
            <input type="text" name="tutorName" defaultValue={webinar.tutorName ?? ""} className="input w-full" placeholder="Name des Referenten" />
          </div>
          <div>
            <label className="label">Meeting-Link (Google Meet, Zoom etc.)</label>
            <input type="url" name="meetingUrl" defaultValue={webinar.meetingUrl ?? ""} className="input w-full" placeholder="https://meet.google.com/..." />
          </div>
          <div>
            <label className="label">Externes Anmeldeformular (optional)</label>
            <input type="url" name="registrationUrl" defaultValue={webinar.registrationUrl ?? ""} className="input w-full" placeholder="https://..." />
            <p className="text-[11px] text-[#999] mt-1">Wenn leer, wird das eingebaute Anmeldeformular genutzt.</p>
          </div>
          <div>
            <label className="label">Status</label>
            <select name="active" defaultValue={webinar.active ? "true" : "false"} className="input w-full">
              <option value="true">Aktiv</option>
              <option value="false">Inaktiv</option>
            </select>
          </div>
        </div>
      </fieldset>

      {error && <p className="text-[13px] text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>}

      <div className="flex items-center justify-between">
        <form action={deleteWebinar.bind(null, webinar.id)}>
          <button
            type="submit"
            className="text-[13px] text-red-500 hover:text-red-700 underline"
            onClick={e => { if (!confirm("Webinar wirklich löschen?")) e.preventDefault(); }}
          >
            Webinar löschen
          </button>
        </form>
        <button
          type="submit"
          disabled={saving}
          className="bg-[#30A2F1] hover:bg-[#1a8fd8] disabled:opacity-50 !text-white font-semibold px-6 py-2.5 rounded text-[13px] transition-colors"
        >
          {saving ? "Speichern …" : saved ? "✓ Gespeichert" : "Änderungen speichern"}
        </button>
      </div>
    </form>
  );
}
