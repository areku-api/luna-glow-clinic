import { deleteService, getService, updateService } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const service = getService(id);
  if (!service) return NextResponse.json({ error: "ไม่พบ" }, { status: 404 });
  return NextResponse.json({ service });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const service = updateService(id, body);
    return NextResponse.json({ service });
  } catch {
    return NextResponse.json({ error: "ไม่พบ" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    deleteService(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "ไม่พบ" }, { status: 404 });
  }
}
