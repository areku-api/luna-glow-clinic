"use client";

import Link from "next/link";
import { usePrefs } from "./PreferencesProvider";

export function SiteFooter() {
  const { t } = usePrefs();

  return (
    <footer className="mt-auto border-t border-line bg-card">
      <div className="mx-auto grid max-w-5xl gap-6 px-5 py-10 md:grid-cols-3">
        <div>
          <p className="font-semibold text-navy">Luna Glow Clinic</p>
          <p className="mt-2 text-sm text-muted">
            {t("footerAddress")}
            <br />
            {t("footerHours")}
          </p>
          <a
            href="tel:021234567"
            className="mt-2 inline-block text-sm font-medium text-navy"
          >
            {t("footerPhone")}
          </a>
        </div>
        <div>
          <p className="text-sm font-medium text-ink">{t("footerPatients")}</p>
          <div className="mt-2 flex flex-col gap-1.5 text-sm text-muted">
            <Link href="/book" className="hover:text-navy">
              {t("navBook")}
            </Link>
            <Link href="/shop" className="hover:text-navy">
              {t("footerShop")}
            </Link>
            <Link href="/status" className="hover:text-navy">
              {t("footerStatus")}
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-ink">{t("footerOwners")}</p>
          <Link
            href="/admin"
            className="mt-2 inline-block text-sm text-muted hover:text-navy"
          >
            {t("footerAdmin")}
          </Link>
          <p className="mt-6 text-xs text-muted/80">{t("footerCredit")}</p>
        </div>
      </div>
    </footer>
  );
}
