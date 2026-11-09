// Shared resume model: types, defaults, sanitising and display helpers.
// Safe to import from both server and client code.

export type ResumeLang = "fa" | "en";
export type Level = 1 | 2 | 3 | 4;

export const templateIds = ["main", "avantgarde", "modern", "prestige", "classic", "compact"] as const;
export type TemplateId = (typeof templateIds)[number];

/** Sections that can be reordered / hidden in the downloaded resume. */
export const sectionKeys = [
  "experience",
  "skills",
  "education",
  "languages",
  "projects",
  "courses",
  "certificates",
  "publications",
  "tests",
  "links",
  "about",
] as const;
export type SectionKey = (typeof sectionKeys)[number];

export const degrees = ["under-diploma", "diploma", "associate", "bachelor", "master", "phd", "seminary"] as const;
export type Degree = (typeof degrees)[number];

export const militaryOptions = ["subject", "done", "medical", "exempt", "serving", "student"] as const;
export type Military = (typeof militaryOptions)[number];

export const linkTypes = ["website", "linkedin", "github", "gitlab", "behance", "dribbble", "instagram", "telegram", "x", "other"] as const;
export type LinkType = (typeof linkTypes)[number];

export type Education = {
  id: string;
  degree: Degree | "";
  field: string;
  university: string;
  gpa: string;
  start: string;
  end: string;
  ongoing: boolean;
  description: string;
};
export type LeveledItem = { id: string; name: string; level: Level };
export type Experience = {
  id: string;
  company: string;
  title: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
};
export type Project = { id: string; title: string; link: string; start: string; end: string; ongoing: boolean; description: string };
export type Course = { id: string; title: string; start: string; end: string; ongoing: boolean; description: string };
export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  serial: string;
  link: string;
  date: string;
  lifetime: boolean;
  description: string;
};
export type Publication = { id: string; title: string; publisher: string; link: string; date: string; description: string };
export type LinkItem = { id: string; type: LinkType; url: string };

export type ResumeContent = {
  personal: {
    fullName: string;
    phone: string;
    email: string;
    gender: "" | "male" | "female";
    birthDay: string;
    birthMonth: string;
    birthYear: string;
    marital: "" | "single" | "married";
    military: Military | "";
  };
  location: { province: string; city: string; address: string; hideAddress: boolean };
  job: { title: string; salary: string; showSalary: boolean };
  about: string;
  education: Education[];
  experience: Experience[];
  skills: LeveledItem[];
  languages: LeveledItem[];
  projects: Project[];
  courses: Course[];
  certificates: Certificate[];
  publications: Publication[];
  links: LinkItem[];
};

export type ResumeDesign = {
  template: TemplateId;
  color: string;
  order: SectionKey[];
  hidden: SectionKey[];
};

export type Resume = ResumeContent &
  ResumeDesign & {
    id: string;
    userId: string;
    title: string;
    lang: ResumeLang;
    createdAt: string;
    updatedAt: string;
  };

export type ResumeSummary = Pick<Resume, "id" | "title" | "lang" | "updatedAt"> & { completion: number };

export const MAX_RESUMES = 20;

export const colors: { value: string; ink: string; name: { fa: string; en: string } }[] = [
  { value: "#7c4dff", ink: "#5b2fd6", name: { fa: "بنفش", en: "Purple" } },
  { value: "#e53935", ink: "#c62828", name: { fa: "قرمز", en: "Red" } },
  { value: "#f57c00", ink: "#c25e00", name: { fa: "نارنجی", en: "Orange" } },
  { value: "#f2c200", ink: "#8a6d00", name: { fa: "زرد", en: "Yellow" } },
  { value: "#00a856", ink: "#007a3e", name: { fa: "سبز", en: "Green" } },
  { value: "#1e78e6", ink: "#1559b0", name: { fa: "آبی", en: "Blue" } },
  { value: "#222222", ink: "#222222", name: { fa: "مشکی", en: "Black" } },
];

