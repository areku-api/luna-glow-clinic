import { createBooking, listBookings } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date") ?? undefined;
  return NextResponse.json({ bookings: listBookings(date) });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const booking = createBooking({
      serviceId: body.serviceId,
      customerName: String(body.customerName ?? "").trim(),
      phone: String(body.phone ?? "").trim(),
      date: body.date,
      time: body.time,
      note: String(body.note ?? ""),
      status: body.status ?? "pending",
    });
    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "SLOT_TAKEN") {
      return NextResponse.json({ error: "ช่วงเวลานี้ถูกจองแล้ว" }, { status: 409 });
    }
    return NextResponse.json({ error: "จองไม่สำเร็จ" }, { status: 400 });
  }
}
