import { NextResponse } from "next/server";
import { requestOtp } from "@/lib/server-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const purpose = body.purpose === "reset" ? "reset" : "login";
    const result = await requestOtp(String(body.phone ?? ""), purpose);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "ارسال کد انجام نشد." },
      { status: 400 },
    );
  }
}
