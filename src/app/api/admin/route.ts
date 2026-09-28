import { NextResponse } from "next/server";
import { adjustWallet, getAdmin, saveCourseRules, saveEarnPlan } from "@/lib/server-store";
import { normalizeCourseRules, type CourseRules } from "@/lib/course-rules";
import { normalizeEarnPlan, type EarnPlan } from "@/lib/earn-plan";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getAdmin());
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    action?: string;
    plan?: Partial<EarnPlan>;
    rules?: Partial<CourseRules>;
    userId?: string;
    delta?: number;
  };

  if (body.action === "saveEarnPlan") {
    const plan = await saveEarnPlan(normalizeEarnPlan(body.plan));
    return NextResponse.json({ ok: true, plan });
  }

  if (body.action === "saveCourseRules") {
    const rules = await saveCourseRules(normalizeCourseRules(body.rules));
    return NextResponse.json({ ok: true, rules });
  }

  if (body.action === "adjustWallet") {
    if (!body.userId) {
      return NextResponse.json({ error: "شناسه کاربر لازم است." }, { status: 400 });
    }
    const wallet = await adjustWallet(body.userId, Number(body.delta) || 0);
    return NextResponse.json({ ok: true, wallet });
  }

  return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 });
}
