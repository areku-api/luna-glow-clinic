"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminGate } from "@/components/AdminGate";
import type { Service } from "@/lib/types";

const empty = {
  name: "",
  summary: "",
  durationMin: "60",
  price: "1000",
  active: true,
};

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => setItems(d.services ?? []));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      summary: form.summary,
      durationMin: Number(form.durationMin),
      price: Number(form.price),
      active: form.active,
    };
    if (editId) {
      await fetch(`/api/services/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setForm(empty);
    setEditId(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("ลบบริการนี้?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <AdminGate>
      <h1 className="text-2xl font-semibold tracking-tight text-navy">
        จัดการบริการ
      </h1>

      <form onSubmit={save} className="card mt-6 grid gap-3 p-5 sm:grid-cols-2">
        <p className="sm:col-span-2 text-sm font-medium">
          {editId ? "แก้ไขบริการ" : "เพิ่มบริการ"}
        </p>
        <input
          required
          className="field"
          placeholder="ชื่อบริการ"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="field"
          placeholder="คำอธิบายสั้นภาษาไทย"
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
        />
        <input
          required
          className="field"
          placeholder="นาที"
          value={form.durationMin}
          onChange={(e) => setForm({ ...form, durationMin: e.target.value })}
        />
        <input
          required
          className="field"
          placeholder="ราคา"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          เปิดใช้งาน
        </label>
        <div className="sm:col-span-2 flex gap-2">
          <button type="submit" className="btn">
            {editId ? "บันทึก" : "เพิ่ม"}
          </button>
          {editId ? (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setEditId(null);
                setForm(empty);
              }}
            >
              ยกเลิก
            </button>
          ) : null}
        </div>
      </form>

      <div className="table-wrap mt-6">
        <table className="data">
          <thead>
            <tr>
              <th>ชื่อ</th>
              <th>เวลา</th>
              <th>ราคา</th>
              <th>สถานะ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.durationMin} นาที</td>
                <td>฿{s.price}</td>
                <td>{s.active ? "เปิด" : "ปิด"}</td>
                <td className="space-x-2 whitespace-nowrap">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setEditId(s.id);
                      setForm({
                        name: s.name,
                        summary: s.summary ?? "",
                        durationMin: String(s.durationMin),
                        price: String(s.price),
                        active: s.active,
                      });
                    }}
                  >
                    แก้ไข
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => remove(s.id)}
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
