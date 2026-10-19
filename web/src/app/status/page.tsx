"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { usePrefs } from "@/components/PreferencesProvider";
import { money } from "@/lib/format";
import type { Order } from "@/lib/types";

function StatusInner() {
  const { t } = usePrefs();
  const search = useSearchParams();
  const [id, setId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const story: Record<string, string> = {
    pending: t("statusPending"),
    paid: t("statusPaid"),
    shipped: t("statusShipped"),
    cancelled: t("statusCancelled"),
  };

  useEffect(() => {
    const q = search.get("id");
    if (q) {
      setId(q);
      lookup(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function lookup(orderId = id) {
    if (!orderId.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch(
        `/api/orders/${encodeURIComponent(orderId.trim())}`,
      );
      const data = await res.json();
      if (!res.ok) {
        setError(t("statusNotFound"));
        return;
      }
      setOrder(data.order);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-enter mx-auto max-w-md px-5 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-navy">
        {t("statusTitle")}
      </h1>
      <p className="mt-2 text-sm text-muted">{t("statusSub")}</p>
      <div className="card mt-6 p-5">
        <label className="grid gap-1.5 text-sm">
          <span className="text-muted">{t("statusLabel")}</span>
          <input
            className="field"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder={t("statusPh")}
          />
        </label>
        <button
          type="button"
          className="btn mt-4 w-full"
          disabled={loading}
          onClick={() => lookup()}
        >
          {loading ? t("statusSearching") : t("statusBtn")}
        </button>
      </div>
      {error ? <p className="mt-4 text-sm text-warn">{error}</p> : null}
      {order ? (
        <div className="card mt-4 p-5">
          <p className="text-sm font-medium text-navy">
            {story[order.status] ?? order.status}
          </p>
          <p className="mt-3 text-sm text-muted">
            {t("checkoutKeepId")}{" "}
            <span className="font-medium text-ink">{order.id}</span>
            <br />
            {t("statusKeep")}
          </p>
          <p className="mt-3 font-medium">{order.customerName}</p>
          <ul className="mt-4 space-y-1 text-sm text-muted">
            {order.items.map((i) => (
              <li key={i.productId}>
                {i.name} × {i.qty}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xl font-semibold text-navy">
            {money(order.total)}
          </p>
        </div>
      ) : null}
    </section>
  );
}

export default function StatusPage() {
  return (
    <main className="flex flex-1 flex-col">
      <SiteHeader />
      <Suspense fallback={<p className="p-10 text-muted">...</p>}>
        <StatusInner />
      </Suspense>
      <SiteFooter />
    </main>
  );
}
