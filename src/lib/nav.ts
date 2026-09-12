import type { Dictionary } from "./dictionary";
import { localePath } from "./i18n";
import type { Locale } from "./types";

export function headerLinks(locale: Locale, t: Dictionary) {
  return [
    { href: localePath(locale), label: t.nav.home },
    { href: localePath(locale, "/courses"), label: t.nav.courses },
    { href: localePath(locale, "/courses?topic=featured"), label: t.nav.featured },
    { href: localePath(locale, "/courses/powerful-me"), label: t.nav.free },
    { href: localePath(locale, "/path"), label: t.nav.path },
    { href: localePath(locale, "/reviews"), label: t.nav.reviews },
    { href: localePath(locale, "/faq"), label: t.nav.faq },
    { href: localePath(locale, "/about"), label: t.nav.about },
    { href: localePath(locale, "/contact"), label: t.nav.contact },
  ];
}

export function tabLinks(locale: Locale, t: Dictionary) {
  return [
    { href: localePath(locale), label: t.tabs.home, id: "home" },
    { href: localePath(locale, "/courses"), label: t.tabs.courses, id: "courses" },
    { href: localePath(locale, "/courses/powerful-me"), label: t.tabs.free, id: "free" },
    { href: localePath(locale, "/about"), label: t.tabs.about, id: "about" },
  ] as const;
}

export function moreLinks(locale: Locale, t: Dictionary) {
  return [
    { href: localePath(locale, "/courses?topic=featured"), label: t.nav.featured },
    { href: localePath(locale, "/path"), label: t.nav.path },
    { href: localePath(locale, "/reviews"), label: t.nav.reviews },
    { href: localePath(locale, "/faq"), label: t.nav.faq },
    { href: localePath(locale, "/contact"), label: t.nav.contact },
  ];
}

export function isTabActive(pathname: string, href: string, id: string) {
  if (id === "home") {
    return pathname === "/fa" || pathname === "/en";
  }
  if (id === "free") {
    return pathname.endsWith("/courses/powerful-me");
  }
  if (id === "courses") {
    return pathname.includes("/courses") && !pathname.endsWith("/powerful-me");
  }
  return pathname.startsWith(href);
}
