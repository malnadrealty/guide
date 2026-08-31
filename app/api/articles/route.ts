import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { toSlug } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const status = req.nextUrl.searchParams.get("status");
  const articles = await db.article.findMany({
    where: status ? { status } : {},
    orderBy: { updatedAt: "desc" },
    include: { category: true, location: true, author: { select: { name: true } } },
  });
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, slug, categoryId, locationId, excerpt, content, featuredImage, seoTitle, metaDescription, canonicalUrl, ogImage, status } = body;

  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const finalSlug = slug || toSlug(title);

  const existing = await db.article.findUnique({ where: { slug: finalSlug } });
  if (existing) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });

  const article = await db.article.create({
    data: {
      title,
      slug: finalSlug,
      categoryId: categoryId || null,
      locationId: locationId || null,
      excerpt: excerpt || null,
      content: content || null,
      featuredImage: featuredImage || null,
      seoTitle: seoTitle || null,
      metaDescription: metaDescription || null,
      canonicalUrl: canonicalUrl || null,
      ogImage: ogImage || null,
      status: status || "draft",
      publishedAt: status === "published" ? new Date() : null,
      authorId: session.user.id,
    },
  });

  return NextResponse.json(article, { status: 201 });
}
