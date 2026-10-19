"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useCart } from "@/components/CartProvider";
import { usePrefs } from "@/components/PreferencesProvider";
import { money } from "@/lib/format";
import type { Product } from "@/lib/types";

const TONE: Record<Product["tone"], string> = {
  amber: "linear-gradient(145deg,#f3e0c2,#d4a574)",
  sun: "linear-gradient(145deg,#fff8e7,#f0e6c8)",
  mint: "linear-gradient(145deg,#d8efe9,#8fc9bc)",
  rose: "linear-gradient(145deg,#f8e4e8,#e8b4c0)",
};

export default function ShopPage() {
  const { t } = usePrefs();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("ทั้งหมด");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { add, has } = useCart();

  function load() {
    setLoading(true);
    setError(false);
    fetch("/api/products?active=1")
      .then((r) => {
        if (!r.ok) throw new Error("fail");
        return r.json();
      })
      .then((d) => setProducts(d.products ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  const allLabel = t("shopAll");
  const categories = [allLabel, ...new Set(products.map((p) => p.category))];
  const filtered =
    category === allLabel || category === "ทั้งหมด"
      ? products
      : products.filter((p) => p.category === category);

  useEffect(() => {
    setCategory(allLabel);
  }, [allLabel]);

  return (
    <main className="flex flex-1 flex-col">
      <SiteHeader />
      <section className="page-enter mx-auto max-w-5xl px-5 py-10">
        <h1 className="text-3xl font-semibold tracking-tight text-navy">
          {t("shopTitle")}
        </h1>
        <p className="mt-2 text-muted">{t("shopSub")}</p>

        {!loading && !error && products.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-1.5 text-sm ${
                  category === c
                    ? "bg-navy text-white"
                    : "border border-line text-muted hover:border-navy"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        ) : null}

        {loading ? (
          <p className="mt-10 text-muted">{t("shopLoading")}</p>
        ) : error ? (
          <div className="card mt-10 p-6 text-center">
            <p className="text-muted">{t("shopError")}</p>
            <button type="button" className="btn mt-4" onClick={load}>
              {t("shopRetry")}
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="mt-10 text-muted">{t("shopEmpty")}</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((p) => {
              const id = p.id;
              const inCart = has(id);
              return (
                <article key={id} className="card card-lift flex flex-col p-4">
                  <div
                    className="mb-3 aspect-[4/3] rounded-lg"
                    style={{ background: TONE[p.tone] ?? TONE.mint }}
                    aria-hidden
                  />
                  <p className="text-xs text-muted">{p.category}</p>
                  <h2 className="mt-1 font-medium">{p.name}</h2>
                  <p className="mt-2 text-sm text-muted">{p.description}</p>
                  <p className="mt-2 text-sm text-navy">{p.usage}</p>
                  <div className="mt-4 flex flex-1 flex-col justify-end gap-2">
                    <p className="font-medium text-navy">{money(p.price)}</p>
                    {p.stock <= 10 ? (
                      <p className="text-xs text-warn">{t("shopLow")}</p>
                    ) : null}
                    {inCart ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-ok">
                          {t("shopInCart")}
                        </span>
                        <Link
                          href="/shop/cart"
                          className="text-sm font-medium text-sky underline"
                        >
                          {t("shopViewCart")}
                        </Link>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={p.stock <= 0}
                        className="btn btn-sm w-full"
                        onClick={() =>
                          add({ productId: id, name: p.name, price: p.price })
                        }
                      >
                        {t("shopAdd")}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}
