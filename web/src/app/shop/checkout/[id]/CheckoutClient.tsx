"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { usePrefs } from "@/components/PreferencesProvider";
import { money } from "@/lib/format";
import type { Order } from "@/lib/types";

export function CheckoutClient() {
  const { t } = usePrefs();
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/orders/${params.id}`)
      .then((r) => r.json())
      .then((d) => setOrder(d.order ?? null));
  }, [params.id]);

  async function markPaid() {
    setPaying(true);
    try {
      const res = await fetch(`/api/orders/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" }),
      });
      const data = await res.json();
      setOrder(data.order);
    } finally {
      setPaying(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col">
      <SiteHeader />
      <section className="mx-auto max-w-md px-5 py-12">
        {!order ? (
          <p className="text-center text-muted">{t("checkoutLoading")}</p>
        ) : order.status !== "pending" ? (
          <div className="card p-6 text-center">
            <p className="text-lg font-medium text-ok">{t("checkoutPaid")}</p>
            <p className="mt-3 text-sm text-muted">
              {t("checkoutKeepId")}{" "}
              <span className="font-medium text-ink">{order.id}</span>
              <br />
              {t("checkoutKeepHint")}
            </p>
            <p className="mt-4 text-sm text-muted">{t("checkoutShip")}</p>
            <Link
              href={`/status?id=${order.id}`}
              className="btn mt-6 inline-flex"
            >
              {t("checkoutStatus")}
            </Link>
          </div>
        ) : (
          <div className="card p-6">
            <h1 className="text-xl font-medium text-navy">
              {t("checkoutTitle")}
            </h1>
            <p className="mt-2 text-sm text-muted">{t("checkoutHint")}</p>

            <div className="mt-6 space-y-2 rounded-xl bg-navy-soft p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">{t("checkoutAmount")}</span>
                <span className="font-semibold text-navy">
                  {money(order.total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t("checkoutAccount")}</span>
                <span>Luna Glow Clinic</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="shrink-0 text-muted">{t("checkoutRef")}</span>
                <span className="text-right font-medium">{order.id}</span>
              </div>
            </div>

            <div className="mx-auto mt-6 flex h-36 w-36 items-center justify-center rounded-xl border border-dashed border-line bg-bg text-xs text-muted">
              QR PromptPay
            </div>

            <p className="mt-4 text-center text-sm text-muted">
              {t("checkoutPack")}
            </p>

            <button
              type="button"
              onClick={markPaid}
              disabled={paying}
              className="btn mt-6 w-full"
            >
              {paying ? t("checkoutConfirming") : t("checkoutConfirm")}
            </button>
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}
