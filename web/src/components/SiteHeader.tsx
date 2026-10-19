"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { PreferenceToggles } from "./PreferenceToggles";
import { usePrefs } from "./PreferencesProvider";

export function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const { t } = usePrefs();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t("navHome") },
    { href: "/book", label: t("navBook") },
    { href: "/shop", label: t("navShop") },
    { href: "/status", label: t("navStatus") },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-card/90 shadow-[0_1px_0_rgba(27,58,87,0.04)] backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-3.5">
        <Link
          href="/"
          className="bg-gradient-to-r from-navy to-navy-mid bg-clip-text text-base font-semibold tracking-tight text-transparent"
        >
          Luna Glow
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-muted lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link ${pathname === l.href ? "active" : "hover:text-ink"}`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/shop/cart"
            className={`nav-link inline-flex items-center gap-1.5 ${
              pathname.startsWith("/shop/cart") ? "active" : "hover:text-ink"
            }`}
          >
            {t("navCart")}
            {count > 0 ? (
              <span key={count} className="badge-pop">
                {count}
              </span>
            ) : null}
          </Link>
          <PreferenceToggles />
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <PreferenceToggles />
          <Link href="/book" className="btn btn-sm">
            {t("bookNow")}
          </Link>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            aria-expanded={open}
            aria-label={t("navMenu")}
            onClick={() => setOpen((v) => !v)}
          >
            {t("navMenu")}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-card px-5 py-3 lg:hidden">
          <nav className="flex flex-col gap-1 text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-2.5 ${
                  pathname === l.href
                    ? "bg-navy-soft font-medium text-navy"
                    : "text-muted hover:bg-bg"
                }`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/shop/cart"
              className="rounded-lg px-3 py-2.5 text-muted hover:bg-bg"
              onClick={() => setOpen(false)}
            >
              {t("navCart")} {count > 0 ? `(${count})` : ""}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
