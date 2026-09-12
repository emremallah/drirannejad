import { getDictionary } from "@/lib/dictionary";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <div className="mx-auto w-[min(900px,calc(100%-32px))] py-10">
      <h1 className="text-3xl font-extrabold">{t.reviews.title}</h1>
      <p className="mt-2 text-muted">{t.reviews.lead}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {t.reviews.items.map((item) => (
          <article
            key={item.name}
            className="rounded-2xl border border-border bg-surface p-5"
          >
            <p className="text-sm leading-7 text-muted">“{item.text}”</p>
            <p className="mt-4 text-sm font-extrabold">{item.name}</p>
            <p className="text-xs text-faint">{item.role}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
