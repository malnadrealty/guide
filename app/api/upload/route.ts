import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const alt = formData.get("alt") as string | null;
  const caption = formData.get("caption") as string | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "Invalid file type" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Process with sharp — convert to WebP
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const webpBuffer = await image.webp({ quality: 85 }).toBuffer();

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), webpBuffer);

  const url = `/uploads/${filename}`;

  const media = await db.media.create({
    data: {
      filename: file.name,
      url,
      mimeType: "image/webp",
      size: webpBuffer.length,
      width: metadata.width || null,
      height: metadata.height || null,
      alt: alt || null,
      caption: caption || null,
    },
  });

  return NextResponse.json(media, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const media = await db.media.findUnique({ where: { id } });
  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Remove file
  try {
    const { unlink } = await import("fs/promises");
    await unlink(path.join(process.cwd(), "public", media.url));
  } catch { /* file may already be gone */ }

  await db.media.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
