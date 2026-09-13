"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/types";

function hrefFor(pathname: string, next: Locale, query: string) {
  const parts = pathname.split("/");
  if (parts.length > 1) parts[1] = next;
  const path = parts.join("/") || `/${next}`;
  return query ? `${path}?${query}` : path;
}

export function LocaleSwitch({
  locale,
  compact,
}: {
  locale: Locale;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const other: Locale = locale === "fa" ? "en" : "fa";

  return (
    <Link
      href={hrefFor(pathname, other, searchParams.toString())}
      hrefLang={other}
      className={
        compact
          ? "rounded-full border border-border px-2.5 py-1 text-[11px] font-bold text-muted"
          : "rounded-md border border-border px-2.5 py-1.5 text-xs font-bold text-muted"
      }
    >
      {compact ? (other === "en" ? "EN" : "فا") : other === "en" ? "English" : "فارسی"}
    </Link>
  );
}
