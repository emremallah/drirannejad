import { NextResponse } from "next/server";
import { hasPledge, savePledge } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId") ?? "";
  const course = url.searchParams.get("course") ?? "";
  if (!userId || !course) return NextResponse.json({ ok: false, pledged: false }, { status: 400 });
  return NextResponse.json({ ok: true, pledged: await hasPledge(userId, course) });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { userId?: string; course?: string };
  if (!body.userId || !body.course) {
    return NextResponse.json({ error: "اطلاعات ناقص است." }, { status: 400 });
  }
  const row = await savePledge(body.userId, body.course);
  return NextResponse.json({ ok: true, pledge: row });
}
