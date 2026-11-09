"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { setUserId } from "@/lib/auth-client";
import { isLocale, localePath } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { buttonClass, CodeInput, fieldClass, ResendTimer, sendOtp } from "@/components/auth/OtpCodeStep";

type Mode = "otp" | "password";

export default function LoginPage() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale: Locale = isLocale(params.locale) ? params.locale : "fa";
  const fa = locale === "fa";
  const [mode, setMode] = useState<Mode>("otp");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  // OTP flow: phone is kept once the code is sent.
  const [phone, setPhone] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  function finish(userId: string) {
    setUserId(userId);
    // Only same-site paths, so the login page can't be used to bounce people elsewhere.
    const next = new URLSearchParams(window.location.search).get("next") ?? "";
    const safeNext = next.startsWith("/") && !next.startsWith("//") && !next.includes("\\") ? next : "";
    router.push(safeNext || localePath(locale, "/account"));
  }

  async function post(url: string, body: Record<string, unknown>) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error ?? (fa ? "ورود انجام نشد." : "Could not sign in."));
    return data;
  }

  async function run(task: () => Promise<void>) {
    setPending(true);
    setError("");
    try {
      await task();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setPending(false);
    }
  }

  const tab = (value: Mode, label: string) => (
    <button
      type="button"
      onClick={() => {
        setMode(value);
        setError("");
      }}
      className={`min-h-10 flex-1 rounded-lg text-sm font-bold transition ${
        mode === value ? "bg-surface text-primary shadow-sm" : "text-muted hover:text-ink"
      }`}
      aria-pressed={mode === value}
    >
      {label}
    </button>
  );

  return (
    <div className="mx-auto w-[min(520px,calc(100%-32px))] py-10">
      <h1 className="text-3xl font-extrabold">{fa ? "ورود به پروفایل" : "Sign in"}</h1>
      <p className="mt-2 text-sm text-muted">
        {fa
          ? "با کد پیامکی یا رمز عبور وارد حساب خود شوید."
          : "Sign in with an SMS code or your password."}
      </p>

      <div className="mt-6 flex gap-1 rounded-xl border border-border bg-primary-soft/40 p-1">
        {tab("otp", fa ? "رمز یکبار مصرف" : "One-time code")}
        {tab("password", fa ? "رمز عبور" : "Password")}
      </div>

      {mode === "otp" ? (
        !codeSent ? (
          <form
            key="otp-phone"
            className="mt-5 grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              const value = String(new FormData(event.currentTarget).get("phone") ?? "");
              run(async () => {
                setResendIn(await sendOtp(value, "login", fa));
                setPhone(value);
                setCodeSent(true);
              });
            }}
          >
            <label className="grid gap-1 text-sm font-medium">
              {fa ? "شماره موبایل" : "Mobile number"}
              <input
                name="phone"
                required
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                placeholder="09121234567"
                defaultValue={phone}
                className={fieldClass}
              />
            </label>
            {error ? <p className="text-sm text-accent">{error}</p> : null}
            <button disabled={pending} className={buttonClass}>
              {pending ? (fa ? "در حال ارسال..." : "Sending...") : fa ? "ارسال کد" : "Send code"}
            </button>
          </form>
        ) : (
          <form
            key="otp-code"
            className="mt-5 grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              const code = String(new FormData(event.currentTarget).get("code") ?? "");
              run(async () => {
                const data = await post("/api/auth/otp/verify", { phone, code });
                finish(data.user.id);
              });
            }}
          >
            <p className="text-sm text-muted">
              {fa ? "کد به شماره " : "Code sent to "}
              <span dir="ltr" className="font-bold text-ink">{phone}</span>
              {fa ? " پیامک شد. " : ". "}
              <button
                type="button"
                className="font-bold text-primary"
                onClick={() => {
                  setCodeSent(false);
                  setError("");
                }}
              >
                {fa ? "ویرایش شماره" : "Change number"}
              </button>
            </p>
            <CodeInput fa={fa} />
            <ResendTimer
              seconds={resendIn}
              fa={fa}
              onResend={async () => {
                setError("");
                try {
                  return await sendOtp(phone, "login", fa);
                } catch (err) {
                  setError(err instanceof Error ? err.message : String(err));
                  return 0;
                }
              }}
            />
            {error ? <p className="text-sm text-accent">{error}</p> : null}
            <button disabled={pending} className={buttonClass}>
              {pending ? (fa ? "در حال ورود..." : "Signing in...") : fa ? "تأیید و ورود" : "Verify and sign in"}
            </button>
          </form>
        )
      ) : (
        <form
          key="password"
          className="mt-5 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            run(async () => {
              const data = await post("/api/auth/login", {
                phone: form.get("phone"),
                password: form.get("password"),
              });
              finish(data.user.id);
            });
          }}
        >
          <label className="grid gap-1 text-sm font-medium">
            {fa ? "شماره موبایل" : "Mobile number"}
            <input
              name="phone"
              required
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              placeholder="09121234567"
              defaultValue={phone}
              className={fieldClass}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            {fa ? "رمز عبور" : "Password"}
            <input name="password" type="password" required autoComplete="current-password" className={fieldClass} />
          </label>
          <Link href={localePath(locale, "/forgot-password")} className="justify-self-start text-xs font-bold text-primary">
            {fa ? "رمز عبور را فراموش کرده‌اید؟" : "Forgot your password?"}
          </Link>
          {error ? <p className="text-sm text-accent">{error}</p> : null}
          <button disabled={pending} className={buttonClass}>
            {pending ? (fa ? "در حال ورود..." : "Signing in...") : fa ? "ورود" : "Sign in"}
          </button>
        </form>
      )}

      <p className="mt-4 text-sm text-muted">
        {fa ? "حساب ندارید؟" : "No account yet?"}{" "}
        <Link href={localePath(locale, "/register")} className="font-bold text-primary">
          {fa ? "ثبت‌نام کنید" : "Register"}
        </Link>
      </p>
    </div>
  );
}
