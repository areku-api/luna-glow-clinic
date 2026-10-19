"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { usePrefs } from "@/components/PreferencesProvider";
import { bangkokDate, formatDay, money } from "@/lib/format";
import type { Service } from "@/lib/types";

type Slot = { time: string; available: boolean };

export default function BookPage() {
  const { t, locale } = usePrefs();
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [minDate, setMinDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ id: string; date: string; time: string } | null>(
    null,
  );
  const [error, setError] = useState("");
  const [step, setStep] = useState<"form" | "confirm">("form");

  useEffect(() => {
    const t = bangkokDate();
    setDate(t);
    setMinDate(t);
  }, []);

  useEffect(() => {
    fetch("/api/services?active=1")
      .then((r) => r.json())
      .then((d) => {
        setServices(d.services ?? []);
        if (d.services?.[0]) setServiceId(d.services[0].id);
      });
  }, []);

  useEffect(() => {
    if (!date) return;
    setTime("");
    fetch(`/api/slots?date=${date}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []));
  }, [date]);

  const selected = useMemo(
    () => services.find((s) => s.id === serviceId),
    [services, serviceId],
  );

  async function submit() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          customerName: name,
          phone,
          date,
          time,
          note,
          status: "pending",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("bookFail"));
        setStep("form");
        return;
      }
      setDone({ id: data.booking.id, date, time });
      setStep("form");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col">
      <SiteHeader />
      <section className="page-enter mx-auto max-w-2xl px-5 py-10">
        <h1 className="text-3xl font-semibold tracking-tight text-navy">
          {t("bookTitle")}
        </h1>
        <p className="mt-2 text-muted">{t("bookSub")}</p>

        {done ? (
          <div className="card mt-8 p-6 text-center">
            <p className="text-lg font-medium text-ok">{t("bookSuccessTitle")}</p>
            <p className="mt-3 text-muted">
              {t("bookSuccessMeet")} {formatDay(done.date, locale)} {done.time}
              <br />
              {t("bookSuccessBody")}
            </p>
            {selected ? (
              <p className="mt-3 text-sm text-muted">
                {selected.name} · {money(selected.price)}
              </p>
            ) : null}
            <p className="mt-4 text-xs text-muted">
              {t("bookRef")} {done.id} · {t("bookCallAgain")}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setDone(null);
                  setName("");
                  setPhone("");
                  setNote("");
                  setTime("");
                  fetch(`/api/slots?date=${date}`)
                    .then((r) => r.json())
                    .then((d) => setSlots(d.slots ?? []));
                }}
              >
                {t("bookAnother")}
              </button>
              <Link href="/shop" className="btn btn-ghost">
                {t("bookSeeShop")}
              </Link>
            </div>
          </div>
        ) : step === "confirm" ? (
          <div className="card mt-8 space-y-4 p-6">
            <h2 className="text-lg font-medium text-navy">{t("bookSummary")}</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between gap-3">
                <span className="text-muted">{t("bookName")}</span>
                <span className="font-medium">{name}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-muted">{t("bookService")}</span>
                <span className="font-medium">{selected?.name}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-muted">{t("bookWhen")}</span>
                <span className="font-medium">
                  {formatDay(date, locale)} {time}
                </span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-muted">{t("bookPrice")}</span>
                <span className="font-medium">
                  {selected ? money(selected.price) : "—"}
                </span>
              </li>
              {note ? (
                <li className="flex justify-between gap-3">
                  <span className="text-muted">{t("bookNote")}</span>
                  <span className="text-right">{note}</span>
                </li>
              ) : null}
            </ul>
            {error ? <p className="text-sm text-warn">{error}</p> : null}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                className="btn"
                disabled={loading}
                onClick={submit}
              >
                {loading ? "..." : t("bookConfirm")}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStep("form")}
              >
                {t("bookEdit")}
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!time) return;
              setStep("confirm");
            }}
            className="card mt-8 space-y-6 p-5 md:p-6"
          >
            <div className="grid gap-2 sm:grid-cols-2">
              {services.map((s) => (
                <label
                  key={s.id}
                  className={`cursor-pointer rounded-xl border p-4 ${
                    serviceId === s.id
                      ? "border-navy bg-navy-soft"
                      : "border-line"
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    checked={serviceId === s.id}
                    onChange={() => setServiceId(s.id)}
                  />
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-sm text-muted">{s.summary}</p>
                      <p className="text-sm text-muted">{s.durationMin} {t("minutes")}</p>
                    </div>
                    <p className="font-medium text-navy">{money(s.price)}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="space-y-4">
              <label className="grid max-w-xs gap-1.5 text-sm">
                <span className="text-muted">{t("bookDate")}</span>
                <input
                  type="date"
                  required
                  value={date}
                  min={minDate || undefined}
                  onChange={(e) => setDate(e.target.value)}
                  className="field"
                />
              </label>
              <div className="grid gap-1.5 text-sm">
                <span className="text-muted">{t("bookSlots")}</span>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slots.map((s) => (
                    <button
                      key={s.time}
                      type="button"
                      disabled={!s.available}
                      className={`slot ${time === s.time ? "active" : ""}`}
                      onClick={() => setTime(s.time)}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm">
                <span className="text-muted">{t("bookName")}</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field"
                />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-muted">{t("bookPhone")}</span>
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="field"
                />
              </label>
            </div>

            <label className="grid gap-1.5 text-sm">
              <span className="text-muted">{t("bookNote")}</span>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="field"
                placeholder={t("bookNotePh")}
              />
            </label>

            <button type="submit" disabled={!time} className="btn">
              {t("bookReview")}
            </button>
          </form>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}
