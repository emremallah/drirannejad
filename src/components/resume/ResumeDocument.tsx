import type { CSSProperties, ReactNode } from "react";
import {
  digits,
  formatMonth,
  formatRange,
  inkFor,
  linkTypeNames,
  resumeLabels,
  type Level,
  type Resume,
  type SectionKey,
} from "@/lib/resume";

export type ResumeTest = { id: string; title: string; score: number; summary: string };

type Props = { resume: Resume; tests?: ResumeTest[] };

/** A4 width at 96dpi — the editor scales this down to fit its column. */
export const PAPER_WIDTH = 794;
export const PAPER_HEIGHT = 1123;

const sidebarKeys: SectionKey[] = ["skills", "languages", "links"];

// ---------------- small pieces ----------------

const iconPaths: Record<SectionKey | "user" | "mail" | "phone" | "pin", string> = {
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
  about: "M4 5h16M4 10h16M4 15h10M4 20h7",
  publications: "M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7",
  education: "M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5",
  experience: "M4 8h16v11H4zM9 8V5h6v3",
  skills: "M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z",
  languages: "M3 5h9M7.5 3v2c0 4-2 7-4.5 8M5 9c1.5 2.5 4 4 6 4M13 21l4-10 4 10M14.5 17h5",
  projects: "M3 6h7l2 2h9v11H3z",
  courses: "M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3zM4 17a3 3 0 0 1 3-3h11",
  certificates: "M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM9 13l-2 8 5-3 5 3-2-8",
  links: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  tests: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  mail: "M3 6h18v12H3zM3 6l9 7 9-7",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  pin: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
};

function Icon({ name, className = "h-4 w-4" }: { name: keyof typeof iconPaths; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={iconPaths[name]} />
    </svg>
  );
}

function LevelBar({ level, onDark }: { level: Level; onDark?: boolean }) {
  return (
    <span className="inline-flex gap-[3px]">
      {[1, 2, 3, 4].map((step) => (
        <span
          key={step}
          className="h-[9px] w-[15px]"
          style={{
            background: step <= level ? (onDark ? "#fff" : "var(--rc)") : onDark ? "rgba(255,255,255,.3)" : "#dcdcdc",
          }}
        />
      ))}
    </span>
  );
}

const ltr = (text: string) => <bdi dir="ltr">{text}</bdi>;
const bare = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

// ---------------- section bodies (shared by every template) ----------------

