"use client";

import { useState } from "react";
import { updateEvent, deleteEvent } from "@/app/actions/events";
import ImageUpload from "@/components/admin/ImageUpload";

type EventData = {
  id: string;
  title:       string;
  imageUrl:    string | null;
  description: string;
  dateFrom:    Date | null;
  dateTo:      Date | null;
  city:        string | null;
  country:     string | null;
  active:      boolean;
};

function toDateInput(d: Date | null): string {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toISOString().slice(0, 10);
}

export default function EventForm({ event }: { event: EventData }) {
  const [imageUrl, setImageUrl] = useState(event.imageUrl ?? "");
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
      await updateEvent(event.id, fd);
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
        <legend className="text-[11px] font-semibold text-[#999] uppercase tracking-wide px-1">Event-Bild</legend>
        <ImageUpload
          value={imageUrl}
          onChange={setImageUrl}
          folder="practice-images"
          label="Bild hochladen"
        />
      </fieldset>

      {/* Beschreibung */}
      <fieldset className="bg-white border border-gray-200 rounded-lg p-5">
        <legend className="text-[11px] font-semibold text-[#999] uppercase tracking-wide px-1">Details</legend>
        <div className="space-y-4">
          <div>
            <label className="label">Titel *</label>
            <input type="text" name="title" required defaultValue={event.title} className="input w-full" placeholder="Event-Titel …" />
          </div>
          <div>
            <label className="label">Beschreibung *</label>
            <textarea
              name="description"
              required
              rows={4}
              defaultValue={event.description}
              className="input w-full resize-none"
              placeholder="Beschreibung des Events …"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Datum von</label>
              <input type="date" name="dateFrom" defaultValue={toDateInput(event.dateFrom)} className="input w-full" />
            </div>
            <div>
              <label className="label">Datum bis (optional)</label>
              <input type="date" name="dateTo" defaultValue={toDateInput(event.dateTo)} className="input w-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Stadt</label>
              <input type="text" name="city" defaultValue={event.city ?? ""} className="input w-full" placeholder="z. B. Berlin" />
            </div>
            <div>
              <label className="label">Land</label>
              <input type="text" name="country" defaultValue={event.country ?? ""} className="input w-full" placeholder="z. B. Deutschland" />
            </div>
          </div>
          <div>
            <label className="label">Status</label>
            <select name="active" defaultValue={event.active ? "true" : "false"} className="input w-full">
              <option value="true">Aktiv</option>
              <option value="false">Inaktiv</option>
            </select>
          </div>
        </div>
      </fieldset>

      {error && <p className="text-[13px] text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>}

      <div className="flex items-center justify-between">
        <form action={deleteEvent.bind(null, event.id)}>
          <button
            type="submit"
            className="text-[13px] text-red-500 hover:text-red-700 underline"
            onClick={e => { if (!confirm("Event wirklich löschen?")) e.preventDefault(); }}
          >
            Event löschen
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
