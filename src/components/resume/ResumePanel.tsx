"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { getUserId } from "@/lib/auth-client";
import { localePath } from "@/lib/i18n";
import {
  colors,
  completion,
  formatMonth,
  formatRange,
  linkTypeNames,
  newId,
  resumeLabels,
  templateIds,
  templateNames,
  type Certificate,
  type Course,
  type Education,
  type Experience,
  type LeveledItem,
  type LinkItem,
  type Project,
  type Publication,
  type Resume,
  type ResumeLang,
  type ResumeSummary,
  type SectionKey,
} from "@/lib/resume";
import { psychTests } from "@/lib/tests";
import type { Locale } from "@/lib/types";
import { ResumeDocument, type ResumeTest } from "./ResumeDocument";
import {
  AboutForm,
  CertificateForm,
  Check,
  CourseForm,
  Dots,
  EducationForm,
  ExperienceForm,
  Field,
  InfoForm,
  JobForm,
  LeveledForm,
  LinkForm,
  LocationForm,
  NameForm,
  ProjectForm,
  PublicationForm,
  Sheet,
  inputClass,
  useT,
} from "./ResumeForms";
import { ScaledPreview } from "./ScaledPreview";

type ListKey = "experience" | "skills" | "education" | "languages" | "projects" | "courses" | "certificates" | "publications" | "links";

type SheetState =
  | { kind: "name" | "info" | "location" | "job" | "about" | "choose" | "new" | "copy" | "rename" | "preview" | "layout" }
  | { kind: ListKey; id?: string };

const blank = {
  experience: (): Experience => ({ id: newId(), company: "", title: "", start: "", end: "", current: false, description: "" }),
  skills: (): LeveledItem => ({ id: newId(), name: "", level: 4 }),
  languages: (): LeveledItem => ({ id: newId(), name: "", level: 2 }),
  education: (): Education => ({
    id: newId(),
    degree: "",
    field: "",
    university: "",
    gpa: "",
    start: "",
    end: "",
    ongoing: false,
    description: "",
  }),
  projects: (): Project => ({ id: newId(), title: "", link: "", start: "", end: "", ongoing: false, description: "" }),
  courses: (): Course => ({ id: newId(), title: "", start: "", end: "", ongoing: false, description: "" }),
  certificates: (): Certificate => ({
    id: newId(),
    title: "",
    issuer: "",
    serial: "",
    link: "",
    date: "",
    lifetime: false,
    description: "",
  }),
  publications: (): Publication => ({ id: newId(), title: "", publisher: "", link: "", date: "", description: "" }),
  links: (): LinkItem => ({ id: newId(), type: "linkedin", url: "" }),
};

type Me = { tests?: { id: string; testSlug: string; score: number; summary: string; addedToResume?: boolean }[] };

