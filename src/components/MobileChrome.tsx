"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/lib/dictionary";
import { isTabActive, tabLinks } from "@/lib/nav";
import type { Locale } from "@/lib/types";
import { TabIcon } from "./TabIcon";

type MobileChromeProps = {
  locale: Locale;
  t: Dictionary;
};

export function MobileChrome({ locale, t }: MobileChromeProps) {
  const pathname = usePathname();
  const tabs = tabLinks(locale);

  return (
    <nav className="frosted fixed inset-x-0 bottom-0 z-40 border-t border-border px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-1 lg:hidden">
      <ul className="grid grid-cols-4">
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
      </ul>
    </nav>
  );
}