export function inkFor(color: string) {
  return colors.find((item) => item.value === color)?.ink ?? color;
}

export const templateNames: Record<TemplateId, { fa: string; en: string }> = {
  main: { fa: "قالب اصلی", en: "Main" },
  avantgarde: { fa: "آوانگارد", en: "Avant-garde" },
  modern: { fa: "مدرن", en: "Modern" },
  prestige: { fa: "پرستیژ", en: "Prestige" },
  classic: { fa: "کلاسیک", en: "Classic" },
  compact: { fa: "کامپکت", en: "Compact" },
};

/** Labels printed on the resume itself — they follow the resume's language, not the site's. */
export const resumeLabels = {
  fa: {
    sections: {
      about: "درباره من",
      education: "سوابق تحصیلی",
      experience: "سوابق کاری",
      skills: "مهارت‌ها",
      languages: "زبان‌های خارجی",
      projects: "پروژه‌ها",
      courses: "دوره‌ها",
      certificates: "مدارک، گواهینامه‌ها و افتخارات",
      publications: "مقالات و کتاب‌ها",
      links: "لینک‌ها و نمونه کارها",
      tests: "تست‌های هوش و شخصیت‌شناسی",
    } as Record<SectionKey, string>,
    basic: "اطلاعات پایه",
    gender: "جنسیت",
    birth: "تاریخ تولد",
    military: "وضعیت سربازی",
    marital: "وضعیت تأهل",
    salary: "حقوق درخواستی",
    from: "از",
    to: "تا",
    present: "اکنون",
    ongoing: "در حال انجام",
    studying: "در حال تحصیل",
    gpa: "معدل",
    issued: "صدور در",
    serial: "شماره",
    lifetime: "اعتبار مادام‌العمر",
    score: "امتیاز",
    levels: ["مبتدی", "متوسط", "پیشرفته", "حرفه‌ای"],
    genders: { male: "آقا", female: "خانم" },
    militaries: {
      subject: "مشمول",
      done: "پایان خدمت",
      medical: "معافیت پزشکی",
      exempt: "معافیت",
      serving: "در حال خدمت",
      student: "معافیت تحصیلی",
    } as Record<Military, string>,
    maritals: { single: "مجرد", married: "متأهل" },
    degrees: {
      "under-diploma": "زیر دیپلم",
      diploma: "دیپلم",
      associate: "کاردانی",
      bachelor: "کارشناسی",
      master: "کارشناسی ارشد",
      phd: "دکتری",
      seminary: "حوزوی",
    } as Record<Degree, string>,
    months: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"],
    province: "استان",
  },
  en: {
    sections: {
      about: "About me",
      education: "Education",
      experience: "Work experience",
      skills: "Skills",
      languages: "Languages",
      projects: "Projects",
      courses: "Courses",
      certificates: "Certificates & awards",
      publications: "Publications",
      links: "Links & portfolio",
      tests: "Assessments",
    } as Record<SectionKey, string>,
    basic: "Basic info",
    gender: "Gender",
    birth: "Born",
    military: "Military service",
    marital: "Marital status",
    salary: "Expected salary",
    from: "",
    to: "–",
    present: "Present",
    ongoing: "Ongoing",
    studying: "Studying",
    gpa: "GPA",
    issued: "Issued",
    serial: "No.",
    lifetime: "Lifetime",
    score: "Score",
    levels: ["Beginner", "Intermediate", "Advanced", "Expert"],
    genders: { male: "Male", female: "Female" },
    militaries: {
      subject: "Not completed",
      done: "Completed",
      medical: "Medical exemption",
      exempt: "Exempt",
      serving: "Serving",
      student: "Student deferment",
    } as Record<Military, string>,
    maritals: { single: "Single", married: "Married" },
    degrees: {
      "under-diploma": "Below diploma",
      diploma: "High school diploma",
      associate: "Associate degree",
      bachelor: "Bachelor's",
      master: "Master's",
      phd: "PhD",
      seminary: "Seminary",
    } as Record<Degree, string>,
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    province: "",
  },
};

