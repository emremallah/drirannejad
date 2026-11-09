import { createHash, randomBytes, randomInt, timingSafeEqual } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { normalizeCourseRules, type CourseRules } from "./course-rules";
import { normalizeEarnPlan, type EarnPlan } from "./earn-plan";
import { normalizePhone, toEnglishDigits } from "./phone";
import { sendOtpSms } from "./sms";
import {
  MAX_RESUMES,
  defaultDesign,
  emptyContent,
  sanitizeContent,
  sanitizeDesign,
  summarize,
  type Resume,
  type ResumeLang,
} from "./resume";

const file = path.join(process.cwd(), "data", "store.json");
const SECRET = process.env.CLINIC_SECRET || "irannejad-clinic-verify-2026";

export type User = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  passwordHash: string;
  referralCode: string;
  referredBy?: string;
  wallet: number;
  createdAt: string;
};

export type TestResult = {
  id: string;
  userId?: string;
  name: string;
  phone: string;
  testSlug: string;
  score: number;
  summary: string;
  answers: number[];
  createdAt: string;
  addedToResume?: boolean;
};

export type FormRecord = {
  id: string;
  kind: "consult" | "collaborate" | "dispatch" | "resume" | "gift";
  data: Record<string, string>;
  createdAt: string;
};

export type Progress = {
  userId: string;
  courseSlug: string;
  unlocked: number;
  homework: string[];
};

export type IssuedDoc = {
  id: string;
  type: "card" | "certificate";
  userId: string;
  title: string;
  code: string;
  createdAt: string;
};

export type Pledge = {
  id: string;
  userId: string;
  courseSlug: string;
  acceptedAt: string;
};

export type OtpPurpose = "login" | "reset";

export type OtpRecord = {
  phone: string;
  purpose: OtpPurpose;
  codeHash: string;
  expiresAt: number;
  attempts: number;
  sentAt: number;
  /** Sends inside the current hourly window, to cap SMS spending per number. */
  sendCount: number;
  windowStart: number;
};

export type Store = {
  otps: OtpRecord[];
  users: User[];
  tests: TestResult[];
  forms: FormRecord[];
  progress: Progress[];
  docs: IssuedDoc[];
  earnPlan: EarnPlan;
  courseRules: CourseRules;
  pledges: Pledge[];
  resumes: Resume[];
};

const empty: Store = {
  otps: [],
  users: [],
  tests: [],
  forms: [],
  progress: [],
  docs: [],
  earnPlan: normalizeEarnPlan(),
  courseRules: normalizeCourseRules(),
  pledges: [],
  resumes: [],
};

async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = (raw.trim() ? JSON.parse(raw) : {}) as Partial<Store>;
    return {
      ...empty,
      ...parsed,
      earnPlan: normalizeEarnPlan(parsed.earnPlan),
      courseRules: normalizeCourseRules(parsed.courseRules),
      pledges: Array.isArray(parsed.pledges) ? parsed.pledges : [],
      resumes: Array.isArray(parsed.resumes) ? parsed.resumes : [],
      otps: Array.isArray(parsed.otps) ? parsed.otps : [],
    };
  } catch {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(empty, null, 2));
    return empty;
  }
}

async function writeStore(store: Store) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(store, null, 2));
}

export function hashPassword(password: string) {
  return createHash("sha256").update(`${SECRET}:${password}`).digest("hex");
}

export function makeCode(prefix: string, payload: string) {
  const digest = createHash("sha256")
    .update(`${SECRET}:${prefix}:${payload}`)
    .digest("hex")
    .slice(0, 12)
    .toUpperCase();
  return `${prefix}-${digest.slice(0, 4)}-${digest.slice(4, 8)}-${digest.slice(8, 12)}`;
}

