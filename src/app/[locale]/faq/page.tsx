import { getDictionary } from "@/lib/dictionary";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <div className="mx-auto w-[min(800px,calc(100%-32px))] py-10">
      <h1 className="text-3xl font-extrabold">{t.faq.title}</h1>
      <p className="mt-2 text-muted">{t.faq.lead}</p>
      <div className="mt-8 grid gap-3">
        {t.faq.items.map((item) => (
          <details
            key={item.q}
            className="rounded-2xl border border-border bg-surface px-4 py-3"
          >
            <summary className="cursor-pointer list-none py-1 text-sm font-bold">
              {item.q}
            </summary>
            <p className="mt-2 pb-1 text-sm leading-7 text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