export const linkTypeNames: Record<LinkType, string> = {
  website: "Website",
  linkedin: "LinkedIn",
  github: "GitHub",
  gitlab: "GitLab",
  behance: "Behance",
  dribbble: "Dribbble",
  instagram: "Instagram",
  telegram: "Telegram",
  x: "X (Twitter)",
  other: "Link",
};

const faDigits = "۰۱۲۳۴۵۶۷۸۹";

/** Converts Latin digits to Persian digits for Persian resumes. */
export function digits(value: string, lang: ResumeLang) {
  if (lang !== "fa") return value;
  return value.replace(/\d/g, (d) => faDigits[Number(d)]);
}

/** Stored dates are "YYYY-MM" (Jalali year for fa resumes, Gregorian for en). */
export function formatMonth(value: string, lang: ResumeLang) {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return digits(value, lang);
  const month = resumeLabels[lang].months[Number(match[2]) - 1] ?? "";
  return digits(`${month} ${match[1]}`.trim(), lang);
}

export function formatRange(start: string, end: string, current: boolean, lang: ResumeLang, currentLabel?: string) {
  const L = resumeLabels[lang];
  const from = start ? formatMonth(start, lang) : "";
  const to = current ? currentLabel ?? L.present : end ? formatMonth(end, lang) : "";
  if (!from && !to) return "";
  return [from, to].filter(Boolean).join(" - ");
}

export function currentYear(lang: ResumeLang) {
  const year = new Date().getFullYear();
  return lang === "fa" ? year - 621 : year;
}

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function emptyContent(): ResumeContent {
  return {
    personal: {
      fullName: "",
      phone: "",
      email: "",
      gender: "",
      birthDay: "",
      birthMonth: "",
      birthYear: "",
      marital: "",
      military: "",
    },
    location: { province: "", city: "", address: "", hideAddress: true },
    job: { title: "", salary: "", showSalary: false },
    about: "",
    education: [],
    experience: [],
    skills: [],
    languages: [],
    projects: [],
    courses: [],
    certificates: [],
    publications: [],
    links: [],
  };
}

export function defaultDesign(): ResumeDesign {
  return { template: "main", color: colors[0].value, order: [...sectionKeys], hidden: [] };
}

