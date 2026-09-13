import Link from "next/link";
import { gifts } from "@/lib/content";
import { isLocale, localePath } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function GiftsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="mx-auto w-[min(800px,calc(100%-32px))] py-10">
      <h1 className="text-3xl font-extrabold">دریافت هدایا</h1>
      <div className="mt-6 grid gap-4">
        {gifts.map((item) => (
          <article key={item.title} className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="font-extrabold text-primary">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">{item.text}</p>
          </article>
        ))}
      </div>
      <Link href={localePath(locale, "/register")} className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-white">
        ثبت‌نام برای دریافت کد معرفی
      </Link>
    </div>
  );
}
