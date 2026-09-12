import Link from "next/link";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, localePath } from "@/lib/i18n";
import { notFound } from "next/navigation";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <div className="mx-auto w-[min(800px,calc(100%-32px))] py-14">
      <p className="text-sm font-bold text-primary">{t.sections.instructor}</p>
      <h1 className="mt-2 text-4xl font-extrabold text-ink">{t.about.title}</h1>
      <p className="mt-3 text-lg font-medium text-muted">{t.about.role}</p>
      <div className="mt-8 space-y-5 text-base leading-8 text-muted">
        <p>{t.about.p1}</p>
        <p>{t.about.p2}</p>
        <p>{t.about.p3}</p>
      </div>
      <Link
        href={localePath(locale, "/courses")}
        className="mt-8 inline-flex rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"
      >
        {t.actions.viewCourses}
      </Link>
    </div>
  );
}
