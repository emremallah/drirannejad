"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getUserId } from "@/lib/auth-client";
import type { Dictionary } from "@/lib/dictionary";
import { localePath } from "@/lib/i18n";
import { navGroups } from "@/lib/nav";
import type { Locale } from "@/lib/types";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitch } from "./LocaleSwitch";
import { BrandLogo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { SearchBox } from "./SearchBox";

type HeaderProps = {
  locale: Locale;
  t: Dictionary;
};

export function Header({ locale, t }: HeaderProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const groups = navGroups(locale);

  useEffect(() => {
    setLoggedIn(Boolean(getUserId()));
  }, [pathname]);

  useEffect(() => {
    setSearchOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
    <header className={`sticky top-0 border-b border-border bg-surface/95 backdrop-blur-md ${menuOpen ? "z-[60]" : "z-30"}`}>
      <div className="bg-scrim px-3 py-1.5 text-center text-[11px] font-bold leading-5 text-white md:text-xs">
        <span className="text-orange-200">{locale === "fa" ? "از پیله تا پروانه شدن پیوسته ادامه بده" : "From cocoon to butterfly"}</span>
        <span className="mx-1.5 text-white/40">·</span>
        <span>Keep Going</span>
      </div>
      <div className="mx-auto hidden h-[4.75rem] w-[min(1180px,calc(100%-32px))] items-center gap-5 lg:flex">
        <Link href={localePath(locale)} className="shrink-0" aria-label={t.brand}>
          <BrandLogo locale={locale} />
        </Link>
        <nav className="flex flex-1 items-center gap-0.5 text-[13px] font-semibold text-muted">
          {groups.map((group) => (
            <div key={group.title} className="group relative">
              <button
                type="button"
                aria-haspopup="true"
                className="rounded-lg px-3 py-2 hover:bg-bg hover:text-primary group-hover:bg-bg group-hover:text-primary group-focus-within:bg-bg group-focus-within:text-primary"
              >
                {group.title}
              </button>
              <div className="invisible absolute top-full start-0 z-40 min-w-48 pt-1 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="rounded-2xl border border-border bg-surface p-2 shadow-lg">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-xl px-3 py-2 text-sm text-ink hover:bg-bg hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>
        <div className="w-52 shrink-0 xl:w-64">
          <Suspense fallback={<div className="h-11 rounded-xl border border-border bg-bg" />}>
            <SearchBox locale={locale} t={t} />
          </Suspense>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle locale={locale} />
          <Suspense>
            <LocaleSwitch locale={locale} />
          </Suspense>
          {loggedIn ? (
            <Link
              href={localePath(locale, "/account")}
              className="rounded-md bg-primary px-3.5 py-2 text-sm font-bold text-white hover:bg-primary-hover"
            >
              {locale === "fa" ? "پروفایل من" : "My profile"}
            </Link>
          ) : (
            <>
              <Link
                href={localePath(locale, "/login")}
                className="rounded-md border border-border px-3 py-2 text-sm font-bold text-ink hover:border-primary hover:text-primary"
              >
                {t.actions.login}
              </Link>
              <Link
                href={localePath(locale, "/register")}
                className="rounded-md bg-primary px-3.5 py-2 text-sm font-bold text-white hover:bg-primary-hover"
              >
                {locale === "fa" ? "ثبت‌نام" : "Register"}
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto flex h-16 w-[min(1180px,calc(100%-24px))] items-center justify-between gap-2 lg:hidden">
        <div className="flex min-w-0 items-center gap-1">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setMenuOpen((value) => !value);
              setSearchOpen(false);
            }}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-bg"
            aria-label={t.nav.menu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
          <Link href={localePath(locale)} className="min-w-0" aria-label={t.brand}>
            <BrandLogo locale={locale} compact />
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <ThemeToggle locale={locale} compact />
          <Suspense>
            <LocaleSwitch locale={locale} compact />
          </Suspense>
          <button
            type="button"
            onClick={() => {
              setSearchOpen((value) => !value);
              setMenuOpen(false);
            }}
            className="grid size-10 place-items-center rounded-full bg-bg"
            aria-label={t.nav.search}
            aria-expanded={searchOpen}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      {searchOpen ? (
        <div className="border-t border-border px-4 py-3 lg:hidden">
          <Suspense fallback={<div className="h-11 rounded-xl border border-border bg-bg" />}>
            <SearchBox locale={locale} t={t} compact onSubmit={() => setSearchOpen(false)} />
          </Suspense>
        </div>
      ) : null}
    </header>
    <MobileMenu
      locale={locale}
      t={t}
      open={menuOpen}
      loggedIn={loggedIn}
      onClose={() => setMenuOpen(false)}
    />
    </>
  );
}
