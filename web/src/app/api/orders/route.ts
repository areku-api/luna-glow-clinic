import { createOrder, listOrders } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ orders: listOrders() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order = createOrder({
      customerName: String(body.customerName ?? "").trim(),
      phone: String(body.phone ?? "").trim(),
      address: String(body.address ?? "").trim(),
      items: body.items ?? [],
    });
    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    const msg =
      err instanceof Error && err.message === "OUT_OF_STOCK"
        ? "สินค้าไม่พอ"
        : "สร้างออเดอร์ไม่สำเร็จ";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
