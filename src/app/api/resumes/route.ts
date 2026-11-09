import { NextResponse } from "next/server";
import { createResume, listResumes } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const userId = new URL(request.url).searchParams.get("userId") ?? "";
  if (!userId) return NextResponse.json({ error: "ابتدا وارد شوید." }, { status: 401 });
  return NextResponse.json({ resumes: await listResumes(userId) });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    userId?: string;
    lang?: string;
    title?: string;
    copyOf?: string;
    template?: string;
    color?: string;
    ifNone?: boolean;
  };
  if (!body.userId) return NextResponse.json({ error: "ابتدا وارد شوید." }, { status: 401 });
  try {
    const resume = await createResume(String(body.userId), {
      lang: body.lang === "en" ? "en" : "fa",
      title: typeof body.title === "string" ? body.title : undefined,
      copyOf: typeof body.copyOf === "string" ? body.copyOf : undefined,
      template: body.template,
      color: body.color,
      ifNone: body.ifNone === true,
    });
    return NextResponse.json({ resume });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
