"use client";

import { useState } from "react";
import {
  emptyEarnPerk,
  emptyEarnStep,
  emptyEarnTier,
  type EarnPerk,
  type EarnPlan,
  type EarnStep,
  type EarnTier,
} from "@/lib/earn-plan";

type SafeUser = {
  id: string;
  name: string;
  phone: string;
  referralCode: string;
  referredBy?: string;
  wallet: number;
};

type EarnAdminProps = {
  initialPlan: EarnPlan;
  users: SafeUser[];
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

export function EarnAdmin({ initialPlan, users: initialUsers }: EarnAdminProps) {
  const [plan, setPlan] = useState(initialPlan);
  const [users, setUsers] = useState(initialUsers);
  const [moneyStep, setMoneyStep] = useState(10000);
  const [percentStep, setPercentStep] = useState(1);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function persist(next: EarnPlan) {
    setPlan(next);
    setSaving(true);
    setStatus("");
    const response = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "saveEarnPlan", plan: next }),
    });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) {
      setStatus(data.error ?? "ذخیره نشد.");
      return;
    }
    setPlan(data.plan);
    setStatus("تغییرات طرح ذخیره شد.");
  }

  function update<K extends keyof EarnPlan>(key: K, value: EarnPlan[K], immediate = false) {
    const next = { ...plan, [key]: value };
    setPlan(next);
    if (immediate) void persist(next);
  }

  function updateList<T extends EarnStep | EarnTier | EarnPerk>(
    key: "steps" | "tiers" | "perks",
    id: string,
    patch: Partial<T>,
    immediate = false,
  ) {
    const next = {
      ...plan,
      [key]: plan[key].map((item) => (item.id === id ? { ...item, ...patch } : item)),
    };
    setPlan(next);
    if (immediate) void persist(next);
  }

  async function changeWallet(userId: string, delta: number) {
    const response = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "adjustWallet", userId, delta }),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error ?? "کیف پول به‌روز نشد.");
      return;
    }
    setUsers((current) =>
      current.map((user) => (user.id === userId ? { ...user, wallet: data.wallet } : user)),
    );
    setStatus("کیف پول به‌روز شد.");
  }

  return (
    <section className="mt-8 rounded-3xl border border-accent/40 bg-accent-soft/40 p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold text-accent">مدیریت محتوا و اعداد</p>
          <h2 className="text-2xl font-extrabold">طرح راحت پول دربیار</h2>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => persist(plan)}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-70"
        >
          {saving ? "در حال ذخیره..." : "ذخیره متن‌ها"}
        </button>
      </div>
      {status ? <p className="mt-3 text-sm text-accent">{status}</p> : null}

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          عنوان فارسی
          <input className={fieldClass} value={plan.titleFa} onChange={(event) => update("titleFa", event.target.value)} />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          عنوان انگلیسی
          <input className={fieldClass} value={plan.titleEn} onChange={(event) => update("titleEn", event.target.value)} />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          زیرعنوان فارسی
          <input className={fieldClass} value={plan.subtitleFa} onChange={(event) => update("subtitleFa", event.target.value)} />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          زیرعنوان انگلیسی
          <input className={fieldClass} value={plan.subtitleEn} onChange={(event) => update("subtitleEn", event.target.value)} />
        </label>
        <label className="grid gap-1 text-sm font-medium md:col-span-2">
          توضیح فارسی
          <textarea className={`${fieldClass} min-h-24`} value={plan.introFa} onChange={(event) => update("introFa", event.target.value)} />
        </label>
        <label className="grid gap-1 text-sm font-medium md:col-span-2">
          توضیح انگلیسی
          <textarea className={`${fieldClass} min-h-24`} value={plan.introEn} onChange={(event) => update("introEn", event.target.value)} />
        </label>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl bg-surface p-4 md:grid-cols-3">
        <div>
          <p className="text-sm font-bold">پاداش هر معرفی</p>
          <div className="mt-2">
            <Stepper
              value={plan.rewardPerReferral}
              step={moneyStep}
              suffix="تومان"
              onChange={(value) => update("rewardPerReferral", value, true)}
            />
          </div>
        </div>
        <div>
          <p className="text-sm font-bold">کف کمیسیون</p>
          <div className="mt-2">
            <Stepper
              value={plan.commissionMin}
              step={percentStep}
              suffix="٪"
              onChange={(value) => update("commissionMin", Math.min(100, value), true)}
            />
          </div>
        </div>
        <div>
          <p className="text-sm font-bold">سقف کمیسیون</p>
          <div className="mt-2">
            <Stepper
              value={plan.commissionMax}
              step={percentStep}
              suffix="٪"
              onChange={(value) => update("commissionMax", Math.min(100, value), true)}
            />
          </div>
        </div>
        <label className="grid gap-1 text-sm">
          گام مبلغ
          <input
            type="number"
            min={1}
            className={fieldClass}
            value={moneyStep}
            onChange={(event) => setMoneyStep(Math.max(1, Number(event.target.value) || 1))}
          />
        </label>
        <label className="grid gap-1 text-sm">
          گام درصد
          <input
            type="number"
            min={1}
            className={fieldClass}
            value={percentStep}
            onChange={(event) => setPercentStep(Math.max(1, Number(event.target.value) || 1))}
          />
        </label>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-extrabold">مراحل طرح</h3>
          <button
            type="button"
            className="text-sm font-bold text-primary"
            onClick={() => persist({ ...plan, steps: [...plan.steps, emptyEarnStep()] })}
          >
            + افزودن مرحله
          </button>
        </div>
        <div className="mt-3 grid gap-3">
          {plan.steps.map((step) => (
            <article key={step.id} className="rounded-2xl bg-surface p-4">
              <div className="grid gap-2 md:grid-cols-2">
                <input className={fieldClass} value={step.titleFa} onChange={(event) => updateList("steps", step.id, { titleFa: event.target.value })} />
                <input className={fieldClass} value={step.titleEn} onChange={(event) => updateList("steps", step.id, { titleEn: event.target.value })} />
                <textarea className={fieldClass} value={step.textFa} onChange={(event) => updateList("steps", step.id, { textFa: event.target.value })} />
                <textarea className={fieldClass} value={step.textEn} onChange={(event) => updateList("steps", step.id, { textEn: event.target.value })} />
              </div>
              <button
                type="button"
                className="mt-2 text-xs font-bold text-accent"
                onClick={() => persist({ ...plan, steps: plan.steps.filter((item) => item.id !== step.id) })}
              >
                حذف مرحله
              </button>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-extrabold">سطوح درآمد</h3>
          <button
            type="button"
            className="text-sm font-bold text-primary"
            onClick={() => persist({ ...plan, tiers: [...plan.tiers, emptyEarnTier()] })}
          >
            + افزودن سطح
          </button>
        </div>
        <div className="mt-3 grid gap-3">
          {plan.tiers.map((tier) => (
            <article key={tier.id} className="rounded-2xl bg-surface p-4">
              <div className="grid gap-2 md:grid-cols-2">
                <input className={fieldClass} value={tier.titleFa} onChange={(event) => updateList("tiers", tier.id, { titleFa: event.target.value })} />
                <input className={fieldClass} value={tier.titleEn} onChange={(event) => updateList("tiers", tier.id, { titleEn: event.target.value })} />
                <textarea className={fieldClass} value={tier.textFa} onChange={(event) => updateList("tiers", tier.id, { textFa: event.target.value })} />
                <textarea className={fieldClass} value={tier.textEn} onChange={(event) => updateList("tiers", tier.id, { textEn: event.target.value })} />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold text-muted">درصد</p>
                  <Stepper
                    value={tier.percent}
                    step={percentStep}
                    suffix="٪"
                    onChange={(value) => updateList("tiers", tier.id, { percent: Math.min(100, value) }, true)}
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted">مبلغ</p>
                  <Stepper
                    value={tier.amount}
                    step={moneyStep}
                    suffix="تومان"
                    onChange={(value) => updateList("tiers", tier.id, { amount: value }, true)}
                  />
                </div>
              </div>
              <button
                type="button"
                className="mt-2 text-xs font-bold text-accent"
                onClick={() => persist({ ...plan, tiers: plan.tiers.filter((item) => item.id !== tier.id) })}
              >
                حذف سطح
              </button>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-extrabold">مزایا و اعداد نمایشی</h3>
          <button
            type="button"
            className="text-sm font-bold text-primary"
            onClick={() => persist({ ...plan, perks: [...plan.perks, emptyEarnPerk()] })}
          >
            + افزودن مورد
          </button>
        </div>
        <div className="mt-3 grid gap-3">
          {plan.perks.map((perk) => (
            <article key={perk.id} className="rounded-2xl bg-surface p-4">
              <div className="grid gap-2 md:grid-cols-2">
                <input className={fieldClass} value={perk.titleFa} onChange={(event) => updateList("perks", perk.id, { titleFa: event.target.value })} />
                <input className={fieldClass} value={perk.titleEn} onChange={(event) => updateList("perks", perk.id, { titleEn: event.target.value })} />
                <input className={fieldClass} value={perk.unitFa} onChange={(event) => updateList("perks", perk.id, { unitFa: event.target.value })} />
                <input className={fieldClass} value={perk.unitEn} onChange={(event) => updateList("perks", perk.id, { unitEn: event.target.value })} />
                <textarea className={fieldClass} value={perk.textFa} onChange={(event) => updateList("perks", perk.id, { textFa: event.target.value })} />
                <textarea className={fieldClass} value={perk.textEn} onChange={(event) => updateList("perks", perk.id, { textEn: event.target.value })} />
              </div>
              <div className="mt-3">
                <p className="text-xs font-bold text-muted">عدد</p>
                <Stepper
                  value={perk.value}
                  step={perk.unitFa.includes("درصد") || perk.unitEn.includes("%") ? percentStep : moneyStep}
                  suffix={perk.unitFa}
                  onChange={(value) => updateList("perks", perk.id, { value }, true)}
                />
              </div>
              <button
                type="button"
                className="mt-2 text-xs font-bold text-accent"
                onClick={() => persist({ ...plan, perks: plan.perks.filter((item) => item.id !== perk.id) })}
              >
                حذف مورد
              </button>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-extrabold">کیف پول کاربران</h3>
        <p className="mt-1 text-sm text-muted">موجودی هر کاربر را زیاد یا کم کنید. کمتر از صفر نمی‌شود.</p>
        <div className="mt-3 grid gap-2">
          {users.length ? (
            users.map((user) => (
              <article key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface p-4">
                <div>
                  <p className="font-bold">{user.name}</p>
                  <p className="text-xs text-muted">
                    {user.phone} · کد {user.referralCode}
                    {user.referredBy ? ` · معرف ${user.referredBy}` : ""}
                  </p>
                </div>
                <Stepper
                  value={user.wallet}
                  step={moneyStep}
                  suffix="تومان"
                  onChange={(value) => changeWallet(user.id, value - user.wallet)}
                />
              </article>
            ))
          ) : (
            <p className="text-sm text-muted">هنوز کاربری ثبت نشده است.</p>
          )}
        </div>
      </div>
    </section>
  );
}
