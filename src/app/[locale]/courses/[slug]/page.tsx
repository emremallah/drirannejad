import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnrollForm } from "@/components/EnrollForm";
import { MobileEnrollBar } from "@/components/MobileEnrollBar";
import { courseCopy, courses, getCourse } from "@/lib/courses";
import { getDictionary } from "@/lib/dictionary";
import { formatPrice, isLocale, localePath } from "@/lib/i18n";

type CoursePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return ["fa", "en"].flatMap((locale) =>
    courses.map((course) => ({ locale, slug: course.slug })),
  );
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const course = getCourse(slug);
  if (!course) notFound();

  const t = getDictionary(locale);
  const copy = courseCopy(course, locale);

  return (
    <div className="mx-auto w-[min(1120px,calc(100%-32px))] py-6 md:py-10">
      <Link
        href={localePath(locale, "/courses")}
        className="text-sm font-bold text-primary"
      >
        {t.actions.back}
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <article>
          <div className="relative mb-6 h-56 overflow-hidden rounded-2xl md:h-72">
            <Image
              src={course.image}
              alt={copy.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
          <p className="text-sm font-bold text-primary">{copy.subtitle}</p>
          <h1 className="mt-2 text-3xl font-extrabold leading-snug text-ink">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
            {copy.description}
          </p>
          <Link
            href={localePath(locale, `/courses/${course.slug}/learn`)}
            className="mt-5 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-bold text-white"
          >
            ورود به جلسات مرحله‌ای
          </Link>
          <p className="mt-2 text-xs leading-6 text-muted">
            قبل از شروع رسمی جلسات، تعهدنامه قوانین، انصراف و جریمه نمایش داده می‌شود.
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              [t.course.instructor, t.course.instructorName],
              [t.course.duration, course.duration[locale]],
              [t.course.format, course.format[locale]],
              [t.course.level, course.level[locale]],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-border bg-surface p-3">
                <dt className="text-xs text-faint">{label}</dt>
                <dd className="mt-1 text-sm font-bold text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <section className="mt-10">
            <h2 className="text-xl font-extrabold text-ink">{t.course.outcomes}</h2>
            <ul className="mt-4 grid gap-3">
              {copy.outcomes.map((item) => (
                <li
                  key={item.title}
                  className="rounded-xl border border-border bg-surface p-4"
                >
                  <p className="font-bold text-ink">{item.title}</p>
                  <p className="mt-1 text-sm leading-7 text-muted">{item.detail}</p>
                </li>
              ))}
            </ul>
          </section>

          {copy.extras?.length ? (
            <section className="mt-10">
              <h2 className="text-xl font-extrabold text-ink">
                {copy.extrasTitle}
              </h2>
              <ul className="mt-4 grid gap-2">
                {copy.extras.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg bg-primary-soft px-4 py-3 text-sm leading-7 text-primary-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>

        <aside
          id="enroll"
          className="mb-36 h-fit scroll-mt-28 rounded-xl border border-border bg-surface p-5 lg:sticky lg:top-24 lg:mb-0"
        >
          <p className="text-xs font-bold text-faint">{t.course.tuition}</p>
          <p className="mt-1 text-2xl font-extrabold text-ink">
            {formatPrice(course.price, locale)}
          </p>
          <p className="mt-4 text-sm font-bold text-ink">{t.course.enrollTitle}</p>
          <p className="mt-1 mb-4 text-sm leading-7 text-muted">{t.course.enrollLead}</p>
          <EnrollForm locale={locale} t={t} defaultCourse={course.slug} />
        </aside>
      </div>
      <MobileEnrollBar course={course} locale={locale} t={t} />
    </div>
  );
}
