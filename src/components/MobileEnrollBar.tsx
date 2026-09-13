import Link from "next/link";
import type { Dictionary } from "@/lib/dictionary";
import { formatPrice } from "@/lib/i18n";
import type { Course, Locale } from "@/lib/types";

type MobileEnrollBarProps = {
  course: Course;
  locale: Locale;
  t: Dictionary;
};

export function MobileEnrollBar({ course, locale, t }: MobileEnrollBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-[72px] z-30 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] text-faint">{t.course.tuition}</p>
          <p className="text-sm font-extrabold">{formatPrice(course.price, locale)}</p>
        </div>
        <Link
          href="#enroll"
          className="rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-white"
        >
          {t.actions.enrollNow}
        </Link>
      </div>
    </div>
  );
}
