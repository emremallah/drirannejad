"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Dictionary } from "@/lib/dictionary";
import { headerLinks } from "@/lib/nav";
import { localePath } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { BrandLogo } from "./Logo";
import { SearchBox } from "./SearchBox";

type HeaderProps = {
  locale: Locale;
  t: Dictionary;
};

function switchLocale(pathname: string, next: Locale, query: string) {
  const parts = pathname.split("/");
  if (parts.length > 1) parts[1] = next;
  const path = parts.join("/") || `/${next}`;
  return query ? `${path}?${query}` : path;
}

export function Header({ locale, t }: HeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchOpen, setSearchOpen] = useState(false);
  const otherLocale: Locale = locale === "fa" ? "en" : "fa";
  const links = headerLinks(locale, t);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto hidden w-[min(1180px,calc(100%-32px))] md:block">
        <div className="flex min-h-[68px] items-center justify-between gap-6">
          <Link href={localePath(locale)} className="text-ink">
            <BrandLogo name={t.brand} />
          </Link>
          <SearchBox locale={locale} t={t} defaultValue={searchParams.get("q") ?? ""} />
          <div className="flex items-center gap-2">
            <Link
              href={switchLocale(pathname, otherLocale, searchParams.toString())}
              className="rounded-md border border-border px-2.5 py-1.5 text-xs font-bold text-muted"
            >
              FA / EN
            </Link>
            <Link
              href={localePath(locale, "/contact")}
              className="rounded-md bg-primary px-3.5 py-2 text-sm font-bold text-white hover:bg-primary-hover"
            >
              {t.actions.start}
            </Link>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 pb-3 text-[13px] font-semibold text-muted">
          {links.map((link) => (
            <Link key={`${link.href}-${link.label}`} href={link.href} className="hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mx-auto flex min-h-14 w-[min(1180px,calc(100%-24px))] items-center justify-between gap-3 md:hidden">
        <Link href={localePath(locale)} className="text-ink">
          <BrandLogo name={t.brand} compact />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={switchLocale(pathname, otherLocale, searchParams.toString())}
            className="rounded-full border border-border px-2.5 py-1 text-[11px] font-bold text-muted"
          >
            FA / EN
          </Link>
          <button
            type="button"
            onClick={() => setSearchOpen((value) => !value)}
            className="grid size-10 place-items-center rounded-full bg-bg text-sm font-bold text-ink"
            aria-label={t.nav.search}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {searchOpen ? (
        <div className="border-t border-border px-4 py-3 md:hidden">
          <SearchBox
            locale={locale}
            t={t}
            compact
            defaultValue={searchParams.get("q") ?? ""}
            onSubmit={() => setSearchOpen(false)}
          />
        </div>
      ) : null}
    </header>
  );
}
