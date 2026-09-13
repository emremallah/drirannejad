"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { setUserId } from "@/lib/auth-client";
import { isLocale, localePath } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const fieldClass =
  "min-h-11 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary";

export default function LoginPage() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale: Locale = isLocale(params.locale) ? params.locale : "fa";
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const fa = locale === "fa";

  return (
    <div className="mx-auto w-[min(520px,calc(100%-32px))] py-10">
      <h1 className="text-3xl font-extrabold">{fa ? "ورود به پروفایل" : "Sign in"}</h1>
      <p className="mt-2 text-sm text-muted">
        {fa ? "با همان شماره و رمزی که هنگام ثبت‌نام گذاشتید وارد شوید." : "Use the phone and password from registration."}
      </p>
      <form
        className="mt-6 grid gap-3"
        onSubmit={async (event) => {
          event.preventDefault();
          setPending(true);
          setError("");
          const form = new FormData(event.currentTarget);
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phone: form.get("phone"),
              password: form.get("password"),
            }),
          });
          const data = await response.json();
          setPending(false);
          if (!response.ok) {
            setError(data.error ?? (fa ? "ورود انجام نشد." : "Could not sign in."));
            return;
          }
          setUserId(data.user.id);
          router.push(localePath(locale, "/account"));
        }}
      >
        <label className="grid gap-1 text-sm font-medium">
          {fa ? "شماره تماس" : "Phone"}
          <input name="phone" required inputMode="tel" autoComplete="tel" className={fieldClass} />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          {fa ? "رمز عبور" : "Password"}
          <input name="password" type="password" required autoComplete="current-password" className={fieldClass} />
        </label>
        {error ? <p className="text-sm text-accent">{error}</p> : null}
        <button disabled={pending} className="min-h-11 rounded-xl bg-primary text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-70">
          {pending ? (fa ? "در حال ورود..." : "Signing in...") : fa ? "ورود" : "Sign in"}
        </button>
      </form>
      <p className="mt-4 text-sm text-muted">
        {fa ? "حساب ندارید؟" : "No account yet?"}{" "}
        <Link href={localePath(locale, "/register")} className="font-bold text-primary">
          {fa ? "ثبت‌نام کنید" : "Register"}
        </Link>
      </p>
    </div>
  );
}
