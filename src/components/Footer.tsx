import Link from "next/link";
import { sisterSites } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { localePath } from "@/lib/i18n";
import { navGroups } from "@/lib/nav";
import type { Locale } from "@/lib/types";
import { BrandLogo } from "./Logo";

function SisterLink({
  locale,
  site,
}: {
  locale: Locale;
  site: (typeof sisterSites)[number];
}) {
  const label = locale === "en" ? site.nameEn : site.name;
  if (site.soon) {
    return <span className="text-faint">{label}</span>;
  }
  if (site.path) {
    return (
      <Link href={localePath(locale, site.path)} className="hover:text-primary">
        {label}
      </Link>
    );
  }
  if (!site.href) return <span>{label}</span>;
  return (
    <a href={site.href} target="_blank" rel="noreferrer" className="hover:text-primary">
      {label}
    </a>
  );
}

export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const groups = navGroups(locale);

  return (
    <footer className="mt-auto border-t border-border bg-surface pb-24 lg:pb-0">
      <div className="mx-auto hidden w-[min(1180px,calc(100%-32px))] gap-8 py-10 lg:grid lg:grid-cols-7">
        <div>
          <Link href={localePath(locale)} className="inline-flex">
            <BrandLogo locale={locale} />
          </Link>
          <p className="mt-3 text-sm leading-7 text-muted">{t.footer.blurb}</p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <p className="text-sm font-extrabold text-ink">{group.title}</p>
            <div className="mt-3 grid gap-2 text-sm text-muted">
              {group.links.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-primary">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
        <div>
          <p className="text-sm font-extrabold text-ink">
            {locale === "fa" ? "سایت‌های زیرمجموعه" : "Sister sites"}
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
            {sisterSites.map((site) => (
              <SisterLink key={site.name} locale={locale} site={site} />
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-6 lg:hidden">
        <p className="text-sm font-extrabold">{locale === "fa" ? "سایت‌های زیرمجموعه" : "Sister sites"}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {sisterSites.map((site) => (
            <span key={site.name} className="rounded-full bg-bg px-3 py-1.5 font-bold text-muted">
              <SisterLink locale={locale} site={site} />
            </span>
          ))}
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto w-[min(1180px,calc(100%-32px))] py-4 text-xs text-faint">
          © 2026 {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
