"use client";

import { useActionState, useState } from "react";
import { EXPERT_CATEGORIES } from "@/lib/expertCategories";
import type { Expert } from "@/generated/prisma/client";
import ImageUpload from "@/components/admin/ImageUpload";

type Props = {
  expert?: Expert;
  action: (formData: FormData) => Promise<void>;
};

export default function ExpertForm({ expert, action }: Props) {
  const [saved, setSaved] = useState(false);
  const [benefits, setBenefits] = useState<string[]>(
    expert?.benefits?.length ? expert.benefits : [""]
  );
  const [imageUrl, setImageUrl] = useState<string>(expert?.imageUrl ?? "");

  type BenefitLink = { label: string; url: string };
  const [benefitLinks, setBenefitLinks] = useState<BenefitLink[]>(
    Array.isArray(expert?.benefitLinks) ? (expert.benefitLinks as BenefitLink[]) : []
  );

  const addLink    = () => setBenefitLinks(l => [...l, { label: "", url: "" }]);
  const removeLink = (i: number) => setBenefitLinks(l => l.filter((_, idx) => idx !== i));
  const updateLink = (i: number, field: keyof BenefitLink, val: string) =>
    setBenefitLinks(l => l.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  const [error, formAction, pending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      formData.set("benefits", benefits.filter(Boolean).join("\n"));
      formData.set("imageUrl", imageUrl);
      formData.set("benefitLinks", JSON.stringify(benefitLinks.filter(l => l.label && l.url)));
      try {
        await action(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        return null;
      } catch (e: unknown) {
        return (e as Error).message ?? "Fehler beim Speichern";
      }
    },
    null
  );

  const addBenefit    = () => setBenefits(b => [...b, ""]);
  const updateBenefit = (i: number, val: string) => setBenefits(b => b.map((v, idx) => idx === i ? val : v));
  const removeBenefit = (i: number) => setBenefits(b => b.filter((_, idx) => idx !== i));

  return (
    <form action={formAction} className="space-y-8 max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 rounded-[4px]">
          {error}
        </div>
      )}

      {/* ── Basisdaten ──────────────────────────────────────────────── */}
      <fieldset className="bg-white border border-[#e5e7eb] rounded-[6px] p-6">
        <legend className="text-[13px] font-semibold text-[#555] tracking-wide px-2 mb-4">
          Basisdaten
        </legend>

        <div className="mb-4">
          <label className="label">Kategorien * (mehrere möglich)</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {EXPERT_CATEGORIES.map(c => {
              const checked = expert?.categories?.includes(c.key) ?? expert?.category === c.key;
              return (
                <label key={c.key} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="categories"
                    value={c.key}
                    defaultChecked={checked}
                    className="rounded"
                  />
                  <span className="text-[13px] text-[#333]">{c.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label className="label">Vorname *</label>
            <input name="firstName" type="text" required defaultValue={expert?.firstName ?? ""} className="input" placeholder="Vorname" />
          </div>
          <div>
            <label className="label">Nachname *</label>
            <input name="lastName" type="text" required defaultValue={expert?.lastName ?? ""} className="input" placeholder="Nachname" />
          </div>
        </div>

        <div className="mt-4">
          <label className="label">Unternehmen (optional)</label>
          <input name="company" type="text" defaultValue={expert?.company ?? ""} className="input" placeholder="Firmenname / Berufsbezeichnung" />
        </div>

        <div className="mt-4">
          <ImageUpload
            label="Profilbild"
            value={imageUrl}
            onChange={setImageUrl}
            folder="expert-images"
            aspectRatio="square"
          />
          <input type="hidden" name="imageUrl" value={imageUrl} />
        </div>

        <div className="mt-4 flex items-center gap-2.5">
          <input
            type="checkbox"
            name="active"
            id="active"
            value="true"
            defaultChecked={expert?.active ?? true}
            className="rounded"
          />
          <label htmlFor="active" className="text-[14px] text-[#333]">Aktiv (im Member-Bereich sichtbar)</label>
        </div>
      </fieldset>

      {/* ── Vorstellung & Leistungen ────────────────────────────────── */}
      <fieldset className="bg-white border border-[#e5e7eb] rounded-[6px] p-6">
        <legend className="text-[13px] font-semibold text-[#555] tracking-wide px-2 mb-4">
          Vorstellung & Leistungen
        </legend>
        <div className="space-y-4">
          <div>
            <label className="label">Vorstellungstext</label>
            <textarea name="bio" rows={4} defaultValue={expert?.bio ?? ""} className="input resize-none" placeholder="Kurze Vorstellung des Experten …" />
          </div>
          <div>
            <label className="label">Leistungen</label>
            <textarea name="leistungen" rows={4} defaultValue={expert?.leistungen ?? ""} className="input resize-none" placeholder="Was bietet der Experte an?" />
          </div>
        </div>
      </fieldset>

      {/* ── Member Benefits ─────────────────────────────────────────── */}
      <fieldset className="bg-white border border-[#e5e7eb] rounded-[6px] p-6">
        <legend className="text-[13px] font-semibold text-[#555] tracking-wide px-2 mb-4">
          Member Benefits
        </legend>
        <div className="space-y-2">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[#999] text-[13px] w-4 flex-shrink-0">•</span>
              <input
                type="text"
                value={b}
                onChange={e => updateBenefit(i, e.target.value)}
                className="input flex-1"
                placeholder={`Benefit ${i + 1}`}
              />
              {benefits.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBenefit(i)}
                  className="text-red-400 hover:text-red-600 text-[18px] leading-none px-1"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addBenefit}
            className="mt-1 text-[13px] text-[#30A2F1] hover:underline"
          >
            + Benefit hinzufügen
          </button>
        </div>

        {/* Link-Buttons */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <p className="text-[12px] font-semibold text-[#999] uppercase tracking-wide mb-3">Link-Buttons</p>
          <div className="space-y-2">
            {benefitLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={link.label}
                  onChange={e => updateLink(i, "label", e.target.value)}
                  className="input w-40 flex-shrink-0"
                  placeholder="Button-Text"
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={e => updateLink(i, "url", e.target.value)}
                  className="input flex-1"
                  placeholder="https://…"
                />
                <button
                  type="button"
                  onClick={() => removeLink(i)}
                  className="text-red-400 hover:text-red-600 text-[18px] leading-none px-1"
                >×</button>
              </div>
            ))}
            <button
              type="button"
              onClick={addLink}
              className="mt-1 text-[13px] text-[#30A2F1] hover:underline"
            >
              + Link-Button hinzufügen
            </button>
          </div>
        </div>
      </fieldset>

      {/* ── Kontakt ─────────────────────────────────────────────────── */}
      <fieldset className="bg-white border border-[#e5e7eb] rounded-[6px] p-6">
        <legend className="text-[13px] font-semibold text-[#555] tracking-wide px-2 mb-4">
          Kontakt
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Telefon</label>
            <input name="phone" type="tel" defaultValue={expert?.phone ?? ""} className="input" placeholder="+49 …" />
          </div>
          <div>
            <label className="label">E-Mail</label>
            <input name="email" type="email" defaultValue={expert?.email ?? ""} className="input" placeholder="name@firma.de" />
          </div>
          <div>
            <label className="label">Website</label>
            <input name="website" type="url" defaultValue={expert?.website ?? ""} className="input" placeholder="https://…" />
          </div>
        </div>
        <div className="mt-4">
          <label className="label">Profil-Link (z. B. LinkedIn-Profil, Portfolio)</label>
          <input name="profileUrl" type="url" defaultValue={expert?.profileUrl ?? ""} className="input" placeholder="https://…" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="label">LinkedIn</label>
            <input name="linkedin" type="url" defaultValue={expert?.linkedin ?? ""} className="input" placeholder="https://linkedin.com/in/…" />
          </div>
          <div>
            <label className="label">Instagram</label>
            <input name="instagram" type="url" defaultValue={expert?.instagram ?? ""} className="input" placeholder="https://instagram.com/…" />
          </div>
          <div>
            <label className="label">Facebook</label>
            <input name="facebook" type="url" defaultValue={expert?.facebook ?? ""} className="input" placeholder="https://facebook.com/…" />
          </div>
        </div>
      </fieldset>

      {/* ── Adresse ─────────────────────────────────────────────────── */}
      <fieldset className="bg-white border border-[#e5e7eb] rounded-[6px] p-6">
        <legend className="text-[13px] font-semibold text-[#555] tracking-wide px-2 mb-4">
          Adresse
        </legend>
        <input name="address" type="text" defaultValue={expert?.address ?? ""} className="input" placeholder="Straße, PLZ, Stadt" />
      </fieldset>

      {/* ── Submit ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 pb-8">
        <button
          type="submit"
          disabled={pending}
          className="bg-[#30A2F1] hover:bg-[#1a8fd8] disabled:opacity-60 !text-white font-semibold px-8 py-2.5 rounded-[4px] transition-colors text-[14px]"
        >
          {pending ? "Speichern …" : saved ? "✓ Gespeichert" : expert ? "Änderungen speichern" : "Experten anlegen"}
        </button>
        <a href="/admin/experten" className="text-[13px] text-[#999] hover:text-[#333] transition-colors">
          Abbrechen
        </a>
      </div>
    </form>
  );
}
