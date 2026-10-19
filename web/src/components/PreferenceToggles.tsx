"use client";

import { usePrefs } from "./PreferencesProvider";

export function PreferenceToggles() {
  const { locale, theme, setLocale, toggleTheme, t } = usePrefs();

  return (
    <div className="flex items-center gap-1.5">
      <div
        className="inline-flex rounded-full border border-line bg-card p-0.5"
        role="group"
        aria-label="Language"
      >
        <button
          type="button"
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
            locale === "th"
              ? "bg-navy text-white"
              : "text-muted hover:text-ink"
          }`}
          onClick={() => setLocale("th")}
        >
          {t("langTh")}
        </button>
        <button
          type="button"
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
            locale === "en"
              ? "bg-navy text-white"
              : "text-muted hover:text-ink"
          }`}
          onClick={() => setLocale("en")}
        >
          {t("langEn")}
        </button>
      </div>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={toggleTheme}
        aria-label={theme === "dark" ? t("themeLight") : t("themeDark")}
        title={theme === "dark" ? t("themeLight") : t("themeDark")}
      >
        {theme === "dark" ? t("themeLight") : t("themeDark")}
      </button>
    </div>
  );
}
