import Link from "next/link";
import { CourseCard } from "@/components/CourseCard";
import { courses, featuredCourses } from "@/lib/courses";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, localePath } from "@/lib/i18n";
import { notFound } from "next/navigation";

type HomeProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomeProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const featured = featuredCourses();

  return (
    <div className="mx-auto w-[min(1120px,calc(100%-32px))]">
      <section className="grid gap-8 py-8 md:grid-cols-[1.2fr_0.8fr] md:items-center md:gap-10 md:py-20">
        <div>
          <p className="mb-3 text-sm font-bold text-primary">{t.hero.kicker}</p>
          <h1 className="max-w-xl text-[32px] font-extrabold leading-tight tracking-tight text-ink md:text-5xl">
            {t.hero.title}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-muted">{t.hero.lead}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={localePath(locale, "/courses")}
              className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary-hover md:rounded-md md:px-4 md:py-2.5"
            >
              {t.actions.viewCourses}
            </Link>
            <Link
              href={localePath(locale, "/courses/powerful-me")}
              className="rounded-md px-4 py-2.5 text-sm font-bold text-primary"
            >
              {t.actions.freeCourse}
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            [t.stats.studentsValue, t.stats.students],
            [t.stats.coursesValue, t.stats.courses],
            [t.stats.hoursValue, t.stats.hours],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-surface p-4 text-center"
            >
              <p className="text-xl font-extrabold text-primary">{value}</p>
              <p className="mt-1 text-xs text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-16">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-ink">{t.sections.featured}</h2>
            <p className="mt-1 text-sm text-muted">{t.sections.featuredLead}</p>
          </div>
          <Link href={localePath(locale, "/courses")} className="text-sm font-bold text-primary">
            {t.actions.viewCourses}
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {featured.map((course) => (
            <CourseCard key={course.slug} course={course} locale={locale} compact />
          ))}
        </div>
      </section>

      <section className="pb-16">
        <h2 className="mb-5 text-2xl font-extrabold text-ink">{t.sections.why}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {t.why.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <h3 className="font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="mb-5">
          <h2 className="text-2xl font-extrabold text-ink">{t.sections.all}</h2>
          <p className="mt-1 text-sm text-muted">{t.sections.allLead}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {courses
            .filter((course) => !course.featured)
            .map((course) => (
              <CourseCard key={course.slug} course={course} locale={locale} />
            ))}
        </div>
      </section>
    </div>
  );
}
