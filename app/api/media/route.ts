import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const q = req.nextUrl.searchParams.get("q");
  const media = await db.media.findMany({
    where: q ? { filename: { contains: q, mode: "insensitive" } } : {},
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(media);
}
