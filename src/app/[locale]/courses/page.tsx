import Link from "next/link";
import { CourseCard } from "@/components/CourseCard";
import { courses } from "@/lib/courses";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, localePath } from "@/lib/i18n";
import type { CourseCategory } from "@/lib/types";
import { notFound } from "next/navigation";

type CoursesPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ topic?: string; q?: string }>;
};

export default async function CoursesPage({
  params,
  searchParams,
}: CoursesPageProps) {
  const { locale } = await params;
  const { topic, q } = await searchParams;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const query = q?.trim().toLowerCase() ?? "";

  const filtered = courses.filter((course) => {
    const byTopic = !topic
      ? true
      : topic === "featured"
        ? course.featured
        : course.category === (topic as CourseCategory);
    if (!byTopic) return false;
    if (!query) return true;
    const copy = course[locale];
    return `${copy.title} ${copy.excerpt} ${copy.subtitle}`.toLowerCase().includes(query);
  });

  const filters = [
    { key: "", label: t.coursesPage.all },
    { key: "featured", label: t.coursesPage.featured },
    { key: "finance", label: t.coursesPage.finance },
    { key: "eq", label: t.coursesPage.eq },
    { key: "ai", label: t.coursesPage.ai },
    { key: "speaking", label: t.coursesPage.speaking },
    { key: "free", label: t.coursesPage.free },
  ];

  return (
    <div className="mx-auto w-[min(1120px,calc(100%-32px))] py-8 md:py-12">
      <h1 className="text-3xl font-extrabold text-ink">{t.coursesPage.title}</h1>
      <p className="mt-2 max-w-2xl text-muted">{t.coursesPage.lead}</p>
      {query ? (
        <p className="mt-3 text-sm font-bold text-primary">
          {locale === "fa" ? `نتیجه برای «${q}»` : `Results for “${q}”`}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const active = (topic ?? "") === filter.key;
          const href = filter.key
            ? `${localePath(locale, "/courses")}?topic=${filter.key}`
            : localePath(locale, "/courses");
          return (
            <Link
              key={filter.key || "all"}
              href={href}
              className={
                active
                  ? "rounded-full bg-primary px-3 py-1.5 text-sm font-bold text-white"
                  : "rounded-full bg-primary-soft px-3 py-1.5 text-sm font-bold text-primary-ink"
              }
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {filtered.length ? (
          filtered.map((course) => (
            <CourseCard key={course.slug} course={course} locale={locale} />
          ))
        ) : (
          <p className="rounded-2xl bg-surface p-6 text-sm text-muted md:col-span-3">
            {t.actions.empty}
          </p>
        )}
      </div>
    </div>
  );
}
