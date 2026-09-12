"use client";

import { useMemo, useState } from "react";
import type { Dictionary } from "@/lib/dictionary";
import { courses, courseCopy } from "@/lib/courses";
import type { Locale } from "@/lib/types";

type EnrollFormProps = {
  locale: Locale;
  t: Dictionary;
  defaultCourse?: string;
};

export function EnrollForm({ locale, t, defaultCourse }: EnrollFormProps) {
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const options = useMemo(
    () =>
      courses.map((course) => ({
        slug: course.slug,
        title: courseCopy(course, locale).title,
      })),
    [locale],
  );

  if (sent) {
    return (
      <div className="rounded-xl border border-border bg-primary-soft p-5 text-sm leading-7 text-primary-ink">
        {t.form.success}
      </div>
    );
  }

  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        setPending(true);
        window.setTimeout(() => {
          setPending(false);
          setSent(true);
        }, 500);
      }}
    >
      <label className="grid gap-1 text-sm font-medium text-ink">
        {t.form.name}
        <input
          required
          name="name"
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium text-ink">
        {t.form.phone}
        <input
          required
          name="phone"
          inputMode="tel"
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium text-ink">
        {t.form.email}
        <input
          type="email"
          name="email"
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium text-ink">
        {t.form.course}
        <select
          name="course"
          defaultValue={defaultCourse}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        >
          {options.map((option) => (
            <option key={option.slug} value={option.slug}>
              {option.title}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-medium text-ink">
        {t.form.message}
        <textarea
          name="message"
          rows={4}
          className="resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-70"
      >
        {pending ? t.actions.sending : t.actions.send}
      </button>
    </form>
  );
}
