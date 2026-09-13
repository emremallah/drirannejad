import { NextResponse } from "next/server";
import { attachTestToResume, saveTest } from "@/lib/server-store";

export async function POST(request: Request) {
  const body = await request.json();
  if (body.attach && body.testId) {
    const row = await attachTestToResume(String(body.testId));
    return NextResponse.json({ result: row });
  }
  const result = await saveTest({
    userId: body.userId ? String(body.userId) : undefined,
    name: String(body.name ?? ""),
    phone: String(body.phone ?? ""),
    testSlug: String(body.testSlug ?? ""),
    score: Number(body.score ?? 0),
    summary: String(body.summary ?? ""),
    answers: Array.isArray(body.answers) ? body.answers.map(Number) : [],
  });
  return NextResponse.json({ result });
}
