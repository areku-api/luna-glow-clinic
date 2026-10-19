"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { usePrefs } from "@/components/PreferencesProvider";
import { money } from "@/lib/format";
import type { Service } from "@/lib/types";

export default function HomePage() {
  const { t } = usePrefs();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch("/api/services?active=1")
      .then((r) => r.json())
      .then((d) => setServices(d.services ?? []));
  }, []);

  const cards = [
    {
      title: t("cardBookTitle"),
      desc: t("cardBookDesc"),
      href: "/book",
      delay: 0 as const,
    },
    {
      title: t("cardShopTitle"),
      desc: t("cardShopDesc"),
      href: "/shop",
      delay: 1 as const,
    },
    {
      title: t("cardStatusTitle"),
      desc: t("cardStatusDesc"),
      href: "/status",
      delay: 2 as const,
    },
  ];

  return (
    <main className="flex flex-1 flex-col">
      <SiteHeader />

      <section className="hero-shell border-b border-line text-white">
        <div className="blob blob-a" aria-hidden />
        <div className="blob blob-b" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-5 py-16 md:py-24">
          <p className="hero-sub text-sm font-medium text-white/75">
            {t("heroTag")}
          </p>
          <h1 className="hero-title mt-3 max-w-xl text-4xl font-semibold tracking-tight md:text-5xl">
            <span className="gradient-text">{t("heroTitle")}</span>{" "}
            {t("heroClinic")}
          </h1>
          <p className="hero-sub mt-4 max-w-lg text-lg text-white/85">
            {t("heroSub")}
          </p>
          <div className="hero-cta mt-8 flex flex-wrap gap-3">
            <Link href="/book" className="btn btn-light">
              {t("heroCtaBook")}
            </Link>
            <Link href="/shop" className="btn btn-outline-light">
              {t("heroCtaShop")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-5 py-12 md:grid-cols-3">
        {cards.map((item) => (
          <Reveal key={item.href} delay={item.delay}>
            <Link href={item.href} className="card card-lift block h-full p-5">
              <div className="mb-3 h-1.5 w-10 rounded-full bg-gradient-to-r from-navy-mid to-mint" />
              <h2 className="font-medium text-navy">{item.title}</h2>
              <p className="mt-2 text-sm text-muted">{item.desc}</p>
              <p className="mt-4 text-sm font-medium text-sky">{t("openLink")}</p>
            </Link>
          </Reveal>
        ))}
      </section>

      <section className="border-y border-line bg-card/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-5 py-12">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-navy">
              {t("popularTitle")}
            </h2>
            <p className="mt-2 text-muted">{t("popularSub")}</p>
          </Reveal>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {(services.length
              ? services
              : [
                  {
                    id: "1",
                    name: "Facial Glow",
                    summary: "ล้าง มาสก์ ผิวชุ่มทันที",
                    durationMin: 60,
                    price: 1290,
                    active: true,
                  },
                ]
            ).map((s, i) => (
              <Reveal key={s.id} delay={Math.min(i, 2) as 0 | 1 | 2}>
                <div className="service-chip p-5">
                  <p className="font-medium">{s.name}</p>
                  <p className="mt-1 text-sm text-muted">{s.summary}</p>
                  <p className="mt-1 text-sm text-muted">
                    {s.durationMin} {t("minutes")}
                  </p>
                  <p className="mt-4 text-xl font-semibold text-navy">
                    {money(s.price)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={2}>
            <Link href="/book" className="btn mt-8">
              {t("bookCta")}
            </Link>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
