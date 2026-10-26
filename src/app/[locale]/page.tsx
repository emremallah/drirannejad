import Image from "next/image";
import Link from "next/link";
import { CourseCard } from "@/components/CourseCard";
import { clinicBanner, licenses, sisterSites, sloganEn, sloganFa, zizaaStoreUrl } from "@/lib/content";
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
        <h1 className="mx-auto max-w-4xl text-xl font-extrabold leading-9 md:text-3xl md:leading-12" style={{ color: "#7FD4F9" }}>
          {fa
            ? "مبدع و مبتکر اکوسیستم آموزشی نوین ارائه‌دهنده متدولوژی مبتنی بر هوش پنج‌گانه در ایران و جهان"
            : "Originator and innovator of a new educational ecosystem providing a five-intelligence methodology in Iran and the world"}
        </h1>
        <p className="mt-3 text-base font-extrabold md:text-lg" style={{ color: "#7FD4F9" }}>
          {fa ? sloganFa : "From cocoon to butterfly, keep going"}
        </p>
        <p className="keep-going mt-2 text-[18px] leading-none text-white md:text-[22px]">{sloganEn}</p>
      </section>

      <div className="mx-auto w-[min(1120px,calc(100%-32px))]">
        <section className="grid items-start gap-8 py-10 md:grid-cols-[1.2fr_0.8fr]">
          <div className="min-w-0 text-justify [text-align-last:start]">
            {fa ? (
              <div className="space-y-3 text-[15px] leading-8 text-ink md:text-base md:leading-8">
                <h2 className="text-[15px] font-extrabold leading-8 md:text-base md:leading-8">
                  انسانِ امروزی در یک بستر کاملاً جدید و دگرگون‌شده زندگی می‌کند که در آن تمام معناهای سنتیِ زیستن، ارتباط برقرار کردن، کار کردن و موفق شدن دچار دگرگونی شده‌اند.
                </h2>
                <p>
                  سرعت تحولات به قدری بالاست که تجربه‌ی زیسته‌ی نسل‌ها با هم متفاوت شده است. مفاهیمی مثل موفقیت، ارتباط، آرامش و هویت، دیگر تعریف‌های ثابتی ندارند و مدام در حال نو شدن هستند.
                </p>
                <p>
                  همان‌گونه که سیستم بدن انسان با حواس پنجگانه کار می‌کند؛ سیستم موفقیت در عصر مدرنیته هم با «هوش پنج‌گانه» کار می‌کند؛
                </p>
                <p>
                  انسانِ مدرن به نوعی سازگاریِ ساختاری و چندبعدی (همان هوش‌های پنج‌گانه) نیاز دارد تا در این دنیای پر از ابهام و تحول، دچار فروپاشی روانی یا سردرگمی آموزشی نشود.
                </p>
                <p className="font-extrabold">
                  آیا آماده‌ی جهش در عصر مدرن هستید؟ همین حالا مهارت‌های هوش هیجانی، هوش ارتباطی، هوش مصنوعی، هوش مالی و هوش تجاری خودت را تقویت کن.
                </p>
              </div>
            ) : (
              <h2 className="text-3xl font-extrabold leading-snug text-ink md:text-4xl">
                Specialized & superspecialized polyclinic of entrepreneurship and AI, Dr. Irannejad
              </h2>
            )}
            <p className="mt-4 text-sm leading-7 text-muted md:text-base">
              {fa
                ? "دوران آموزش جزیره‌ای منسوخ شده، با ما سیستماتیک و مدرن آموزش ببین و به درخشان‌ترین نسخه‌ی خودت تبدیل شو."
                : "Courses, tests, and consultation in one path. The Entrepreneurship Club card is issued after registration, and the certificate after you finish the course."}
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
                {fa ? "کارت عضویت باشگاه کارآفرینی" : "Entrepreneurship Club card"}
              </Link>
            </div>
          </div>
          <Image
            src="/brand/hooshay.png"
            alt={fa ? "هوشای، کاراکتر تجاری کلینیک" : "Hooshay, the clinic character"}
            width={819}
            height={819}
            sizes="(max-width: 768px) 90vw, 480px"
            quality={85}
            priority
            className="mx-auto w-full min-w-0 max-w-[360px] object-contain md:max-w-[440px]"
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
              { label: fa ? "آموزش رایگان" : "Free lessons", href: localePath(locale, "/free") },
              { label: fa ? "هدایا" : "Gifts", href: localePath(locale, "/gifts") },
              { label: fa ? "طرح راحت پول دربیار" : "Earn Easily plan", href: localePath(locale, "/earn") },
              { label: fa ? "فروشگاه زی‌ضا" : "Zizaa store", href: zizaaStoreUrl },
            ] as const
          ).map(({ label, href }) => (
            <Link
              key={href}
              href={href}
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
