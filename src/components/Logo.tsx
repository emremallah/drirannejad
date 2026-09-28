import Image from "next/image";
import type { Locale } from "@/lib/types";

type BrandLogoProps = {
  locale: Locale;
  compact?: boolean;
};

export function BrandLogo({ locale, compact }: BrandLogoProps) {
  const fa = locale !== "en";

  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <Image
        src="/brand/clinic-mark.png"
        alt=""
        width={1562}
        height={1200}
        quality={100}
        priority
        className={`shrink-0 object-contain drop-shadow-sm ${compact ? "h-10 w-auto" : "h-12 w-auto md:h-[3.35rem]"}`}
      />
      <span
        className={`min-w-0 leading-snug ${
          compact ? "text-[10px] sm:text-[11px]" : "text-[11px] md:text-[13px]"
        }`}
      >
        <span className="block font-extrabold text-accent">
          {fa ? "پلی‌کلینیک تخصصی و فوق‌تخصصی" : "Specialized & superspecialized polyclinic"}
        </span>
        <span className="mt-0.5 block font-bold text-ink">
          {fa ? "کارآفرینی پروفسور ایران‌نژاد (AI)" : "Entrepreneurship · Prof. Irannejad (AI)"}
        </span>
      </span>
    </span>
  );
}
