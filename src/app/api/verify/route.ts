import { NextResponse } from "next/server";
import { findDoc, getUser, verifyCode } from "@/lib/server-store";

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code") ?? "";
  if (!verifyCode(code)) return NextResponse.json({ valid: false });
  const doc = await findDoc(code);
  if (!doc) return NextResponse.json({ valid: false });
  const user = await getUser(doc.userId);
  return NextResponse.json({
    valid: true,
    type: doc.type,
    title: doc.title,
    name: user?.name,
    phone: user?.phone,
    createdAt: doc.createdAt,
  });
}
