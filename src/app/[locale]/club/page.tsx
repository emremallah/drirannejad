import { InfoPage } from "@/components/InfoPage";
import { isLocale, localePath } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function ClubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const fa = locale === "fa";

  return (
    <InfoPage
      eyebrow={fa ? "از پیله تا پروانه" : "From cocoon to butterfly"}
      title={fa ? "باشگاه کارآفرینی" : "Entrepreneurship Club"}
      lead={
        fa
          ? "باشگاه کارآفرینی جمع اعضای پلی‌کلینیک است. اینجا آموزش پراکنده و جزیره‌ای کنار گذاشته می‌شود و مسیر رشد، سیستماتیک، همراه و مدرن پیش می‌رود."
          : "The Entrepreneurship Club is the clinic’s member community. Scattered, one-off learning stops here, and growth continues as a systematic path you walk with other members."
      }
      sections={[
        {
          title: fa ? "عضویت چطور شروع می‌شود" : "How membership starts",
          body: fa
            ? "با ثبت‌نام، کارت عضویت باشگاه کارآفرینی صادر می‌شود. این کارت با گواهینامه پایان دوره فرق دارد. گواهینامه وقتی صادر می‌شود که دوره را تمام کرده باشید. هر دو کد یکتا دارند و از صفحه استعلام قابل بررسی‌اند."
            : "Registration issues your Entrepreneurship Club card. That card is separate from the course certificate, which is issued when you finish a course. Each has a unique code you can check on the verification page.",
        },
        {
          title: fa ? "عضو باشگاه به چه چیزهایی دسترسی دارد" : "What members get",
          body: fa
            ? "دوره‌ها، آزمون‌ها، مشاوره، هدایا و طرح راحت پول دربیار. هر عضو کد معرفی خودش را دارد و می‌تواند دیگران را به همین مسیر بیاورد."
            : "Courses, tests, consultation, gifts, and the Earn Easily plan. Every member has a personal referral code and can bring others onto the same path.",
        },
        {
          title: fa ? "چرا عضویت در باشگاه" : "Why join",
          body: fa
            ? "یادگیری کنار کسانی که همان مسیر را می‌روند، ادامه دادن را واقعی‌تر می‌کند. شعار باشگاه همان شعار کلینیک است: از پیله تا پروانه، پیوسته ادامه بده."
            : "Learning beside people on the same path makes it easier to keep going. The club uses the clinic’s line: from cocoon to butterfly, keep going.",
        },
      ]}
      actions={[
        { href: localePath(locale, "/register"), label: fa ? "ثبت‌نام و دریافت کارت" : "Register and get your card", primary: true },
        { href: localePath(locale, "/courses"), label: fa ? "معرفی دوره‌ها" : "Browse courses" },
      ]}
    />
  );
}
