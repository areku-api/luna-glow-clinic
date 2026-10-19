"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PreferenceToggles } from "./PreferenceToggles";

const links = [
  { href: "/admin", label: "ภาพรวม" },
  { href: "/admin/services", label: "บริการ" },
  { href: "/admin/bookings", label: "คิวจอง" },
  { href: "/admin/products", label: "สินค้า" },
  { href: "/admin/orders", label: "ออเดอร์" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-line bg-card md:w-52 md:border-b-0 md:border-r">
      <div className="px-4 py-4">
        <p className="text-sm font-semibold text-navy">Luna Admin</p>
        <p className="text-xs text-muted">หลังบ้านคลินิก</p>
        <div className="mt-3">
          <PreferenceToggles />
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:pb-4">
        {links.map((l) => {
          const active =
            l.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm ${
                active
                  ? "bg-navy-soft font-medium text-navy"
                  : "text-muted hover:bg-bg hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="hidden border-t border-line px-4 py-3 md:block">
        <Link href="/" className="text-sm text-muted hover:text-ink">
          หน้าเว็บหลัก
        </Link>
      </div>
    </aside>
  );
}
