import { NextResponse } from "next/server";
import { getEarnPlan } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getEarnPlan());
}
