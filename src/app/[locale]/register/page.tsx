"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { setUserId } from "@/lib/auth-client";
import { isLocale, localePath } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const fieldClass =
  "min-h-11 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary";

function RegisterForm() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale: Locale = isLocale(params.locale) ? params.locale : "fa";
  const search = useSearchParams();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const defaultRef = search.get("ref") ?? "";
  const fa = locale === "fa";

  return (
    <div className="mx-auto w-[min(520px,calc(100%-32px))] py-10">
      <h1 className="text-3xl font-extrabold">{fa ? "ثبت‌نام و صدور کارت عضویت" : "Register and get a membership card"}</h1>
      <p className="mt-2 text-sm text-muted">
        {fa
          ? "بعد از ثبت‌نام، کارت رمزگذاری‌شده و کد معرفی مخصوص خودتان صادر می‌شود."
          : "After signup you get an encrypted card and your own referral code."}
      </p>
      <form
        className="mt-6 grid gap-3"
        onSubmit={async (event) => {
          event.preventDefault();
          setPending(true);
          setError("");
          const form = new FormData(event.currentTarget);
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: form.get("name"),
              phone: form.get("phone"),
              email: form.get("email"),
              password: form.get("password"),
              referredBy: form.get("referredBy"),
            }),
          });
          const data = await response.json();
          setPending(false);
          if (!response.ok) {
            setError(data.error ?? (fa ? "ثبت‌نام انجام نشد." : "Registration failed."));
            return;
          }
          setUserId(data.user.id);
          router.push(localePath(locale, "/account"));
        }}
      >
        <label className="grid gap-1 text-sm font-medium">
          {fa ? "نام و نام خانوادگی" : "Full name"}
          <input name="name" required autoComplete="name" className={fieldClass} />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          {fa ? "شماره تماس" : "Phone"}
          <input name="phone" required inputMode="tel" autoComplete="tel" className={fieldClass} />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          {fa ? "ایمیل (اختیاری)" : "Email (optional)"}
          <input name="email" type="email" autoComplete="email" className={fieldClass} />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          {fa ? "رمز عبور" : "Password"}
          <input name="password" type="password" required autoComplete="new-password" minLength={6} className={fieldClass} />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          {fa ? "کد معرفی (اختیاری)" : "Referral code (optional)"}
          <input name="referredBy" defaultValue={defaultRef} className={fieldClass} />
        </label>
        {error ? <p className="text-sm text-accent">{error}</p> : null}
        <button disabled={pending} className="min-h-11 rounded-xl bg-primary text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-70">
          {pending ? (fa ? "در حال ثبت..." : "Saving...") : fa ? "ثبت‌نام" : "Create account"}
        </button>
      </form>
      <p className="mt-4 text-sm text-muted">
        {fa ? "حساب دارید؟" : "Already registered?"}{" "}
        <Link href={localePath(locale, "/login")} className="font-bold text-primary">
          {fa ? "وارد شوید" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
