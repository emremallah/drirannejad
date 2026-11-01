import { InfoPage } from "@/components/InfoPage";
import { isLocale, localePath } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function CafePage({
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
      title={fa ? "کافه کارآفرینی" : "Entrepreneurship cafe"}
      lead={
        fa
          ? "کافه کارآفرینی محل قرارهای کوتاه، گفت‌وگوی کاری و آشنا شدن اعضا با هم است."
          : "The entrepreneurship cafe is for short meetings, work conversations, and members getting to know each other."
      }
      sections={[
        {
          title: fa ? "اینجا چه شکل است" : "What happens here",
          body: fa
            ? "معرفی ایده، جلسه دونفره، استراحت بین کار، و حرف زدن با کسانی که در همین مسیرند."
            : "Pitching an idea, a two-person meeting, a break between work, and talking with people on the same path.",
        },
        {
          title: fa ? "فرق آن با یک قرار معمولی" : "How it differs from a casual meetup",
          body: fa
            ? "گفت‌وگو حول کار و یادگیری است؛ جمعی برای ادامه مسیر، نه دورهمی پراکنده."
            : "The conversation stays on work and learning: a group for continuing the path, not a scattered social.",
        },
        {
          title: fa ? "هماهنگی" : "Arranging a visit",
          body: fa
            ? "برای ساعت حضور، از صفحه تماس با ما هماهنگ کنید."
            : "Arrange the time of your visit through the contact page.",
        },
      ]}
      actions={[
        { href: localePath(locale, "/contact"), label: fa ? "تماس با ما" : "Contact us", primary: true },
        { href: localePath(locale, "/coworking"), label: fa ? "فضای کار اشتراکی" : "Coworking space" },
      ]}
    />
  );
}
