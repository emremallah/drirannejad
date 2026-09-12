import Image from "next/image";
import Link from "next/link";
import { courseCopy } from "@/lib/courses";
import { categoryLabel, formatPrice, localePath } from "@/lib/i18n";
import type { Course, Locale } from "@/lib/types";

type CourseCardProps = {
  course: Course;
  locale: Locale;
  compact?: boolean;
};

export function CourseCard({ course, locale, compact }: CourseCardProps) {
  const copy = courseCopy(course, locale);

  return (
    <article
      className={`overflow-hidden border border-border bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.06)] ${
        compact ? "min-w-[78%] snap-center rounded-3xl md:min-w-0" : "rounded-2xl md:rounded-[10px]"
      }`}
    >
      <Link href={localePath(locale, `/courses/${course.slug}`)} className="block">
        <div className="relative h-44">
          <Image
            src={course.image}
            alt={copy.title}
            fill
            sizes="(max-width: 768px) 90vw, 33vw"
            className="object-cover"
          />
          <span className="absolute bottom-3 start-3 rounded-full bg-white/92 px-2.5 py-1 text-xs font-bold text-primary-ink">
            {categoryLabel(course.category, locale)}
          </span>
        </div>
        <div className="p-4">
          {course.featured || course.price === "free" ? (
            <span className="inline-flex rounded-full bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary-ink">
              {course.price === "free"
                ? locale === "fa"
                  ? "رایگان"
                  : "Free"
                : locale === "fa"
                  ? "منتخب"
                  : "Featured"}
            </span>
          ) : null}
          <h3 className="mt-2 text-base font-bold leading-7 text-ink">{copy.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">{copy.excerpt}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-sm font-extrabold text-ink">
              {formatPrice(course.price, locale)}
            </span>
            <span className="text-sm font-bold text-primary">
              {locale === "fa" ? "مشاهده" : "View"}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