export function ResumePanel({ locale }: { locale: Locale }) {
  const t = useT(locale);
  const [userId, setUserIdState] = useState("");
  const [status, setStatus] = useState<"loading" | "guest" | "ready" | "error">("loading");
  const [list, setList] = useState<ResumeSummary[]>([]);
  const [resume, setResume] = useState<Resume | null>(null);
  const [tests, setTests] = useState<ResumeTest[]>([]);
  const [sheet, setSheet] = useState<SheetState | null>(null);
  const [pending, setPending] = useState(false);
  const [toast, setToast] = useState("");
  const [view, setView] = useState<"edit" | "download">("edit");
  const [manage, setManage] = useState<ListKey | null>(null);
  const started = useRef(false);

  const flash = useCallback((text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 2400);
  }, []);

  const openResume = useCallback(async (uid: string, id: string) => {
    const res = await fetch(`/api/resumes/${id}?userId=${encodeURIComponent(uid)}`);
    if (!res.ok) throw new Error("load");
    const data = (await res.json()) as { resume: Resume };
    setResume(data.resume);
    try {
      localStorage.setItem("resume-current", id);
    } catch {}
  }, []);

  const loadList = useCallback(async (uid: string) => {
    const res = await fetch(`/api/resumes?userId=${encodeURIComponent(uid)}`);
    if (!res.ok) throw new Error("list");
    const data = (await res.json()) as { resumes: ResumeSummary[] };
    setList(data.resumes);
    return data.resumes;
  }, []);

  // First load: list resumes, create the main one if there are none, then open the last-used one.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const uid = getUserId();
    if (!uid) {
      setStatus("guest");
      return;
    }
    setUserIdState(uid);
    (async () => {
      try {
        let rows = await loadList(uid);
        if (!rows.length) {
          const res = await fetch("/api/resumes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: uid, lang: locale, title: locale === "fa" ? "رزومه اصلی" : "Main resume", ifNone: true }),
          });
          if (res.status === 400) {
            setStatus("guest");
            return;
          }
          rows = await loadList(uid);
        }
        let saved = "";
        try {
          saved = localStorage.getItem("resume-current") ?? "";
        } catch {}
        const first = rows.find((r) => r.id === saved) ?? rows[0];
        await openResume(uid, first.id);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
      fetch(`/api/me?id=${encodeURIComponent(uid)}`)
        .then((r) => r.json())
        .then((me: Me) => {
          const rows = (me.tests ?? []).filter((x) => x.addedToResume);
          setTests(
            rows.map((x) => ({
              id: x.id,
              title: psychTests.find((p) => p.slug === x.testSlug)?.title ?? x.testSlug,
              score: x.score,
              summary: x.summary,
            })),
          );
        })
        .catch(() => undefined);
    })();
  }, [loadList, openResume, locale]);

  const persist = useCallback(
    async (next: Resume, message?: string) => {
      setPending(true);
      try {
        const res = await fetch(`/api/resumes/${next.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...next, userId }),
        });
        if (!res.ok) throw new Error("save");
        const data = (await res.json()) as { resume: Resume };
        setResume(data.resume);
        setList((rows) =>
          rows.map((r) => (r.id === next.id ? { ...r, title: data.resume.title, completion: completion(data.resume) } : r)),
        );
        setSheet(null);
        flash(message ?? t("ذخیره شد", "Saved"));
        return true;
      } catch {
        flash(t("ذخیره نشد؛ دوباره تلاش کنید.", "Couldn't save. Please try again."));
        return false;
      } finally {
        setPending(false);
      }
    },
    [userId, flash, t],
  );

  if (status === "loading") {
    return <PanelShell><p className="py-16 text-center text-sm text-muted">{t("در حال بارگذاری رزومه...", "Loading your resume...")}</p></PanelShell>;
  }
  if (status === "guest") {
    const next = encodeURIComponent(localePath(locale, "/resume-builder/me"));
    return (
      <PanelShell>
        <div className="rounded-2xl border border-border bg-surface p-6 text-center">
          <h1 className="text-2xl font-extrabold">{t("برای ساخت رزومه وارد شوید", "Sign in to build your resume")}</h1>
          <p className="mt-2 text-sm text-muted">
            {t("رزومه‌ها در حساب کاربری شما ذخیره می‌شوند تا هر وقت خواستید ویرایش و دانلود کنید.", "Resumes are saved in your account so you can edit and download them any time.")}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link href={`${localePath(locale, "/login")}?next=${next}`} className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white">
              {t("ورود", "Sign in")}
            </Link>
            <Link href={localePath(locale, "/register")} className="rounded-full border border-primary px-6 py-2.5 text-sm font-bold text-primary">
              {t("ثبت‌نام", "Register")}
            </Link>
          </div>
        </div>
      </PanelShell>
    );
  }
  if (status === "error" || !resume) {
    return <PanelShell><p className="py-16 text-center text-sm text-accent">{t("رزومه بارگذاری نشد. صفحه را دوباره باز کنید.", "Couldn't load your resume. Please reload the page.")}</p></PanelShell>;
  }

  const L = resumeLabels[resume.lang];
  const lang = resume.lang;
  const percent = completion(resume);

  // ---------- list helpers ----------
  const saveItem = <K extends ListKey>(key: K, item: Resume[K][number]) => {
    const rows = resume[key] as { id: string }[];
    const exists = rows.some((r) => r.id === item.id);
    persist({ ...resume, [key]: exists ? rows.map((r) => (r.id === item.id ? item : r)) : [...rows, item] });
  };
  const deleteItem = (key: ListKey, id: string) => {
    const rows = resume[key] as { id: string }[];
    persist({ ...resume, [key]: rows.filter((r) => r.id !== id) }, t("حذف شد", "Deleted"));
  };
  const moveItem = (key: ListKey, id: string, dir: -1 | 1) => {
    const rows = [...(resume[key] as { id: string }[])];
    const i = rows.findIndex((r) => r.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= rows.length) return;
    [rows[i], rows[j]] = [rows[j], rows[i]];
    persist({ ...resume, [key]: rows }, t("ترتیب ذخیره شد", "Order saved"));
  };

  const formProps = { resume, locale, pending, onClose: () => setSheet(null) };

  // ---------- resume actions ----------
  const createResume = async (body: Record<string, unknown>) => {
    setPending(true);
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        flash(data.error ?? t("ساخته نشد", "Couldn't create it"));
        return;
      }
      await loadList(userId);
      await openResume(userId, data.resume.id);
      setSheet(null);
      setView("edit");
      flash(t("رزومه جدید ساخته شد", "New resume created"));
    } finally {
      setPending(false);
    }
  };
  const removeResume = async () => {
    setPending(true);
    try {
      const res = await fetch(`/api/resumes/${resume.id}?userId=${encodeURIComponent(userId)}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      const rows = await loadList(userId);
      if (rows.length) await openResume(userId, rows[0].id);
      else window.location.reload();
      setSheet(null);
      flash(t("رزومه حذف شد", "Resume deleted"));
    } catch {
      flash(t("حذف نشد", "Couldn't delete it"));
    } finally {
      setPending(false);
    }
  };

  // ---------- section card ----------
  const card = (
    key: ListKey | null,
    title: string,
    body: ReactNode,
    opts: { onEdit?: () => void; empty?: boolean; addLabel?: string } = {},
  ) => (
    <section className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold">{title}</h2>
        <div className="flex gap-2">
          {key && !opts.empty ? (
            <IconButton
              label={manage === key ? t("پایان ویرایش", "Done") : t("ویرایش ترتیب", "Reorder")}
              active={manage === key}
              onClick={() => setManage(manage === key ? null : key)}
              icon={manage === key ? "check" : "pencil"}
            />
          ) : null}
          {opts.onEdit ? <IconButton label={t("ویرایش", "Edit")} onClick={opts.onEdit} icon="pencil" /> : null}
          {key ? <IconButton label={opts.addLabel ?? t("افزودن", "Add")} onClick={() => setSheet({ kind: key })} icon="plus" /> : null}
        </div>
      </div>
      <div className="mt-3">
        {opts.empty ? (
          <button
            type="button"
            onClick={() => (key ? setSheet({ kind: key }) : opts.onEdit?.())}
            className="w-full rounded-xl border border-dashed border-border px-4 py-4 text-sm text-faint transition hover:border-primary hover:text-primary"
          >
            {t("خالی — برای افزودن کلیک کنید", "Empty — click to add")}
          </button>
        ) : (
          body
        )}
      </div>
    </section>
  );

  const item = (key: ListKey, id: string, index: number, total: number, content: ReactNode) => (
    <div key={id} className="flex items-stretch gap-2">
      <button
        type="button"
        onClick={() => setSheet({ kind: key, id })}
        className="flex-1 rounded-xl border border-border bg-bg p-3.5 text-start transition hover:border-primary"
      >
        {content}
      </button>
      {manage === key ? (
        <div className="flex flex-col justify-center gap-1">
          <IconButton small label={t("بالا", "Up")} icon="up" disabled={index === 0} onClick={() => moveItem(key, id, -1)} />
          <IconButton small label={t("پایین", "Down")} icon="down" disabled={index === total - 1} onClick={() => moveItem(key, id, 1)} />
          <IconButton small label={t("حذف", "Delete")} icon="trash" onClick={() => deleteItem(key, id)} />
        </div>
      ) : null}
    </div>
  );

  const muted = (text: string) => (text ? <p className="mt-0.5 text-sm text-muted">{text}</p> : null);
  const desc = (text: string) =>
    text ? <p className="mt-2 line-clamp-3 whitespace-pre-line rounded-lg bg-surface px-3 py-2 text-sm leading-6 text-muted">{text}</p> : null;

  const p = resume.personal;
  const birth = [p.birthDay, p.birthMonth, p.birthYear].filter(Boolean).join("/");

  // ---------- current sheet ----------
  const findItem = <K extends ListKey>(key: K, id?: string) =>
    (id ? (resume[key] as { id: string }[]).find((r) => r.id === id) : undefined) as Resume[K][number] | undefined;

  let sheetNode: ReactNode = null;
  if (sheet) {
    const close = () => setSheet(null);
    switch (sheet.kind) {
      case "name":
        sheetNode = <NameForm {...formProps} initial={resume.personal} onSave={(v) => persist({ ...resume, personal: v })} />;
        break;
      case "info":
        sheetNode = <InfoForm {...formProps} initial={resume.personal} onSave={(v) => persist({ ...resume, personal: v })} />;
        break;
      case "location":
        sheetNode = <LocationForm {...formProps} initial={resume.location} onSave={(v) => persist({ ...resume, location: v })} />;
        break;
      case "job":
        sheetNode = <JobForm {...formProps} initial={resume.job} onSave={(v) => persist({ ...resume, job: v })} />;
        break;
      case "about":
        sheetNode = <AboutForm {...formProps} initial={resume.about} onSave={(v) => persist({ ...resume, about: v })} />;
        break;
      case "experience": {
        const found = findItem("experience", sheet.id);
        sheetNode = (
          <ExperienceForm
            {...formProps}
            initial={found ?? blank.experience()}
            onSave={(v) => saveItem("experience", v)}
            onDelete={found ? () => deleteItem("experience", found.id) : undefined}
          />
        );
        break;
      }
      case "skills":
      case "languages": {
        const key = sheet.kind;
        const found = findItem(key, sheet.id);
        sheetNode = (
          <LeveledForm
            {...formProps}
            kind={key === "skills" ? "skill" : "language"}
            initial={found ?? blank[key]()}
            onSave={(v) => saveItem(key, v)}
            onDelete={found ? () => deleteItem(key, found.id) : undefined}
          />
        );
        break;
      }
      case "education": {
        const found = findItem("education", sheet.id);
        sheetNode = (
          <EducationForm
            {...formProps}
            initial={found ?? blank.education()}
            onSave={(v) => saveItem("education", v)}
            onDelete={found ? () => deleteItem("education", found.id) : undefined}
          />
        );
        break;
      }
      case "projects": {
        const found = findItem("projects", sheet.id);
        sheetNode = (
          <ProjectForm
            {...formProps}
            initial={found ?? blank.projects()}
            onSave={(v) => saveItem("projects", v)}
            onDelete={found ? () => deleteItem("projects", found.id) : undefined}
          />
        );
        break;
      }
      case "courses": {
        const found = findItem("courses", sheet.id);
        sheetNode = (
          <CourseForm
            {...formProps}
            initial={found ?? blank.courses()}
            onSave={(v) => saveItem("courses", v)}
            onDelete={found ? () => deleteItem("courses", found.id) : undefined}
          />
        );
        break;
      }
      case "certificates": {
        const found = findItem("certificates", sheet.id);
        sheetNode = (
          <CertificateForm
            {...formProps}
            initial={found ?? blank.certificates()}
            onSave={(v) => saveItem("certificates", v)}
            onDelete={found ? () => deleteItem("certificates", found.id) : undefined}
          />
        );
        break;
      }
      case "publications": {
        const found = findItem("publications", sheet.id);
        sheetNode = (
          <PublicationForm
            {...formProps}
            initial={found ?? blank.publications()}
            onSave={(v) => saveItem("publications", v)}
            onDelete={found ? () => deleteItem("publications", found.id) : undefined}
          />
        );
        break;
      }
      case "links": {
        const found = findItem("links", sheet.id);
        sheetNode = (
          <LinkForm
            {...formProps}
            initial={found ?? blank.links()}
            onSave={(v) => saveItem("links", v)}
            onDelete={found ? () => deleteItem("links", found.id) : undefined}
          />
        );
        break;
      }
      case "choose":
        sheetNode = (
          <Sheet locale={locale} title={t("انتخاب رزومه", "Choose resume")} onClose={close}>
            <div className="grid gap-2">
              {list.map((row) => (
                <button
                  key={row.id}
                  type="button"
                  onClick={async () => {
                    await openResume(userId, row.id);
                    setSheet(null);
                  }}
                  className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 text-start ${
                    row.id === resume.id ? "border-primary bg-primary-soft" : "border-border bg-surface hover:border-primary"
                  }`}
                >
                  <span>
                    <span className="block font-bold">{row.title}</span>
                    <span className="text-xs text-faint">{row.lang === "fa" ? "فارسی" : "English"}</span>
                  </span>
                  <Progress value={row.completion} locale={locale} />
                </button>
              ))}
            </div>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <ActionButton onClick={() => setSheet({ kind: "new" })}>{t("+ رزومه جدید", "+ New resume")}</ActionButton>
              <ActionButton onClick={() => setSheet({ kind: "copy" })}>{t("کپی در رزومه جدید", "Copy to a new resume")}</ActionButton>
              <ActionButton onClick={() => setSheet({ kind: "rename" })}>{t("ویرایش عنوان", "Rename")}</ActionButton>
              <DeleteResume locale={locale} pending={pending} disabled={list.length < 2} onDelete={removeResume} />
            </div>
            {list.length < 2 ? (
              <p className="mt-2 text-xs text-faint">{t("آخرین رزومه را نمی‌توان حذف کرد.", "You can't delete your only resume.")}</p>
            ) : null}
          </Sheet>
        );
        break;
      case "new":
      case "copy":
        sheetNode = (
          <NewResumeForm
            locale={locale}
            copy={sheet.kind === "copy"}
            source={resume}
            pending={pending}
            onClose={close}
            onCreate={(body) => createResume(sheet.kind === "copy" ? { ...body, copyOf: resume.id } : body)}
          />
        );
        break;
      case "rename":
        sheetNode = <RenameForm locale={locale} pending={pending} initial={resume.title} onClose={close} onSave={(title) => persist({ ...resume, title })} />;
        break;
      case "preview":
        sheetNode = (
          <Sheet locale={locale} title={t("پیش‌نمایش رزومه", "Resume preview")} onClose={close} wide>
            <ScaledPreview resume={resume} tests={tests} className="rounded-lg shadow-xl ring-1 ring-black/10" />
            <p className="mt-4 text-center text-xs text-faint">
              {t("آخرین به‌روزرسانی", "Last updated")} {new Date(resume.updatedAt).toLocaleDateString(locale === "fa" ? "fa-IR" : "en-GB")}
            </p>
          </Sheet>
        );
        break;
      case "layout":
        sheetNode = <LayoutForm locale={locale} resume={resume} pending={pending} onClose={close} onSave={(order, hidden) => persist({ ...resume, order, hidden })} />;
        break;
    }
  }

  const header = (
    <div className="rounded-2xl border border-border bg-surface">
      <button type="button" onClick={() => setSheet({ kind: "choose" })} className="flex w-full items-center justify-between gap-3 p-4 text-start">
        <span>
          <span className="block text-xs text-faint">{t("انتخاب رزومه", "Choose resume")}</span>
          <span className="mt-0.5 block text-lg font-extrabold">
            {resume.title} <span className="text-xs font-normal text-faint">({lang === "fa" ? "فارسی" : "English"})</span>
          </span>
        </span>
        <span className="flex items-center gap-3">
          <Progress value={percent} locale={locale} />
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-faint" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      <div className="grid grid-cols-2 border-t border-border text-sm font-bold">
        <button type="button" onClick={() => setView("download")} className="flex items-center justify-center gap-2 py-3 hover:text-primary">
          <Glyph name="download" /> {t("دانلود رزومه", "Download")}
        </button>
        <button type="button" onClick={() => setSheet({ kind: "preview" })} className="flex items-center justify-center gap-2 border-s border-border py-3 hover:text-primary">
          <Glyph name="eye" /> {t("پیش‌نمایش", "Preview")}
        </button>
      </div>
    </div>
  );

  const editView = (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      {header}

      {card(null, t("اطلاعات پایه", "Basic info"), (
        <div className="grid gap-3">
          <button type="button" onClick={() => setSheet({ kind: "name" })} className="rounded-xl border border-border bg-bg p-3.5 text-start hover:border-primary">
            <p className="text-lg font-extrabold">{p.fullName || t("نام و نام خانوادگی", "Your name")}</p>
            {p.phone ? <p className="mt-1 text-sm text-muted" dir="ltr">{p.phone}</p> : null}
            {p.email ? <p className="text-sm text-muted" dir="ltr">{p.email}</p> : null}
          </button>
          <button type="button" onClick={() => setSheet({ kind: "info" })} className="flex flex-wrap gap-2 rounded-xl border border-border bg-bg p-3.5 text-start hover:border-primary">
            {[p.gender && L.genders[p.gender], birth, p.marital && L.maritals[p.marital], p.military && p.gender !== "female" && L.militaries[p.military]]
              .filter(Boolean)
              .map((chip) => (
                <span key={String(chip)} className="rounded-lg bg-surface px-2.5 py-1 text-xs">
                  {chip}
                </span>
              ))}
            {!p.gender && !birth && !p.marital ? <span className="text-sm text-faint">{t("مشخصات تکمیلی (جنسیت، تولد، تأهل، سربازی)", "More details (gender, birth, marital, military)")}</span> : null}
          </button>
        </div>
      ), { onEdit: () => setSheet({ kind: "name" }) })}

      {card(null, t("محل سکونت", "Location"), (
        <p className="rounded-xl bg-bg px-3.5 py-3 text-sm">
          {t("استان", "State")}: {resume.location.province} | {t("شهر", "City")}: {resume.location.city}
        </p>
      ), { onEdit: () => setSheet({ kind: "location" }), empty: !resume.location.province && !resume.location.city })}

      {card(null, t("اطلاعات شغلی", "Job info"), (
        <div>
          <p className="text-xs text-faint">{t("عنوان شغلی", "Job title")}</p>
          <p className="mt-1 text-xl font-extrabold text-primary">{resume.job.title}</p>
          {resume.job.showSalary && resume.job.salary ? muted(`${t("حقوق درخواستی", "Expected salary")}: ${resume.job.salary}`) : null}
        </div>
      ), { onEdit: () => setSheet({ kind: "job" }), empty: !resume.job.title })}

      {card("experience", t("سوابق کاری", "Work experience"), (
        <div className="grid gap-2.5">
          {resume.experience.map((x, i, all) =>
            item("experience", x.id, i, all.length, (
              <>
                <p className="font-extrabold">{x.title}</p>
                {muted(x.company)}
                <p className="text-xs text-faint">{formatRange(x.start, x.end, x.current, lang, t("مشغول به کار", "Present"))}</p>
                {desc(x.description)}
              </>
            )),
          )}
        </div>
      ), { empty: !resume.experience.length })}

      {card("skills", t("مهارت‌ها", "Skills"), (
        <div className="grid gap-2 sm:grid-cols-2">
          {resume.skills.map((s, i, all) =>
            item("skills", s.id, i, all.length, (
              <span className="flex items-center justify-between gap-3">
                <span className="font-bold">{s.name}</span>
                <Dots level={s.level} />
              </span>
            )),
          )}
        </div>
      ), { empty: !resume.skills.length })}

      {card("education", t("تحصیلات", "Education"), (
        <div className="grid gap-2.5">
          {resume.education.map((e, i, all) =>
            item("education", e.id, i, all.length, (
              <>
                <p className="font-extrabold">{[e.degree && L.degrees[e.degree], e.field].filter(Boolean).join(" ")}</p>
                {muted(e.university)}
                <p className="text-xs text-faint">{formatRange(e.start, e.end, e.ongoing, lang, L.studying)}</p>
              </>
            )),
          )}
        </div>
      ), { empty: !resume.education.length })}

      {card("languages", t("زبان‌های خارجی", "Languages"), (
        <div className="grid gap-2 sm:grid-cols-2">
          {resume.languages.map((s, i, all) =>
            item("languages", s.id, i, all.length, (
              <span className="flex items-center justify-between gap-3">
                <span className="font-bold">{s.name}</span>
                <span className="flex items-center gap-2 text-xs text-faint">
                  {L.levels[s.level - 1]} <Dots level={s.level} />
                </span>
              </span>
            )),
          )}
        </div>
      ), { empty: !resume.languages.length })}

      {card("projects", t("پروژه‌ها", "Projects"), (
        <div className="grid gap-2.5">
          {resume.projects.map((x, i, all) =>
            item("projects", x.id, i, all.length, (
              <>
                <p className="font-extrabold">{x.title}</p>
                <p className="text-xs text-faint">{formatRange(x.start, x.end, x.ongoing, lang, L.ongoing)}</p>
                {x.link ? <p className="mt-1 text-sm text-primary" dir="ltr">{x.link.replace(/^https?:\/\//, "")}</p> : null}
                {desc(x.description)}
              </>
            )),
          )}
        </div>
      ), { empty: !resume.projects.length })}

      {card("courses", t("دوره‌ها", "Courses"), (
        <div className="grid gap-2.5">
          {resume.courses.map((x, i, all) =>
            item("courses", x.id, i, all.length, (
              <>
                <p className="font-extrabold">{x.title}</p>
                <p className="text-xs text-faint">{formatRange(x.start, x.end, x.ongoing, lang, L.ongoing)}</p>
              </>
            )),
          )}
        </div>
      ), { empty: !resume.courses.length })}

      {card("certificates", t("مدارک، گواهینامه‌ها، افتخارات", "Certificates & awards"), (
        <div className="grid gap-2.5">
          {resume.certificates.map((x, i, all) =>
            item("certificates", x.id, i, all.length, (
              <>
                <p className="font-extrabold">{x.title}</p>
                {muted(x.issuer)}
                {x.date ? <p className="text-xs text-faint">{formatMonth(x.date, lang)}</p> : null}
              </>
            )),
          )}
        </div>
      ), { empty: !resume.certificates.length })}

      {card("publications", t("مقالات و کتاب‌ها", "Articles & books"), (
        <div className="grid gap-2.5">
          {resume.publications.map((x, i, all) =>
            item("publications", x.id, i, all.length, (
              <>
                <p className="font-extrabold">{x.title}</p>
                {muted(x.publisher)}
                {x.date ? <p className="text-xs text-faint">{formatMonth(x.date, lang)}</p> : null}
              </>
            )),
          )}
        </div>
      ), { empty: !resume.publications.length })}

      <section className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold">{t("تست‌های هوش | شخصیت‌شناسی", "Intelligence | personality tests")}</h2>
          <Link href={localePath(locale, "/tests")} className="rounded-full bg-bg px-3.5 py-1.5 text-sm font-bold text-primary">
            {t("شرکت در آزمون", "Take a test")}
          </Link>
        </div>
        {tests.length ? (
          <div className="mt-3 grid gap-2">
            {tests.map((x) => (
              <div key={x.id} className="rounded-xl border border-border bg-bg p-3.5">
                <p className="font-bold">
                  {x.title} <span className="text-sm font-normal text-faint">— {t("امتیاز", "score")} {x.score}</span>
                </p>
                {muted(x.summary)}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-xl border border-dashed border-border px-4 py-4 text-sm text-faint">
            {t(
              "خالی — بعد از هر آزمون روی «افزودن به رزومه سایت» بزنید تا نتیجه اینجا بیاید.",
              "Empty — after a test, choose “Add to site resume” and the result appears here.",
            )}
          </p>
        )}
      </section>

      {card("links", t("لینک‌ها | نمونه کارها", "Links | portfolio"), (
        <div className="grid gap-2">
          {resume.links.map((x, i, all) =>
            item("links", x.id, i, all.length, (
              <span className="flex flex-wrap items-center justify-between gap-2" dir="ltr">
                <b>{linkTypeNames[x.type]}</b>
                <span className="text-sm text-primary">{x.url.replace(/^https?:\/\//, "")}</span>
              </span>
            )),
          )}
        </div>
      ), { empty: !resume.links.length })}

      {card(null, t("توضیحات", "About me"), <p className="whitespace-pre-line rounded-xl bg-bg px-3.5 py-3 text-sm leading-7">{resume.about}</p>, {
        onEdit: () => setSheet({ kind: "about" }),
        empty: !resume.about.trim(),
      })}

      <button
        type="button"
        onClick={() => setView("download")}
        className="min-h-12 rounded-full bg-primary text-base font-extrabold text-white hover:bg-primary-hover"
      >
        {t("دانلود رزومه", "Download resume")}
      </button>
    </div>
  );

  const downloadView = (
    <DownloadView
      locale={locale}
      resume={resume}
      tests={tests}
      pending={pending}
      onBack={() => setView("edit")}
      onLayout={() => setSheet({ kind: "layout" })}
      onChange={(patch) => persist({ ...resume, ...patch }, t("قالب ذخیره شد", "Design saved"))}
    />
  );

  return (
    <>
      <div className="mx-auto grid w-[min(1240px,calc(100%-32px))] gap-6 py-6 print:hidden lg:grid-cols-[minmax(0,1fr)_420px] lg:py-8">
        <div className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h1 className="text-2xl font-extrabold">{view === "edit" ? t("رزومه من", "My resume") : t("دانلود رزومه", "Download resume")}</h1>
            <Link href={localePath(locale, "/resume-builder")} className="text-sm text-muted underline-offset-4 hover:underline">
              {t("درباره رزومه‌ساز", "About the builder")}
            </Link>
          </div>
          {view === "edit" ? editView : downloadView}
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-bold">{t("پیش‌نمایش زنده", "Live preview")}</span>
              <span className="text-faint">{templateNames[resume.template][locale]}</span>
            </div>
            <div className="max-h-[calc(100vh-140px)] overflow-y-auto rounded-xl">
              <ScaledPreview resume={resume} tests={tests} className="rounded-lg ring-1 ring-black/10" />
            </div>
          </div>
        </aside>
      </div>

      {/* Only this is printed — "Save as PDF" in the print dialog gives the PDF. */}
      <div className="resume-print-area hidden print:block">
        <ResumeDocument resume={resume} tests={tests} />
      </div>

      {sheetNode}

      {toast ? (
        <div role="status" className="fixed inset-x-0 bottom-24 z-[70] mx-auto w-fit rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-bg shadow-lg print:hidden lg:bottom-8">
          {toast}
        </div>
      ) : null}
    </>
  );
}

// ---------------- pieces ----------------

function PanelShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-[min(720px,calc(100%-32px))] py-10">{children}</div>;
}

function Progress({ value, locale }: { value: number; locale: Locale }) {
  return (
    <span className="flex items-center gap-2 text-xs font-bold text-primary">
      <span className="h-2 w-16 overflow-hidden rounded-full bg-border">
        <span className="block h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
      </span>
      {locale === "fa" ? `٪${String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)])}` : `${value}%`}
    </span>
  );
}

const glyphs = {
  pencil: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
  plus: "M12 5v14M5 12h14",
  check: "M5 12l5 5 9-10",
  up: "M6 15l6-6 6 6",
  down: "M6 9l6 6 6-6",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
  download: "M12 4v11M7 10l5 5 5-5M5 20h14",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
};

function Glyph({ name, className = "h-4.5 w-4.5" }: { name: keyof typeof glyphs; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={glyphs[name]} />
    </svg>
  );
}

function IconButton({
  label,
  onClick,
  icon,
  active,
  small,
  disabled,
}: {
  label: string;
  onClick: () => void;
  icon: keyof typeof glyphs;
  active?: boolean;
  small?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`grid place-items-center rounded-full transition disabled:opacity-30 ${small ? "h-7 w-7" : "h-9 w-9"} ${
        active ? "bg-primary text-white" : "bg-bg text-muted hover:text-primary"
      }`}
    >
      <Glyph name={icon} className={small ? "h-3.5 w-3.5" : "h-4.5 w-4.5"} />
    </button>
  );
}

function ActionButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="min-h-11 rounded-xl border border-border bg-surface px-4 text-sm font-bold hover:border-primary hover:text-primary">
      {children}
    </button>
  );
}

function DeleteResume({ locale, pending, disabled, onDelete }: { locale: Locale; pending: boolean; disabled: boolean; onDelete: () => void }) {
  const [confirm, setConfirm] = useState(false);
  const t = useT(locale);
  return (
    <button
      type="button"
      disabled={pending || disabled}
      onClick={() => (confirm ? onDelete() : setConfirm(true))}
      className={`min-h-11 rounded-xl border px-4 text-sm font-bold disabled:opacity-40 ${
        confirm ? "border-accent bg-accent text-white" : "border-border bg-surface text-accent hover:border-accent"
      }`}
    >
      {confirm ? t("مطمئنید؟ این رزومه برای همیشه حذف می‌شود", "Sure? This resume is deleted for good") : t("حذف این رزومه", "Delete this resume")}
    </button>
  );
}

function NewResumeForm({
  locale,
  copy,
  source,
  pending,
  onClose,
  onCreate,
}: {
  locale: Locale;
  copy: boolean;
  source: Resume;
  pending: boolean;
  onClose: () => void;
  onCreate: (body: { lang: ResumeLang; title: string }) => void;
}) {
  const t = useT(locale);
  const [lang, setLang] = useState<ResumeLang>(copy ? source.lang : locale);
  const [title, setTitle] = useState(copy ? `${source.title} ${t("(کپی)", "(copy)")}` : "");
  const [tried, setTried] = useState(false);
  return (
    <Sheet
      locale={locale}
      title={copy ? t("کپی در رزومه جدید", "Copy to a new resume") : t("رزومه جدید", "New resume")}
      tip={t(
        "اگر برای چند شغل متفاوت رزومه ارسال می‌کنید، می‌توانید برای هر کدام یک رزومه متفاوت «فارسی» یا «انگلیسی» بسازید و آن را برای همان شغل تنظیم کنید.",
        "Applying for different jobs? Make a separate Persian or English resume for each one and tailor it to that job.",
      )}
      onClose={onClose}
      footer={
        <button
          type="button"
          disabled={pending}
          onClick={() => (title.trim() ? onCreate({ lang, title: title.trim() }) : setTried(true))}
          className="min-h-12 w-full rounded-full bg-primary text-base font-extrabold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {copy ? t("کپی در رزومه جدید", "Copy to a new resume") : t("رزومه جدید", "Create resume")}
        </button>
      }
    >
      <div className="grid gap-5">
        <Field label={t("زبان رزومه", "Resume language")} required hint={copy ? undefined : t("غیر قابل تغییر پس از ایجاد رزومه", "Can't be changed later")} group>
          {copy ? (
            <p className="rounded-xl bg-surface px-3.5 py-2.5 text-sm">{source.lang === "fa" ? "فارسی" : "English"}</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {(["fa", "en"] as const).map((value) => (
                <label
                  key={value}
                  className={`flex min-h-11 cursor-pointer items-center justify-center rounded-xl border text-sm font-bold ${
                    lang === value ? "border-primary bg-primary-soft text-primary-ink" : "border-border bg-surface"
                  }`}
                >
                  <input type="radio" name="lang" className="sr-only" checked={lang === value} onChange={() => setLang(value)} />
                  {value === "fa" ? "فارسی" : "English"}
                </label>
              ))}
            </div>
          )}
        </Field>
        <Field label={t("عنوان رزومه", "Resume name")} required hint={t("فقط به شما نمایش داده می‌شود", "Only you see this")}>
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} />
        </Field>
        {tried && !title.trim() ? <p className="text-sm text-accent">{t("عنوان رزومه را بنویسید.", "Give the resume a name.")}</p> : null}
      </div>
    </Sheet>
  );
}

function RenameForm({ locale, pending, initial, onClose, onSave }: { locale: Locale; pending: boolean; initial: string; onClose: () => void; onSave: (title: string) => void }) {
  const t = useT(locale);
  const [title, setTitle] = useState(initial);
  return (
    <Sheet
      locale={locale}
      title={t("ویرایش عنوان رزومه", "Rename resume")}
      onClose={onClose}
      footer={
        <button
          type="button"
          disabled={pending || !title.trim()}
          onClick={() => onSave(title.trim())}
          className="min-h-12 w-full rounded-full bg-primary text-base font-extrabold text-white disabled:opacity-60"
        >
          {t("ذخیره", "Save")}
        </button>
      }
    >
      <Field label={t("عنوان رزومه", "Resume name")} required hint={t("فقط به شما نمایش داده می‌شود", "Only you see this")}>
        <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} />
      </Field>
    </Sheet>
  );
}

function LayoutForm({
  locale,
  resume,
  pending,
  onClose,
  onSave,
}: {
  locale: Locale;
  resume: Resume;
  pending: boolean;
  onClose: () => void;
  onSave: (order: SectionKey[], hidden: SectionKey[]) => void;
}) {
  const t = useT(locale);
  const [order, setOrder] = useState(resume.order);
  const [hidden, setHidden] = useState(resume.hidden);
  const labels = resumeLabels[locale].sections;
  const move = (i: number, dir: -1 | 1) => {
    const next = [...order];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  };
  return (
    <Sheet
      locale={locale}
      title={t("چیدمان بخش‌ها", "Section layout")}
      tip={t("ترتیب هر بخش در نسخه دانلودی رزومه را تعیین کنید و بخش‌هایی را که نمی‌خواهید پنهان کنید.", "Set the order of sections in the downloaded resume and hide the ones you don't want.")}
      onClose={onClose}
      footer={
        <button
          type="button"
          disabled={pending}
          onClick={() => onSave(order, hidden)}
          className="min-h-12 w-full rounded-full bg-primary text-base font-extrabold text-white disabled:opacity-60"
        >
          {t("ذخیره", "Save")}
        </button>
      }
    >
      <div className="mb-2 flex justify-between px-1 text-xs text-faint">
        <span>{t("ترتیب", "Order")}</span>
        <span>{t("نمایش", "Show")}</span>
      </div>
      <ol className="grid gap-2">
        {order.map((key, i) => (
          <li key={key} className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5">
            <IconButton small label={t("بالا", "Up")} icon="up" disabled={i === 0} onClick={() => move(i, -1)} />
            <IconButton small label={t("پایین", "Down")} icon="down" disabled={i === order.length - 1} onClick={() => move(i, 1)} />
            <span className="flex-1 text-sm font-bold">{labels[key]}</span>
            <Check
              checked={!hidden.includes(key)}
              onChange={(show) => setHidden(show ? hidden.filter((k) => k !== key) : [...hidden, key])}
              label=""
              ariaLabel={`${t("نمایش", "Show")} ${labels[key]}`}
            />
          </li>
        ))}
      </ol>
    </Sheet>
  );
}

function DownloadView({
  locale,
  resume,
  tests,
  pending,
  onBack,
  onLayout,
  onChange,
}: {
  locale: Locale;
  resume: Resume;
  tests: ResumeTest[];
  pending: boolean;
  onBack: () => void;
  onLayout: () => void;
  onChange: (patch: Partial<Resume>) => void;
}) {
  const t = useT(locale);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      <button type="button" onClick={onBack} className="flex w-fit items-center gap-2 text-sm font-bold text-muted hover:text-primary">
        <svg viewBox="0 0 24 24" className={`h-4 w-4 ${locale === "fa" ? "" : "rotate-180"}`} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
        {t("بازگشت به ویرایش رزومه", "Back to editing")}
      </button>

      <section>
        <h2 className="text-lg font-extrabold">{t("قالب رزومه", "Template")}</h2>
        <div className="no-scrollbar mt-3 flex snap-x gap-3 overflow-x-auto pb-2">
          {templateIds.map((id) => (
            <button
              key={id}
              type="button"
              disabled={pending}
              onClick={() => onChange({ template: id })}
              className={`w-40 shrink-0 snap-start rounded-2xl border-2 bg-surface p-2 text-center transition sm:w-44 ${
                resume.template === id ? "border-primary" : "border-transparent hover:border-border"
              }`}
              aria-pressed={resume.template === id}
            >
              <ScaledPreview resume={{ ...resume, template: id }} tests={tests} maxHeight={200} className="rounded-md bg-white" />
              <span className={`mt-2 block text-sm font-bold ${resume.template === id ? "text-primary" : ""}`}>{templateNames[id][locale]}</span>
            </button>
          ))}
        </div>
      </section>

      <button type="button" onClick={onLayout} className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-surface text-sm font-bold hover:text-primary">
        <Glyph name="up" className="h-4 w-4" />
        {t("ویرایش چیدمان", "Edit layout")}
      </button>

      <section>
        <h2 className="text-lg font-extrabold">{t("رنگ قالب", "Template color")}</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {colors.map((c) => (
            <button
              key={c.value}
              type="button"
              disabled={pending}
              onClick={() => onChange({ color: c.value })}
              title={c.name[locale]}
              aria-label={c.name[locale]}
              aria-pressed={resume.color === c.value}
              className={`grid h-9 w-9 place-items-center rounded-full ring-2 ring-offset-2 ring-offset-bg transition ${
                resume.color === c.value ? "ring-primary" : "ring-transparent"
              }`}
            >
              <span className="h-7 w-7 rounded-full" style={{ background: c.value }} />
            </button>
          ))}
        </div>
      </section>

      <div className="lg:hidden">
        <ScaledPreview resume={resume} tests={tests} className="rounded-lg ring-1 ring-black/10" />
      </div>

      <div>
        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-12 w-full rounded-full bg-primary text-base font-extrabold text-white hover:bg-primary-hover"
        >
          {t("دانلود رزومه (PDF)", "Download resume (PDF)")}
        </button>
        <p className="mt-2 text-center text-xs leading-5 text-faint">
          {t(
            "در پنجره چاپ، مقصد را «Save as PDF» بگذارید و تیک «Background graphics» را بزنید.",
            "In the print dialog choose “Save as PDF” and turn on “Background graphics”.",
          )}
        </p>
      </div>
    </div>
  );
}
