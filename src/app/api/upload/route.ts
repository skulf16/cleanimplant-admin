import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Bucket-Zuordnung je nach folder
const BUCKET_MAP: Record<string, string> = {
  "post-images":     "posts",
  "doctor-images":   "doctor-images",
  "practice-images": "practice-images",
  "expert-images":   "Experts",
  "media-files":     "Logos & Media",
  "bibliothek":      "Bibliothek",
};

export async function POST(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file   = formData.get("file")   as File | null;
  const folder = (formData.get("folder") as string | null) ?? "doctor-images";
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bucket = BUCKET_MAP[folder] ?? "doctor-images";
  const ext      = file.name.split(".").pop() ?? "bin";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
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