export function verifyCode(code: string) {
  return /^[A-Z]{3,4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/.test(code);
}

export function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function referralCode() {
  return `IRN-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function registerUser(input: {
  name: string;
  phone: string;
  email?: string;
  password: string;
  referredBy?: string;
}) {
  const phone = normalizePhone(input.phone);
  if (!phone) throw new Error("شماره موبایل معتبر نیست. نمونه: 09121234567");
  if (!input.name.trim()) throw new Error("نام را وارد کنید.");
  if (input.password.length < 6) throw new Error("رمز عبور باید حداقل ۶ کاراکتر باشد.");
  const store = await readStore();
  if (findUserByPhone(store, phone)) {
    throw new Error("این شماره قبلاً ثبت شده است.");
  }
  const referrer = input.referredBy
    ? store.users.find((user) => user.referralCode === input.referredBy)
    : undefined;
  const user: User = {
    id: randomBytes(8).toString("hex"),
    name: input.name.trim(),
    phone,
    email: input.email,
    passwordHash: hashPassword(input.password),
    referralCode: referralCode(),
    referredBy: referrer?.referralCode,
    wallet: 0,
    createdAt: new Date().toISOString(),
  };
  store.users.push(user);
  if (referrer) {
    referrer.wallet += store.earnPlan.rewardPerReferral;
  }
  const card: IssuedDoc = {
    id: randomBytes(6).toString("hex"),
    type: "card",
    userId: user.id,
    title: "کارت عضویت باشگاه کارآفرینی",
    code: makeCode("CARD", `${user.id}:${user.phone}`),
    createdAt: user.createdAt,
  };
  store.docs.push(card);
  await writeStore(store);
  return { user, card };
}

function findUserByPhone(store: Store, phone: string) {
  // Older accounts may have been saved before numbers were normalized.
  return store.users.find((item) => item.phone === phone || normalizePhone(item.phone) === phone);
}

export async function loginUser(rawPhone: string, password: string) {
  const phone = normalizePhone(rawPhone);
  const store = await readStore();
  const user = phone ? findUserByPhone(store, phone) : undefined;
  if (!user || !safeEqual(user.passwordHash, hashPassword(password))) {
    throw new Error("شماره یا رمز عبور نادرست است.");
  }
  return user;
}

// ---------------- one-time codes (SMS) ----------------

const OTP_LENGTH = 5;
const OTP_TTL_MS = 3 * 60_000;
const OTP_RESEND_MS = 2 * 60_000;
const OTP_MAX_ATTEMPTS = 5;
const OTP_MAX_SENDS_PER_HOUR = 5;
const HOUR_MS = 60 * 60_000;

function hashOtp(phone: string, purpose: OtpPurpose, code: string) {
  return createHash("sha256").update(`${SECRET}:otp:${purpose}:${phone}:${code}`).digest("hex");
}

/** Sends a login or password-reset code to a registered number. */
export async function requestOtp(rawPhone: string, purpose: OtpPurpose) {
  const phone = normalizePhone(rawPhone);
  if (!phone) throw new Error("شماره موبایل معتبر نیست. نمونه: 09121234567");
  const store = await readStore();
  if (!findUserByPhone(store, phone)) {
    throw new Error("حسابی با این شماره پیدا نشد. ابتدا ثبت‌نام کنید.");
  }

  const now = Date.now();
  store.otps = store.otps.filter((row) => row.windowStart + HOUR_MS > now);
  let row = store.otps.find((item) => item.phone === phone && item.purpose === purpose);

  if (row) {
    const wait = row.sentAt + OTP_RESEND_MS - now;
    if (wait > 0) {
      return { resendIn: Math.ceil(wait / 1000), expiresIn: Math.max(0, Math.ceil((row.expiresAt - now) / 1000)) };
    }
    if (row.sendCount >= OTP_MAX_SENDS_PER_HOUR) {
      throw new Error("تعداد درخواست‌ها زیاد است. یک ساعت دیگر دوباره تلاش کنید.");
    }
  }

  const code = String(randomInt(10 ** (OTP_LENGTH - 1), 10 ** OTP_LENGTH));
  await sendOtpSms(phone, code);

  if (!row) {
    row = { phone, purpose, codeHash: "", expiresAt: 0, attempts: 0, sentAt: 0, sendCount: 0, windowStart: now };
    store.otps.push(row);
  }
  row.codeHash = hashOtp(phone, purpose, code);
  row.expiresAt = now + OTP_TTL_MS;
  row.attempts = 0;
  row.sentAt = now;
  row.sendCount += 1;
  await writeStore(store);
  return { resendIn: OTP_RESEND_MS / 1000, expiresIn: OTP_TTL_MS / 1000 };
}

function consumeOtp(store: Store, phone: string, purpose: OtpPurpose, rawCode: string) {
  const code = toCode(rawCode);
  const row = store.otps.find((item) => item.phone === phone && item.purpose === purpose);
  if (!row || !row.codeHash || row.expiresAt < Date.now()) {
    throw new Error("کد منقضی شده است. دوباره درخواست کد بدهید.");
  }
  if (row.attempts >= OTP_MAX_ATTEMPTS) {
    throw new Error("تعداد تلاش‌ها زیاد بود. کد جدید درخواست کنید.");
  }
  if (!code || !safeEqual(row.codeHash, hashOtp(phone, purpose, code))) {
    row.attempts += 1;
    return false;
  }
  // One-time: the same code can't be used again. Keep the row for rate limiting.
  row.codeHash = "";
  row.expiresAt = 0;
  return true;
}

function toCode(value: string) {
  return toEnglishDigits(String(value ?? "")).replace(/\D/g, "");
}

export async function loginWithOtp(rawPhone: string, code: string) {
  const phone = normalizePhone(rawPhone);
  if (!phone) throw new Error("شماره موبایل معتبر نیست.");
  const store = await readStore();
  const ok = consumeOtp(store, phone, "login", code);
  await writeStore(store);
  if (!ok) throw new Error("کد واردشده نادرست است.");
  const user = findUserByPhone(store, phone);
  if (!user) throw new Error("حسابی با این شماره پیدا نشد.");
  return user;
}

export async function resetPasswordWithOtp(rawPhone: string, code: string, password: string) {
  const phone = normalizePhone(rawPhone);
  if (!phone) throw new Error("شماره موبایل معتبر نیست.");
  if (password.length < 6) throw new Error("رمز عبور باید حداقل ۶ کاراکتر باشد.");
  const store = await readStore();
  const ok = consumeOtp(store, phone, "reset", code);
  const user = ok ? findUserByPhone(store, phone) : undefined;
  if (user) user.passwordHash = hashPassword(password);
  await writeStore(store);
  if (!ok) throw new Error("کد واردشده نادرست است.");
  if (!user) throw new Error("حسابی با این شماره پیدا نشد.");
  return user;
}

export async function getUser(id: string) {
  const store = await readStore();
  return store.users.find((user) => user.id === id) ?? null;
}

export async function publicUser(id: string) {
  const user = await getUser(id);
  if (!user) return null;
  const { passwordHash: _, ...safe } = user;
  return safe;
}

export async function saveTest(result: Omit<TestResult, "id" | "createdAt">) {
  const store = await readStore();
  const row: TestResult = {
    ...result,
    id: randomBytes(6).toString("hex"),
    createdAt: new Date().toISOString(),
  };
  store.tests.push(row);
  await writeStore(store);
  return row;
}

export async function saveForm(kind: FormRecord["kind"], data: Record<string, string>) {
  const store = await readStore();
  const row: FormRecord = {
    id: randomBytes(6).toString("hex"),
    kind,
    data,
    createdAt: new Date().toISOString(),
  };
  store.forms.push(row);
  await writeStore(store);
  return row;
}

export async function getProgress(userId: string, courseSlug: string) {
  const store = await readStore();
  return (
    store.progress.find((item) => item.userId === userId && item.courseSlug === courseSlug) ?? {
      userId,
      courseSlug,
      unlocked: 1,
      homework: [],
    }
  );
}

export async function submitHomework(userId: string, courseSlug: string, note: string) {
  const store = await readStore();
  let row = store.progress.find((item) => item.userId === userId && item.courseSlug === courseSlug);
  if (!row) {
    row = { userId, courseSlug, unlocked: 1, homework: [] };
    store.progress.push(row);
  }
  row.homework.push(note);
  row.unlocked += 1;
  const user = store.users.find((item) => item.id === userId);
  if (user && row.unlocked >= 3) {
    const exists = store.docs.some(
      (doc) => doc.userId === userId && doc.type === "certificate" && doc.title.includes(courseSlug),
    );
    if (!exists) {
      store.docs.push({
        id: randomBytes(6).toString("hex"),
        type: "certificate",
        userId,
        title: `گواهینامه ${courseSlug}`,
        code: makeCode("CERT", `${userId}:${courseSlug}`),
        createdAt: new Date().toISOString(),
      });
    }
  }
  await writeStore(store);
  return row;
}

export async function getEarnPlan() {
  const store = await readStore();
  return store.earnPlan;
}

export async function saveEarnPlan(input: Partial<EarnPlan>) {
  const store = await readStore();
  store.earnPlan = normalizeEarnPlan({ ...store.earnPlan, ...input });
  await writeStore(store);
  return store.earnPlan;
}

export async function adjustWallet(userId: string, delta: number) {
  const store = await readStore();
  const user = store.users.find((item) => item.id === userId);
  if (!user) throw new Error("کاربر پیدا نشد.");
  const change = Number.isFinite(delta) ? Math.round(delta) : 0;
  user.wallet = Math.max(0, user.wallet + change);
  await writeStore(store);
  return user.wallet;
}

export async function getAdmin() {
  const store = await readStore();
  return {
    users: store.users.map(({ passwordHash: _, ...user }) => user),
    tests: store.tests,
    forms: store.forms,
    docs: store.docs,
    earnPlan: store.earnPlan,
    courseRules: store.courseRules,
    pledges: store.pledges,
    referrals: store.users
      .filter((user) => user.referredBy)
      .map((user) => ({
        user: user.name,
        phone: user.phone,
        referredBy: user.referredBy,
        wallet: user.wallet,
      })),
  };
}

export async function findDoc(code: string) {
  const store = await readStore();
  return store.docs.find((doc) => doc.code === code) ?? null;
}

export async function userDocs(userId: string) {
  const store = await readStore();
  return store.docs.filter((doc) => doc.userId === userId);
}

export async function userTests(userId: string) {
  const store = await readStore();
  return store.tests.filter((item) => item.userId === userId);
}

export async function getCourseRules() {
  const store = await readStore();
  return store.courseRules;
}

export async function saveCourseRules(input: Partial<CourseRules>) {
  const store = await readStore();
  store.courseRules = normalizeCourseRules({ ...store.courseRules, ...input });
  await writeStore(store);
  return store.courseRules;
}

export async function hasPledge(userId: string, courseSlug: string) {
  const store = await readStore();
  return store.pledges.some((row) => row.userId === userId && row.courseSlug === courseSlug);
}

export async function savePledge(userId: string, courseSlug: string) {
  const store = await readStore();
  const exists = store.pledges.find((row) => row.userId === userId && row.courseSlug === courseSlug);
  if (exists) return exists;
  const row: Pledge = {
    id: randomBytes(6).toString("hex"),
    userId,
    courseSlug,
    acceptedAt: new Date().toISOString(),
  };
  store.pledges.push(row);
  await writeStore(store);
  return row;
}

export async function attachTestToResume(testId: string) {
  const store = await readStore();
  const row = store.tests.find((item) => item.id === testId);
  if (row) row.addedToResume = true;
  await writeStore(store);
  return row;
}

// ---------------- resumes ----------------

export async function listResumes(userId: string) {
  const store = await readStore();
  return store.resumes
    .filter((row) => row.userId === userId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map(summarize);
}

export async function getResume(id: string, userId: string) {
  const store = await readStore();
  return store.resumes.find((row) => row.id === id && row.userId === userId) ?? null;
}

export async function createResume(
  userId: string,
  input: { lang?: ResumeLang; title?: string; copyOf?: string; template?: unknown; color?: unknown; ifNone?: boolean },
) {
  const store = await readStore();
  const user = store.users.find((item) => item.id === userId);
  if (!user) throw new Error("ابتدا وارد حساب کاربری شوید.");
  const owned = store.resumes.filter((row) => row.userId === userId);
  // The first-visit "main resume" must not be created twice (two tabs, double requests).
  if (input.ifNone && owned.length) return owned[0];
  if (owned.length >= MAX_RESUMES) throw new Error(`حداکثر ${MAX_RESUMES} رزومه می‌توانید داشته باشید.`);

  const now = new Date().toISOString();
  const source = input.copyOf ? owned.find((row) => row.id === input.copyOf) : undefined;
  if (input.copyOf && !source) throw new Error("رزومه پیدا نشد.");

  let row: Resume;
  if (source) {
    const copy = structuredClone(source);
    row = {
      ...copy,
      id: randomBytes(8).toString("hex"),
      title: (input.title?.trim() || `${source.title} (${source.lang === "fa" ? "کپی" : "copy"})`).slice(0, 60),
      createdAt: now,
      updatedAt: now,
    };
  } else {
    const lang: ResumeLang = input.lang === "en" ? "en" : "fa";
    const content = emptyContent();
    // Prefill from the account so the first step isn't empty.
    content.personal.fullName = lang === "fa" ? user.name : "";
    content.personal.phone = user.phone;
    content.personal.email = user.email ?? "";
    row = {
      id: randomBytes(8).toString("hex"),
      userId,
      title: (input.title?.trim() || (lang === "fa" ? "رزومه فارسی" : "English resume")).slice(0, 60),
      lang,
      createdAt: now,
      updatedAt: now,
      ...sanitizeDesign({ ...defaultDesign(), template: input.template, color: input.color }),
      ...content,
    };
  }
  store.resumes.push(row);
  await writeStore(store);
  return row;
}

export async function updateResume(id: string, userId: string, input: Record<string, unknown>) {
  const store = await readStore();
  const index = store.resumes.findIndex((row) => row.id === id && row.userId === userId);
  if (index < 0) return null;
  const current = store.resumes[index];
  const merged = { ...current, ...input };
  const next: Resume = {
    id: current.id,
    userId: current.userId,
    lang: current.lang,
    createdAt: current.createdAt,
    title: typeof input.title === "string" && input.title.trim() ? input.title.trim().slice(0, 60) : current.title,
    updatedAt: new Date().toISOString(),
    ...sanitizeDesign(merged),
    ...sanitizeContent(merged),
  };
  store.resumes[index] = next;
  await writeStore(store);
  return next;
}

export async function deleteResume(id: string, userId: string) {
  const store = await readStore();
  const before = store.resumes.length;
  store.resumes = store.resumes.filter((row) => !(row.id === id && row.userId === userId));
  if (store.resumes.length === before) return false;
  await writeStore(store);
  return true;
}
