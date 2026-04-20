"use client";

import { useActionState, useState } from "react";
import { updateMemberDoctor } from "@/app/actions/doctors";
import type { DentistProfile } from "@/generated/prisma/client";
import ImageUpload from "@/components/admin/ImageUpload";
import BioEditor from "@/components/admin/BioEditor";
import AddressAutocomplete from "@/components/member/AddressAutocomplete";

// ── Static data ───────────────────────────────────────────────────────────────

const TITLE_OPTIONS = [
  { value: "",                    label: "Kein Titel" },
  { value: "Dr.",                 label: "Dr." },
  { value: "Prof.",               label: "Prof." },
  { value: "Prof. Dr.",           label: "Prof. Dr." },
  { value: "Dr. med. dent.",      label: "Dr. med. dent." },
  { value: "Univ.-Prof. Dr.",     label: "Univ.-Prof. Dr." },
  { value: "Univ.-Prof. Dr. Dr.", label: "Univ.-Prof. Dr. Dr." },
  { value: "Priv.-Doz. Dr.",      label: "Priv.-Doz. Dr." },
];

const LANGUAGES: { slug: string; label: string }[] = [
  { slug: "englisch",        label: "Englisch" },
  { slug: "deutsch",         label: "Deutsch" },
  { slug: "french",          label: "Französisch" },
  { slug: "spanish",         label: "Spanisch" },
  { slug: "italian",         label: "Italienisch" },
  { slug: "portuguese",      label: "Portugiesisch" },
  { slug: "dutch",           label: "Niederländisch" },
  { slug: "russian",         label: "Russisch" },
  { slug: "polish",          label: "Polnisch" },
  { slug: "ukrainian",       label: "Ukrainisch" },
  { slug: "romanian",        label: "Rumänisch" },
  { slug: "czech",           label: "Tschechisch" },
  { slug: "hungarian",       label: "Ungarisch" },
  { slug: "greek",           label: "Griechisch" },
  { slug: "bulgarian",       label: "Bulgarisch" },
  { slug: "serbian",         label: "Serbisch" },
  { slug: "croatian",        label: "Kroatisch" },
  { slug: "bosnian",         label: "Bosnisch" },
  { slug: "slovenian",       label: "Slowenisch" },
  { slug: "slovak",          label: "Slowakisch" },
  { slug: "swedish",         label: "Schwedisch" },
  { slug: "danish",          label: "Dänisch" },
  { slug: "norwegian",       label: "Norwegisch" },
  { slug: "finnish",         label: "Finnisch" },
  { slug: "estonian",        label: "Estnisch" },
  { slug: "latvian",         label: "Lettisch" },
  { slug: "lithuanian",      label: "Litauisch" },
  { slug: "turkish",         label: "Türkisch" },
  { slug: "albanian",        label: "Albanisch" },
  { slug: "macedonian",      label: "Mazedonisch" },
  { slug: "georgian",        label: "Georgisch" },
  { slug: "armenian",        label: "Armenisch" },
  { slug: "belarusian",      label: "Weißrussisch" },
  { slug: "catalan",         label: "Katalanisch" },
  { slug: "basque",          label: "Baskisch" },
  { slug: "irish",           label: "Irisch (Gälisch)" },
  { slug: "scottishgaelic",  label: "Schottisch-Gälisch" },
  { slug: "welsh",           label: "Walisisch" },
  { slug: "icelandic",       label: "Isländisch" },
  { slug: "maltese",         label: "Maltesisch" },
  { slug: "hebrew",          label: "Hebräisch" },
  { slug: "arabic",          label: "Arabisch" },
  { slug: "farsi",           label: "Farsi (Persisch)" },
  { slug: "kurdish",         label: "Kurdisch" },
  { slug: "chinese",         label: "Chinesisch (Mandarin)" },
  { slug: "cantonese",       label: "Chinesisch (Kantonesisch)" },
  { slug: "japanese",        label: "Japanisch" },
  { slug: "korean",          label: "Koreanisch" },
  { slug: "hindi",           label: "Hindi" },
  { slug: "urdu",            label: "Urdu" },
  { slug: "bengali",         label: "Bengali" },
  { slug: "tamil",           label: "Tamil" },
  { slug: "telugu",          label: "Telugu" },
  { slug: "malayalam",       label: "Malayalam" },
  { slug: "thai",            label: "Thai" },
  { slug: "vietnamese",      label: "Vietnamesisch" },
  { slug: "indonesian",      label: "Indonesisch" },
  { slug: "malay",           label: "Malaiisch" },
  { slug: "swahili",         label: "Swahili" },
  { slug: "zulu",            label: "Zulu" },
  { slug: "afrikaans",       label: "Afrikaans" },
  { slug: "filipino",        label: "Filipino (Tagalog)" },
  { slug: "pashto",          label: "Paschtu" },
  { slug: "punjabi",         label: "Punjabi" },
  { slug: "nepali",          label: "Nepali" },
  { slug: "lao",             label: "Laotisch" },
  { slug: "khmer",           label: "Khmer" },
  { slug: "mongolian",       label: "Mongolisch" },
  { slug: "burmese",         label: "Burmesisch" },
  { slug: "tigrinya",        label: "Tigrinya" },
  { slug: "amharic",         label: "Amharisch" },
  { slug: "somali",          label: "Somali" },
];

