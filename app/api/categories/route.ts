import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { toSlug } from "@/lib/utils";

export async function GET() {
  const categories = await db.category.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { name, slug, description } = body;
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const finalSlug = slug || toSlug(name);
  const category = await db.category.create({ data: { name, slug: finalSlug, description } });
  return NextResponse.json(category, { status: 201 });
}
