"use client";

import { useActionState, useState, useCallback } from "react";
import { createPost, updatePost } from "@/app/actions/posts";
import ImageUpload from "@/components/admin/ImageUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Loader2, Upload } from "lucide-react";

// ── Inline image extracted from HTML content ──────────────────────────────────
type InlineImage = { src: string; alt: string; index: number };

function extractInlineImages(html: string): InlineImage[] {
  const regex = /<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*\/?>/gi;
  const results: InlineImage[] = [];
  let match; let i = 0;
  while ((match = regex.exec(html)) !== null) {
    results.push({ src: match[1], alt: match[2], index: i++ });
  }
  return results;
}

function replaceInlineImage(html: string, index: number, newSrc: string): string {
  let i = 0;
  return html.replace(/<img([^>]+)src="([^"]+)"([^>]*)\/?>/gi, (full, before, _src, after) => {
    if (i++ === index) return `<img${before}src="${newSrc}"${after}/>`;
    return full;
  });
}

// ── Single inline image swap widget ──────────────────────────────────────────
function InlineImageRow({
  img,
  onReplace,
}: {
  img: InlineImage;
  onReplace: (index: number, newSrc: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback(async (file: File) => {
    setError(""); setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "post-images");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Upload fehlgeschlagen");
      onReplace(img.index, data.url);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }, [img.index, onReplace]);

  return (
    <div className="flex items-center gap-4 p-3 border border-[#e5e7eb] rounded-lg bg-gray-50">
      {/* Preview */}
      <div className="w-24 h-16 flex-shrink-0 rounded overflow-hidden border border-gray-200 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.src} alt={img.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      {/* Info + Upload */}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] text-[#555] truncate mb-2">{img.alt || `Bild ${img.index + 1}`}</p>
        <label className={`inline-flex items-center gap-1.5 cursor-pointer text-[12px] font-medium px-3 py-1.5 rounded border transition-colors
          ${uploading ? "bg-gray-100 text-gray-400 border-gray-200" : "bg-white text-[#30A2F1] border-[#30A2F1] hover:bg-[#EFF6FF]"}`}>
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
          {uploading ? "Lädt hoch…" : "Ersetzen"}
          <input type="file" accept="image/*" className="hidden" disabled={uploading}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
        </label>
        {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
}

type Post = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  category: string;
  domains: string[];
  published: boolean;
  publishedAt: Date | null;
  metaTitle: string | null;
  metaDesc: string | null;
};

type Props = {
  post?: Post;
};

const CATEGORIES = [
  { value: "GRUNDLAGEN",   label: "Grundlagen & Verfahren" },
  { value: "ZAHNERSATZ",   label: "Zahnersatz & Prothetik" },
  { value: "ERKRANKUNGEN", label: "Erkrankungen & Symptome" },
  { value: "BEHANDLUNGEN", label: "Behandlungen & Eingriffe" },
  { value: "KOSTEN",       label: "Kosten & Versicherung" },
  { value: "RATGEBER",     label: "Ratgeber" },
  { value: "ZAHNAERZTE",   label: "Zahnärzte" },
];

function formatDateForInput(d: Date | null) {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

// ── SEO helpers ───────────────────────────────────────────────────────────────

function MetaCounter({ name, max }: { name: string; max: number }) {
  const [len, setLen] = useState(0);
  return (
    <span
      className={`text-[11px] ${len > max ? "text-red-500" : "text-[#aaa]"}`}
      data-counter={name}
      suppressHydrationWarning
    >
      {/* updated via onChange on parent input – placeholder only */}
      {len}/{max}
    </span>
  );
}

function SeoPreview({ defaultTitle, defaultDesc, slug }: { defaultTitle: string; defaultDesc: string; slug: string }) {
  const [title, setTitle] = useState(defaultTitle);
  const [desc,  setDesc]  = useState(defaultDesc);

  // Listen to form field changes via DOM (no prop drilling needed)
  if (typeof window !== "undefined") {
    // handled via useEffect below
  }

  return (
    <div className="mt-2">
      <p className="label mb-2">Google-Vorschau</p>
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <p className="text-[11px] text-green-700 mb-1 truncate">mycleandent.de{slug}</p>
        <p className="text-[16px] text-[#1a0dab] font-medium leading-tight mb-1 line-clamp-1">
          {title || "Seitentitel"}
        </p>
        <p className="text-[13px] text-[#4d5156] line-clamp-2">
          {desc || "Beschreibung des Beitrags erscheint hier in den Suchergebnissen."}
        </p>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function PostForm({ post }: Props) {
  const isEdit = !!post;
  const action = isEdit ? updatePost.bind(null, post.id) : createPost;

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

  const [imageUrl, setImageUrl] = useState(post?.imageUrl ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const inlineImages = extractInlineImages(content);

  const handleInlineReplace = useCallback((index: number, newSrc: string) => {
    setContent(prev => replaceInlineImage(prev, index, newSrc));
  }, []);

  const hasDomain = (d: string) => (post?.domains ?? ["DE"]).includes(d);

  return (
    <form action={formAction} className="space-y-6 max-w-4xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* ── Titel & Bild ─────────────────────────────────────────────── */}
      <fieldset className="bg-white border border-[#e5e7eb] rounded-[6px] p-6">
        <legend className="text-[13px] font-semibold text-[#555] uppercase tracking-wide px-2 mb-4">
          Beitrag
        </legend>
        <div className="space-y-4">
          <div>
            <label className="label">Titel *</label>
            <input name="title" defaultValue={post?.title ?? ""} required className="input" />
          </div>
          <div>
            <label className="label">Kurzbeschreibung (Excerpt)</label>
            <textarea name="excerpt" defaultValue={post?.excerpt ?? ""} rows={2} className="input resize-none" />
          </div>
          <div>
            <ImageUpload
              label="Beitragsbild"
              value={imageUrl}
              onChange={setImageUrl}
              aspectRatio="free"
              folder="post-images"
            />
            <input type="hidden" name="imageUrl" value={imageUrl} />
          </div>
        </div>
      </fieldset>

      {/* ── Inhalt ───────────────────────────────────────────────────── */}
      <fieldset className="bg-white border border-[#e5e7eb] rounded-[6px] p-6">
        <legend className="text-[13px] font-semibold text-[#555] uppercase tracking-wide px-2 mb-4">
          Inhalt
        </legend>
        <RichTextEditor
          defaultValue={content}
          name="content"
          onChange={setContent}
        />
      </fieldset>

      {/* ── Inline-Bilder ─────────────────────────────────────────────── */}
      {inlineImages.length > 0 && (
        <fieldset className="bg-white border border-[#e5e7eb] rounded-[6px] p-6">
          <legend className="text-[13px] font-semibold text-[#555] uppercase tracking-wide px-2 mb-1">
            Bilder im Beitrag
          </legend>
          <p className="text-[12px] text-[#999] mb-4 px-2">
            Klicke auf &quot;Ersetzen&quot; um ein Bild durch ein neues auszutauschen.
          </p>
          <div className="space-y-3">
            {inlineImages.map(img => (
              <InlineImageRow key={img.index} img={img} onReplace={handleInlineReplace} />
            ))}
          </div>
        </fieldset>
      )}

      {/* ── Einstellungen ────────────────────────────────────────────── */}
      <fieldset className="bg-white border border-[#e5e7eb] rounded-[6px] p-6">
        <legend className="text-[13px] font-semibold text-[#555] uppercase tracking-wide px-2 mb-4">
          Einstellungen
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Kategorie */}
          <div>
            <label className="label">Kategorie</label>
            <select name="category" defaultValue={post?.category ?? "GRUNDLAGEN"} className="input">
              {CATEGORIES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Domains */}
          <div>
            <p className="label mb-2">Domain</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#555]">
                <input type="checkbox" name="domains" value="DE" defaultChecked={hasDomain("DE")} className="rounded" />
                mycleandent<strong>.de</strong> (DACH)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#555]">
                <input type="checkbox" name="domains" value="COM" defaultChecked={hasDomain("COM")} className="rounded" />
                mycleandent<strong>.com</strong> (International)
              </label>
            </div>
          </div>

          {/* Veröffentlichung */}
          <div>
            <p className="label mb-2">Veröffentlichung</p>
            <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#555] mb-3">
              <input type="checkbox" name="published" defaultChecked={post?.published ?? false} className="rounded" />
              Veröffentlicht
            </label>
            <div>
              <label className="label">Datum</label>
              <input
                type="date"
                name="publishedAt"
                defaultValue={formatDateForInput(post?.publishedAt ?? null)}
                className="input"
              />
            </div>
          </div>

        </div>
      </fieldset>

      {/* ── SEO ─────────────────────────────────────────────────────── */}
      <fieldset className="bg-white border border-[#e5e7eb] rounded-[6px] p-6">
        <legend className="text-[13px] font-semibold text-[#555] uppercase tracking-wide px-2 mb-1">
          SEO
        </legend>
        <p className="text-[12px] text-[#999] mb-4 px-2">Leer lassen = Titel bzw. Excerpt wird automatisch verwendet</p>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="label mb-0">Meta-Titel</label>
              <MetaCounter name="metaTitle" max={60} />
            </div>
            <input
              name="metaTitle"
              defaultValue={post?.metaTitle ?? ""}
              placeholder={post?.title ?? "Wird vom Titel übernommen"}
              maxLength={60}
              className="input"
            />
            <p className="text-[11px] text-[#aaa] mt-1">Empfehlung: max. 60 Zeichen</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="label mb-0">Meta-Description</label>
              <MetaCounter name="metaDesc" max={160} />
            </div>
            <textarea
              name="metaDesc"
              defaultValue={post?.metaDesc ?? ""}
              placeholder={post?.excerpt ?? "Wird aus dem Excerpt übernommen"}
              maxLength={160}
              rows={3}
              className="input resize-none"
            />
            <p className="text-[11px] text-[#aaa] mt-1">Empfehlung: max. 160 Zeichen</p>
          </div>
          {/* Preview */}
          <SeoPreview
            defaultTitle={post?.metaTitle ?? post?.title ?? ""}
            defaultDesc={post?.metaDesc ?? post?.excerpt ?? ""}
            slug={post ? `/wissenswert/${(post as { slug?: string }).slug ?? ""}` : "/wissenswert/neuer-beitrag"}
          />
        </div>
      </fieldset>

      {/* ── Submit ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 pb-8">
        <button
          type="submit"
          disabled={pending}
          className="bg-[#30A2F1] hover:bg-[#1a8fd8] disabled:opacity-60 !text-white font-semibold px-8 py-2.5 rounded text-[14px] transition-colors"
        >
          {pending ? "Speichern…" : isEdit ? "Änderungen speichern" : "Beitrag anlegen"}
        </button>
        <a href="/admin/posts" className="text-[13px] text-[#999] hover:text-[#333] transition-colors">
          Abbrechen
        </a>
      </div>
    </form>
  );
}
