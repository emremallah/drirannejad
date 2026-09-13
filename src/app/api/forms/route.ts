import { NextResponse } from "next/server";
import { saveForm } from "@/lib/server-store";

export async function POST(request: Request) {
  const body = await request.json();
  const row = await saveForm(body.kind, body.data ?? {});
  return NextResponse.json({ ok: true, id: row.id });
}
