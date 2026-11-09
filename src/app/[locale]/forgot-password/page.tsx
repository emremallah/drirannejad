"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { setUserId } from "@/lib/auth-client";
import { isLocale, localePath } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { buttonClass, CodeInput, fieldClass, ResendTimer, sendOtp } from "@/components/auth/OtpCodeStep";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale: Locale = isLocale(params.locale) ? params.locale : "fa";
  const fa = locale === "fa";
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [phone, setPhone] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [resendIn, setResendIn] = useState(0);

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

  return (
    <div className="mx-auto w-[min(520px,calc(100%-32px))] py-10">
      <h1 className="text-3xl font-extrabold">{fa ? "بازیابی رمز عبور" : "Reset your password"}</h1>
      <p className="mt-2 text-sm leading-7 text-muted">
        {fa
          ? "شماره موبایل حساب خود را وارد کنید تا کد تأیید برایتان پیامک شود، سپس رمز جدید بگذارید."
          : "Enter your account's mobile number. We'll text you a code, then you can set a new password."}
      </p>

      {!codeSent ? (
        <form
          key="phone"
          className="mt-6 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const value = String(new FormData(event.currentTarget).get("phone") ?? "");
            run(async () => {
              setResendIn(await sendOtp(value, "reset", fa));
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
            {pending ? (fa ? "در حال ارسال..." : "Sending...") : fa ? "ارسال کد بازیابی" : "Send reset code"}
          </button>
        </form>
      ) : (
        <form
          key="reset"
          className="mt-6 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const password = String(form.get("password") ?? "");
            if (password !== String(form.get("confirm") ?? "")) {
              setError(fa ? "رمز عبور و تکرار آن یکسان نیستند." : "Passwords do not match.");
              return;
            }
            run(async () => {
              const response = await fetch("/api/auth/password/reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, code: form.get("code"), password }),
              });
              const data = await response.json().catch(() => ({}));
              if (!response.ok) throw new Error(data.error ?? (fa ? "تغییر رمز انجام نشد." : "Could not reset password."));
              setUserId(data.user.id);
              router.push(localePath(locale, "/account"));
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
                return await sendOtp(phone, "reset", fa);
              } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
                return 0;
              }
            }}
          />
          <label className="grid gap-1 text-sm font-medium">
            {fa ? "رمز عبور جدید" : "New password"}
            <input name="password" type="password" required minLength={6} autoComplete="new-password" className={fieldClass} />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            {fa ? "تکرار رمز عبور جدید" : "Repeat new password"}
            <input name="confirm" type="password" required minLength={6} autoComplete="new-password" className={fieldClass} />
          </label>
          {error ? <p className="text-sm text-accent">{error}</p> : null}
          <button disabled={pending} className={buttonClass}>
            {pending ? (fa ? "در حال ذخیره..." : "Saving...") : fa ? "ذخیره رمز جدید و ورود" : "Save and sign in"}
          </button>
        </form>
      )}

      <p className="mt-4 text-sm text-muted">
        <Link href={localePath(locale, "/login")} className="font-bold text-primary">
          {fa ? "بازگشت به ورود" : "Back to sign in"}
        </Link>
      </p>
    </div>
  );
}
