import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Ordner, in die auch Mitglieder hochladen dürfen (eigene Profilbilder/Galerie)
const MEMBER_ALLOWED_FOLDERS = new Set(["doctor-images", "practice-images"]);

// Bucket-Zuordnung je nach folder
const BUCKET_MAP: Record<string, string> = {
  "post-images":     "posts",
  "doctor-images":   "doctor-images",
  "practice-images": "practice-images",
  "expert-images":   "Experts",
  "media-files":     "Logos & Media",
  "bibliothek":      "Bibliothek",
};

// ── POST /api/upload ─────────────────────────────────────────────────────────
//
// Zwei Modi:
//
//   1) FormData (legacy / kleine Dateien):
//      Body: multipart mit "file" + "folder"
//      → Server lädt direkt zu Supabase
//      → Response: { url, fileName, fileType, fileSize }
//
//   2) Signed Upload URL (empfohlen, größere Dateien):
//      Body: JSON { mode: "signed", fileName, folder, contentType }
//      → Server erstellt Signed Upload URL bei Supabase
//      → Response: { signedUrl, token, path, publicUrl }
//      → Client PUTet Datei selbst direkt an Supabase
//
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    console.warn("[upload] No session");
    return NextResponse.json({ error: "Nicht angemeldet. Bitte neu einloggen." }, { status: 401 });
  }
  const role = (session.user as { role?: string }).role;

  const contentType = req.headers.get("content-type") ?? "";

  // ── Modus 2: Signed URL (JSON) ────────────────────────────────────────────
  if (contentType.includes("application/json")) {
    let body: { mode?: string; fileName?: string; folder?: string; contentType?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Ungültiges JSON" }, { status: 400 });
    }

    const fileName = body.fileName ?? "";
    const folder   = body.folder   ?? "doctor-images";
    const fileCT   = body.contentType ?? "application/octet-stream";

    if (!fileName) {
      return NextResponse.json({ error: "fileName fehlt" }, { status: 400 });
    }

    if (role !== "ADMIN" && !MEMBER_ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const bucket   = BUCKET_MAP[folder] ?? "doctor-images";
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path     = `${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error || !data) {
      console.error("[upload] createSignedUploadUrl failed:", error);
      return NextResponse.json({ error: error?.message ?? "Signed URL failed" }, { status: 500 });
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);

    return NextResponse.json({
      signedUrl:  data.signedUrl,
      token:      data.token,
      path,
      bucket,
      publicUrl:  publicData.publicUrl,
      contentType: fileCT,
    });
  }

  // ── Modus 1: FormData (legacy, Proxy-Upload) ──────────────────────────────
  const formData = await req.formData();
  const file   = formData.get("file")   as File | null;
  const folder = (formData.get("folder") as string | null) ?? "doctor-images";
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  if (role !== "ADMIN" && !MEMBER_ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Datei zu groß für Server-Upload. Bitte Signed-URL-Modus nutzen." },
      { status: 413 }
    );
  }

  const bucket   = BUCKET_MAP[folder] ?? "doctor-images";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (error) {
    console.error("[upload] proxy upload failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
  return NextResponse.json({
    url:      data.publicUrl,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  });
}
