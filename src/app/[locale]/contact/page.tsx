import { EnrollForm } from "@/components/EnrollForm";
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
            <p className="text-xs font-bold text-faint">{t.contact.phone}</p>
            {t.contact.phones.map((phone) => (
              <p key={phone} className="mt-1 font-bold text-ink">
                {phone}
              </p>
            ))}
          </div>
          <div>
            <p className="text-xs font-bold text-faint">{t.contact.address}</p>
            <p className="mt-1 max-w-sm leading-8 text-muted">{t.contact.addressValue}</p>
          </div>
        </div>
      </section>
      <section className="rounded-xl border border-border bg-surface p-6">
        <EnrollForm locale={locale} t={t} />
      </section>
    </div>
  );
}
