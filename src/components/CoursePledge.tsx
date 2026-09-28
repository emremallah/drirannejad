"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { courseRuleSteps, toman, type CourseRules } from "@/lib/course-rules";
import { localePath } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

type CoursePledgeProps = {
  locale: Locale;
  courseSlug: string;
  courseTitle: string;
  userId: string;
  userName: string;
  onAccepted: () => void;
};

export function CoursePledge({
  locale,
  courseSlug,
  courseTitle,
  userId,
  userName,
  onAccepted,
}: CoursePledgeProps) {
  const fa = locale === "fa";
  const [rules, setRules] = useState<CourseRules | null>(null);
  const [screen, setScreen] = useState<"intro" | number>("intro");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/course-rules")
      .then((response) => response.json())
      .then(setRules)
      .catch(() => setError(fa ? "قوانین بارگذاری نشد." : "Could not load the rules."));
  }, [fa]);

  const steps = useMemo(() => (rules ? courseRuleSteps(rules) : []), [rules]);
  const current = typeof screen === "number" ? steps[screen] : null;
  const lastIndex = steps.length - 1;

  async function accept() {
    setPending(true);
    setError("");
    const response = await fetch("/api/pledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, course: courseSlug }),
    });
    const data = await response.json();
    setPending(false);
    if (!response.ok) {
      setError(data.error ?? (fa ? "ثبت تعهد انجام نشد." : "Could not save the pledge."));
      return;
    }
    onAccepted();
  }

  if (!rules) {
    return (
      <div className="mx-auto w-[min(720px,calc(100%-32px))] py-10">
        <p className="text-sm text-muted">{fa ? "در حال بارگذاری قوانین دوره..." : "Loading course rules..."}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-[min(720px,calc(100%-24px))] py-6 md:py-10">
      <p className="text-xs font-extrabold text-accent">{fa ? "قوانین دوره" : "Course rules"}</p>
      <h1 className="mt-1 text-2xl font-extrabold md:text-3xl">{courseTitle}</h1>

      {screen === "intro" ? (
        <section className="mt-6 rounded-3xl border border-border bg-surface p-5 md:p-7">
          <h2 className="text-xl font-extrabold">{fa ? "هدف از قوانین و ثبت تعهدنامه" : "Why these rules and this pledge"}</h2>
          <ul className="mt-4 grid gap-3 text-sm leading-8 text-muted">
            <li>
              {fa
                ? "این دوره، یک دوره عملی است و برای دستیابی به نتایج مطلوب در عادت‌سازی، لازم است قوانین آن را رعایت کنید."
                : "This is a practical course. Lasting results need these rules to be kept."}
            </li>
            <li>
              {fa
                ? "قوانین مطابق با اصول عادت‌سازی است و هدف آن‌ها بازدارندگی از رهاکردن دوره است."
                : "The rules follow habit-building principles and exist to stop the course from being abandoned."}
            </li>
            <li>
              {fa
                ? "برای مشاهده قوانین، روی دکمه «بررسی قوانین» بزنید، آن‌ها را با دقت بخوانید و در صورت پذیرش، تعهد شرعی خود را ثبت کنید."
                : "Open Review rules, read them carefully, and record your pledge if you accept."}
            </li>
          </ul>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setScreen(0)}
              className="min-h-12 rounded-xl bg-primary text-sm font-bold text-white hover:bg-primary-hover"
            >
              {fa ? "بررسی قوانین" : "Review rules"}
            </button>
            <Link
              href={localePath(locale, `/courses/${courseSlug}`)}
              className="flex min-h-12 items-center justify-center rounded-xl border border-border text-sm font-bold"
            >
              {fa ? "انصراف" : "Leave"}
            </Link>
          </div>
        </section>
      ) : current ? (
        <section className="mt-6 rounded-3xl border border-border bg-surface p-5 md:p-7">
          <ol className="mb-6 flex items-start justify-between gap-1">
            {steps.map((step, index) => {
              const done = index < screen;
              const active = index === screen;
              return (
                <li key={step.id} className="flex min-w-0 flex-1 flex-col items-center text-center">
                  <span
                    className={`grid size-8 place-items-center rounded-full text-sm font-extrabold ${
                      done || active ? "bg-primary text-white" : "bg-bg text-faint"
                    }`}
                  >
                    {done ? "✓" : index + 1}
                  </span>
                  <span className={`mt-2 text-[11px] font-bold ${active ? "text-primary" : "text-faint"}`}>
                    {fa ? step.titleFa : step.titleEn}
                  </span>
                </li>
              );
            })}
          </ol>

          <h2 className="text-lg font-extrabold leading-8 md:text-xl">
            {fa ? current.headingFa : current.headingEn}
          </h2>

          {current.id === "confirm" ? (
            <div className="mt-4 text-sm leading-8 text-muted">
              <p>
                {fa ? "من، " : "I, "}
                <b className="text-ink">{userName}</b>
                {fa
                  ? "، متعهد می‌شوم که دوره را تا پایان بازه تعیین‌شده مشاهده کنم و در صورتی که قبل از این جلسه، به هر دلیلی از این دوره انصراف بدهم، "
                  : ", pledge to follow this course as written. If I withdraw before the allowed window for any reason, "}
                <b className="text-ink">{fa ? toman(rules.cancelFee) : `${rules.cancelFee.toLocaleString("en-US")} Toman`}</b>
                {fa
                  ? " برای پلی‌کلینیک پروفسور ایران‌نژاد (AI) واریز نمایم."
                  : " will be paid to Prof. Irannejad (AI) Polyclinic."}
              </p>
              <p className="mt-3">
                {fa
                  ? "همچنین متعهد می‌شوم که برای موفقیت در عادت‌سازی و رسیدن به نتیجه مطلوب، جلسات را به طور منظم و طبق قوانین مشاهده کرده و در آزمون شرکت نمایم و در صورتی که مشاهده نکنم، یا در آزمون شرکت نکنم و یا بعد از ۲ بار شرکت در آزمون، نمره لازم را کسب نکنم، طبق قوانین، جریمه آن را پرداخت نمایم."
                  : "I also pledge to watch lessons on schedule, take each test, and pay the stated penalty if I miss a lesson, skip a test, or fail both attempts."}
              </p>
            </div>
          ) : (
            <ul className="mt-4 grid gap-3 text-sm leading-8 text-muted">
              {(fa ? current.bulletsFa : current.bulletsEn).map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          )}

          {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}

          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {current.id === "confirm" ? (
              <>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => void accept()}
                  className="min-h-12 rounded-xl bg-primary text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-70"
                >
                  {pending ? (fa ? "در حال ثبت..." : "Saving...") : fa ? "شرعا تعهد می‌دهم" : "I pledge"}
                </button>
                <Link
                  href={localePath(locale, `/courses/${courseSlug}`)}
                  className="flex min-h-12 items-center justify-center rounded-xl border border-border text-sm font-bold"
                >
                  {fa ? "تعهد نمی‌دهم" : "I do not pledge"}
                </Link>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setScreen(screen + 1)}
                  className="min-h-12 rounded-xl bg-primary text-sm font-bold text-white hover:bg-primary-hover"
                >
                  {fa ? "پذیرش و ادامه" : "Accept and continue"}
                </button>
                <button
                  type="button"
                  onClick={() => setScreen(screen === 0 ? "intro" : screen - 1)}
                  className="min-h-12 rounded-xl border border-border text-sm font-bold"
                >
                  {fa ? "بازگشت" : "Back"}
                </button>
              </>
            )}
          </div>
          <p className="mt-3 text-center text-[11px] text-faint">
            {fa ? `مرحله ${screen + 1} از ${lastIndex + 1}` : `Step ${screen + 1} of ${lastIndex + 1}`}
          </p>
        </section>
      ) : null}
    </div>
  );
}
