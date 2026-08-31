import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface Params { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  try {
    const body = await req.json();
    const existing = await db.category.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const category = await db.category.update({
      where: { id },
      data: {
        name: body.name !== undefined ? String(body.name).slice(0, 100) : existing.name,
        slug: body.slug !== undefined ? body.slug : existing.slug,
        description: body.description !== undefined ? body.description || null : existing.description,
        order: body.order !== undefined ? Number(body.order) || existing.order : existing.order,
      },
    });
    return NextResponse.json(category);
  } catch (err) {
    console.error("PATCH /api/categories/[id]:", err);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await db.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/categories/[id]:", err);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