/** How complete the resume is, 0–100 — shown next to the resume name like e-estekhdam's panel. */
export function completion(r: ResumeContent) {
  const checks = [
    Boolean(r.personal.fullName),
    Boolean(r.personal.phone || r.personal.email),
    Boolean(r.personal.gender && r.personal.birthYear),
    Boolean(r.location.province && r.location.city),
    Boolean(r.job.title),
    r.experience.length > 0,
    r.skills.length >= 3,
    r.education.length > 0,
    r.languages.length > 0,
    Boolean(r.about.trim()) || r.projects.length + r.courses.length + r.certificates.length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

// ---------- sanitising (used by the API before anything is stored) ----------

function str(value: unknown, max = 200) {
  return typeof value === "string" ? value.slice(0, max) : "";
}
function bool(value: unknown) {
  return value === true;
}
function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}
function list<T>(value: unknown, map: (row: Record<string, unknown>) => T, max = 30): T[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((row): row is Record<string, unknown> => typeof row === "object" && row !== null)
    .slice(0, max)
    .map(map);
}
function rowId(row: Record<string, unknown>) {
  const id = str(row.id, 20);
  return /^[a-z0-9]+$/i.test(id) ? id : newId();
}
function level(value: unknown): Level {
  const n = Number(value);
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : 3;
}
function month(value: unknown) {
  const text = str(value, 7);
  return /^\d{4}-\d{2}$/.test(text) ? text : "";
}
function num(value: unknown, max: number) {
  const text = str(value, 4).replace(/\D/g, "");
  return text && Number(text) >= 1 && Number(text) <= max ? text : "";
}
/** Only http(s) links are kept, so nothing like javascript: can reach the page. */
export function cleanUrl(value: unknown) {
  const text = str(value, 300).trim();
  if (!text) return "";
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(text) ? text : `https://${text}`;
  return /^https?:\/\/[^\s]+$/i.test(withScheme) ? withScheme : "";
}

export function sanitizeContent(input: unknown): ResumeContent {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const p = (raw.personal ?? {}) as Record<string, unknown>;
  const loc = (raw.location ?? {}) as Record<string, unknown>;
  const j = (raw.job ?? {}) as Record<string, unknown>;
  return {
    personal: {
      fullName: str(p.fullName, 80),
      phone: str(p.phone, 30),
      email: str(p.email, 120),
      gender: oneOf(p.gender, ["", "male", "female"] as const, ""),
      birthDay: num(p.birthDay, 31),
      birthMonth: num(p.birthMonth, 12),
      birthYear: num(p.birthYear, 9999),
      marital: oneOf(p.marital, ["", "single", "married"] as const, ""),
      military: oneOf(p.military, ["", ...militaryOptions] as const, ""),
    },
    location: {
      province: str(loc.province, 60),
      city: str(loc.city, 60),
      address: str(loc.address, 200),
      hideAddress: loc.hideAddress === undefined ? true : bool(loc.hideAddress),
    },
    job: { title: str(j.title, 100), salary: str(j.salary, 60), showSalary: bool(j.showSalary) },
    about: str(raw.about, 2000),
    education: list(raw.education, (r) => ({
      id: rowId(r),
      degree: oneOf(r.degree, ["", ...degrees] as const, ""),
      field: str(r.field, 120),
      university: str(r.university, 120),
      gpa: str(r.gpa, 10),
      start: month(r.start),
      end: month(r.end),
      ongoing: bool(r.ongoing),
      description: str(r.description, 800),
    })),
    experience: list(raw.experience, (r) => ({
      id: rowId(r),
      company: str(r.company, 120),
      title: str(r.title, 120),
      start: month(r.start),
      end: month(r.end),
      current: bool(r.current),
      description: str(r.description, 1500),
    })),
    skills: list(raw.skills, (r) => ({ id: rowId(r), name: str(r.name, 60), level: level(r.level) }), 60),
    languages: list(raw.languages, (r) => ({ id: rowId(r), name: str(r.name, 40), level: level(r.level) }), 10),
    projects: list(raw.projects, (r) => ({
      id: rowId(r),
      title: str(r.title, 120),
      link: cleanUrl(r.link),
      start: month(r.start),
      end: month(r.end),
      ongoing: bool(r.ongoing),
      description: str(r.description, 1000),
    })),
    courses: list(raw.courses, (r) => ({
      id: rowId(r),
      title: str(r.title, 120),
      start: month(r.start),
      end: month(r.end),
      ongoing: bool(r.ongoing),
      description: str(r.description, 600),
    })),
    certificates: list(raw.certificates, (r) => ({
      id: rowId(r),
      title: str(r.title, 120),
      issuer: str(r.issuer, 120),
      serial: str(r.serial, 60),
      link: cleanUrl(r.link),
      date: month(r.date),
      lifetime: bool(r.lifetime),
      description: str(r.description, 600),
    })),
    publications: list(raw.publications, (r) => ({
      id: rowId(r),
      title: str(r.title, 160),
      publisher: str(r.publisher, 120),
      link: cleanUrl(r.link),
      date: month(r.date),
      description: str(r.description, 600),
    })),
    links: list(raw.links, (r) => ({ id: rowId(r), type: oneOf(r.type, linkTypes, "other"), url: cleanUrl(r.url) }), 12).filter(
      (l) => l.url,
    ),
  };
}

export function sanitizeDesign(input: unknown): ResumeDesign {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const base = defaultDesign();
  const order = Array.isArray(raw.order)
    ? raw.order.filter((key, index, all): key is SectionKey => sectionKeys.includes(key) && all.indexOf(key) === index)
    : base.order;
  // Keep every section in the order, even if an older client left one out.
  for (const key of sectionKeys) if (!order.includes(key)) order.push(key);
  return {
    template: oneOf(raw.template, templateIds, base.template),
    color: colors.some((c) => c.value === raw.color) ? (raw.color as string) : base.color,
    order,
    hidden: Array.isArray(raw.hidden)
      ? raw.hidden.filter((key, i, all): key is SectionKey => sectionKeys.includes(key) && all.indexOf(key) === i)
      : [],
  };
}

export function summarize(resume: Resume): ResumeSummary {
  return {
    id: resume.id,
    title: resume.title,
    lang: resume.lang,
    updatedAt: resume.updatedAt,
    completion: completion(resume),
  };
}

/** Sample data for template thumbnails on the landing page. */
export function sampleResume(lang: ResumeLang, design?: Partial<ResumeDesign>): Resume {
  const fa = lang === "fa";
  return {
    id: "sample",
    userId: "",
    title: "",
    lang,
    createdAt: "",
    updatedAt: "",
    ...defaultDesign(),
    ...design,
    personal: {
      fullName: fa ? "سارا احمدی" : "Sara Ahmadi",
      phone: "0912 000 0000",
      email: "sara@example.com",
      gender: "female",
      birthDay: "",
      birthMonth: "",
      birthYear: fa ? "1374" : "1995",
      marital: "single",
      military: "",
    },
    location: { province: fa ? "تهران" : "Tehran", city: fa ? "تهران" : "Tehran", address: "", hideAddress: true },
    job: { title: fa ? "کارشناس دیجیتال مارکتینگ" : "Digital Marketing Specialist", salary: "", showSalary: false },
    about: fa
      ? "پنج سال تجربه در برنامه‌ریزی کمپین، تولید محتوا و تحلیل داده‌های بازاریابی."
      : "Five years planning campaigns, producing content and analysing marketing data.",
    education: [
      {
        id: "e1",
        degree: "master",
        field: fa ? "مدیریت بازرگانی" : "Business Management",
        university: fa ? "دانشگاه تهران" : "University of Tehran",
        gpa: "17.8",
        start: fa ? "1396-07" : "2017-09",
        end: fa ? "1398-11" : "2020-02",
        ongoing: false,
        description: "",
      },
    ],
    experience: [
      {
        id: "x1",
        company: fa ? "شرکت نمونه" : "Sample Co.",
        title: fa ? "کارشناس ارشد بازاریابی" : "Senior Marketing Specialist",
        start: fa ? "1399-02" : "2020-05",
        end: "",
        current: true,
        description: fa
          ? "افزایش ۳۵ درصدی فروش آنلاین در یک سال با بازطراحی قیف بازاریابی."
          : "Grew online sales by 35% in one year by redesigning the funnel.",
      },
      {
        id: "x2",
        company: fa ? "آژانس خلاق" : "Creative Agency",
        title: fa ? "کارشناس تولید محتوا" : "Content Specialist",
        start: fa ? "1397-01" : "2018-04",
        end: fa ? "1399-01" : "2020-04",
        current: false,
        description: "",
      },
    ],
    skills: [
      { id: "s1", name: fa ? "سئو" : "SEO", level: 4 },
      { id: "s2", name: "Google Analytics", level: 3 },
      { id: "s3", name: fa ? "تولید محتوا" : "Content writing", level: 4 },
      { id: "s4", name: fa ? "کار تیمی" : "Teamwork", level: 3 },
    ],
    languages: [{ id: "l1", name: fa ? "انگلیسی" : "English", level: 3 }],
    projects: [],
    courses: [
      {
        id: "c1",
        title: fa ? "دیجیتال مارکتینگ پیشرفته" : "Advanced Digital Marketing",
        start: fa ? "1400-03" : "2021-06",
        end: fa ? "1400-06" : "2021-09",
        ongoing: false,
        description: "",
      },
    ],
    certificates: [],
    publications: [],
    links: [{ id: "k1", type: "linkedin", url: "https://linkedin.com" }],
  };
}
