import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json({ results: [] });

  const [articles, locations] = await Promise.all([
    db.article.findMany({
      where: {
        status: "published",
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: { id: true, title: true, slug: true, category: { select: { name: true } } },
    }),
    db.location.findMany({
      where: {
        status: "published",
        name: { contains: q, mode: "insensitive" },
      },
      take: 3,
      select: { id: true, name: true, slug: true },
    }),
  ]);

  const results = [
    ...locations.map((l) => ({ id: l.id, title: l.name, slug: l.slug, type: "location" as const })),
    ...articles.map((a) => ({ id: a.id, title: a.title, slug: a.slug, type: "article" as const, category: a.category?.name })),
  ];

  return NextResponse.json({ results });
}
