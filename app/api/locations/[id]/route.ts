import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sanitizeContent } from "@/lib/sanitize";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const location = await db.location.findUnique({ where: { id } });
  if (!location) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(location);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  try {
    const body = await req.json();

    const existing = await db.location.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const location = await db.location.update({
      where: { id },
      data: {
        name: body.name !== undefined ? String(body.name).slice(0, 200) : existing.name,
        slug: body.slug !== undefined ? body.slug : existing.slug,
        district: body.district !== undefined ? body.district || null : existing.district,
        taluk: body.taluk !== undefined ? body.taluk || null : existing.taluk,
        shortDescription: body.shortDescription !== undefined ? (body.shortDescription ? String(body.shortDescription).slice(0, 1000) : null) : existing.shortDescription,
        description: body.description !== undefined ? sanitizeContent(body.description) : existing.description,
        heroImage: body.heroImage !== undefined ? body.heroImage || null : existing.heroImage,
        gallery: Array.isArray(body.gallery) ? body.gallery : existing.gallery,
        seoTitle: body.seoTitle !== undefined ? (body.seoTitle ? String(body.seoTitle).slice(0, 160) : null) : existing.seoTitle,
        metaDescription: body.metaDescription !== undefined ? (body.metaDescription ? String(body.metaDescription).slice(0, 500) : null) : existing.metaDescription,
        ogImage: body.ogImage !== undefined ? body.ogImage || null : existing.ogImage,
        status: body.status !== undefined ? (["draft", "published"].includes(body.status) ? body.status : existing.status) : existing.status,
        order: body.order !== undefined ? Number(body.order) || existing.order : existing.order,
        updatedAt: new Date(),
      },
    });
    revalidateTag("locations", { expire: 0 });
    return NextResponse.json(location);
  } catch (err) {
    console.error("PATCH /api/locations/[id]:", err);
    return NextResponse.json({ error: "Failed to update location" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await db.location.delete({ where: { id } });
    revalidateTag("locations", { expire: 0 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/locations/[id]:", err);
    return NextResponse.json({ error: "Failed to delete location" }, { status: 500 });
  }
}
