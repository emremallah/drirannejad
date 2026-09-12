import Link from "next/link";
import type { Dictionary } from "@/lib/dictionary";
import { headerLinks } from "@/lib/nav";
import { localePath } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { BrandLogo } from "./Logo";

type FooterProps = {
  locale: Locale;
  t: Dictionary;
};

export function Footer({ locale, t }: FooterProps) {
  const links = headerLinks(locale, t);

  return (
    <footer className="mt-auto hidden border-t border-border bg-surface md:block">
      <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href={localePath(locale)} className="inline-flex">
            <BrandLogo name={t.brand} />
          </Link>
          <p className="mt-2 max-w-sm text-sm leading-7 text-muted">{t.footer.blurb}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted">
          {links.slice(0, 5).map((link) => (
            <Link key={`${link.href}-${link.label}`} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="text-sm text-muted">
          {links.slice(5).map((link) => (
            <Link key={`${link.href}-${link.label}`} href={link.href} className="mb-2 block">
              {link.label}
            </Link>
          ))}
          {t.contact.phones.map((phone) => (
            <p key={phone}>{phone}</p>
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
