import { NextResponse } from "next/server";
import { loginWithOtp } from "@/lib/server-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await loginWithOtp(String(body.phone ?? ""), String(body.code ?? ""));
    const { passwordHash: _, ...safe } = user;
    return NextResponse.json({ user: safe });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "ورود ناموفق" },
      { status: 400 },
    );
  }
}
