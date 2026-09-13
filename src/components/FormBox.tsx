"use client";

import { useState } from "react";

type Field = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  options?: string[];
};

const fieldClass =
  "min-h-11 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary";

export function FormBox({
  kind,
  fields,
  extra,
}: {
  kind: "consult" | "collaborate" | "dispatch" | "resume" | "gift";
  fields: Field[];
  extra?: Record<string, string>;
}) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (sent) {
    return (
      <p className="rounded-2xl bg-primary-soft p-5 text-sm leading-7 text-primary-ink">
        درخواست شما ثبت شد. برای رتبه‌بندی و پیگیری، همین اطلاعات در پنل مرکز ذخیره شد.
      </p>
    );
  }

  return (
    <form
      className="grid gap-3"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError("");
        const form = new FormData(event.currentTarget);
        const data = Object.fromEntries(form.entries()) as Record<string, string>;
        const response = await fetch("/api/forms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind, data: { ...data, ...extra } }),
        });
        setPending(false);
        if (!response.ok) {
          setError("ارسال نشد. دوباره تلاش کنید.");
          return;
        }
        setSent(true);
      }}
    >
      {fields.map((field) => (
        <label key={field.name} className="grid gap-1 text-sm font-medium">
          {field.label}
          {field.options ? (
            <select name={field.name} required={field.required} defaultValue="" className={fieldClass}>
              <option value="" disabled>
                انتخاب کنید
              </option>
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : field.type === "textarea" ? (
            <textarea name={field.name} required={field.required} rows={4} className={`${fieldClass} min-h-24`} />
          ) : (
            <input
              name={field.name}
              type={field.type ?? "text"}
              required={field.required}
              inputMode={field.name.includes("mobile") || field.name.includes("phone") ? "tel" : undefined}
              className={fieldClass}
            />
          )}
        </label>
      ))}
      {error ? <p className="text-sm text-accent">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 rounded-xl bg-primary px-4 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-70"
      >
        {pending ? "در حال ارسال..." : "ارسال فرم و عضویت در سایت"}
      </button>
    </form>
  );
}
