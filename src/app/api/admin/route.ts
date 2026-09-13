import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/server-store";

export async function GET() {
  return NextResponse.json(await getAdmin());
}
