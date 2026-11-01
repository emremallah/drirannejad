import { InfoPage } from "@/components/InfoPage";
import { isLocale, localePath } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function AcceleratorPage({
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
      title={fa ? "شتابدهنده" : "Accelerator"}
      lead={
        fa
          ? "شتابدهنده برای عضوی است که از مرحله یادگیری گذشته و می‌خواهد ایده‌اش را به یک کسب‌وکار قابل اجرا برساند."
          : "The accelerator is for a member who has moved past the lessons and wants to turn an idea into a business that can actually run."
      }
      sections={[
        {
          title: fa ? "چه کاری انجام می‌دهد" : "What it does",
          body: fa
            ? "ایده را از حالت پراکنده خارج می‌کند و کنار متدولوژی هوش پنج‌گانه، روی مسئله، مخاطب، مدل درآمد و اولین قدم اجرایی می‌نشیند."
            : "It pulls the idea out of a scattered note and, alongside the five-intelligence method, works through the problem, the audience, the revenue model, and the first practical step.",
        },
        {
          title: fa ? "چه کسانی مناسب‌اند" : "Who it is for",
          body: fa
            ? "کسانی که دوره‌ای را در کلینیک گذرانده‌اند، یا ایده روشنی دارند و برای شروع جدی به همراهی نیاز دارند."
            : "People who have taken a clinic course, or who already have a clear idea and need company for a serious start.",
        },
        {
          title: fa ? "قدم بعد" : "Next step",
          body: fa
            ? "درخواست از مسیر مشاوره یا همکاری با ما ثبت می‌شود تا زمان و شکل همراهی هماهنگ شود."
            : "Send a request through consultation or collaboration so the timing and the form of support can be arranged.",
        },
      ]}
      actions={[
        { href: localePath(locale, "/consult"), label: fa ? "درخواست مشاوره" : "Request a consultation", primary: true },
        { href: localePath(locale, "/collaborate"), label: fa ? "همکاری با ما" : "Work with us" },
      ]}
    />
  );
}
