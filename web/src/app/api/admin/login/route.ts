import { ADMIN_PASSWORD } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body?.password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("luna_admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return res;
}
