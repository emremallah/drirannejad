"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ScaledPreview } from "@/components/resume/ScaledPreview";
import { isLocale, localePath } from "@/lib/i18n";
import { colors, sampleResume, templateIds, templateNames, type TemplateId } from "@/lib/resume";
import type { Locale } from "@/lib/types";

export default function ResumeBuilderPage() {
  const params = useParams<{ locale: string }>();
  const locale: Locale = isLocale(params.locale) ? params.locale : "fa";
  const fa = locale === "fa";
  const t = (a: string, b: string) => (fa ? a : b);
  const [color, setColor] = useState(colors[0].value);
  const [active, setActive] = useState<TemplateId>("main");
  const start = localePath(locale, "/resume-builder/me");

  const features = [
    {
      title: t("قالب‌های متنوع", "Six templates"),
      text: t("شش قالب استاندارد؛ هر وقت خواستید قالب را عوض کنید، اطلاعات سر جایش می‌ماند.", "Six standard templates. Switch any time — your details stay put."),
    },
    {
      title: t("هفت رنگ", "Seven colours"),
      text: t("رنگ قالب را با یک کلیک عوض کنید و پیش‌نمایش را همان لحظه ببینید.", "Change the colour in one click and see it right away."),
    },
    {
      title: t("تغییر چیدمان", "Your own layout"),
      text: t("ترتیب بخش‌ها را عوض کنید و بخش‌هایی را که نمی‌خواهید پنهان کنید.", "Reorder sections and hide the ones you don't need."),
    },
    {
      title: t("فارسی و انگلیسی", "Persian & English"),
      text: t("رزومه فارسی با تاریخ شمسی و رزومه انگلیسی با تاریخ میلادی.", "Persian resumes with the Persian calendar, English ones with the Gregorian."),
    },
    {
      title: t("چند رزومه", "Several resumes"),
      text: t("از رزومه اصلی کپی بگیرید و برای هر آگهی، نسخه مناسب همان شغل را بسازید.", "Copy your main resume and tailor a version for each job."),
    },
    {
      title: t("نتیجه آزمون‌ها", "Your test results"),
      text: t("نتیجه آزمون‌های هوش و شخصیت‌شناسی همین سایت به رزومه اضافه می‌شود.", "Results from this site's personality tests can go on your resume."),
    },
    {
      title: t("دانلود PDF", "PDF download"),
      text: t("رزومه را در اندازه A4 دانلود یا چاپ کنید.", "Download or print your resume at A4 size."),
    },
    {
      title: t("ذخیره در حساب", "Saved to your account"),
      text: t("از موبایل و کامپیوتر به رزومه‌تان دسترسی دارید و هر وقت خواستید ویرایشش می‌کنید.", "Edit your resume from any device, any time."),
    },
  ];

  const faq = [
    {
      q: t("استفاده از رزومه‌ساز رایگان است؟", "Is the resume builder free?"),
      a: t("بله. ساخت، ویرایش و دانلود رزومه کاملاً رایگان است.", "Yes. Building, editing and downloading are all free."),
    },
    {
      q: t("چطور PDF بگیرم؟", "How do I get a PDF?"),
      a: t(
        "در صفحه «دانلود رزومه» روی دکمه دانلود بزنید و در پنجره چاپ، مقصد را «Save as PDF» انتخاب کنید.",
        "On the Download page press Download, then choose “Save as PDF” in the print dialog.",
      ),
    },
    {
      q: t("می‌توانم بعداً قالب یا رنگ را عوض کنم؟", "Can I change the template or colour later?"),
      a: t("بله. اطلاعات رزومه جدا از قالب ذخیره می‌شود و با هر قالبی نمایش داده می‌شود.", "Yes. Your details are stored apart from the design and work with every template."),
    },
    {
      q: t("عکس بگذارم؟", "Should I add a photo?"),
      a: t(
        "توصیه می‌کنیم جز به درخواست کارفرما عکس نگذارید تا قضاوت فقط بر اساس توانایی‌هایتان باشد.",
        "Unless the employer asks for one, we suggest leaving it out so you're judged on your skills.",
      ),
    },
  ];

  return (
    <div className="mx-auto w-[min(1120px,calc(100%-32px))] py-10">
      <section className="text-center">
        <p className="text-sm font-bold text-accent">{t("رزومه‌ساز آنلاین رایگان", "Free online resume builder")}</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-5xl">{t("در کمتر از ۱۰ دقیقه رزومه حرفه‌ای بسازید", "Build a professional resume in under 10 minutes")}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          {t("رزومه‌ساز دو زبانه با قالب‌های استاندارد و رنگ‌بندی متنوع.", "A two-language resume builder with standard templates and a choice of colours.")}
        </p>
        <Link href={start} className="mt-7 inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-base font-extrabold text-white hover:bg-primary-hover">
          {t("شروع کنید", "Get started")}
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs">{t("رایگان", "Free")}</span>
        </Link>
      </section>

      <section className="mt-16">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold">{t("انتخاب قالب رزومه", "Choose a template")}</h2>
          <p className="mt-2 text-sm text-muted">{t("بدون نیاز به نرم‌افزار گرافیکی، رزومه حرفه‌ای بسازید.", "No design software needed.")}</p>
        </div>
        <div className="mt-5 flex justify-center gap-3">
          {colors.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setColor(c.value)}
              aria-label={c.name[locale]}
              aria-pressed={color === c.value}
              className={`grid h-9 w-9 place-items-center rounded-full ring-2 ring-offset-2 ring-offset-bg ${color === c.value ? "ring-primary" : "ring-transparent"}`}
            >
              <span className="h-7 w-7 rounded-full" style={{ background: c.value }} />
            </button>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {templateIds.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              className={`rounded-2xl border-2 bg-surface p-2 text-center transition ${active === id ? "border-primary" : "border-transparent hover:border-border"}`}
            >
              <ScaledPreview resume={sampleResume(locale, { template: id, color })} maxHeight={230} className="rounded-md bg-white" />
              <span className="mt-2 block text-sm">
                <span className="text-faint">{t("قالب", "Template")} </span>
                <b>{templateNames[id][locale].replace("قالب ", "")}</b>
              </span>
            </button>
          ))}
        </div>
        <div className="mx-auto mt-8 max-w-xl">
          <ScaledPreview resume={sampleResume(locale, { template: active, color })} className="rounded-lg shadow-2xl ring-1 ring-black/10" />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-center text-2xl font-extrabold">{t("امکانات رزومه‌ساز", "What you get")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="font-extrabold">{f.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-center text-2xl font-extrabold">{t("سوالات متداول", "FAQ")}</h2>
        <div className="mt-6 grid gap-3">
          {faq.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-border bg-surface p-4">
              <summary className="cursor-pointer list-none font-bold marker:hidden">{f.q}</summary>
              <p className="mt-3 text-sm leading-7 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-3xl bg-primary p-8 text-center text-white">
        <h2 className="text-2xl font-extrabold">{t("رزومه‌تان را همین حالا بسازید", "Start your resume now")}</h2>
        <p className="mt-2 text-white/85">{t("تنها با چند کلیک رزومه‌ای می‌سازید که توجه کارفرما را جلب کند.", "A few clicks to a resume that gets noticed.")}</p>
        <Link href={start} className="mt-5 inline-block rounded-full bg-white px-7 py-3 font-extrabold text-primary">
          {t("شروع کنید", "Get started")}
        </Link>
      </section>
    </div>
  );
}
