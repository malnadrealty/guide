import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { toSlug } from "@/lib/utils";
import { sanitizeContent } from "@/lib/sanitize";

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
    const newStatus = ["draft", "published"].includes(body.status) ? body.status : existing.status;
    const nowPublished = newStatus === "published";

    const article = await db.article.update({
      where: { id },
      data: {
        title: body.title ? String(body.title).slice(0, 500) : existing.title,
        slug: body.slug || body.title ? toSlug(body.slug || body.title || existing.title) : existing.slug,
        categoryId: body.categoryId || null,
        locationId: body.locationId || null,
        excerpt: body.excerpt !== undefined ? (body.excerpt ? String(body.excerpt).slice(0, 1000) : null) : existing.excerpt,
        content: body.content !== undefined ? sanitizeContent(body.content) : existing.content,
        featuredImage: body.featuredImage !== undefined ? body.featuredImage || null : existing.featuredImage,
        seoTitle: body.seoTitle !== undefined ? (body.seoTitle ? String(body.seoTitle).slice(0, 160) : null) : existing.seoTitle,
        metaDescription: body.metaDescription !== undefined ? (body.metaDescription ? String(body.metaDescription).slice(0, 500) : null) : existing.metaDescription,
        canonicalUrl: body.canonicalUrl !== undefined ? body.canonicalUrl || null : existing.canonicalUrl,
        ogImage: body.ogImage !== undefined ? body.ogImage || null : existing.ogImage,
        status: newStatus,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured,
        isPopular: body.isPopular !== undefined ? Boolean(body.isPopular) : existing.isPopular,
        publishedAt: nowPublished && !wasPublished ? new Date() : existing.publishedAt,
        updatedAt: new Date(),
      },
    });
    revalidateTag("articles");
    return NextResponse.json(article);
  } catch (err) {
    console.error("PATCH /api/articles/[id]:", err);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await db.article.delete({ where: { id } });
    revalidateTag("articles");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/articles/[id]:", err);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
