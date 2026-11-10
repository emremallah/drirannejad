import { EnrollForm } from "@/components/EnrollForm";
import { socialChannels } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <div className="mx-auto grid w-[min(1120px,calc(100%-32px))] gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr]">
      <section>
        <h1 className="text-3xl font-extrabold text-ink">{t.contact.title}</h1>
        <p className="mt-3 max-w-md text-base leading-8 text-muted">{t.contact.lead}</p>
        <div className="mt-8 space-y-5">
          <div>
            <p className="text-xs font-bold text-faint">{t.contact.addressLabel}</p>
            <p className="mt-1 max-w-sm leading-8 text-ink">{t.contact.address}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-faint">{t.contact.landlineLabel}</p>
            <a href={`tel:${t.contact.landline.replace(/\D/g, "")}`} dir="ltr" className="mt-1 block w-fit font-bold text-ink hover:text-primary">
              {t.contact.landline}
            </a>
          </div>
          <div>
            <p className="text-xs font-bold text-faint">{t.contact.mobileLabel}</p>
            <a href={`tel:${t.contact.mobile}`} dir="ltr" className="mt-1 block w-fit font-bold text-ink hover:text-primary">
              {t.contact.mobile}
            </a>
          </div>
          <div>
            <p className="text-xs font-bold text-faint">{t.contact.emailLabel}</p>
            <a href={`mailto:${t.contact.email}`} dir="ltr" className="mt-1 block w-fit font-bold text-ink hover:text-primary">
              {t.contact.email}
            </a>
          </div>
          <div>
            <p className="text-xs font-bold text-faint">{t.contact.postalLabel}</p>
            <p dir="ltr" className="mt-1 w-fit font-bold text-ink">{t.contact.postal}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-faint">{locale === "fa" ? "کانال‌ها" : "Channels"}</p>
            <div className="mt-1 flex flex-col gap-1">
              {socialChannels.map((channel) => (
                <a
                  key={channel.id}
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-ink hover:text-primary"
                >
                  {locale === "fa" ? channel.labelFa : channel.labelEn}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="rounded-xl border border-border bg-surface p-6">
        <EnrollForm locale={locale} t={t} />
      </section>
    </div>
  );
}
