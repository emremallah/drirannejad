import type { Locale } from "./types";

export const locales: Locale[] = ["fa", "en"];
export const defaultLocale: Locale = "fa";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localePath(locale: Locale, path = "") {
  const clean = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `/${locale}${clean}`;
}

export function dirFor(locale: Locale) {
  return locale === "fa" ? "rtl" : "ltr";
}

const persianDigits = "۰۱۲۳۴۵۶۷۸۹";

export function formatPrice(price: number | "free", locale: Locale) {
  if (price === "free") return locale === "fa" ? "رایگان" : "Free";
  const grouped = String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (locale === "en") return `${grouped} Toman`;
  const persian = grouped
    .replace(/,/g, "٬")
    .replace(/\d/g, (digit) => persianDigits[Number(digit)]);
  return `${persian} تومان`;
}

export function categoryLabel(
  category: "finance" | "eq" | "ai" | "speaking" | "free",
  locale: Locale,
) {
  const labels = {
    finance: { fa: "هوش مالی", en: "Finance" },
    eq: { fa: "هوش هیجانی", en: "EQ" },
    ai: { fa: "هوش مصنوعی", en: "AI" },
    speaking: { fa: "فن بیان", en: "Speaking" },
    free: { fa: "شروع رایگان", en: "Free start" },
  };
  return labels[category][locale];
}
