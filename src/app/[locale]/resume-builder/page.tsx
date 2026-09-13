"use client";

import { useMemo, useState } from "react";

const fields = {
  name: { label: "نام", rows: 1 },
  title: { label: "عنوان شغلی", rows: 1 },
  education: { label: "تحصیلات", rows: 3 },
  experience: { label: "سوابق", rows: 3 },
  skills: { label: "مهارت‌ها", rows: 3 },
} as const;

export default function ResumeBuilderPage() {
  const [data, setData] = useState({
    name: "",
    title: "",
    education: "",
    experience: "",
    skills: "",
    includeTests: true,
  });

  const filled = useMemo(
    () => Boolean(data.name || data.title || data.education || data.experience || data.skills),
    [data],
  );

  return (
    <div className="mx-auto grid w-[min(1000px,calc(100%-32px))] gap-6 py-10 lg:grid-cols-2">
      <div>
        <h1 className="text-3xl font-extrabold">رزومه‌ساز رایگان</h1>
        <p className="mt-2 text-sm text-muted">
          اگر بخواهید، نتیجه آزمون‌های همین سایت به‌صورت خودکار در رزومه می‌نشیند.
        </p>
        <div className="mt-5 grid gap-3">
          {Object.entries(fields).map(([key, field]) => (
            <label key={key} className="grid gap-1 text-sm font-medium">
              {field.label}
              <textarea
                rows={field.rows}
                className="min-h-11 rounded-xl border border-border bg-surface px-3.5 py-2.5"
                onChange={(event) => setData((current) => ({ ...current, [key]: event.target.value }))}
              />
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.includeTests}
              onChange={(event) => setData((current) => ({ ...current, includeTests: event.target.checked }))}
            />
            افزودن خودکار نتیجه آزمون‌ها به رزومه
          </label>
        </div>
      </div>
      <aside className="rounded-2xl border border-border bg-surface p-5">
        <p className="text-xs font-bold text-accent">پیش‌نمایش</p>
        {filled ? (
          <>
            <h2 className="mt-2 text-xl font-extrabold">{data.name || "نام شما"}</h2>
            {data.title ? <p className="text-sm text-muted">{data.title}</p> : null}
            {data.education ? (
              <section className="mt-4">
                <p className="text-xs font-extrabold text-primary">تحصیلات</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-7">{data.education}</p>
              </section>
            ) : null}
            {data.experience ? (
              <section className="mt-4">
                <p className="text-xs font-extrabold text-primary">سوابق</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-7">{data.experience}</p>
              </section>
            ) : null}
            {data.skills ? (
              <section className="mt-4">
                <p className="text-xs font-extrabold text-primary">مهارت‌ها</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-7">{data.skills}</p>
              </section>
            ) : null}
          </>
        ) : (
          <p className="mt-3 text-sm leading-7 text-muted">فیلدها را پر کنید تا رزومه شکل بگیرد.</p>
        )}
        {data.includeTests ? (
          <p className="mt-4 rounded-xl bg-primary-soft p-3 text-sm text-primary-ink">
            نتیجه آزمون‌های ثبت‌شده شما، در صورت تأیید، اینجا ضمیمه می‌شود.
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => window.print()}
          className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white"
        >
          خروجی PDF رزومه
        </button>
      </aside>
    </div>
  );
}