const TREATMENTS: { slug: string; label: string }[] = [
  { slug: "angstpatienten",                              label: "Angstpatienten" },
  { slug: "ästhetische zahnheilkunde",                   label: "Ästhetische Zahnheilkunde" },
  { slug: "ästhetische zahnmedizin",                     label: "Ästhetische Zahnmedizin" },
  { slug: "biologische zahnmedizin",                     label: "Biologische Zahnmedizin" },
  { slug: "diagnostik und biopsie",                      label: "Diagnostik und Biopsie" },
  { slug: "explantation",                                label: "Explantation" },
  { slug: "fissurenversiegelung",                        label: "Fissurenversiegelung" },
  { slug: "fluoridbehandlungen",                         label: "Fluoridbehandlungen" },
  { slug: "füllungen",                                   label: "Füllungen" },
  { slug: "funktionsdiagnostik",                         label: "Funktionsdiagnostik" },
  { slug: "implantatversorgung",                         label: "Implantatversorgung" },
  { slug: "implantologie",                               label: "Implantologie" },
  { slug: "inlays",                                      label: "Inlays" },
  { slug: "kariesbehandlung",                            label: "Kariesbehandlung" },
  { slug: "keramikfüllungen",                            label: "Keramikfüllungen" },
  { slug: "keramikimplantate",                           label: "Keramikimplantate" },
  { slug: "kieferkammaufbau",                            label: "Kieferkammaufbau" },
  { slug: "kiefergelenksbehandlung",                     label: "Kiefergelenksbehandlung" },
  { slug: "kiefergelenksstörungen",                      label: "Kiefergelenksstörungen" },
  { slug: "kieferorthopädie",                            label: "Kieferorthopädie" },
  { slug: "kinderzahnheilkunde",                         label: "Kinderzahnheilkunde" },
  { slug: "kinesiologie",                                label: "Kinesiologie" },
  { slug: "knochentransplantation",                      label: "Knochentransplantation" },
  { slug: "knochenaufbau",                               label: "Knochenaufbau" },
  { slug: "kompositfüllungen",                           label: "Kompositfüllungen" },
  { slug: "kronen und brücken",                          label: "Kronen und Brücken" },
  { slug: "lachgas",                                     label: "Lachgas" },
  { slug: "laserbehandlungen",                           label: "Laserbehandlungen" },
  { slug: "mikronährstoffe und ernährung",               label: "Mikronährstoffe & Ernährung" },
  { slug: "moderne digitale zahnmedizin",                label: "Moderne Digitale Zahnmedizin" },
  { slug: "narkosebehandlung",                           label: "Narkosebehandlung" },
  { slug: "onlays",                                      label: "Onlays" },
  { slug: "parodontitis",                                label: "Parodontitis" },
  { slug: "parodontologie",                              label: "Parodontologie" },
  { slug: "periimplantitis",                             label: "Periimplantitis" },
  { slug: "professionelle zahnreinigung (prophylaxe)",   label: "Professionelle Zahnreinigung (Prophylaxe)" },
  { slug: "provisorischer zahnersatz",                   label: "Provisorischer Zahnersatz" },
  { slug: "sedierung in der zahnheilkunde",              label: "Sedierung in der Zahnheilkunde" },
  { slug: "sinuslift-operation",                         label: "Sinuslift-Operation" },
  { slug: "sportzahnmedizin",                            label: "Sportzahnmedizin" },
  { slug: "tiefenreinigung",                             label: "Tiefenreinigung (Scaling und Root Planing)" },
  { slug: "transparente aligner",                        label: "Transparente Aligner (z. B. Invisalign)" },
  { slug: "umweltzahnmedizin",                           label: "Umweltzahnmedizin" },
  { slug: "untersuchung und beratung",                   label: "Untersuchung und Beratung" },
  { slug: "unsichtbare zahnspangen",                     label: "Unsichtbare Zahnspangen" },
  { slug: "veneers",                                     label: "Veneers" },
  { slug: "vitamin d3 test",                             label: "Vitamin D3 Test" },
  { slug: "weichgewebstransplantation",                  label: "Weichgewebstransplantation" },
  { slug: "wurzelkanalbehandlung (endodontie)",          label: "Wurzelkanalbehandlung (Endodontie)" },
  { slug: "wurzelspitzenresektion (apikotomie)",         label: "Wurzelspitzenresektion (Apikotomie)" },
  { slug: "zahnärztlicher notfalldienst",                label: "Zahnärztlicher Notfalldienst" },
  { slug: "zahnaufhellung (bleaching)",                  label: "Zahnaufhellung (Bleaching)" },
  { slug: "zahnentfernungen",                            label: "Zahnentfernungen" },
  { slug: "zahnersatz (voll- und teilprothesen)",        label: "Zahnersatz (Voll- und Teilprothesen)" },
  { slug: "zahnimplantate",                              label: "Zahnimplantate" },
  { slug: "zahnmedizin",                                 label: "Zahnmedizin" },
  { slug: "zahnröntgen und 3d-bildgebung (dvt/cbct)",   label: "Zahnröntgen und 3D-Bildgebung (DVT/CBCT)" },
  { slug: "zahntraumata",                                label: "Zahntraumata" },
  { slug: "zahnversiegelungen",                          label: "Zahnversiegelungen" },
  { slug: "zystenentfernung",                            label: "Zystenentfernung" },
];

