import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hooshay } from "@/components/Hooshay";
import { MobileChrome } from "@/components/MobileChrome";
import { getDictionary } from "@/lib/dictionary";
import { dirFor, isLocale } from "@/lib/i18n";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
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
      className={`${vazir.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("clinic-theme");if(t==="light")document.documentElement.classList.add("light")}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${vazir.className} flex min-h-full flex-col bg-bg text-ink`}>
        <Header locale={locale} t={t} />
        <main className="flex-1 pb-8 lg:pb-0">{children}</main>
        <Footer locale={locale} t={t} />
        <Hooshay />
        <MobileChrome locale={locale} t={t} />
      </body>
    </html>
  );
}
