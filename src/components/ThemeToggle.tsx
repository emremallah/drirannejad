"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/types";

const STORAGE_KEY = "clinic-theme";

export function ThemeToggle({
  locale,
  compact,
}: {
  locale: Locale;
  compact?: boolean;
}) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("light") ? "light" : "dark");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("light", next === "light");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore private mode */
    }
  }

  const label =
    theme === "dark"
      ? locale === "fa"
        ? "حالت روشن"
        : "Light mode"
      : locale === "fa"
        ? "حالت تیره"
        : "Dark mode";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={
        compact
          ? "grid size-10 place-items-center rounded-full bg-bg text-ink"
          : "grid size-9 place-items-center rounded-md border border-border text-ink hover:border-primary hover:text-primary"
      }
    >
      {theme === "dark" ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M12 3v1.6M12 19.4V21M4.9 4.9l1.1 1.1M18 18l1.1 1.1M3 12h1.6M19.4 12H21M4.9 19.1 6 18M18 6l1.1-1.1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M16.5 13.2A6.2 6.2 0 0 1 10.8 7.5 6.4 6.4 0 1 0 16.5 13.2Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
