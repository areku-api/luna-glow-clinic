import { deleteOrder, getOrder, updateOrder } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const order = getOrder(id);
  if (!order) return NextResponse.json({ error: "ไม่พบออเดอร์" }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const order = updateOrder(id, body);
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "ไม่พบ" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    deleteOrder(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "ไม่พบ" }, { status: 404 });
  }
}
