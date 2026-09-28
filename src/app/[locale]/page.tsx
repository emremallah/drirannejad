import Image from "next/image";
import Link from "next/link";
import { CourseCard } from "@/components/CourseCard";
import { clinicBanner, clinicName, licenses, sisterSites, sloganEn, sloganFa } from "@/lib/content";
import { courses, featuredCourses } from "@/lib/courses";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, localePath } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const featured = featuredCourses();
  const fa = locale === "fa";

  return (
    <div>
      <section className="bg-surface px-4 py-7 text-center md:py-9">
        <p className="text-[11px] font-bold text-accent md:text-xs">{clinicName}</p>
        <h1 className="mx-auto mt-2 max-w-4xl text-xl font-extrabold leading-9 md:text-3xl md:leading-12">
          {fa
            ? "مبدع و مبتکر اکوسیستم آموزشی نوین ارائه‌دهنده متدولوژی مبتنی بر هوش پنج‌گانه در ایران و جهان"
            : "Originator and innovator of a new educational ecosystem providing a five-intelligence methodology in Iran and the world"}
        </h1>
        <p className="mt-3 text-sm text-primary-ink">
          {sloganFa} · {sloganEn}
        </p>
      </section>

      <div className="mx-auto w-[min(1120px,calc(100%-32px))]">
        <section className="grid items-center gap-8 py-10 md:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-sm font-bold text-accent">{t.brand}</p>
            <h2 className="mt-2 text-3xl font-extrabold leading-snug text-ink md:text-4xl">
              {fa ? "از پیله تا پروانه شدن" : "From cocoon to butterfly"}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted md:text-base">
              {fa
                ? "دوره، آزمون، مشاوره و کارت عضویت در یک مسیر. همین‌جا شروع کنید."
                : "Courses, tests, consultation, and membership — start from here."}
            </p>
            <p className="sr-only">{clinicBanner}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={localePath(locale, "/courses")} className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary-hover">
                {fa ? "معرفی دوره‌ها" : "Browse courses"}
              </Link>
              <Link href={localePath(locale, "/tests")} className="rounded-full bg-accent px-5 py-3 text-sm font-bold text-white">
                {fa ? "آزمون رایگان" : "Free test"}
              </Link>
              <Link href={localePath(locale, "/register")} className="rounded-full border border-primary px-5 py-3 text-sm font-bold text-primary">
                {fa ? "ثبت‌نام و کارت عضویت" : "Register"}
              </Link>
            </div>
          </div>
          <Image
            src="/brand/hooshay.jpg"
            alt={fa ? "هوشای، کاراکتر تجاری کلینیک" : "Hooshay, the clinic character"}
            width={420}
            height={420}
            priority
            className="mx-auto w-full max-w-[280px] rounded-full border-4 border-accent object-cover md:max-w-[320px]"
          />
        </section>

        <section className="pb-12">
          <h2 className="text-2xl font-extrabold">{fa ? "مجوزهای کلینیک" : "Clinic licenses"}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {licenses.map((item) => (
              <article key={item.title} className="rounded-2xl border border-border bg-surface p-4">
                <p className="font-bold text-primary">{item.title}</p>
                <p className="mt-1 text-sm text-muted">{item.issuer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pb-12">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-2xl font-extrabold">{t.sections.featured}</h2>
            <Link href={localePath(locale, "/courses")} className="text-sm font-bold text-primary">
              {fa ? "همه دوره‌ها" : "All courses"}
            </Link>
          </div>
          <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {featured.map((course) => (
              <CourseCard key={course.slug} course={course} locale={locale} compact />
            ))}
          </div>
        </section>

        <section className="grid gap-3 pb-12 sm:grid-cols-2 md:grid-cols-4">
          {(
            [
              [fa ? "آموزش رایگان" : "Free lessons", "/free"],
              [fa ? "هدایا" : "Gifts", "/gifts"],
              [fa ? "طرح راحت پول دربیار" : "Referral wallet", "/earn"],
              [fa ? "فروشگاه زی‌رضا" : "Zi-Reza store", "/store"],
            ] as const
          ).map(([label, href]) => (
            <Link
              key={href}
              href={localePath(locale, href)}
              className="rounded-2xl bg-primary-soft p-4 font-bold text-primary-ink hover:bg-primary hover:text-white"
            >
              {label}
            </Link>
          ))}
        </section>

        <section className="pb-12">
          <h2 className="text-2xl font-extrabold">{t.sections.all}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {courses
              .filter((course) => !course.featured)
              .map((course) => (
                <CourseCard key={course.slug} course={course} locale={locale} />
              ))}
          </div>
        </section>

        <section className="pb-16">
          <h2 className="text-2xl font-extrabold">{fa ? "سایت‌های زیرمجموعه" : "Sister sites"}</h2>
          <p className="mt-1 text-sm text-muted">
            {fa
              ? "هر سایت تازه‌ای که اضافه شود، اینجا به بقیه لینک می‌شود."
              : "New sister sites will appear here as they launch."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {sisterSites.map((site) => {
              const label = fa ? site.name : site.nameEn;
              if (site.soon) {
                return (
                  <span key={site.name} className="rounded-full border border-dashed border-border bg-surface px-4 py-2 text-sm font-bold text-faint">
                    {label}
                  </span>
                );
              }
              if (site.path) {
                return (
                  <Link
                    key={site.name}
                    href={localePath(locale, site.path)}
                    className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-bold hover:border-primary hover:text-primary"
                  >
                    {label}
                  </Link>
                );
              }
              return (
                <a
                  key={site.name}
                  href={site.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-bold hover:border-primary hover:text-primary"
                >
                  {label}
                </a>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
