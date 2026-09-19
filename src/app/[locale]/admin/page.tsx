"use client";

import { useEffect, useState } from "react";
import { EarnAdmin } from "@/components/EarnAdmin";
import { normalizeEarnPlan, type EarnPlan } from "@/lib/earn-plan";

type AdminUser = {
  id: string;
  name: string;
  phone: string;
  referralCode: string;
  referredBy?: string;
  wallet: number;
};

export default function AdminPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/api/admin")
      .then((response) => response.json())
      .then(setData);
  }, []);

  if (!data) return <p className="p-8">در حال بارگذاری پنل...</p>;

  const tests = (data.tests as { name: string; phone: string; testSlug: string; score: number }[]) ?? [];
  const referrals = (data.referrals as { user: string; phone: string; referredBy: string }[]) ?? [];
  const forms = (data.forms as { kind: string; data: Record<string, string> }[]) ?? [];
  const users = (data.users as AdminUser[]) ?? [];
  const earnPlan = normalizeEarnPlan(data.earnPlan as EarnPlan | undefined);

  return (
    <div className="mx-auto w-[min(1000px,calc(100%-32px))] py-8">
      <h1 className="text-3xl font-extrabold">پنل مرکز</h1>
      <EarnAdmin initialPlan={earnPlan} users={users} />
      <section className="mt-6">
        <h2 className="font-extrabold">شرکت‌کنندگان آزمون</h2>
        <div className="mt-3 grid gap-2">
          {tests.length ? (
            tests.map((item, index) => (
              <p key={`${item.phone}-${index}`} className="rounded-xl bg-surface p-3 text-sm">
                {item.name} — {item.phone} — {item.testSlug} — نمره {item.score}
              </p>
            ))
          ) : (
            <p className="text-sm text-muted">هنوز آزمونی ثبت نشده است.</p>
          )}
        </div>
      </section>
      <section className="mt-8">
        <h2 className="font-extrabold">معرف‌ها و پورسانت</h2>
        <div className="mt-3 grid gap-2">
          {referrals.length ? (
            referrals.map((item) => (
              <p key={item.phone} className="rounded-xl bg-accent-soft p-3 text-sm">
                {item.user} ({item.phone}) با کد {item.referredBy} آمده است
              </p>
            ))
          ) : (
            <p className="text-sm text-muted">هنوز معرفی ثبت نشده است.</p>
          )}
        </div>
      </section>
      <section className="mt-8">
        <h2 className="font-extrabold">فرم‌های مشاوره و همکاری</h2>
        <div className="mt-3 grid gap-2">
          {forms.length ? (
            forms.map((item, index) => (
              <p key={`${item.kind}-${index}`} className="rounded-xl bg-bg p-3 text-sm">
                {item.kind}: {Object.values(item.data).slice(0, 4).join(" / ")}
              </p>
            ))
          ) : (
            <p className="text-sm text-muted">فرمی ارسال نشده است.</p>
          )}
        </div>
      </section>
    </div>
  );
}
