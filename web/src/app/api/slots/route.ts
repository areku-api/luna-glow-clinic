import { getBookedTimes, listSlots } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "ต้องระบุวันที่" }, { status: 400 });
  }
  const booked = new Set(getBookedTimes(date));
  return NextResponse.json({
    date,
    slots: listSlots().map((time) => ({
      time,
      available: !booked.has(time),
    })),
  });
}
