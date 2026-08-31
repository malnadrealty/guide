import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const BUCKET = "media";

// Magic bytes for allowed image types — validate actual file content, not client-supplied header
const MAGIC_SIGNATURES: { bytes: number[]; mime: string; ext: string }[] = [
  { bytes: [0xff, 0xd8, 0xff],           mime: "image/jpeg", ext: "jpg" },
  { bytes: [0x89, 0x50, 0x4e, 0x47],     mime: "image/png",  ext: "png" },
  { bytes: [0x52, 0x49, 0x46, 0x46],     mime: "image/webp", ext: "webp" }, // RIFF...WEBP
];

function detectMimeType(buf: Buffer): { mime: string; ext: string } | null {
  for (const sig of MAGIC_SIGNATURES) {
    if (sig.bytes.every((b, i) => buf[i] === b)) {
      // Extra check for WEBP: bytes 8-11 must be "WEBP"
      if (sig.ext === "webp") {
        const webp = buf.slice(8, 12).toString("ascii");
        if (webp !== "WEBP") continue;
      }
      return { mime: sig.mime, ext: sig.ext };
    }
  }
  return null;
}

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const alt = formData.get("alt") as string | null;
  const caption = formData.get("caption") as string | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Validate by magic bytes, not by client-supplied Content-Type
  const detected = detectMimeType(buffer);
  if (!detected) {
    return NextResponse.json({ error: "Unsupported file type. JPEG, PNG and WebP images only." }, { status: 400 });
  }

  // Server-generated filename — never use client-supplied filename
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${detected.ext}`;

  const supabase = getSupabase();

  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find((b) => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: true });
  }

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filename, buffer, { contentType: detected.mime, upsert: false });

  if (uploadError) {
    console.error("Supabase upload error:", uploadError.message);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filename);

  let width: number | null = null;
  let height: number | null = null;
  try {
    const sharp = (await import("sharp")).default;
    const meta = await sharp(buffer).metadata();
    width = meta.width ?? null;
    height = meta.height ?? null;
  } catch { /* sharp unavailable */ }

  const media = await db.media.create({
    data: {
      // Store original filename for display only; actual storage uses server-generated name
      filename: (file.name || "upload").slice(0, 255).replace(/[^\w.-]/g, "_"),
      url: publicUrl,
      mimeType: detected.mime,
      size: buffer.length,
      width,
      height,
      alt: alt ? String(alt).slice(0, 500) : null,
      caption: caption ? String(caption).slice(0, 1000) : null,
    },
  });

  return NextResponse.json(media, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let id: string;
  try {
    ({ id } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Media id required" }, { status: 400 });
  }

  const media = await db.media.findUnique({ where: { id } });
  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (media.url.includes("supabase")) {
    try {
      const supabase = getSupabase();
      const path = media.url.split(`/${BUCKET}/`)[1];
      if (path) await supabase.storage.from(BUCKET).remove([path]);
    } catch { /* storage cleanup failure is non-fatal */ }
  }

  await db.media.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
