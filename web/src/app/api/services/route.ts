import { createService, listServices } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const activeOnly = req.nextUrl.searchParams.get("active") === "1";
  return NextResponse.json({ services: listServices(activeOnly) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const service = createService({
    name: String(body.name ?? "").trim(),
    summary: String(body.summary ?? "").trim(),
    durationMin: Number(body.durationMin ?? 30),
    price: Number(body.price ?? 0),
    active: body.active !== false,
  });
  return NextResponse.json({ service }, { status: 201 });
}
