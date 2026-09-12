import Link from "next/link";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, localePath } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function PathPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <div className="mx-auto w-[min(800px,calc(100%-32px))] py-10">
      <h1 className="text-3xl font-extrabold">{t.path.title}</h1>
      <p className="mt-2 text-muted">{t.path.lead}</p>
      <ol className="mt-8 grid gap-3">
        {t.path.steps.map((step, index) => (
          <li key={step.title}>
            <Link
              href={localePath(locale, step.href)}
              className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-4"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-extrabold text-primary-ink">
                {index + 1}
              </span>
              <span>
                <span className="block font-bold text-ink">{step.title}</span>
                <span className="mt-1 block text-sm leading-7 text-muted">
                  {step.text}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