function buildSections(resume: Resume, tests: ResumeTest[]) {
  const L = resumeLabels[resume.lang];
  const { lang } = resume;
  const has: Record<SectionKey, boolean> = {
    about: Boolean(resume.about.trim()),
    publications: resume.publications.length > 0,
    education: resume.education.length > 0,
    experience: resume.experience.length > 0,
    skills: resume.skills.some((s) => s.name.trim()),
    languages: resume.languages.some((s) => s.name.trim()),
    projects: resume.projects.length > 0,
    courses: resume.courses.length > 0,
    certificates: resume.certificates.length > 0,
    links: resume.links.length > 0,
    tests: tests.length > 0,
  };
  const visible = resume.order.filter((key) => has[key] && !resume.hidden.includes(key));

  const meta = (parts: (string | false | undefined)[]) => parts.filter(Boolean).join("  /  ");

  function body(key: SectionKey, opts: { onDark?: boolean; dense?: boolean } = {}): ReactNode {
    const muted = opts.onDark ? "text-white/80" : "text-[#555]";
    const strong = opts.onDark ? "text-white" : "text-[#1f1f1f]";
    const gap = opts.dense ? "gap-2" : "gap-3.5";
    switch (key) {
      case "about":
        return <p className={`whitespace-pre-line leading-7 ${muted}`}>{digits(resume.about, lang)}</p>;
      case "education":
        return (
          <div className={`grid ${gap}`}>
            {resume.education.map((e) => (
              <div key={e.id}>
                <p className={`font-bold ${strong}`}>{[e.degree && L.degrees[e.degree], e.field].filter(Boolean).join(" ")}</p>
                <p className={`mt-0.5 text-[0.92em] ${muted}`}>
                  {meta([
                    e.university,
                    formatRange(e.start, e.end, e.ongoing, lang, L.studying),
                    e.gpa && `${L.gpa} ${digits(e.gpa, lang)}`,
                  ])}
                </p>
                {e.description ? <p className={`mt-0.5 whitespace-pre-line ${muted}`}>{digits(e.description, lang)}</p> : null}
              </div>
            ))}
          </div>
        );
      case "experience":
        return (
          <div className={`grid ${gap}`}>
            {resume.experience.map((x) => (
              <div key={x.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className={`font-bold ${strong}`}>{x.title}</p>
                  <p className={`text-[0.9em] ${muted}`}>{formatRange(x.start, x.end, x.current, lang)}</p>
                </div>
                {x.company ? <p className={`text-[0.92em] ${muted}`}>{x.company}</p> : null}
                {x.description ? (
                  <p className={`mt-1 whitespace-pre-line leading-7 ${muted}`}>{digits(x.description, lang)}</p>
                ) : null}
              </div>
            ))}
          </div>
        );
      case "skills":
      case "languages": {
        const rows = resume[key].filter((s) => s.name.trim());
        return (
          <div className={`grid ${opts.onDark || opts.dense ? "grid-cols-1" : "grid-cols-2"} gap-x-8 gap-y-2.5`}>
            {rows.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3">
                <span className={strong}>{s.name}</span>
                <span className="flex flex-col items-end gap-0.5">
                  <span className={`text-[0.78em] ${muted}`}>{L.levels[s.level - 1]}</span>
                  <LevelBar level={s.level} onDark={opts.onDark} />
                </span>
              </div>
            ))}
          </div>
        );
      }
      case "projects":
        return (
          <div className={`grid ${gap}`}>
            {resume.projects.map((p) => (
              <div key={p.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className={`font-bold ${strong}`}>{p.title}</p>
                  <p className={`text-[0.9em] ${muted}`}>{formatRange(p.start, p.end, p.ongoing, lang, L.ongoing)}</p>
                </div>
                {p.link ? <p className="text-[0.88em] text-[var(--ri)]">{ltr(bare(p.link))}</p> : null}
                {p.description ? <p className={`mt-1 whitespace-pre-line leading-7 ${muted}`}>{digits(p.description, lang)}</p> : null}
              </div>
            ))}
          </div>
        );
      case "courses":
        return (
          <div className={`grid ${opts.dense ? "gap-1.5" : "gap-2.5"}`}>
            {resume.courses.map((c) => (
              <div key={c.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className={`font-bold ${strong}`}>{c.title}</p>
                  <p className={`text-[0.9em] ${muted}`}>{formatRange(c.start, c.end, c.ongoing, lang, L.ongoing)}</p>
                </div>
                {c.description ? <p className={`mt-0.5 whitespace-pre-line ${muted}`}>{digits(c.description, lang)}</p> : null}
              </div>
            ))}
          </div>
        );
      case "certificates":
        return (
          <div className="grid">
            {resume.certificates.map((c, i) => (
              <div key={c.id} className={`py-2.5 ${i ? "border-t border-[#e6e6e6]" : ""}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className={`font-bold ${strong}`}>{c.title}</p>
                  {c.date ? <p className={`text-[0.9em] ${muted}`}>{L.issued} {formatMonth(c.date, lang)}</p> : null}
                </div>
                <p className={`text-[0.9em] ${muted}`}>
                  {meta([c.issuer, c.serial && `${L.serial} ${c.serial}`, c.lifetime && L.lifetime])}
                </p>
                {c.link ? <p className="text-[0.88em] text-[var(--ri)]">{ltr(bare(c.link))}</p> : null}
                {c.description ? <p className={`mt-0.5 whitespace-pre-line ${muted}`}>{digits(c.description, lang)}</p> : null}
              </div>
            ))}
          </div>
        );
      case "publications":
        return (
          <div className={`grid ${gap}`}>
            {resume.publications.map((p) => (
              <div key={p.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className={`font-bold ${strong}`}>{p.title}</p>
                  {p.date ? <p className={`text-[0.9em] ${muted}`}>{formatMonth(p.date, lang)}</p> : null}
                </div>
                {p.publisher ? <p className={`text-[0.9em] ${muted}`}>{p.publisher}</p> : null}
                {p.link ? <p className="text-[0.88em] text-[var(--ri)]">{ltr(bare(p.link))}</p> : null}
                {p.description ? <p className={`mt-0.5 whitespace-pre-line ${muted}`}>{digits(p.description, lang)}</p> : null}
              </div>
            ))}
          </div>
        );
      case "links":
        return (
          <div className="grid gap-1.5">
            {resume.links.map((l) => (
              <p key={l.id} className="flex flex-wrap gap-x-3" dir="ltr">
                <b className={`min-w-20 ${strong}`}>{linkTypeNames[l.type]}</b>
                <span className={`break-all ${opts.onDark ? "text-white/85" : "text-[var(--ri)]"}`}>{bare(l.url)}</span>
              </p>
            ))}
          </div>
        );
      case "tests":
        return (
          <div className={`grid ${gap}`}>
            {tests.map((t) => (
              <div key={t.id}>
                <p className={`font-bold ${strong}`}>
                  {t.title} <span className={`text-[0.88em] font-normal ${muted}`}>— {L.score} {digits(String(t.score), lang)}</span>
                </p>
                {t.summary ? <p className={`mt-0.5 ${muted}`}>{t.summary}</p> : null}
              </div>
            ))}
          </div>
        );
    }
  }

  return { visible, body, L };
}

function contactRows(resume: Resume) {
  const p = resume.personal;
  const loc = resume.location;
  const L = resumeLabels[resume.lang];
  const sep = resume.lang === "fa" ? "، " : ", ";
  const place = [loc.province && `${L.province} ${loc.province}`.trim(), loc.city, !loc.hideAddress && loc.address]
    .filter(Boolean)
    .join(sep);
  return [
    place && { icon: "pin" as const, node: place },
    p.email && { icon: "mail" as const, node: ltr(p.email) },
    p.phone && { icon: "phone" as const, node: ltr(digits(p.phone, resume.lang)) },
  ].filter(Boolean) as { icon: "pin" | "mail" | "phone"; node: ReactNode }[];
}

function basicInfo(resume: Resume) {
  const L = resumeLabels[resume.lang];
  const p = resume.personal;
  const birth = p.birthYear
    ? digits([p.birthYear, p.birthMonth, p.birthDay].filter(Boolean).map((v) => v.padStart(2, "0")).join("/"), resume.lang)
    : "";
  return [
    p.gender && `${L.gender}: ${L.genders[p.gender]}`,
    birth && `${L.birth}: ${birth}`,
    p.military && p.gender !== "female" && `${L.military}: ${L.militaries[p.military]}`,
    p.marital && `${L.marital}: ${L.maritals[p.marital]}`,
    resume.job.showSalary && resume.job.salary && `${L.salary}: ${digits(resume.job.salary, resume.lang)}`,
  ].filter(Boolean) as string[];
}

function placeholderName(resume: Resume) {
  return resume.personal.fullName || (resume.lang === "fa" ? "نام و نام خانوادگی" : "Your name");
}

// ---------------- templates ----------------

export function ResumeDocument({ resume, tests = [] }: Props) {
  const style = {
    "--rc": resume.color,
    "--ri": inkFor(resume.color),
    width: PAPER_WIDTH,
    minHeight: PAPER_HEIGHT,
  } as CSSProperties;
  const props = { resume, tests };
  return (
    <article
      dir={resume.lang === "fa" ? "rtl" : "ltr"}
      lang={resume.lang}
      style={style}
      className="resume-paper relative bg-white text-[13.5px] leading-6 text-[#2b2b2b] [font-family:Tahoma,'Segoe_UI',sans-serif]"
    >
      {resume.template === "avantgarde" ? (
        <Avantgarde {...props} />
      ) : resume.template === "modern" ? (
        <Modern {...props} />
      ) : resume.template === "prestige" ? (
        <Prestige {...props} />
      ) : resume.template === "classic" ? (
        <Classic {...props} />
      ) : resume.template === "compact" ? (
        <Compact {...props} />
      ) : (
        <Main {...props} />
      )}
    </article>
  );
}

const heading = "[font-family:var(--font-vazir),Tahoma,sans-serif] font-extrabold";

function Main({ resume, tests }: Required<Props>) {
  const { visible, body, L } = buildSections(resume, tests);
  const info = basicInfo(resume);
  return (
    <div className="px-12 py-11">
      <header>
        <h1 className={`${heading} text-[34px] leading-tight text-[#1f1f1f]`}>{placeholderName(resume)}</h1>
        {resume.job.title ? <p className={`${heading} mt-1 text-[17px] text-[var(--ri)]`}>{resume.job.title}</p> : null}
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {contactRows(resume).map((row) => (
            <span key={row.icon} className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center bg-[#444] text-white">
                <Icon name={row.icon} className="h-3.5 w-3.5" />
              </span>
              {row.node}
            </span>
          ))}
        </div>
        {info.length ? (
          <div className="mt-4">
            <p className="font-bold text-[#1f1f1f]">{L.basic}</p>
            <p className="mt-1 text-[#555]">{info.join("  /  ")}</p>
          </div>
        ) : null}
      </header>
      {visible.map((key) => (
        <section key={key} className="mt-7 break-inside-avoid-page">
          <h2 className="flex items-center gap-3 border-b-2 border-[var(--rc)] pb-2">
            <span className="grid h-8 w-8 place-items-center bg-[var(--rc)] text-white">
              <Icon name={key} />
            </span>
            <span className={`${heading} text-[19px] text-[#1f1f1f]`}>{L.sections[key]}</span>
          </h2>
          <div className="mt-3.5">{body(key)}</div>
        </section>
      ))}
    </div>
  );
}

function Avantgarde({ resume, tests }: Required<Props>) {
  const { visible, body, L } = buildSections(resume, tests);
  const side = visible.filter((key) => sidebarKeys.includes(key));
  const main = visible.filter((key) => !sidebarKeys.includes(key));
  const info = basicInfo(resume);
  const initials = placeholderName(resume)
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join(resume.lang === "fa" ? "‌" : "");
  return (
    <div className="grid min-h-[inherit] grid-cols-[34%_1fr]">
      <aside className="bg-[var(--ri)] px-7 py-10 text-white">
        <div className={`${heading} mx-auto grid h-24 w-24 place-items-center rounded-full border-4 border-white/40 text-[30px]`}>{initials}</div>
        <div className="mt-7 grid gap-2.5 text-[12.5px]">
          {contactRows(resume).map((row) => (
            <p key={row.icon} className="flex items-start gap-2.5 break-all">
              <Icon name={row.icon} className="mt-1 h-3.5 w-3.5 shrink-0" />
              {row.node}
            </p>
          ))}
        </div>
        {info.length ? (
          <div className="mt-6">
            <h2 className={`${heading} border-b border-white/40 pb-1.5 text-[15px]`}>{L.basic}</h2>
            <ul className="mt-2.5 grid gap-1 text-[12.5px] text-white/85">
              {info.map((row) => (
                <li key={row}>{row}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {side.map((key) => (
          <section key={key} className="mt-6 break-inside-avoid-page">
            <h2 className={`${heading} border-b border-white/40 pb-1.5 text-[15px]`}>{L.sections[key]}</h2>
            <div className="mt-2.5 text-[12.5px]">{body(key, { onDark: true, dense: true })}</div>
          </section>
        ))}
      </aside>
      <div className="px-9 py-10">
        <h1 className={`${heading} text-[32px] leading-tight text-[#1f1f1f]`}>{placeholderName(resume)}</h1>
        {resume.job.title ? <p className={`${heading} mt-1 text-[16px] text-[var(--ri)]`}>{resume.job.title}</p> : null}
        {main.map((key) => (
          <section key={key} className="mt-7 break-inside-avoid-page">
            <h2 className={`${heading} flex items-center gap-2 text-[17px] text-[var(--ri)]`}>
              <Icon name={key} />
              {L.sections[key]}
            </h2>
            <div className="mt-2.5 border-s-2 border-[#ececec] ps-4">{body(key)}</div>
          </section>
        ))}
      </div>
    </div>
  );
}

function Modern({ resume, tests }: Required<Props>) {
  const { visible, body, L } = buildSections(resume, tests);
  const info = basicInfo(resume);
  return (
    <div>
      <header className="bg-[var(--ri)] px-12 pb-8 pt-10 text-white">
        <h1 className={`${heading} text-[34px] leading-tight`}>{placeholderName(resume)}</h1>
        {resume.job.title ? <p className={`${heading} mt-1 text-[17px] text-white/85`}>{resume.job.title}</p> : null}
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/90">
          {contactRows(resume).map((row) => (
            <span key={row.icon} className="flex items-center gap-2">
              <Icon name={row.icon} className="h-3.5 w-3.5" />
              {row.node}
            </span>
          ))}
        </div>
      </header>
      {info.length ? <p className="bg-[#f4f4f4] px-12 py-2.5 text-[12.5px] text-[#555]">{info.join("   •   ")}</p> : null}
      <div className="px-12 py-4">
        {visible.map((key) => (
          <section key={key} className="mt-6 break-inside-avoid-page">
            <h2 className={`${heading} text-[18px] text-[#1f1f1f]`}>{L.sections[key]}</h2>
            <span className="mt-1.5 block h-[4px] w-12 rounded-full bg-[var(--rc)]" />
            <div className="mt-3">{body(key)}</div>
          </section>
        ))}
      </div>
    </div>
  );
}

function Prestige({ resume, tests }: Required<Props>) {
  const { visible, body, L } = buildSections(resume, tests);
  const info = basicInfo(resume);
  return (
    <div className="px-14 py-12">
      <header className="border-y-[3px] border-double border-[var(--rc)] py-6 text-center">
        <h1 className={`${heading} text-[34px] leading-tight tracking-wide text-[#1f1f1f]`}>{placeholderName(resume)}</h1>
        {resume.job.title ? <p className="mt-1.5 text-[16px] tracking-wide text-[var(--ri)]">{resume.job.title}</p> : null}
        <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-[12.5px] text-[#555]">
          {contactRows(resume).map((row) => (
            <span key={row.icon}>{row.node}</span>
          ))}
        </div>
        {info.length ? <p className="mt-2 text-[12.5px] text-[#777]">{info.join("  ·  ")}</p> : null}
      </header>
      {visible.map((key) => (
        <section key={key} className="mt-8 break-inside-avoid-page">
          <h2 className="flex items-center gap-4">
            <span className="h-px flex-1 bg-[var(--rc)]" />
            <span className={`${heading} text-[17px] tracking-wide text-[var(--ri)]`}>{L.sections[key]}</span>
            <span className="h-px flex-1 bg-[var(--rc)]" />
          </h2>
          <div className="mt-4">{body(key)}</div>
        </section>
      ))}
    </div>
  );
}

function Classic({ resume, tests }: Required<Props>) {
  const { visible, body, L } = buildSections(resume, tests);
  const info = basicInfo(resume);
  return (
    <div className="px-12 py-11">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#bdbdbd] pb-5">
        <div>
          <h1 className={`${heading} text-[30px] leading-tight text-[#1f1f1f]`}>{placeholderName(resume)}</h1>
          {resume.job.title ? <p className="mt-1 text-[16px] text-[#444]">{resume.job.title}</p> : null}
        </div>
        <div className="grid gap-1 text-[12.5px] text-[#555]">
          {contactRows(resume).map((row) => (
            <span key={row.icon}>{row.node}</span>
          ))}
        </div>
      </header>
      {info.length ? <p className="mt-3 text-[12.5px] text-[#666]">{info.join("  |  ")}</p> : null}
      {visible.map((key) => (
        <section key={key} className="mt-7 grid grid-cols-[150px_1fr] gap-6 break-inside-avoid-page">
          <h2 className={`${heading} border-s-4 border-[var(--rc)] ps-3 text-[15px] leading-6 text-[#1f1f1f]`}>{L.sections[key]}</h2>
          <div>{body(key)}</div>
        </section>
      ))}
    </div>
  );
}

function Compact({ resume, tests }: Required<Props>) {
  const { visible, body, L } = buildSections(resume, tests);
  const side = visible.filter((key) => sidebarKeys.includes(key));
  const main = visible.filter((key) => !sidebarKeys.includes(key));
  const info = basicInfo(resume);
  const title = (key: SectionKey) => (
    <h2 className={`${heading} bg-[color-mix(in_srgb,var(--rc)_14%,white)] px-2.5 py-1 text-[13.5px] text-[var(--ri)]`}>{L.sections[key]}</h2>
  );
  return (
    <div className="px-9 py-8 text-[12.5px] leading-[1.6]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[var(--rc)] pb-3">
        <div>
          <h1 className={`${heading} text-[26px] leading-tight text-[#1f1f1f]`}>{placeholderName(resume)}</h1>
          {resume.job.title ? <p className={`${heading} text-[14px] text-[var(--ri)]`}>{resume.job.title}</p> : null}
        </div>
        <div className="grid gap-0.5 text-[12px] text-[#555]">
          {contactRows(resume).map((row) => (
            <span key={row.icon} className="flex items-center gap-1.5">
              <Icon name={row.icon} className="h-3 w-3 text-[var(--ri)]" />
              {row.node}
            </span>
          ))}
        </div>
      </header>
      <div className="mt-4 grid grid-cols-[1fr_32%] gap-6">
        <div className="grid content-start gap-4">
          {main.map((key) => (
            <section key={key} className="break-inside-avoid-page">
              {title(key)}
              <div className="mt-2">{body(key, { dense: true })}</div>
            </section>
          ))}
        </div>
        <div className="grid content-start gap-4">
          {info.length ? (
            <section>
              <h2 className={`${heading} bg-[color-mix(in_srgb,var(--rc)_14%,white)] px-2.5 py-1 text-[13.5px] text-[var(--ri)]`}>{L.basic}</h2>
              <ul className="mt-2 grid gap-0.5 text-[#555]">
                {info.map((row) => (
                  <li key={row}>{row}</li>
                ))}
              </ul>
            </section>
          ) : null}
          {side.map((key) => (
            <section key={key} className="break-inside-avoid-page">
              {title(key)}
              <div className="mt-2">{body(key, { dense: true })}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
