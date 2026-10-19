export function money(n: number) {
  return `฿${n.toLocaleString("th-TH")}`;
}

/** YYYY-MM-DD in Asia/Bangkok */
export function bangkokDate(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function formatDay(dateStr: string, locale: "th" | "en" = "th") {
  const d = new Date(`${dateStr}T12:00:00+07:00`);
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "th-TH", {
    timeZone: "Asia/Bangkok",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d);
}

/** @deprecated use formatDay */
export function formatThaiDay(dateStr: string) {
  return formatDay(dateStr, "th");
}
