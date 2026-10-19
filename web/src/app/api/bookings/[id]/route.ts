import { deleteBooking, getBooking, updateBooking } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const booking = getBooking(id);
  if (!booking) return NextResponse.json({ error: "ไม่พบ" }, { status: 404 });
  return NextResponse.json({ booking });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const booking = updateBooking(id, body);
    return NextResponse.json({ booking });
  } catch (err) {
    if (err instanceof Error && err.message === "SLOT_TAKEN") {
      return NextResponse.json({ error: "ช่วงเวลานี้ถูกจองแล้ว" }, { status: 409 });
    }
    return NextResponse.json({ error: "ไม่พบ" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    deleteBooking(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "ไม่พบ" }, { status: 404 });
  }
}
