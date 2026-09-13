import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseCard } from "@/components/CourseCard";
import { courses } from "@/lib/courses";
import { isLocale, localePath } from "@/lib/i18n";

export default async function FreePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const fa = locale === "fa";
  const free = courses.filter((course) => course.price === "free" || course.slug === "powerful-me");

  return (
    <div className="mx-auto w-[min(900px,calc(100%-32px))] py-10">
      <h1 className="text-3xl font-extrabold">{fa ? "آموزش‌های رایگان" : "Free lessons"}</h1>
      <p className="mt-2 text-muted">
        {fa
          ? "شروع مسیر بدون هزینه؛ بعد می‌توانید آزمون و دوره تخصصی را بردارید."
          : "Start without paying. Then move to a test or a full course."}
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {free.map((course) => (
          <CourseCard key={course.slug} course={course} locale={locale} />
        ))}
      </div>
      <Link href={localePath(locale, "/tests")} className="mt-6 inline-block font-bold text-primary">
        {fa ? "آزمون‌های رایگان" : "Free tests"}
      </Link>
    </div>
  );
}
