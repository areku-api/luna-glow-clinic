"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminGate } from "@/components/AdminGate";

type Stats = {
  revenue: number;
  orders: number;
  bookingsToday: number;
  products: number;
  lowStock: number;
};

export default function AdminHome() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setStats(d.stats));
  }, []);

  return (
    <AdminGate>
      <h1 className="text-2xl font-semibold tracking-tight text-navy">ภาพรวม</h1>
      <p className="mt-1 text-sm text-muted">
        สรุปตัวเลขจากระบบจองคิว + ร้านค้า
      </p>

      {!stats ? (
        <p className="mt-8 text-muted">กำลังโหลด...</p>
      ) : (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "รายได้ (ชำระแล้ว)", value: `฿${stats.revenue.toLocaleString()}` },
            { label: "ออเดอร์ทั้งหมด", value: String(stats.orders) },
            { label: "คิววันนี้", value: String(stats.bookingsToday) },
            { label: "สินค้าเปิดขาย", value: String(stats.products) },
            { label: "สต็อกต่ำ (≤10)", value: String(stats.lowStock) },
          ].map((c) => (
            <div key={c.label} className="card p-4">
              <p className="text-sm text-muted">{c.label}</p>
              <p className="mt-1 text-2xl font-semibold text-navy">{c.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {[
          { href: "/admin/bookings", label: "จัดการคิวจอง" },
          { href: "/admin/orders", label: "จัดการออเดอร์" },
          { href: "/admin/services", label: "จัดการบริการ" },
          { href: "/admin/products", label: "จัดการสินค้า" },
        ].map((l) => (
          <Link key={l.href} href={l.href} className="card p-4 hover:border-navy">
            <span className="font-medium text-navy">{l.label}</span>
          </Link>
        ))}
      </div>
    </AdminGate>
  );
}
