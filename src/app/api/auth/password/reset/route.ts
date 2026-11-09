import { NextResponse } from "next/server";
import { resetPasswordWithOtp } from "@/lib/server-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await resetPasswordWithOtp(
      String(body.phone ?? ""),
      String(body.code ?? ""),
      String(body.password ?? ""),
    );
    const { passwordHash: _, ...safe } = user;
    return NextResponse.json({ user: safe });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "تغییر رمز انجام نشد." },
      { status: 400 },
    );
  }
}
