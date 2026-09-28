import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { normalizeCourseRules, type CourseRules } from "./course-rules";
import { normalizeEarnPlan, type EarnPlan } from "./earn-plan";

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

export type Store = {
  users: User[];
  tests: TestResult[];
  forms: FormRecord[];
  progress: Progress[];
  docs: IssuedDoc[];
  earnPlan: EarnPlan;
  courseRules: CourseRules;
  pledges: Pledge[];
};

const empty: Store = {
  users: [],
  tests: [],
  forms: [],
  progress: [],
  docs: [],
  earnPlan: normalizeEarnPlan(),
  courseRules: normalizeCourseRules(),
  pledges: [],
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
  const store = await readStore();
  if (store.users.some((user) => user.phone === input.phone)) {
    throw new Error("این شماره قبلاً ثبت شده است.");
  }
  const referrer = input.referredBy
    ? store.users.find((user) => user.referralCode === input.referredBy)
    : undefined;
  const user: User = {
    id: randomBytes(8).toString("hex"),
    name: input.name,
    phone: input.phone,
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
    title: "کارت عضویت فیروزه‌ای",
    code: makeCode("CARD", `${user.id}:${user.phone}`),
    createdAt: user.createdAt,
  };
  store.docs.push(card);
  await writeStore(store);
  return { user, card };
}

export async function loginUser(phone: string, password: string) {
  const store = await readStore();
  const user = store.users.find((item) => item.phone === phone);
  if (!user || !safeEqual(user.passwordHash, hashPassword(password))) {
    throw new Error("شماره یا رمز عبور نادرست است.");
  }
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
