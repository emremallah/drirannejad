import { NextResponse } from "next/server";
import { registerUser } from "@/lib/server-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user, card } = await registerUser({
      name: String(body.name ?? ""),
      phone: String(body.phone ?? ""),
      email: body.email ? String(body.email) : undefined,
      password: String(body.password ?? ""),
      referredBy: body.referredBy ? String(body.referredBy) : undefined,
    });
    const { passwordHash: _, ...safe } = user;
    return NextResponse.json({ user: safe, card });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "خطا در ثبت‌نام" },
      { status: 400 },
    );
  }
}
