"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function VerifyInner() {
  const search = useSearchParams();
  const initial = search.get("code") ?? "";
  const [code, setCode] = useState(initial);
  const [result, setResult] = useState<{ valid?: boolean; name?: string; title?: string; type?: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function check(value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      setResult(null);
      return;
    }
    setPending(true);
    const response = await fetch(`/api/verify?code=${encodeURIComponent(trimmed)}`);
    setResult(await response.json());
    setPending(false);
  }

  useEffect(() => {
    if (initial) void check(initial);
    // Only auto-check a code that arrived from the URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  return (
    <div className="mx-auto w-[min(640px,calc(100%-32px))] py-10">
      <h1 className="text-3xl font-extrabold">استعلام کارت و گواهینامه</h1>
      <p className="mt-2 text-sm text-muted">هر مدرک یک کد یکتا دارد. جعل آن بدون این کد معتبر نیست.</p>
      <form
        className="mt-5 flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          void check(code);
        }}
      >
        <label className="grid flex-1 gap-1 text-sm font-medium">
          کد مدرک
          <input
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="CARD-... یا CERT-..."
            className="min-h-11 rounded-xl border border-border bg-surface px-3.5"
          />
        </label>
        <button className="min-h-11 self-end rounded-xl bg-primary px-4 text-sm font-bold text-white disabled:opacity-70" disabled={pending}>
          {pending ? "در حال بررسی..." : "بررسی"}
        </button>
      </form>
      {result ? (
        <p className={`mt-5 rounded-2xl p-4 ${result.valid ? "bg-primary-soft text-primary-ink" : "bg-accent-soft"}`}>
          {result.valid
            ? `معتبر است — ${result.type === "card" ? "کارت عضویت" : "گواهینامه"} ${result.title} برای ${result.name}`
            : "این کد در سامانه ثبت نشده و معتبر نیست."}
        </p>
      ) : null}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyInner />
    </Suspense>
  );
}
