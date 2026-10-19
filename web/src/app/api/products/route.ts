import { createProduct, listProducts } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const activeOnly = req.nextUrl.searchParams.get("active") === "1";
  return NextResponse.json({ products: listProducts(activeOnly) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const product = createProduct({
    name: String(body.name ?? "").trim(),
    category: String(body.category ?? "ทั่วไป"),
    price: Number(body.price ?? 0),
    stock: Number(body.stock ?? 0),
    description: String(body.description ?? ""),
    usage: String(body.usage ?? ""),
    tone: body.tone ?? "mint",
    active: body.active !== false,
  });
  return NextResponse.json({ product }, { status: 201 });
}
