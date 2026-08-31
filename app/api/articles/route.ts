import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { toSlug } from "@/lib/utils";
import { sanitizeContent } from "@/lib/sanitize";

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
  const { title, slug, categoryId, locationId, excerpt, content, featuredImage, seoTitle, metaDescription, canonicalUrl, ogImage, status, isFeatured } = body;

  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const finalSlug = slug || toSlug(title);

  const existing = await db.article.findUnique({ where: { slug: finalSlug } });
  if (existing) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });

  const article = await db.article.create({
    data: {
      title: String(title).slice(0, 500),
      slug: finalSlug,
      categoryId: categoryId || null,
      locationId: locationId || null,
      excerpt: excerpt ? String(excerpt).slice(0, 1000) : null,
      content: sanitizeContent(content),
      featuredImage: featuredImage || null,
      seoTitle: seoTitle ? String(seoTitle).slice(0, 160) : null,
      metaDescription: metaDescription ? String(metaDescription).slice(0, 500) : null,
      canonicalUrl: canonicalUrl || null,
      ogImage: ogImage || null,
      status: ["draft", "published"].includes(status) ? status : "draft",
      isFeatured: Boolean(isFeatured),
      publishedAt: status === "published" ? new Date() : null,
      authorId: session.user.id,
    },
  });

  revalidateTag("articles", { expire: 0 });
  return NextResponse.json(article, { status: 201 });
}
