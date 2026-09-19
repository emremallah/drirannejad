"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { moreGroups } from "@/lib/nav";
import { localePath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/types";
import { BrandLogo } from "./Logo";

type MobileMenuProps = {
  locale: Locale;
  t: Dictionary;
  open: boolean;
  loggedIn: boolean;
  onClose: () => void;
};

export function MobileMenu({ locale, t, open, loggedIn, onClose }: MobileMenuProps) {
  const [ready, setReady] = useState(false);
  const groups = moreGroups(locale).map((group) => ({
    ...group,
    links: group.links.filter((link) => {
      if (!loggedIn) return true;
      return !link.href.includes("/login") && !link.href.includes("/register");
    }),
  }));

  useEffect(() => {
    if (!open) {
      setReady(false);
      return;
    }
    const timer = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(timer);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-ink/45"
        aria-label={t.actions.close}
        onClick={() => {
          if (ready) onClose();
        }}
      />
      <nav
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menu}
        className="absolute inset-y-0 start-0 flex w-[min(20.5rem,86vw)] flex-col bg-surface shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <Link href={localePath(locale)} onClick={onClose} aria-label={t.brand}>
            <BrandLogo name={t.brand} compact />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-full bg-bg"
            aria-label={t.actions.close}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-28">
          <div className="grid gap-5">
            {groups.map((group) => (
              <section key={group.title}>
                <p className="mb-2 text-[11px] font-extrabold text-accent">{group.title}</p>
                <div className="grid gap-1.5">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className={
                        link.href.includes("/earn")
                          ? "rounded-xl bg-accent px-3.5 py-3 text-sm font-bold text-white"
                          : "rounded-xl bg-bg px-3.5 py-3 text-sm font-bold text-ink"
                      }
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
        <div className="border-t border-border px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          {loggedIn ? (
            <Link
              href={localePath(locale, "/account")}
              onClick={onClose}
              className="flex min-h-11 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white"
            >
              {locale === "fa" ? "پروفایل من" : "My profile"}
            </Link>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={localePath(locale, "/login")}
                onClick={onClose}
                className="flex min-h-11 items-center justify-center rounded-xl border border-border text-sm font-bold"
              >
                {t.actions.login}
              </Link>
              <Link
                href={localePath(locale, "/register")}
                onClick={onClose}
                className="flex min-h-11 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white"
              >
                {locale === "fa" ? "ثبت‌نام" : "Register"}
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
