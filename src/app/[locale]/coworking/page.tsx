import { InfoPage } from "@/components/InfoPage";
import { isLocale, localePath } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function CoworkingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const fa = locale === "fa";

  return (
    <InfoPage
      eyebrow={fa ? "باشگاه کارآفرینی" : "Entrepreneurship Club"}
      title={fa ? "فضای کار اشتراکی" : "Coworking space"}
      lead={
        fa
          ? "فضای کار اشتراکی جایی برای کار کردن، درس خواندن و پیش بردن ایده در کنار بقیه اعضای باشگاه است."
          : "The coworking space is where you work, study, and move an idea forward next to other club members."
      }
      sections={[
        {
          title: fa ? "برای چه کاری مناسب است" : "What it is for",
          body: fa
            ? "تمرکز روی درس و کار، جلسه کوتاه با هم‌تیمی، و فاصله گرفتن از کارِ تنها."
            : "Focused study and work, a short meeting with a teammate, and a break from working alone.",
        },
        {
          title: fa ? "چه کسانی می‌آیند" : "Who comes here",
          body: fa
            ? "اعضای باشگاه و کسانی که مسیر کارآفرینی کلینیک را جلو می‌برند."
            : "Club members and people moving along the clinic’s entrepreneurship path.",
        },
        {
          title: fa ? "هماهنگی حضور" : "Arranging a visit",
          body: fa
            ? "زمان و شکل استفاده از فضا از صفحه تماس هماهنگ می‌شود."
            : "The time and the way you use the space are arranged through the contact page.",
        },
      ]}
      actions={[
        { href: localePath(locale, "/contact"), label: fa ? "تماس با ما" : "Contact us", primary: true },
        { href: localePath(locale, "/club"), label: fa ? "باشگاه کارآفرینی" : "Entrepreneurship Club" },
      ]}
    />
  );
}
