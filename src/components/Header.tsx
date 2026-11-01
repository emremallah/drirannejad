"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getUserId } from "@/lib/auth-client";
import type { Dictionary } from "@/lib/dictionary";
import { localePath } from "@/lib/i18n";
import { navGroups } from "@/lib/nav";
import type { Locale } from "@/lib/types";
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
  const menus = groups.filter((group) => !group.bar);
  const barLinks = groups.filter((group) => group.bar).flatMap((group) => group.links);

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
    <header className={`sticky top-0 border-b border-[#d4eef8] bg-white text-[#7FD4F9] ${menuOpen ? "z-[60]" : "z-30"}`}>
      <div className="border-b border-white/25 bg-[#15274f] px-3 py-2 text-center leading-tight">
        <p className="text-[12px] font-extrabold md:text-sm" style={{ color: "#7FD4F9" }}>
          {locale === "fa" ? "از پیله تا پروانه، پیوسته ادامه بده" : "From cocoon to butterfly, keep going"}
        </p>
        <p className="keep-going mt-0.5 text-[13px] text-white md:text-[15px]">Keep Going</p>
      </div>
      <div className="mx-auto hidden h-[4.75rem] w-[min(1180px,calc(100%-32px))] items-center gap-5 lg:flex">
        <Link href={localePath(locale)} className="shrink-0" aria-label={t.brand}>
          <BrandLogo locale={locale} light />
        </Link>
        <nav className="flex flex-1 items-center gap-0.5 text-[13px] font-semibold text-[#7FD4F9]">
          {menus.map((group) => (
            <div key={group.title} className="group relative">
              <button
                type="button"
                aria-haspopup="true"
                className="rounded-lg px-3 py-2 hover:bg-[#e8f7fd] hover:text-[#4eb6e8] group-hover:bg-[#e8f7fd] group-hover:text-[#4eb6e8] group-focus-within:bg-[#e8f7fd] group-focus-within:text-[#4eb6e8]"
              >
                {group.title}
              </button>
              <div className="invisible absolute top-full start-0 z-40 min-w-48 pt-1 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="rounded-2xl border border-[#d4eef8] bg-white p-2 shadow-lg">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-xl px-3 py-2 text-sm text-[#7FD4F9] hover:bg-[#e8f7fd] hover:text-[#4eb6e8]"
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
          <Suspense fallback={<div className="h-11 rounded-xl border border-[#d4eef8] bg-[#e8f7fd]" />}>
            <SearchBox locale={locale} t={t} />
          </Suspense>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Suspense>
            <LocaleSwitch locale={locale} />
          </Suspense>
          {loggedIn ? (
            <Link
              href={localePath(locale, "/account")}
              className="rounded-md bg-[#7FD4F9] px-3.5 py-2 text-sm font-bold text-white hover:bg-[#4eb6e8]"
            >
              {locale === "fa" ? "پروفایل من" : "My profile"}
            </Link>
          ) : (
            <>
              <Link
                href={localePath(locale, "/login")}
                className="rounded-md border border-[#7FD4F9] px-3 py-2 text-sm font-bold text-[#7FD4F9] hover:bg-[#e8f7fd]"
              >
                {t.actions.login}
              </Link>
              <Link
                href={localePath(locale, "/register")}
                className="rounded-md bg-[#7FD4F9] px-3.5 py-2 text-sm font-bold text-white hover:bg-[#4eb6e8]"
              >
                {locale === "fa" ? "ثبت‌نام" : "Register"}
              </Link>
            </>
          )}
        </div>
      </div>
      {barLinks.length > 0 ? (
        <nav
          aria-label={locale === "fa" ? "باشگاه کارآفرینی" : "Entrepreneurship Club"}
          className="mx-auto hidden w-[min(1180px,calc(100%-32px))] items-center gap-1 border-t border-[#d4eef8] py-1.5 lg:flex"
        >
          {barLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-bold ${
                  active ? "bg-[#e8f7fd] text-[#4eb6e8]" : "text-[#7FD4F9] hover:bg-[#e8f7fd] hover:text-[#4eb6e8]"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {link.barLabel ?? link.label}
              </Link>
            );
          })}
        </nav>
      ) : null}

      <div className="mx-auto flex h-16 w-[min(1180px,calc(100%-24px))] items-center justify-between gap-2 lg:hidden">
        <div className="flex min-w-0 items-center gap-1">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setMenuOpen((value) => !value);
              setSearchOpen(false);
            }}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e8f7fd] text-[#7FD4F9]"
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
            <BrandLogo locale={locale} compact light />
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Suspense>
            <LocaleSwitch locale={locale} compact />
          </Suspense>
          <button
            type="button"
            onClick={() => {
              setSearchOpen((value) => !value);
              setMenuOpen(false);
            }}
            className="grid size-10 place-items-center rounded-full bg-[#e8f7fd] text-[#7FD4F9]"
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
        <div className="border-t border-[#d4eef8] px-4 py-3 lg:hidden">
          <Suspense fallback={<div className="h-11 rounded-xl border border-[#d4eef8] bg-[#e8f7fd]" />}>
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
