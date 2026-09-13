import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath } from "@/lib/i18n";
import { psychTests } from "@/lib/tests";

export default async function TestsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const fa = locale === "fa";

  return (
    <div className="mx-auto w-[min(900px,calc(100%-32px))] py-10">
      <h1 className="text-3xl font-extrabold">{fa ? "آزمون‌های روانشناسی" : "Psychology tests"}</h1>
      <p className="mt-2 text-muted">
        {fa
          ? "نتیجه همان لحظه دیده می‌شود. اگر بخواهید، PDF می‌گیرید و به رزومه سایت اضافه می‌شود."
          : "See the result immediately. You can print a PDF and attach it to your resume."}
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {psychTests.map((test) => (
          <article key={test.slug} className="flex flex-col rounded-2xl border border-border bg-surface p-4">
            <p className="text-xs font-bold text-accent">
              {test.price === "free"
                ? fa
                  ? "رایگان"
                  : "Free"
                : `${test.price.toLocaleString(fa ? "fa-IR" : "en-US")} ${fa ? "تومان" : "Toman"}`}
            </p>
            <h2 className="mt-1 font-extrabold">{test.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-7 text-muted">{test.description}</p>
            <Link href={localePath(locale, `/tests/${test.slug}`)} className="mt-3 inline-block text-sm font-bold text-primary">
              {fa ? "شروع آزمون" : "Start test"}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
