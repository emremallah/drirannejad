import Link from "next/link";
import { sisterSites } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionary";
import { localePath } from "@/lib/i18n";
import { navGroups } from "@/lib/nav";
import type { Locale } from "@/lib/types";
import { BrandLogo } from "./Logo";

const ENAMAD_CODE = "AK5CEDleANGrSqJZxP9z3BvwqoMLi0Mx";
const ENAMAD_HREF = `https://trustseal.enamad.ir/?id=8213531&Code=${ENAMAD_CODE}`;

function EnamadSeal() {
  return (
    <a
      referrerPolicy="origin"
      target="_blank"
      rel="noopener"
      href={ENAMAD_HREF}
      className="inline-block shrink-0"
      title="نماد اعتماد الکترونیکی"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        referrerPolicy="origin"
        src="/brand/enamad.jpg"
        alt="نماد اعتماد الکترونیکی"
        width={554}
        height={554}
        className="h-[88px] w-auto cursor-pointer bg-white md:h-[108px]"
        {...{ code: ENAMAD_CODE }}
      />
    </a>
  );
}

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
      <div className="mx-auto hidden w-[min(1180px,calc(100%-32px))] py-10 lg:block">
        <div className="grid grid-cols-3 items-start gap-x-10 gap-y-10 xl:grid-cols-4">
          <div className="min-w-0 max-w-[260px]">
            <Link href={localePath(locale)} className="inline-flex max-w-full">
              <BrandLogo locale={locale} compact stacked />
            </Link>
            <p className="mt-3 text-sm leading-7 text-muted">{t.footer.blurb}</p>
          </div>
          {groups.map((group) => (
            <div key={group.title} className="min-w-0">
              <p className="text-sm font-extrabold text-ink">{group.title}</p>
              <div className="mt-3 flex flex-col gap-2 text-sm leading-6 text-muted">
                {group.links.map((link) => (
                  <Link key={link.href} href={link.href} className="w-fit hover:text-primary">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-ink">
              {locale === "fa" ? "سایت‌های زیرمجموعه" : "Sister sites"}
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm leading-6 text-muted">
              {sisterSites.map((site) => (
                <SisterLink key={site.name} locale={locale} site={site} />
              ))}
            </div>
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
        <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-wrap items-center justify-between gap-4 py-4">
          <p className="min-w-0 flex-1 text-xs leading-6 text-faint">© 2026 {t.footer.rights}</p>
          <EnamadSeal />
        </div>
      </div>
    </footer>
  );
}