const WEEK_DAYS: { key: string; label: string }[] = [
  { key: "Mo", label: "Montag" },
  { key: "Tu", label: "Dienstag" },
  { key: "We", label: "Mittwoch" },
  { key: "Th", label: "Donnerstag" },
  { key: "Fr", label: "Freitag" },
  { key: "Sa", label: "Samstag" },
  { key: "Su", label: "Sonntag" },
];

// ── Types ─────────────────────────────────────────────────────────────────────

type DayHours = { open: string; close: string; open2?: string; close2?: string; closed: boolean };
type OpeningHoursMap = Record<string, DayHours>;

type Props = {
  doctor: DentistProfile & { categories?: { category: { id: string; name: string } }[] };
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseOpeningHours(raw: unknown): OpeningHoursMap {
  const defaults: OpeningHoursMap = {};
  for (const { key } of WEEK_DAYS) {
    defaults[key] = { open: "09:00", close: "17:00", closed: key === "Sa" || key === "Su" };
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return defaults;
  const map = raw as Record<string, unknown>;
  const result: OpeningHoursMap = {};
  for (const { key } of WEEK_DAYS) {
    const entry = map[key];
    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
      const e = entry as Record<string, unknown>;
      result[key] = {
        open:   typeof e.open   === "string" ? e.open   : "09:00",
        close:  typeof e.close  === "string" ? e.close  : "17:00",
        open2:  typeof e.open2  === "string" ? e.open2  : "",
        close2: typeof e.close2 === "string" ? e.close2 : "",
        closed: typeof e.closed === "boolean" ? e.closed : false,
      };
    } else {
      result[key] = defaults[key];
    }
  }
  return result;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MemberDoctorForm({ doctor }: Props) {
  const action = updateMemberDoctor.bind(null, doctor.id);

  const [error, formAction, pending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      try {
        await action(formData);
        return null;
      } catch (e: unknown) {
        return (e as Error).message ?? "Fehler beim Speichern";
      }
    },
    null
  );

  // ── Opening hours state ──────────────────────────────────────────────────
  const initialHours = parseOpeningHours(doctor?.openingHours);
  const [closedDays, setClosedDays] = useState<Record<string, boolean>>(
    Object.fromEntries(WEEK_DAYS.map(({ key }) => [key, initialHours[key].closed]))
  );

  const toggleClosed = (key: string) =>
    setClosedDays((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Language / treatment search ──────────────────────────────────────────
  const [langSearch, setLangSearch]   = useState("");
  const [treatSearch, setTreatSearch] = useState("");

  const filteredLangs = LANGUAGES.filter(
    ({ label }) => label.toLowerCase().includes(langSearch.toLowerCase())
  );
  const filteredTreatments = TREATMENTS.filter(
    ({ label, slug }) =>
      label.toLowerCase().includes(treatSearch.toLowerCase()) ||
      slug.toLowerCase().includes(treatSearch.toLowerCase())
  );

  // ── Helpers ──────────────────────────────────────────────────────────────
  const val = (field: keyof DentistProfile) =>
    (doctor?.[field] as string | null | undefined) ?? "";

  const hasLanguage = (slug: string) =>
    doctor?.languages?.includes(slug) ?? false;

  const hasTreatment = (slug: string) =>
    doctor?.treatments?.includes(slug) ?? false;

  // ── Image state ──────────────────────────────────────────────────────────
  const [imageUrl, setImageUrl] = useState<string>(
    (doctor?.imageUrl as string | null | undefined) ?? ""
  );
  const [galleryImages, setGalleryImages] = useState<string[]>(
    (doctor?.galleryImages as string[] | undefined) ?? Array(6).fill("")
  );

  const setGalleryImage = (i: number, url: string) =>
    setGalleryImages((prev) => prev.map((v, idx) => (idx === i ? url : v)));

  return (
    <form action={formAction} className="space-y-8 max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 rounded-[4px]">
          {error}
        </div>
      )}

      {/* ── Stammdaten ─────────────────────────────────────────────── */}
      <fieldset className="bg-white border border-[#e5e7eb] rounded-[6px] p-6">
        <legend className="text-[13px] font-semibold text-[#555] tracking-wide px-2 mb-4">
          Stammdaten
        </legend>
        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 1fr 120px", gap: 16 }}>
          <div>
            <label className="label">Titel</label>
            <select name="title" defaultValue={val("title")} className="input">
              {TITLE_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Vorname *</label>
            <input name="firstName" defaultValue={val("firstName")} required className="input" />
          </div>
          <div>
            <label className="label">Nachname *</label>
            <input name="lastName" defaultValue={val("lastName")} required className="input" />
          </div>
          <div>
            <label className="label">Suffix</label>
            <input name="suffix" defaultValue={val("suffix")} placeholder="M.Sc." className="input" />
          </div>
        </div>
        <div className="mt-4">
          <label className="label">Praxisname / Klinikname</label>
          <input name="practiceName" defaultValue={val("practiceName")} className="input" />
        </div>
        <div className="mt-4">
          <label className="label">Biografie / Beschreibung</label>
          <BioEditor name="bio" defaultValue={val("bio")} />
        </div>
        <div className="mt-4">
          <ImageUpload
            label="Profilbild"
            value={imageUrl}
            onChange={setImageUrl}
            aspectRatio="square"
          />
          <input type="hidden" name="imageUrl" value={imageUrl} />
        </div>
      </fieldset>

      {/* ── Kontakt ────────────────────────────────────────────────── */}
      <fieldset className="bg-white border border-[#e5e7eb] rounded-[6px] p-6">
        <legend className="text-[13px] font-semibold text-[#555] tracking-wide px-2 mb-4">
          Kontakt
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Telefon</label>
            <input name="phone" defaultValue={val("phone")} placeholder="+49 30 ..." className="input" />
          </div>
          <div>
            <label className="label">E-Mail</label>
            <input name="email" type="email" defaultValue={val("email")} className="input" />
          </div>
          <div>
            <label className="label">Website</label>
            <input name="website" defaultValue={val("website")} placeholder="https://..." className="input" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="label">Terminbuchungs-Link</label>
            <input
              name="appointmentUrl"
              type="url"
              defaultValue={val("appointmentUrl")}
              placeholder="https://..."
              className="input"
            />
          </div>
          <div>
            <label className="label">Google Business URL</label>
            <input
              name="googleBusinessUrl"
              type="url"
              defaultValue={val("googleBusinessUrl")}
              placeholder="https://maps.google.com/..."
              className="input"
            />
            <p className="text-[11px] text-[#999] mt-1">
              Für automatische Öffnungszeiten (experimentell)
            </p>
          </div>
        </div>
      </fieldset>

      {/* ── Adresse ────────────────────────────────────────────────── */}
      <fieldset className="bg-white border border-[#e5e7eb] rounded-[6px] p-6">
        <legend className="text-[13px] font-semibold text-[#555] tracking-wide px-2 mb-4">
          Adresse
        </legend>
        <AddressAutocomplete
          initial={{
            street:  doctor?.street,
            zip:     doctor?.zip,
            city:    doctor?.city,
            region:  doctor?.region,
            country: doctor?.country,
            lat:     doctor?.lat,
            lng:     doctor?.lng,
          }}
        />
      </fieldset>

      {/* ── Öffnungszeiten ─────────────────────────────────────────── */}
      <fieldset className="bg-white border border-[#e5e7eb] rounded-[6px] p-6">
        <legend className="text-[13px] font-semibold text-[#555] tracking-wide px-2 mb-4">
          Öffnungszeiten
        </legend>
        <div className="space-y-3">
          {WEEK_DAYS.map(({ key, label }) => {
            const dayData = initialHours[key];
            const isClosed = closedDays[key];
            return (
              <div key={key} className="space-y-1.5">
                <div className="grid grid-cols-[140px_auto_1fr_1fr_1fr_1fr] items-end gap-2">
                  <span className="text-[13px] text-[#333] font-medium pb-2">{label}</span>
                  <label className="flex items-center gap-1.5 text-[12px] text-[#666] cursor-pointer whitespace-nowrap pb-2">
                    <input
                      type="checkbox"
                      name={`hours_${key}_closed`}
                      checked={isClosed}
                      onChange={() => toggleClosed(key)}
                      className="rounded border-gray-300"
                    />
                    Geschlossen
                  </label>
                  <div>
                    <label className="label text-[11px]">Öffnet</label>
                    <input
                      type="time"
                      name={`hours_${key}_open`}
                      defaultValue={dayData.open}
                      disabled={isClosed}
                      className="input disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="label text-[11px]">Schließt</label>
                    <input
                      type="time"
                      name={`hours_${key}_close`}
                      defaultValue={dayData.close}
                      disabled={isClosed}
                      className="input disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="label text-[11px]">Öffnet (NM)</label>
                    <input
                      type="time"
                      name={`hours_${key}_open2`}
                      defaultValue={dayData.open2 ?? ""}
                      disabled={isClosed}
                      className="input disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="label text-[11px]">Schließt (NM)</label>
                    <input
                      type="time"
                      name={`hours_${key}_close2`}
                      defaultValue={dayData.close2 ?? ""}
                      disabled={isClosed}
                      className="input disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-[#999] mt-2">NM = Nachmittag (leer lassen wenn keine Mittagspause)</p>
      </fieldset>

      {/* ── Galerie ────────────────────────────────────────────────── */}
      <fieldset className="bg-white border border-[#e5e7eb] rounded-[6px] p-6">
        <legend className="text-[13px] font-semibold text-[#555] tracking-wide px-2 mb-4">
          Galerie (bis zu 6 Bilder)
        </legend>
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i}>
              <ImageUpload
                label={`Bild ${i + 1}`}
                value={galleryImages[i] ?? ""}
                onChange={(url) => setGalleryImage(i, url)}
                aspectRatio="free"
                folder="practice-images"
              />
              <input type="hidden" name={`galleryImages[${i}]`} value={galleryImages[i] ?? ""} />
            </div>
          ))}
        </div>
      </fieldset>

      {/* ── Sprachen ───────────────────────────────────────────────── */}
      <fieldset className="bg-white border border-[#e5e7eb] rounded-[6px] p-6">
        <legend className="text-[13px] font-semibold text-[#555] tracking-wide px-2 mb-4">
          Sprachen (in der Praxis gesprochen)
        </legend>
        <input
          type="text"
          value={langSearch}
          onChange={(e) => setLangSearch(e.target.value)}
          placeholder="Sprachen filtern..."
          className="input mb-3"
        />
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {filteredLangs.map(({ slug, label }) => (
              <label key={slug} className="flex items-center gap-2 text-[13px] text-[#555] cursor-pointer">
                <input
                  type="checkbox"
                  name="languages"
                  value={slug}
                  defaultChecked={hasLanguage(slug)}
                  className="rounded border-gray-300 text-[#30A2F1] focus:ring-[#30A2F1]"
                />
                {label}
              </label>
            ))}
            {filteredLangs.length === 0 && (
              <p className="col-span-3 text-[12px] text-[#999] py-2">Keine Treffer</p>
            )}
          </div>
        </div>
      </fieldset>

      {/* ── Behandlungen ───────────────────────────────────────────── */}
      <fieldset className="bg-white border border-[#e5e7eb] rounded-[6px] p-6">
        <legend className="text-[13px] font-semibold text-[#555] tracking-wide px-2 mb-4">
          Behandlungen
        </legend>
        <input
          type="text"
          value={treatSearch}
          onChange={(e) => setTreatSearch(e.target.value)}
          placeholder="Behandlungen filtern..."
          className="input mb-3"
        />
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filteredTreatments.map(({ slug, label }) => (
              <label key={slug} className="flex items-center gap-2 text-[13px] text-[#555] cursor-pointer">
                <input
                  type="checkbox"
                  name="treatments"
                  value={slug}
                  defaultChecked={hasTreatment(slug)}
                  className="rounded border-gray-300 text-[#30A2F1] focus:ring-[#30A2F1]"
                />
                {label}
              </label>
            ))}
            {filteredTreatments.length === 0 && (
              <p className="col-span-2 text-[12px] text-[#999] py-2">Keine Treffer</p>
            )}
          </div>
        </div>
      </fieldset>

      {/* ── Submit ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 pb-8">
        <button
          type="submit"
          disabled={pending}
          className="bg-[#30A2F1] hover:bg-[#1a8fd8] disabled:opacity-60 !text-white font-semibold px-8 py-2.5 rounded-[4px] transition-colors text-[14px]"
        >
          {pending ? "Speichern…" : "Änderungen speichern"}
        </button>
        <a href="/account/profil" className="text-[13px] text-[#999] hover:text-[#333] transition-colors">
          Abbrechen
        </a>
      </div>
    </form>
  );
}
