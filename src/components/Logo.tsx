import Image from "next/image";
import type { Locale } from "@/lib/types";

type BrandLogoProps = {
  locale: Locale;
  compact?: boolean;
  stacked?: boolean;
};

export function BrandLogo({ locale, compact, stacked }: BrandLogoProps) {
  const fa = locale !== "en";

  return (
    <span className={`flex min-w-0 ${stacked ? "flex-col items-start gap-2" : "items-center gap-2.5"}`}>
      <Image
        src="/brand/clinic-mark.png"
        alt=""
        width={96}
        height={74}
        sizes="96px"
        quality={90}
        priority
        className={`shrink-0 object-contain drop-shadow-sm ${compact ? "h-10 w-auto" : "h-12 w-auto md:h-[3.35rem]"}`}
      />
      <span
        className={`brand-lockup grid leading-5 ${
          stacked ? "w-full" : "w-max max-w-full"
        } ${compact ? "text-[10px] sm:text-[11px]" : "text-[11px] md:text-[13px]"}`}
      >
        <span className="font-extrabold text-accent">
          {fa ? "پلی‌کلینیک تخصصی و فوق‌تخصصی" : "Specialized & superspecialized polyclinic"}
        </span>
        <span className="font-extrabold text-ink">
          {fa ? "کارآفرینی پروفسور ایران‌نژاد (AI)" : "Entrepreneurship · Prof. Irannejad (AI)"}
        </span>
      </span>
    </span>
  );
}
