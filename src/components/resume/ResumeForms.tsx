"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import {
  cleanUrl,
  currentYear,
  degrees,
  linkTypeNames,
  linkTypes,
  militaryOptions,
  newId,
  resumeLabels,
  type Certificate,
  type Course,
  type Education,
  type Experience,
  type LeveledItem,
  type Level,
  type LinkItem,
  type Project,
  type Publication,
  type Resume,
  type ResumeLang,
} from "@/lib/resume";
import type { Locale } from "@/lib/types";

// ---------------- shared building blocks ----------------

export const inputClass =
  "min-h-11 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-primary";

export function useT(locale: Locale) {
  return (fa: string, en: string) => (locale === "fa" ? fa : en);
}

/** Slide-over panel used for every form, like the reference site's side forms. */
export function Sheet({
  title,
  onClose,
  children,
  footer,
  tip,
  wide,
  locale,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  tip?: string;
  wide?: boolean;
  locale: Locale;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex justify-start print:hidden" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="close" className="absolute inset-0 bg-scrim/70" onClick={onClose} />
      <div className={`relative flex h-full w-full flex-col bg-bg shadow-2xl ${wide ? "max-w-3xl" : "max-w-lg"}`}>
        <header className="flex items-center gap-3 border-b border-border px-4 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface"
            aria-label={locale === "fa" ? "بازگشت" : "Back"}
          >
            <svg viewBox="0 0 24 24" className={`h-5 w-5 ${locale === "fa" ? "" : "rotate-180"}`} fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
          <h2 className="text-lg font-extrabold">{title}</h2>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          {tip ? (
            <p className="mb-5 flex gap-3 rounded-xl bg-primary-soft px-4 py-3 text-sm leading-6 text-primary-ink">
              <span aria-hidden className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-current text-xs">
                i
              </span>
              {tip}
            </p>
          ) : null}
          {children}
        </div>
        {footer ? <div className="border-t border-border bg-bg px-4 py-3 sm:px-6">{footer}</div> : null}
      </div>
    </div>
  );
}

export function Field({
  label,
  required,
  hint,
  group,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  /** For several controls (radios, month + year): a labelled group instead of a <label>. */
  group?: boolean;
  children: ReactNode;
}) {
  const inner = (
    <>
      <span className="text-sm font-bold">
        {label}
        {required ? <span className="ms-1 text-accent">*</span> : null}
      </span>
      {children}
      {hint ? <span className="text-xs leading-5 text-faint">{hint}</span> : null}
    </>
  );
  return group ? (
    <div role="group" aria-label={label} className="grid gap-1.5">
      {inner}
    </div>
  ) : (
    <label className="grid gap-1.5">{inner}</label>
  );
}

