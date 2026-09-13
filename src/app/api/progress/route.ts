import { NextResponse } from "next/server";
import { getProgress, submitHomework } from "@/lib/server-store";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const row = await getProgress(url.searchParams.get("userId") ?? "", url.searchParams.get("course") ?? "");
  return NextResponse.json(row);
}

export async function POST(request: Request) {
  const body = await request.json();
  const row = await submitHomework(String(body.userId), String(body.course), String(body.note ?? ""));
  return NextResponse.json(row);
}
