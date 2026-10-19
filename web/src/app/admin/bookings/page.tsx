"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminGate } from "@/components/AdminGate";
import { bangkokDate, formatThaiDay } from "@/lib/format";
import type { Booking, Service } from "@/lib/types";

const STATUSES = [
  { value: "pending", label: "รอยืนยัน" },
  { value: "confirmed", label: "ยืนยันแล้ว" },
  { value: "done", label: "เสร็จสิ้น" },
  { value: "cancelled", label: "ยกเลิก" },
] as const;

export default function AdminBookingsPage() {
  const [items, setItems] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(bangkokDate());
  }, []);

  const load = useCallback(() => {
    if (!date) return;
    fetch(`/api/bookings?date=${date}`)
      .then((r) => r.json())
      .then((d) => setItems(d.bookings ?? []));
  }, [date]);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => setServices(d.services ?? []));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const serviceName = (id: string) =>
    services.find((s) => s.id === id)?.name ?? id;

  const active = useMemo(
    () => items.filter((b) => b.status !== "cancelled"),
    [items],
  );

  async function setStatus(id: string, status: string) {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function cancelBooking(b: Booking) {
    const ok = confirm(
      `ยกเลิกคิว${b.customerName} ${b.time} ${serviceName(b.serviceId)}?`,
    );
    if (!ok) return;
    await fetch(`/api/bookings/${b.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    load();
  }

  return (
    <AdminGate>
      <h1 className="text-2xl font-semibold tracking-tight text-navy">
        คิวจอง
      </h1>
      <label className="mt-6 grid max-w-xs gap-1.5 text-sm">
        <span className="text-muted">วันที่</span>
        <input
          type="date"
          className="field"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      {date ? (
        <p className="mt-6 text-sm font-medium text-navy">
          {formatThaiDay(date)} · {active.length} คิว
        </p>
      ) : null}

      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <div className="card p-8 text-center text-muted">
            วันนี้ยังไม่มีคิว
          </div>
        ) : (
          items.map((b) => (
            <article
              key={b.id}
              className={`card p-4 ${b.status === "cancelled" ? "opacity-55" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-navy">
                    {b.time} · {b.customerName}
                  </p>
                  <p className="mt-1 text-sm">
                    {serviceName(b.serviceId)}
                    {b.note ? (
                      <span className="text-warn"> · {b.note}</span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-sm text-muted">{b.phone}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    className="select"
                    value={b.status}
                    onChange={(e) => setStatus(b.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  {b.status !== "cancelled" ? (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => cancelBooking(b)}
                    >
                      ยกเลิกคิว
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </AdminGate>
  );
}