export function Check({
  checked,
  onChange,
  label,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  ariaLabel?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={ariaLabel}
        className="h-4.5 w-4.5 accent-[var(--primary)]"
      />
      {label}
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  ariaLabel?: string;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} aria-label={ariaLabel ?? placeholder}>
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function yearOptions(lang: ResumeLang, span = 60, from = currentYear(lang)) {
  return Array.from({ length: span }, (_, i) => String(from - i)).map((y) => ({ value: y, label: lang === "fa" ? toFa(y) : y }));
}

function toFa(value: string) {
  return value.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

/** Month + year picker. Stores "YYYY-MM"; months and years follow the resume's calendar. */
export function MonthYear({
  value,
  onChange,
  lang,
  disabled,
  locale,
}: {
  value: string;
  onChange: (value: string) => void;
  lang: ResumeLang;
  disabled?: boolean;
  locale: Locale;
}) {
  const [year, setYear] = useState(value.slice(0, 4));
  const [month, setMonth] = useState(value.slice(5, 7));
  const t = useT(locale);
  const months = resumeLabels[lang].months.map((name, i) => ({ value: String(i + 1).padStart(2, "0"), label: name }));
  const update = (y: string, m: string) => {
    setYear(y);
    setMonth(m);
    onChange(y && m ? `${y}-${m}` : "");
  };
  return (
    <fieldset disabled={disabled} className="grid grid-cols-2 gap-3 disabled:opacity-50">
      <Select value={month} onChange={(m) => update(year, m)} options={months} placeholder={t("ماه", "Month")} />
      <Select value={year} onChange={(y) => update(y, month)} options={yearOptions(lang)} placeholder={t("سال", "Year")} />
    </fieldset>
  );
}

function LevelPicker({ value, onChange, lang }: { value: Level; onChange: (value: Level) => void; lang: ResumeLang }) {
  const name = useId();
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {resumeLabels[lang].levels.map((label, i) => {
        const level = (i + 1) as Level;
        return (
          <label
            key={label}
            className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 text-sm transition ${
              value === level ? "border-primary bg-primary-soft text-primary-ink" : "border-border bg-surface"
            }`}
          >
            <input type="radio" name={name} className="sr-only" checked={value === level} onChange={() => onChange(level)} />
            <Dots level={level} />
            {label}
          </label>
        );
      })}
    </div>
  );
}

export function Dots({ level }: { level: Level }) {
  return (
    <span className="inline-flex gap-1" aria-hidden>
      {[1, 2, 3, 4].map((step) => (
        <span key={step} className={`h-2.5 w-2.5 rounded-full ${step <= level ? "bg-primary" : "bg-border"}`} />
      ))}
    </span>
  );
}

function SaveBar({
  onSave,
  onDelete,
  pending,
  locale,
  disabled,
}: {
  onSave: () => void;
  onDelete?: () => void;
  pending?: boolean;
  locale: Locale;
  disabled?: boolean;
}) {
  const t = useT(locale);
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onSave}
        disabled={pending || disabled}
        className="min-h-12 flex-1 rounded-full bg-primary text-base font-extrabold text-white transition hover:bg-primary-hover disabled:opacity-60"
      >
        {pending ? t("در حال ذخیره...", "Saving...") : t("ذخیره", "Save")}
      </button>
      {onDelete ? (
        <button
          type="button"
          onClick={() => (confirm ? onDelete() : setConfirm(true))}
          className={`min-h-12 rounded-full border px-5 text-sm font-bold transition ${
            confirm ? "border-accent bg-accent text-white" : "border-border text-muted hover:border-accent hover:text-accent"
          }`}
        >
          {confirm ? t("حذف شود؟", "Delete?") : t("حذف", "Delete")}
        </button>
      ) : null}
    </div>
  );
}

// ---------------- the forms ----------------

type FormProps<T> = {
  initial: T;
  resume: Resume;
  locale: Locale;
  pending?: boolean;
  onSave: (value: T) => void;
  onDelete?: () => void;
  onClose: () => void;
};

function useDraft<T>(initial: T) {
  const [draft, setDraft] = useState(initial);
  const [tried, setTried] = useState(false);
  const set = <K extends keyof T>(key: K, value: T[K]) => setDraft((d) => ({ ...d, [key]: value }));
  return { draft, set, tried, setTried };
}

function Required({ show, locale }: { show: boolean; locale: Locale }) {
  if (!show) return null;
  return <p className="text-sm text-accent">{locale === "fa" ? "لطفاً فیلدهای ستاره‌دار را کامل کنید." : "Please fill in the starred fields."}</p>;
}

function submit<T>(ok: boolean, draft: T, setTried: (v: boolean) => void, onSave: (v: T) => void) {
  if (!ok) {
    setTried(true);
    return;
  }
  onSave(draft);
}

export function NameForm({ initial, locale, pending, onSave, onClose }: FormProps<Resume["personal"]>) {
  const t = useT(locale);
  const { draft, set, tried, setTried } = useDraft(initial);
  const ok = Boolean(draft.fullName.trim());
  return (
    <Sheet
      locale={locale}
      title={t("اطلاعات پایه", "Basic info")}
      onClose={onClose}
      footer={<SaveBar locale={locale} pending={pending} onSave={() => submit(ok, draft, setTried, onSave)} />}
    >
      <div className="grid gap-5">
        <Field label={t("نام و نام خانوادگی", "Full name")} required>
          <input className={inputClass} value={draft.fullName} onChange={(e) => set("fullName", e.target.value)} autoComplete="name" />
        </Field>
        <Field label={t("موبایل", "Mobile")}>
          <input className={inputClass} dir="ltr" inputMode="tel" value={draft.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label={t("ایمیل", "Email")}>
          <input className={inputClass} dir="ltr" type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Required show={tried && !ok} locale={locale} />
      </div>
    </Sheet>
  );
}

export function InfoForm({ initial, resume, locale, pending, onSave, onClose }: FormProps<Resume["personal"]>) {
  const t = useT(locale);
  const L = resumeLabels[resume.lang];
  const { draft, set } = useDraft(initial);
  const lang = resume.lang;
  const num = (n: number) => Array.from({ length: n }, (_, i) => String(i + 1)).map((v) => ({ value: v, label: lang === "fa" ? toFa(v) : v }));
  return (
    <Sheet
      locale={locale}
      title={t("مشخصات تکمیلی", "More details")}
      onClose={onClose}
      footer={<SaveBar locale={locale} pending={pending} onSave={() => onSave(draft)} />}
    >
      <div className="grid gap-5">
        <Field label={t("جنسیت", "Gender")} group>
          <div className="grid grid-cols-2 gap-2">
            {(["male", "female"] as const).map((g) => (
              <label
                key={g}
                className={`flex min-h-11 cursor-pointer items-center justify-center rounded-xl border text-sm font-bold ${
                  draft.gender === g ? "border-primary bg-primary-soft text-primary-ink" : "border-border bg-surface"
                }`}
              >
                <input type="radio" name="gender" className="sr-only" checked={draft.gender === g} onChange={() => set("gender", g)} />
                {L.genders[g]}
              </label>
            ))}
          </div>
        </Field>
        <Field label={t("تاریخ تولد", "Date of birth")} group>
          <div className="grid grid-cols-3 gap-3">
            <Select value={draft.birthDay} onChange={(v) => set("birthDay", v)} options={num(31)} placeholder={t("روز", "Day")} />
            <Select value={draft.birthMonth} onChange={(v) => set("birthMonth", v)} options={num(12)} placeholder={t("ماه", "Month")} />
            <Select
              value={draft.birthYear}
              onChange={(v) => set("birthYear", v)}
              options={yearOptions(lang, 64, currentYear(lang) - 12)}
              placeholder={t("سال", "Year")}
            />
          </div>
        </Field>
        <Field label={t("وضعیت تأهل", "Marital status")}>
          <Select
            value={draft.marital}
            onChange={(v) => set("marital", v as Resume["personal"]["marital"])}
            options={(["married", "single"] as const).map((m) => ({ value: m, label: L.maritals[m] }))}
            placeholder={t("انتخاب کنید", "Choose")}
          />
        </Field>
        {draft.gender !== "female" ? (
          <Field label={t("وضعیت سربازی", "Military service")}>
            <Select
              value={draft.military}
              onChange={(v) => set("military", v as Resume["personal"]["military"])}
              options={militaryOptions.map((m) => ({ value: m, label: L.militaries[m] }))}
              placeholder={t("انتخاب کنید", "Choose")}
            />
          </Field>
        ) : null}
      </div>
    </Sheet>
  );
}

const provinces = [
  "آذربایجان شرقی", "آذربایجان غربی", "اردبیل", "اصفهان", "البرز", "ایلام", "بوشهر", "تهران", "چهارمحال و بختیاری",
  "خراسان جنوبی", "خراسان رضوی", "خراسان شمالی", "خوزستان", "زنجان", "سمنان", "سیستان و بلوچستان", "فارس", "قزوین",
  "قم", "کردستان", "کرمان", "کرمانشاه", "کهگیلویه و بویراحمد", "گلستان", "گیلان", "لرستان", "مازندران", "مرکزی",
  "هرمزگان", "همدان", "یزد",
];

export function LocationForm({ initial, resume, locale, pending, onSave, onClose }: FormProps<Resume["location"]>) {
  const t = useT(locale);
  const { draft, set, tried, setTried } = useDraft(initial);
  const ok = Boolean(draft.province.trim() && draft.city.trim());
  return (
    <Sheet
      locale={locale}
      title={t("محل سکونت", "Location")}
      onClose={onClose}
      footer={<SaveBar locale={locale} pending={pending} onSave={() => submit(ok, draft, setTried, onSave)} />}
    >
      <div className="grid gap-5">
        <Field label={resume.lang === "fa" ? "استان" : t("استان / کشور", "State / country")} required>
          {resume.lang === "fa" ? (
            <Select
              value={draft.province}
              onChange={(v) => set("province", v)}
              options={provinces.map((p) => ({ value: p, label: p }))}
              placeholder={t("انتخاب استان", "Choose")}
            />
          ) : (
            <input className={inputClass} value={draft.province} onChange={(e) => set("province", e.target.value)} />
          )}
        </Field>
        <Field label={t("شهر", "City")} required>
          <input className={inputClass} value={draft.city} onChange={(e) => set("city", e.target.value)} />
        </Field>
        <Field label={t("آدرس", "Address")}>
          <textarea rows={2} className={inputClass} value={draft.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
        <Check checked={draft.hideAddress} onChange={(v) => set("hideAddress", v)} label={t("پنهان از رزومه", "Hide from resume")} />
        <Required show={tried && !ok} locale={locale} />
      </div>
    </Sheet>
  );
}

export function JobForm({ initial, locale, pending, onSave, onClose }: FormProps<Resume["job"]>) {
  const t = useT(locale);
  const { draft, set } = useDraft(initial);
  return (
    <Sheet
      locale={locale}
      title={t("اطلاعات شغلی", "Job info")}
      onClose={onClose}
      footer={<SaveBar locale={locale} pending={pending} onSave={() => onSave(draft)} />}
    >
      <div className="grid gap-5">
        <Field label={t("عنوان شغلی", "Job title")} hint={t("مانند: کارشناس فروش، برنامه‌نویس فرانت‌اند", "e.g. Sales specialist, Front-end developer")}>
          <input className={inputClass} value={draft.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Check checked={draft.showSalary} onChange={(v) => set("showSalary", v)} label={t("نمایش حقوق درخواستی", "Show expected salary")} />
        {draft.showSalary ? (
          <Field label={t("حقوق درخواستی", "Expected salary")} hint={t("مانند: ۲۵ میلیون تومان یا توافقی", "e.g. 2,000 USD or negotiable")}>
            <input className={inputClass} value={draft.salary} onChange={(e) => set("salary", e.target.value)} />
          </Field>
        ) : null}
      </div>
    </Sheet>
  );
}

export function ExperienceForm({ initial, resume, locale, pending, onSave, onDelete, onClose }: FormProps<Experience>) {
  const t = useT(locale);
  const { draft, set, tried, setTried } = useDraft(initial);
  const ok = Boolean(draft.company.trim() && draft.title.trim() && draft.start);
  return (
    <Sheet
      locale={locale}
      title={t("سابقه کاری", "Work experience")}
      tip={t("حتی سابقه کارآموزی ممکن است برای کارفرما حائز اهمیت باشد.", "Even an internship can matter to an employer.")}
      onClose={onClose}
      footer={<SaveBar locale={locale} pending={pending} onDelete={onDelete} onSave={() => submit(ok, draft, setTried, onSave)} />}
    >
      <div className="grid gap-5">
        <Field label={t("نام شرکت یا موسسه", "Company or organisation")} required>
          <input className={inputClass} value={draft.company} onChange={(e) => set("company", e.target.value)} />
        </Field>
        <Field label={t("موقعیت شغلی", "Position")} required hint={t("عنوان شغلی که در شرکت نامبرده در بالا داشتید", "Your job title at the company above")}>
          <input className={inputClass} value={draft.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field label={t("تاریخ شروع به کار", "Start date")} required group>
          <MonthYear locale={locale} lang={resume.lang} value={draft.start} onChange={(v) => set("start", v)} />
        </Field>
        <Field label={t("تاریخ اتمام همکاری", "End date")} group>
          <MonthYear locale={locale} lang={resume.lang} value={draft.end} onChange={(v) => set("end", v)} disabled={draft.current} />
        </Field>
        <Check checked={draft.current} onChange={(v) => set("current", v)} label={t("هنوز در این شرکت مشغول به کار هستم", "I still work here")} />
        <Field
          label={t("شرح وظایف و مسئولیت‌ها", "Duties and achievements")}
          hint={t("با عدد بنویسید؛ مثلاً «فروش را در ۳ ماه ۱۰ درصد افزایش دادم».", "Use numbers, e.g. “grew sales 10% in 3 months”.")}
        >
          <textarea rows={5} className={inputClass} value={draft.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Required show={tried && !ok} locale={locale} />
      </div>
    </Sheet>
  );
}

export function LeveledForm({
  kind,
  initial,
  resume,
  locale,
  pending,
  onSave,
  onDelete,
  onClose,
}: FormProps<LeveledItem> & { kind: "skill" | "language" }) {
  const t = useT(locale);
  const { draft, set, tried, setTried } = useDraft(initial);
  const ok = Boolean(draft.name.trim());
  const listId = useId();
  const languages =
    resume.lang === "fa"
      ? ["انگلیسی", "عربی", "فرانسوی", "آلمانی", "ترکی استانبولی", "روسی", "اسپانیایی", "ایتالیایی", "چینی", "ژاپنی", "کره‌ای"]
      : ["English", "Persian", "Arabic", "French", "German", "Turkish", "Russian", "Spanish", "Italian", "Chinese", "Japanese", "Korean"];
  return (
    <Sheet
      locale={locale}
      title={kind === "skill" ? t("مهارت", "Skill") : t("زبان خارجی", "Language")}
      onClose={onClose}
      footer={<SaveBar locale={locale} pending={pending} onDelete={onDelete} onSave={() => submit(ok, draft, setTried, onSave)} />}
    >
      <div className="grid gap-5">
        <Field
          label={kind === "skill" ? t("عنوان مهارت", "Skill") : t("زبان خارجی", "Language")}
          required
          hint={kind === "skill" ? t("مانند اینترنت، حسابداری، بازاریابی و غیره", "e.g. Excel, accounting, marketing") : undefined}
        >
          <input
            className={inputClass}
            value={draft.name}
            onChange={(e) => set("name", e.target.value)}
            list={kind === "language" ? listId : undefined}
          />
          {kind === "language" ? (
            <datalist id={listId}>
              {languages.map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
          ) : null}
        </Field>
        <Field label={t("میزان تسلط", "Level")} required group>
          <LevelPicker lang={resume.lang} value={draft.level} onChange={(v) => set("level", v)} />
        </Field>
        <Required show={tried && !ok} locale={locale} />
      </div>
    </Sheet>
  );
}

export function EducationForm({ initial, resume, locale, pending, onSave, onDelete, onClose }: FormProps<Education>) {
  const t = useT(locale);
  const L = resumeLabels[resume.lang];
  const { draft, set, tried, setTried } = useDraft(initial);
  const ok = Boolean(draft.degree);
  const school = draft.degree === "under-diploma" || draft.degree === "diploma";
  return (
    <Sheet
      locale={locale}
      title={t("اطلاعات تحصیلی", "Education")}
      onClose={onClose}
      footer={<SaveBar locale={locale} pending={pending} onDelete={onDelete} onSave={() => submit(ok, draft, setTried, onSave)} />}
    >
      <div className="grid gap-5">
        <Field label={t("مقطع تحصیلی", "Degree")} required>
          <Select
            value={draft.degree}
            onChange={(v) => set("degree", v as Education["degree"])}
            options={degrees.map((d) => ({ value: d, label: L.degrees[d] }))}
            placeholder={t("انتخاب مقطع", "Choose")}
          />
        </Field>
        {draft.degree ? (
          <>
            <Field label={school ? t("رشته / گرایش", "Field") : t("رشته تحصیلی", "Field of study")}>
              <input className={inputClass} value={draft.field} onChange={(e) => set("field", e.target.value)} />
            </Field>
            <Field label={school ? t("نام مدرسه یا هنرستان", "School") : t("نام دانشگاه یا موسسه", "University")}>
              <input className={inputClass} value={draft.university} onChange={(e) => set("university", e.target.value)} />
            </Field>
            <Field label={t("معدل", "GPA")}>
              <input className={inputClass} dir="ltr" inputMode="decimal" value={draft.gpa} onChange={(e) => set("gpa", e.target.value)} />
            </Field>
            <Field label={t("تاریخ شروع", "Start date")} group>
              <MonthYear locale={locale} lang={resume.lang} value={draft.start} onChange={(v) => set("start", v)} />
            </Field>
            <Field label={t("تاریخ پایان", "End date")} group>
              <MonthYear locale={locale} lang={resume.lang} value={draft.end} onChange={(v) => set("end", v)} disabled={draft.ongoing} />
            </Field>
            <Check checked={draft.ongoing} onChange={(v) => set("ongoing", v)} label={t("در حال تحصیل هستم", "I'm still studying")} />
          </>
        ) : null}
        <Field label={t("توضیحات تکمیلی", "More details")}>
          <textarea rows={3} className={inputClass} value={draft.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Required show={tried && !ok} locale={locale} />
      </div>
    </Sheet>
  );
}

export function ProjectForm({ initial, resume, locale, pending, onSave, onDelete, onClose }: FormProps<Project>) {
  const t = useT(locale);
  const { draft, set, tried, setTried } = useDraft(initial);
  const ok = Boolean(draft.title.trim());
  return (
    <Sheet
      locale={locale}
      title={t("پروژه", "Project")}
      tip={t(
        "اگر پروژه‌ای را به صورت گروهی انجام داده‌اید، آن را وارد و نقش خود را در بخش توضیحات تکمیلی ذکر نمایید.",
        "If it was a team project, add it and describe your own role in the details.",
      )}
      onClose={onClose}
      footer={<SaveBar locale={locale} pending={pending} onDelete={onDelete} onSave={() => submit(ok, { ...draft, link: cleanUrl(draft.link) }, setTried, onSave)} />}
    >
      <div className="grid gap-5">
        <Field label={t("عنوان پروژه", "Project title")} required>
          <input className={inputClass} value={draft.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field label={t("وبسایت پروژه", "Project website")} hint={t("آدرس صفحه اینترنتی مربوط به پروژه", "Link to the project page")}>
          <input className={inputClass} dir="ltr" inputMode="url" value={draft.link} onChange={(e) => set("link", e.target.value)} />
        </Field>
        <Field label={t("تاریخ شروع", "Start date")} group>
          <MonthYear locale={locale} lang={resume.lang} value={draft.start} onChange={(v) => set("start", v)} />
        </Field>
        <Field label={t("تاریخ پایان", "End date")} group>
          <MonthYear locale={locale} lang={resume.lang} value={draft.end} onChange={(v) => set("end", v)} disabled={draft.ongoing} />
        </Field>
        <Check checked={draft.ongoing} onChange={(v) => set("ongoing", v)} label={t("این پروژه در حال انجام است", "This project is ongoing")} />
        <Field label={t("توضیحات تکمیلی", "More details")}>
          <textarea rows={4} className={inputClass} value={draft.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Required show={tried && !ok} locale={locale} />
      </div>
    </Sheet>
  );
}

export function CourseForm({ initial, resume, locale, pending, onSave, onDelete, onClose }: FormProps<Course>) {
  const t = useT(locale);
  const { draft, set, tried, setTried } = useDraft(initial);
  const ok = Boolean(draft.title.trim());
  return (
    <Sheet
      locale={locale}
      title={t("دوره آموزشی", "Course")}
      onClose={onClose}
      footer={<SaveBar locale={locale} pending={pending} onDelete={onDelete} onSave={() => submit(ok, draft, setTried, onSave)} />}
    >
      <div className="grid gap-5">
        <Field label={t("عنوان دوره", "Course title")} required>
          <input className={inputClass} value={draft.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field label={t("تاریخ شروع", "Start date")} group>
          <MonthYear locale={locale} lang={resume.lang} value={draft.start} onChange={(v) => set("start", v)} />
        </Field>
        <Field label={t("تاریخ پایان", "End date")} group>
          <MonthYear locale={locale} lang={resume.lang} value={draft.end} onChange={(v) => set("end", v)} disabled={draft.ongoing} />
        </Field>
        <Check checked={draft.ongoing} onChange={(v) => set("ongoing", v)} label={t("دوره در حال برگزاری است", "The course is ongoing")} />
        <Field label={t("توضیحات تکمیلی", "More details")}>
          <textarea rows={3} className={inputClass} value={draft.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Required show={tried && !ok} locale={locale} />
      </div>
    </Sheet>
  );
}

export function CertificateForm({ initial, resume, locale, pending, onSave, onDelete, onClose }: FormProps<Certificate>) {
  const t = useT(locale);
  const { draft, set, tried, setTried } = useDraft(initial);
  const ok = Boolean(draft.title.trim());
  return (
    <Sheet
      locale={locale}
      title={t("مدرک، گواهینامه، افتخار", "Certificate or award")}
      onClose={onClose}
      footer={<SaveBar locale={locale} pending={pending} onDelete={onDelete} onSave={() => submit(ok, { ...draft, link: cleanUrl(draft.link) }, setTried, onSave)} />}
    >
      <div className="grid gap-5">
        <Field
          label={t("عنوان مدرک یا گواهینامه", "Title")}
          required
          hint={t("مانند مدرک IELTS، گواهینامه رانندگی، کنفرانس مدیریت و غیره", "e.g. IELTS, driving licence, a conference award")}
        >
          <input className={inputClass} value={draft.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field
          label={t("موسسه اعطا کننده", "Issued by")}
          hint={t("نام شرکت، سازمان یا موسسه‌ای که مدرک را از آن دریافت کرده‌اید", "The organisation that gave it to you")}
        >
          <input className={inputClass} value={draft.issuer} onChange={(e) => set("issuer", e.target.value)} />
        </Field>
        <Field label={t("شماره مدرک یا گواهینامه", "Certificate number")} hint={t("شماره سریال پروانه یا مدرک", "Serial number")}>
          <input className={inputClass} dir="ltr" value={draft.serial} onChange={(e) => set("serial", e.target.value)} />
        </Field>
        <Field label={t("لینک مدرک", "Certificate link")} hint={t("آدرس صفحه اینترنتی تأیید کننده مدرک", "A page that verifies it")}>
          <input className={inputClass} dir="ltr" inputMode="url" value={draft.link} onChange={(e) => set("link", e.target.value)} />
        </Field>
        <Field label={t("تاریخ دریافت", "Date received")} group>
          <MonthYear locale={locale} lang={resume.lang} value={draft.date} onChange={(v) => set("date", v)} />
        </Field>
        <Check
          checked={draft.lifetime}
          onChange={(v) => set("lifetime", v)}
          label={t("این مدرک تاریخ انقضا ندارد (اعتبار مادام‌العمر)", "This certificate doesn't expire")}
        />
        <Field label={t("توضیحات تکمیلی", "More details")}>
          <textarea rows={3} className={inputClass} value={draft.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Required show={tried && !ok} locale={locale} />
      </div>
    </Sheet>
  );
}

export function PublicationForm({ initial, resume, locale, pending, onSave, onDelete, onClose }: FormProps<Publication>) {
  const t = useT(locale);
  const { draft, set, tried, setTried } = useDraft(initial);
  const ok = Boolean(draft.title.trim());
  return (
    <Sheet
      locale={locale}
      title={t("مقاله یا کتاب", "Article or book")}
      onClose={onClose}
      footer={<SaveBar locale={locale} pending={pending} onDelete={onDelete} onSave={() => submit(ok, { ...draft, link: cleanUrl(draft.link) }, setTried, onSave)} />}
    >
      <div className="grid gap-5">
        <Field label={t("عنوان مقاله یا کتاب", "Title")} required>
          <input className={inputClass} value={draft.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field label={t("نام ناشر", "Publisher")} hint={t("نام انتشاراتی که مقاله یا کتاب شما را چاپ کرده است", "Who published it")}>
          <input className={inputClass} value={draft.publisher} onChange={(e) => set("publisher", e.target.value)} />
        </Field>
        <Field label={t("لینک مقاله یا کتاب", "Link")} hint={t("آدرس صفحه اینترنتی مربوط به مقاله، ژورنال یا کتاب", "Page for the article, journal or book")}>
          <input className={inputClass} dir="ltr" inputMode="url" value={draft.link} onChange={(e) => set("link", e.target.value)} />
        </Field>
        <Field label={t("تاریخ انتشار", "Published")} group>
          <MonthYear locale={locale} lang={resume.lang} value={draft.date} onChange={(v) => set("date", v)} />
        </Field>
        <Field label={t("توضیحات تکمیلی", "More details")}>
          <textarea rows={3} className={inputClass} value={draft.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Required show={tried && !ok} locale={locale} />
      </div>
    </Sheet>
  );
}

export function LinkForm({ initial, locale, pending, onSave, onDelete, onClose }: FormProps<LinkItem>) {
  const t = useT(locale);
  const { draft, set, tried, setTried } = useDraft(initial);
  const url = cleanUrl(draft.url);
  const ok = Boolean(url);
  return (
    <Sheet
      locale={locale}
      title={t("لینک | نمونه کار", "Link | portfolio")}
      tip={t("لینک می‌تواند شبکه اجتماعی یا آدرس اینترنتی نمونه کارهای شما باشد.", "A social profile or a page with your work.")}
      onClose={onClose}
      footer={<SaveBar locale={locale} pending={pending} onDelete={onDelete} onSave={() => submit(ok, { ...draft, url }, setTried, onSave)} />}
    >
      <div className="grid gap-5">
        <Field label={t("نوع لینک", "Link type")} required>
          <Select
            value={draft.type}
            onChange={(v) => set("type", (v || "other") as LinkItem["type"])}
            options={linkTypes.map((type) => ({ value: type, label: type === "other" ? t("سایر", "Other") : linkTypeNames[type] }))}
            placeholder={t("انتخاب کنید", "Choose")}
          />
        </Field>
        <Field
          label={t("آدرس اینترنتی لینک", "URL")}
          required
          hint={t("آدرس اینترنتی با https:// شروع می‌شود، مانند: https://example.com", "Starts with https://, e.g. https://example.com")}
        >
          <input className={inputClass} dir="ltr" inputMode="url" value={draft.url} onChange={(e) => set("url", e.target.value)} />
        </Field>
        <Required show={tried && !ok} locale={locale} />
      </div>
    </Sheet>
  );
}

export function AboutForm({ initial, locale, pending, onSave, onClose }: FormProps<string>) {
  const t = useT(locale);
  const [draft, setDraft] = useState(initial);
  return (
    <Sheet
      locale={locale}
      title={t("توضیحات", "About me")}
      tip={t(
        "در چند جمله کوتاه خودتان، هدف شغلی و نقاط قوتتان را معرفی کنید.",
        "Introduce yourself, your goal and your strengths in a few short sentences.",
      )}
      onClose={onClose}
      footer={<SaveBar locale={locale} pending={pending} onSave={() => onSave(draft)} />}
    >
      <Field label={t("توضیحات", "About me")}>
        <textarea rows={8} className={inputClass} value={draft} onChange={(e) => setDraft(e.target.value)} />
      </Field>
      <p className="mt-2 text-xs text-faint">{draft.length} / 2000</p>
    </Sheet>
  );
}

export { newId };
