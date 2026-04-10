import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const result: Record<string, unknown> = {
    session: session ? { email: session.user?.email, role } : null,
    supabaseUrl: supabaseUrl ? `${supabaseUrl.slice(0, 30)}...` : "MISSING",
    serviceKey: serviceKey ? `${serviceKey.slice(0, 20)}...` : "MISSING",
    buckets: null,
    bucketsError: null,
    testUpload: null,
    testUploadError: null,
  };

  if (supabaseUrl && serviceKey) {
    const supabase = createClient(supabaseUrl, serviceKey);

    // List buckets
    const { data: bucketData, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      result.bucketsError = bucketError.message;
    } else {
      result.buckets = bucketData.map((b) => ({ id: b.id, name: b.name, public: b.public }));
    }

    // Test upload: write a tiny 1x1 pixel PNG to doctor-images
    const tinyPng = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    const testFilename = `_test_${Date.now()}.png`;
    const { error: uploadError } = await supabase.storage
      .from("doctor-images")
      .upload(testFilename, tinyPng, { contentType: "image/png", upsert: true });

    if (uploadError) {
      result.testUploadError = uploadError.message;
    } else {
      const { data: urlData } = supabase.storage.from("doctor-images").getPublicUrl(testFilename);
      result.testUpload = `SUCCESS → ${urlData.publicUrl}`;
      // Clean up test file
      await supabase.storage.from("doctor-images").remove([testFilename]);
    }
  }

  return NextResponse.json(result);
}
