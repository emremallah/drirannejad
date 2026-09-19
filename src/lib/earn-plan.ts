export type EarnStep = {
  id: string;
  titleFa: string;
  titleEn: string;
  textFa: string;
  textEn: string;
};

export type EarnTier = {
  id: string;
  titleFa: string;
  titleEn: string;
  percent: number;
  amount: number;
  textFa: string;
  textEn: string;
};

export type EarnPerk = {
  id: string;
  titleFa: string;
  titleEn: string;
  value: number;
  unitFa: string;
  unitEn: string;
  textFa: string;
  textEn: string;
};

export type EarnPlan = {
  titleFa: string;
  titleEn: string;
  subtitleFa: string;
  subtitleEn: string;
  introFa: string;
  introEn: string;
  rewardPerReferral: number;
  commissionMin: number;
  commissionMax: number;
  steps: EarnStep[];
  tiers: EarnTier[];
  perks: EarnPerk[];
};

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function amount(value: unknown, fallback = 0) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.round(number));
}

function percent(value: unknown, fallback = 0) {
  return Math.min(100, amount(value, fallback));
}

export function newEarnId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export const defaultEarnPlan: EarnPlan = {
  titleFa: "طرح راحت پول دربیار",
  titleEn: "Earn Easily Plan",
  subtitleFa: "با معرفی دوست، پاداش نقدی و کمیسیون دوره بگیر",
  subtitleEn: "Share your code, earn cash rewards and course commissions",
  introFa:
    "بعد از ثبت‌نام یک کد اختصاصی می‌گیرید. هر ثبت‌نام موفق با آن کد، پاداش را به کیف پول شما می‌نشاند و برای فروش دوره‌ها کمیسیون جداگانه محاسبه می‌شود.",
  introEn:
    "After signup you get a personal code. Each successful signup with that code credits your wallet, and course sales pay a separate commission.",
  rewardPerReferral: 50000,
  commissionMin: 10,
  commissionMax: 30,
  steps: [
    {
      id: "step-1",
      titleFa: "ثبت‌نام و دریافت کد",
      titleEn: "Sign up and get a code",
      textFa: "حساب بسازید تا کارت عضویت و کد معرفی اختصاصی صادر شود.",
      textEn: "Create an account to receive your membership card and referral code.",
    },
    {
      id: "step-2",
      titleFa: "لینک را به اشتراک بگذارید",
      titleEn: "Share your link",
      textFa: "لینک یا کد را برای دوستان، هنرجویان و شبکه‌تان بفرستید.",
      textEn: "Send the link or code to friends, students, and your network.",
    },
    {
      id: "step-3",
      titleFa: "ثبت‌نام موفق",
      titleEn: "Successful signup",
      textFa: "وقتی طرف مقابل با کد شما عضو شود، پاداش همان لحظه ثبت می‌شود.",
      textEn: "When someone joins with your code, the reward is added at once.",
    },
    {
      id: "step-4",
      titleFa: "برداشت از کیف پول",
      titleEn: "Use your wallet",
      textFa: "موجودی را در پروفایل ببینید و برای دوره‌ها یا تسویه استفاده کنید.",
      textEn: "Check your balance in the profile and use it for courses or payout.",
    },
  ],
  tiers: [
    {
      id: "tier-1",
      titleFa: "پاداش معرفی",
      titleEn: "Referral reward",
      percent: 0,
      amount: 50000,
      textFa: "به ازای هر ثبت‌نام موفق با کد شما",
      textEn: "For every successful signup with your code",
    },
    {
      id: "tier-2",
      titleFa: "کمیسیون دوره",
      titleEn: "Course commission",
      percent: 10,
      amount: 0,
      textFa: "شروع کمیسیون فروش دوره‌های تخصصی",
      textEn: "Starting commission on specialized course sales",
    },
    {
      id: "tier-3",
      titleFa: "همکاری آموزشی",
      titleEn: "Teaching partnership",
      percent: 30,
      amount: 0,
      textFa: "سقف کمیسیون مدرسان و همکاران طرح",
      textEn: "Top commission for instructors and plan partners",
    },
  ],
  perks: [
    {
      id: "perk-1",
      titleFa: "پاداش هر معرفی",
      titleEn: "Reward per referral",
      value: 50000,
      unitFa: "تومان",
      unitEn: "Toman",
      textFa: "واریز آنی به کیف پول بعد از ثبت‌نام موفق",
      textEn: "Instant wallet credit after a successful signup",
    },
    {
      id: "perk-2",
      titleFa: "کمیسیون دوره",
      titleEn: "Course commission",
      value: 30,
      unitFa: "درصد",
      unitEn: "%",
      textFa: "سقف کمیسیون فروش دوره‌های کلینیک",
      textEn: "Maximum commission on clinic course sales",
    },
    {
      id: "perk-3",
      titleFa: "کد اختصاصی",
      titleEn: "Personal code",
      value: 1,
      unitFa: "کد",
      unitEn: "code",
      textFa: "یک لینک دائمی برای پیگیری معرفی‌ها",
      textEn: "One permanent link to track referrals",
    },
  ],
};

