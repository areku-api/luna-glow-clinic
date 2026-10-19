"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useCart, type CartItem } from "@/components/CartProvider";
import { usePrefs } from "@/components/PreferencesProvider";
import {
  ThaiAddressFields,
  formatFullAddress,
  type ThaiAddressValue,
} from "@/components/ThaiAddressFields";
import { money } from "@/lib/format";

const emptyAddress: ThaiAddressValue = {
  line: "",
  province: "",
  district: "",
  subdistrict: "",
  zip: "",
};

export default function CartPage() {
  const { t } = usePrefs();
  const { items, setQty, remove, restore, total, clear } = useCart();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState<ThaiAddressValue>(emptyAddress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [undone, setUndone] = useState<CartItem | null>(null);

  function onMinus(item: CartItem) {
    if (item.qty <= 1) {
      const removed = remove(item.productId);
      if (removed) {
        setUndone(removed);
        window.setTimeout(() => setUndone(null), 5000);
      }
      return;
    }
    setQty(item.productId, item.qty - 1);
  }

  async function checkout(e: React.FormEvent) {
    e.preventDefault();
    if (!items.length) return;
    if (phone.replace(/\D/g, "").length < 9) {
      setError(t("cartPhoneErr"));
      return;
    }
    if (
      !address.line.trim() ||
      !address.province ||
      !address.district ||
      !address.subdistrict ||
      !address.zip
    ) {
      setError(t("addrIncomplete"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phone,
          address: formatFullAddress(address),
          items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error === "สินค้าไม่พอ" ? t("cartStockErr") : t("cartFail"),
        );
        return;
      }
      clear();
      router.push(`/shop/checkout/${data.order.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col">
      <SiteHeader />
      <section className="page-enter mx-auto grid max-w-5xl gap-8 px-5 py-10 lg:grid-cols-2">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-navy">
            {t("cartTitle")}
          </h1>
          {items.length === 0 ? (
            <div className="card mt-6 w-full p-8 text-center">
              <p className="text-muted">{t("cartEmpty")}</p>
              <Link href="/shop" className="btn mt-5 inline-flex">
                {t("cartGoShop")}
              </Link>
            </div>
          ) : (
            <ul className="mt-6 w-full space-y-3">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="card flex w-full items-center justify-between gap-4 p-4"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted">{money(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="h-8 w-8 rounded-full border border-line"
                      onClick={() => onMinus(item)}
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{item.qty}</span>
                    <button
                      type="button"
                      className="h-8 w-8 rounded-full border border-line"
                      onClick={() => setQty(item.productId, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {undone ? (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-line bg-navy-soft px-4 py-3 text-sm">
              <span>
                {t("cartRemoved")} · {undone.name}
              </span>
              <button
                type="button"
                className="font-medium text-navy underline"
                onClick={() => {
                  restore(undone);
                  setUndone(null);
                }}
              >
                {t("cartUndo")}
              </button>
            </div>
          ) : null}
        </div>

        <div className="min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight text-navy">
            {t("cartPay")}
          </h2>
          <form onSubmit={checkout} className="card mt-6 w-full p-5">
            <p className="text-sm text-muted">
              {t("cartTotal")} {money(total)}
            </p>
            <div className="mt-4 space-y-3">
              <label className="grid gap-1.5 text-sm">
                <span className="text-muted">{t("cartName")}</span>
                <input
                  required
                  className="field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("cartNamePh")}
                />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-muted">{t("cartPhone")}</span>
                <input
                  required
                  className="field"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08x-xxx-xxxx"
                />
              </label>
              <ThaiAddressFields value={address} onChange={setAddress} />
            </div>
            {error ? <p className="mt-3 text-sm text-warn">{error}</p> : null}
            <button
              type="submit"
              disabled={!items.length || loading}
              className="btn mt-5 w-full"
            >
              {loading ? t("cartSubmitting") : t("cartSubmit")}
            </button>
          </form>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
