import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { toSlug } from "@/lib/utils";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const article = await db.article.findUnique({
    where: { id },
    include: { category: true, location: true, author: { select: { name: true } } },
  });
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(article);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  try {
    const body = await req.json();

    const existing = await db.article.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const wasPublished = existing.status === "published";
    const nowPublished = body.status === "published";

    const article = await db.article.update({
      where: { id },
      data: {
        ...body,
        categoryId: body.categoryId || null,
        locationId: body.locationId || null,
        slug: body.slug || body.title ? toSlug(body.slug || body.title || existing.title) : existing.slug,
        publishedAt: nowPublished && !wasPublished ? new Date() : existing.publishedAt,
        updatedAt: new Date(),
      },
    });
    revalidateTag("articles", { expire: 0 });
    return NextResponse.json(article);
  } catch (err) {
    console.error("PATCH /api/articles/[id]:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await db.article.delete({ where: { id } });
    revalidateTag("articles", { expire: 0 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/articles/[id]:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to delete" }, { status: 500 });
  }
}
