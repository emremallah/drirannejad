import { NextResponse } from "next/server";
import { publicUser, userDocs, userTests } from "@/lib/server-store";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") ?? "";
  const user = id ? await publicUser(id) : null;
  if (!user) return NextResponse.json({ user: null });
  const [docs, tests] = await Promise.all([userDocs(id), userTests(id)]);
  return NextResponse.json({ user, docs, tests });
}
