"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Dictionary } from "@/lib/dictionary";
import { isTabActive, moreLinks, tabLinks } from "@/lib/nav";
import type { Locale } from "@/lib/types";
import { TabIcon } from "./TabIcon";

type MobileChromeProps = {
  locale: Locale;
  t: Dictionary;
};

export function MobileChrome({ locale, t }: MobileChromeProps) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const tabs = tabLinks(locale, t);
  const extra = moreLinks(locale, t);

  return (
    <>
      {moreOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label={t.actions.close}
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-surface px-5 pb-28 pt-4">
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-border" />
            <p className="mb-3 text-sm font-extrabold">{t.nav.more}</p>
            <div className="grid gap-2">
              {extra.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMoreOpen(false)}
                  className="rounded-2xl bg-bg px-4 py-3.5 text-sm font-bold text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-1 backdrop-blur-md md:hidden">
        <ul className="grid grid-cols-5">
          {tabs.map((tab) => {
            const active = isTabActive(pathname, tab.href, tab.id);
            return (
              <li key={tab.id}>
                <Link
                  href={tab.href}
                  className={`flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-bold ${
                    active ? "text-primary" : "text-faint"
                  }`}
                >
                  <TabIcon name={tab.id} active={active} />
                  {tab.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setMoreOpen((value) => !value)}
              className={`flex min-h-14 w-full flex-col items-center justify-center gap-1 text-[11px] font-bold ${
                moreOpen ? "text-primary" : "text-faint"
              }`}
            >
              <TabIcon name="more" active={moreOpen} />
              {t.tabs.more}
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
