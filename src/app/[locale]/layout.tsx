import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hooshay } from "@/components/Hooshay";
import { MobileChrome } from "@/components/MobileChrome";
import { getDictionary } from "@/lib/dictionary";
import { dirFor, isLocale } from "@/lib/i18n";

const vazir = localFont({
  src: "../fonts/Vazirmatn-Bold.woff2",
  weight: "800",
  variable: "--font-vazir",
  display: "swap",
});

const keepGoing = localFont({
  src: "../fonts/great-vibes-400.woff2",
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return [{ locale: "fa" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    title: t.brand,
    description: t.hero.lead,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = getDictionary(locale);

  return (
    <html
      lang={locale}
      dir={dirFor(locale)}
      suppressHydrationWarning
      className={`${vazir.variable} ${keepGoing.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-ink">
        <Header locale={locale} t={t} />
        <main className="flex-1 pb-8 lg:pb-0">{children}</main>
        <Footer locale={locale} t={t} />
        <Hooshay />
        <MobileChrome locale={locale} t={t} />
      </body>
    </html>
  );
}
