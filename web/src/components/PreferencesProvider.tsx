"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { t as translate, type Locale, type MessageKey } from "@/lib/i18n";

export type Theme = "light" | "dark";

type Prefs = {
  locale: Locale;
  theme: Theme;
  ready: boolean;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  t: (key: MessageKey) => string;
};

const PrefsContext = createContext<Prefs | null>(null);

const LOCALE_KEY = "luna_locale";
const THEME_KEY = "luna_theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

function applyLocale(locale: Locale) {
  document.documentElement.lang = locale;
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("th");
  const [theme, setThemeState] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedLocale = localStorage.getItem(LOCALE_KEY);
    const savedTheme = localStorage.getItem(THEME_KEY);
    const nextLocale: Locale = savedLocale === "en" ? "en" : "th";
    const nextTheme: Theme =
      savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    setLocaleState(nextLocale);
    setThemeState(nextTheme);
    applyLocale(nextLocale);
    applyTheme(nextTheme);
    setReady(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(LOCALE_KEY, next);
    applyLocale(next);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo<Prefs>(
    () => ({
      locale,
      theme,
      ready,
      setLocale,
      setTheme,
      toggleTheme,
      t: (key) => translate(locale, key),
    }),
    [locale, theme, ready, setLocale, setTheme, toggleTheme],
  );

  return (
    <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
  );
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs outside provider");
  return ctx;
}