export function emptyEarnStep(): EarnStep {
  return {
    id: newEarnId("step"),
    titleFa: "مرحله جدید",
    titleEn: "New step",
    textFa: "",
    textEn: "",
  };
}

export function emptyEarnTier(): EarnTier {
  return {
    id: newEarnId("tier"),
    titleFa: "سطح جدید",
    titleEn: "New tier",
    percent: 0,
    amount: 0,
    textFa: "",
    textEn: "",
  };
}

export function emptyEarnPerk(): EarnPerk {
  return {
    id: newEarnId("perk"),
    titleFa: "آیتم جدید",
    titleEn: "New perk",
    value: 0,
    unitFa: "تومان",
    unitEn: "Toman",
    textFa: "",
    textEn: "",
  };
}

export function normalizeEarnPlan(input?: Partial<EarnPlan> | null): EarnPlan {
  const source = input ?? {};
  return {
    titleFa: text(source.titleFa, defaultEarnPlan.titleFa),
    titleEn: text(source.titleEn, defaultEarnPlan.titleEn),
    subtitleFa: text(source.subtitleFa, defaultEarnPlan.subtitleFa),
    subtitleEn: text(source.subtitleEn, defaultEarnPlan.subtitleEn),
    introFa: text(source.introFa, defaultEarnPlan.introFa),
    introEn: text(source.introEn, defaultEarnPlan.introEn),
    rewardPerReferral: amount(source.rewardPerReferral, defaultEarnPlan.rewardPerReferral),
    commissionMin: percent(source.commissionMin, defaultEarnPlan.commissionMin),
    commissionMax: percent(source.commissionMax, defaultEarnPlan.commissionMax),
    steps: Array.isArray(source.steps)
      ? source.steps.map((step, index) => ({
          id: text(step?.id, `step-${index + 1}`),
          titleFa: text(step?.titleFa),
          titleEn: text(step?.titleEn),
          textFa: text(step?.textFa),
          textEn: text(step?.textEn),
        }))
      : defaultEarnPlan.steps,
    tiers: Array.isArray(source.tiers)
      ? source.tiers.map((tier, index) => ({
          id: text(tier?.id, `tier-${index + 1}`),
          titleFa: text(tier?.titleFa),
          titleEn: text(tier?.titleEn),
          percent: percent(tier?.percent),
          amount: amount(tier?.amount),
          textFa: text(tier?.textFa),
          textEn: text(tier?.textEn),
        }))
      : defaultEarnPlan.tiers,
    perks: Array.isArray(source.perks)
      ? source.perks.map((perk, index) => ({
          id: text(perk?.id, `perk-${index + 1}`),
          titleFa: text(perk?.titleFa),
          titleEn: text(perk?.titleEn),
          value: amount(perk?.value),
          unitFa: text(perk?.unitFa, "تومان"),
          unitEn: text(perk?.unitEn, "Toman"),
          textFa: text(perk?.textFa),
          textEn: text(perk?.textEn),
        }))
      : defaultEarnPlan.perks,
  };
}
