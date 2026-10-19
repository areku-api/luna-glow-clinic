"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminGate } from "@/components/AdminGate";
import type { Order } from "@/lib/types";

const STATUSES = [
  { value: "pending", label: "รอชำระ" },
  { value: "paid", label: "ชำระแล้ว" },
  { value: "shipped", label: "จัดส่งแล้ว" },
  { value: "cancelled", label: "ยกเลิก" },
] as const;

export default function AdminOrdersPage() {
  const [items, setItems] = useState<Order[]>([]);

  const load = useCallback(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => setItems(d.orders ?? []));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: string, status: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("ลบออเดอร์นี้?")) return;
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <AdminGate>
      <h1 className="text-2xl font-semibold tracking-tight text-navy">
        จัดการออเดอร์
      </h1>
      <div className="table-wrap mt-6">
        <table className="data">
          <thead>
            <tr>
              <th>รหัส</th>
              <th>ลูกค้า</th>
              <th>ยอด</th>
              <th>สถานะ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((o) => (
              <tr key={o.id}>
                <td className="font-mono text-xs">{o.id}</td>
                <td>
                  <div>{o.customerName}</div>
                  <div className="text-xs text-muted">{o.phone}</div>
                </td>
                <td>฿{o.total.toLocaleString()}</td>
                <td>
                  <select
                    className="select"
                    value={o.status}
                    onChange={(e) => setStatus(o.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => remove(o.id)}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminGate>
  );
}
