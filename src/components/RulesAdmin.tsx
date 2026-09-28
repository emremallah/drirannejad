"use client";

import { useState } from "react";
import { toman, type CourseRules } from "@/lib/course-rules";

type RulesAdminProps = {
  initialRules: CourseRules;
};

const fieldClass =
  "min-h-11 w-full rounded-xl border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary";

function Stepper({
  value,
  step,
  suffix,
  onChange,
}: {
  value: number;
  step: number;
  suffix?: string;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="grid size-10 place-items-center rounded-xl bg-bg text-lg font-extrabold"
        onClick={() => onChange(Math.max(0, value - step))}
        aria-label="کاهش"
      >
        −
      </button>
      <p className="min-w-24 text-center text-lg font-extrabold">
        {value.toLocaleString("fa-IR")}
        {suffix ? ` ${suffix}` : ""}
      </p>
      <button
        type="button"
        className="grid size-10 place-items-center rounded-xl bg-primary text-lg font-extrabold text-white"
        onClick={() => onChange(value + step)}
        aria-label="افزایش"
      >
        +
      </button>
    </div>
  );
}

export function RulesAdmin({ initialRules }: RulesAdminProps) {
  const [rules, setRules] = useState(initialRules);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [moneyStep, setMoneyStep] = useState(5000);

  async function persist(next: CourseRules) {
    setRules(next);
    setSaving(true);
    setStatus("");
    const response = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "saveCourseRules", rules: next }),
    });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) {
      setStatus(data.error ?? "ذخیره نشد.");
      return;
    }
    setRules(data.rules);
    setStatus("قوانین و جریمه‌ها ذخیره شد.");
  }

  function update<K extends keyof CourseRules>(key: K, value: CourseRules[K]) {
    void persist({ ...rules, [key]: value });
  }

  return (
    <section className="mt-8 rounded-3xl border border-border bg-surface p-5">
      <h2 className="text-2xl font-extrabold">تعهدنامه، قوانین و جریمه دوره‌ها</h2>
      <p className="mt-1 text-sm text-muted">
        این اعداد قبل از شروع رسمی جلسات به هنرجو نشان داده می‌شود. با + و − کم و زیاد کنید.
      </p>
      {status ? <p className="mt-3 text-sm text-accent">{status}</p> : null}
      {saving ? <p className="mt-2 text-xs text-muted">در حال ذخیره...</p> : null}

      <label className="mt-4 grid max-w-xs gap-1 text-sm">
        گام مبلغ
        <input
          type="number"
          min={1}
          className={fieldClass}
          value={moneyStep}
          onChange={(event) => setMoneyStep(Math.max(1, Number(event.target.value) || 1))}
        />
      </label>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-bold">جریمه پایه</p>
          <p className="text-xs text-muted">{toman(rules.penaltyBase)}</p>
          <div className="mt-2">
            <Stepper value={rules.penaltyBase} step={moneyStep} suffix="تومان" onChange={(value) => update("penaltyBase", value)} />
          </div>
        </div>
        <div>
          <p className="text-sm font-bold">افزایش هر تکرار</p>
          <div className="mt-2">
            <Stepper value={rules.penaltyStep} step={moneyStep} suffix="تومان" onChange={(value) => update("penaltyStep", value)} />
          </div>
        </div>
        <div>
          <p className="text-sm font-bold">سقف جریمه</p>
          <div className="mt-2">
            <Stepper value={rules.penaltyCap} step={moneyStep} suffix="تومان" onChange={(value) => update("penaltyCap", value)} />
          </div>
        </div>
        <div>
          <p className="text-sm font-bold">مبلغ انصراف خارج از بازه</p>
          <div className="mt-2">
            <Stepper value={rules.cancelFee} step={Math.max(moneyStep, 100000)} suffix="تومان" onChange={(value) => update("cancelFee", value)} />
          </div>
        </div>
        <div>
          <p className="text-sm font-bold">مدت جلسه (دقیقه)</p>
          <div className="mt-2">
            <Stepper value={rules.sessionMinutes} step={1} suffix="دقیقه" onChange={(value) => update("sessionMinutes", Math.max(1, value))} />
          </div>
        </div>
        <div>
          <p className="text-sm font-bold">تعداد سوال آزمون</p>
          <div className="mt-2">
            <Stepper value={rules.examQuestions} step={1} onChange={(value) => update("examQuestions", Math.max(1, value))} />
          </div>
        </div>
        <div>
          <p className="text-sm font-bold">نمره قبولی</p>
          <div className="mt-2">
            <Stepper value={rules.passScore} step={5} suffix="از ۱۰۰" onChange={(value) => update("passScore", Math.min(100, value))} />
          </div>
        </div>
        <div>
          <p className="text-sm font-bold">فرصت آزمون</p>
          <div className="mt-2">
            <Stepper value={rules.examAttempts} step={1} suffix="بار" onChange={(value) => update("examAttempts", Math.max(1, value))} />
          </div>
        </div>
      </div>
    </section>
  );
}
