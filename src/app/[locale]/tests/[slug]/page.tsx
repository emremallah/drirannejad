"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getUserId } from "@/lib/auth-client";
import { isLocale, localePath } from "@/lib/i18n";
import { psychTests, scoreAnswers } from "@/lib/tests";
import type { Locale } from "@/lib/types";

export default function TestPage() {
  const params = useParams<{ slug: string; locale: string }>();
  const locale: Locale = isLocale(params.locale) ? params.locale : "fa";
  const fa = locale === "fa";
  const test = psychTests.find((item) => item.slug === params.slug);
  const [answers, setAnswers] = useState<(number | undefined)[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [resultId, setResultId] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  const answered = answers.filter((item) => item !== undefined).length;
  const complete = Boolean(test && answered === test.questions.length);

  const result = useMemo(() => {
    if (!test || !complete) return null;
    const score = scoreAnswers(answers as number[]);
    return { score, ...test.interpret(score) };
  }, [answers, complete, test]);

  if (!test) {
    return (
      <div className="mx-auto w-[min(640px,calc(100%-32px))] py-10">
        <p>{fa ? "آزمون پیدا نشد." : "Test not found."}</p>
        <Link href={localePath(locale, "/tests")} className="mt-3 inline-block font-bold text-primary">
          {fa ? "بازگشت به آزمون‌ها" : "Back to tests"}
        </Link>
      </div>
    );
  }

  async function finish() {
    if (!result || !test) return;
    setPending(true);
    const response = await fetch("/api/tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: getUserId() || undefined,
        name,
        phone,
        testSlug: test.slug,
        score: result.score,
        summary: result.title,
        answers,
      }),
    });
    const data = await response.json();
    setResultId(data.result?.id ?? "");
    setPending(false);
  }

  return (
    <div className="mx-auto w-[min(760px,calc(100%-32px))] py-8">
      <Link href={localePath(locale, "/tests")} className="text-sm font-bold text-primary">
        {fa ? "بازگشت به آزمون‌ها" : "Back to tests"}
      </Link>
      <h1 className="mt-3 text-3xl font-extrabold">{test.title}</h1>
      <p className="mt-2 text-muted">{test.description}</p>
      <p className="mt-4 text-sm font-bold text-primary">
        {fa ? `پیشرفت: ${answered} از ${test.questions.length} سوال` : `Progress: ${answered} of ${test.questions.length}`}
      </p>
      <ol className="mt-6 grid gap-4">
        {test.questions.map((question, index) => (
          <li key={question.text} className="rounded-2xl border border-border bg-surface p-4">
            <p className="font-bold">
              {index + 1}. {question.text}
            </p>
            <div className="mt-3 grid gap-2">
              {question.options.map((option, optionIndex) => (
                <label key={option} className="flex min-h-11 items-center gap-3 rounded-xl bg-bg px-3 py-2.5 text-sm">
                  <input
                    type="radio"
                    name={`q-${index}`}
                    checked={answers[index] === optionIndex}
                    onChange={() =>
                      setAnswers((current) => {
                        const next = [...current];
                        next[index] = optionIndex;
                        return next;
                      })
                    }
                  />
                  {option}
                </label>
              ))}
            </div>
          </li>
        ))}
      </ol>
      {result ? (
        <section className="mt-6 rounded-2xl bg-primary-soft p-5">
          <p className="text-sm font-bold text-accent">{fa ? "نتیجه فوری" : "Instant result"}</p>
          <h2 className="mt-1 text-2xl font-extrabold">{result.title}</h2>
          <p className="mt-1 text-sm">
            {fa ? "نمره:" : "Score:"} {result.score}
          </p>
          <p className="mt-3 leading-8 text-primary-ink">{result.detail}</p>
          {!resultId ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium">
                {fa ? "نام برای ذخیره نتیجه" : "Name to save the result"}
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="min-h-11 rounded-xl border border-border bg-surface px-3.5"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                {fa ? "شماره تماس" : "Phone"}
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  inputMode="tel"
                  className="min-h-11 rounded-xl border border-border bg-surface px-3.5"
                />
              </label>
              <button
                type="button"
                disabled={!name || !phone || pending}
                onClick={finish}
                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60 md:col-span-2"
              >
                {pending
                  ? fa
                    ? "در حال ثبت..."
                    : "Saving..."
                  : fa
                    ? "ثبت نتیجه و ساخت PDF"
                    : "Save result and make PDF"}
              </button>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => window.print()} className="rounded-md bg-accent px-4 py-2 text-sm font-bold text-white">
                {fa ? "دانلود / چاپ PDF مشروح" : "Print / download PDF"}
              </button>
              <button
                type="button"
                className="rounded-md border border-primary px-4 py-2 text-sm font-bold text-primary"
                onClick={async () => {
                  await fetch("/api/tests", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ attach: true, testId: resultId }),
                  });
                  setSaved(true);
                }}
              >
                {fa ? "افزودن به رزومه سایت" : "Add to site resume"}
              </button>
              {saved ? <span className="text-sm text-success">{fa ? "در رزومه نشست." : "Added to resume."}</span> : null}
            </div>
          )}
        </section>
      ) : (
        <p className="mt-6 text-sm text-muted">
          {fa ? "برای دیدن نتیجه، همه سوال‌ها را پاسخ دهید." : "Answer every question to see the result."}
        </p>
      )}
    </div>
  );
}
