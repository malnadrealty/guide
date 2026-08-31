import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { toSlug } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const locations = await db.location.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(locations);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { name, slug, district, taluk, shortDescription, description, heroImage, gallery, seoTitle, metaDescription, ogImage, status } = body;
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const finalSlug = slug || toSlug(name);
  const location = await db.location.create({
    data: { name, slug: finalSlug, district, taluk, shortDescription, description, heroImage, gallery: gallery || [], seoTitle, metaDescription, ogImage, status: status || "draft" },
  });
  revalidateTag("locations");
  return NextResponse.json(location, { status: 201 });
}
