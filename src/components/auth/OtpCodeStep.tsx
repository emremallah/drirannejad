"use client";

import { useEffect, useState } from "react";

export const fieldClass =
  "min-h-11 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary";

export const buttonClass =
  "min-h-11 rounded-xl bg-primary text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-70";

export type OtpPurpose = "login" | "reset";

/** Asks the server to SMS a code. Returns seconds until a resend is allowed. */
export async function sendOtp(phone: string, purpose: OtpPurpose, fa: boolean) {
  const response = await fetch("/api/auth/otp/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, purpose }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? (fa ? "ارسال کد انجام نشد." : "Could not send the code."));
  return Number(data.resendIn) || 120;
}

/** Countdown + resend link shown under the code field. */
export function ResendTimer({
  seconds,
  onResend,
  fa,
}: {
  seconds: number;
  onResend: () => Promise<number>;
  fa: boolean;
}) {
  const [left, setLeft] = useState(seconds);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (left <= 0) return;
    const id = window.setTimeout(() => setLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [left]);

  if (left > 0) {
    const mm = Math.floor(left / 60);
    const ss = String(left % 60).padStart(2, "0");
    return (
      <p className="text-xs text-muted">
        {fa ? `ارسال دوباره کد تا ${mm}:${ss} دیگر` : `Resend available in ${mm}:${ss}`}
      </p>
    );
  }
  return (
    <button
      type="button"
      disabled={busy}
      className="justify-self-start text-xs font-bold text-primary disabled:opacity-60"
      onClick={async () => {
        setBusy(true);
        try {
          setLeft(await onResend());
        } finally {
          setBusy(false);
        }
      }}
    >
      {fa ? "ارسال دوباره کد" : "Resend code"}
    </button>
  );
}

export function CodeInput({ fa }: { fa: boolean }) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {fa ? "کد پیامک‌شده" : "SMS code"}
      <input
        name="code"
        required
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        dir="ltr"
        className={`${fieldClass} text-center text-lg tracking-[0.5em]`}
        autoFocus
      />
    </label>
  );
}
