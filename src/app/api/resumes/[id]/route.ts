import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { deleteResume, getResume, updateResume } from "@/lib/server-store";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ error: "رزومه پیدا نشد." }, { status: 404 });

export async function GET(request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const userId = request.nextUrl.searchParams.get("userId") ?? "";
  const resume = userId ? await getResume(id, userId) : null;
  return resume ? NextResponse.json({ resume }) : notFound();
}

export async function PUT(request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const userId = typeof body.userId === "string" ? body.userId : "";
  if (!userId) return notFound();
  const resume = await updateResume(id, userId, body);
  return resume ? NextResponse.json({ resume }) : notFound();
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const userId = request.nextUrl.searchParams.get("userId") ?? "";
  const ok = userId ? await deleteResume(id, userId) : false;
  return ok ? NextResponse.json({ ok }) : notFound();
}
