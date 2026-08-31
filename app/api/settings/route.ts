import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SETTING_KEYS } from "@/lib/setting-constants";

export async function GET() {
  try {
    const rows = await db.siteSetting.findMany();
    return NextResponse.json(Object.fromEntries(rows.map((r) => [r.key, r.value])));
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    await Promise.all(
      SETTING_KEYS.filter((key) => key in body).map((key) =>
        db.siteSetting.upsert({
          where: { key },
          update: { value: String(body[key]) },
          create: { key, value: String(body[key]) },
        })
      )
    );
    revalidateTag("settings", { expire: 0 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
