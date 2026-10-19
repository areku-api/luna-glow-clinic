"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminGate } from "@/components/AdminGate";
import type { Product } from "@/lib/types";

const empty = {
  name: "",
  category: "สกินแคร์",
  price: "500",
  stock: "10",
  description: "",
  active: true,
};

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setItems(d.products ?? []));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description,
      active: form.active,
    };
    if (editId) {
      await fetch(`/api/products/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/products", {
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
    if (!confirm("ลบสินค้านี้?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <AdminGate>
      <h1 className="text-2xl font-semibold tracking-tight text-navy">
        จัดการสินค้า
      </h1>

      <form onSubmit={save} className="card mt-6 grid gap-3 p-5 sm:grid-cols-2">
        <p className="sm:col-span-2 text-sm font-medium">
          {editId ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}
        </p>
        <input
          required
          className="field"
          placeholder="ชื่อ"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="field"
          placeholder="หมวด"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          className="field"
          placeholder="ราคา"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          className="field"
          placeholder="สต็อก"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <textarea
          className="field sm:col-span-2"
          rows={2}
          placeholder="รายละเอียด"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          เปิดขาย
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
              <th>หมวด</th>
              <th>ราคา</th>
              <th>สต็อก</th>
              <th>สถานะ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>฿{p.price}</td>
                <td>{p.stock}</td>
                <td>{p.active ? "เปิด" : "ปิด"}</td>
                <td className="space-x-2 whitespace-nowrap">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setEditId(p.id);
                      setForm({
                        name: p.name,
                        category: p.category,
                        price: String(p.price),
                        stock: String(p.stock),
                        description: p.description,
                        active: p.active,
                      });
                    }}
                  >
                    แก้ไข
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => remove(p.id)}
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
