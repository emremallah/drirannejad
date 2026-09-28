export type CourseRules = {
  penaltyBase: number;
  penaltyStep: number;
  penaltyCap: number;
  cancelFee: number;
  sessionMinutes: number;
  examQuestions: number;
  passScore: number;
  examAttempts: number;
};

export const defaultCourseRules: CourseRules = {
  penaltyBase: 5000,
  penaltyStep: 5000,
  penaltyCap: 50000,
  cancelFee: 1000000,
  sessionMinutes: 15,
  examQuestions: 5,
  passScore: 40,
  examAttempts: 2,
};

function amount(value: unknown, fallback: number) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.round(number));
}

export function normalizeCourseRules(input?: Partial<CourseRules> | null): CourseRules {
  const source = input ?? {};
  return {
    penaltyBase: amount(source.penaltyBase, defaultCourseRules.penaltyBase),
    penaltyStep: amount(source.penaltyStep, defaultCourseRules.penaltyStep),
    penaltyCap: amount(source.penaltyCap, defaultCourseRules.penaltyCap),
    cancelFee: amount(source.cancelFee, defaultCourseRules.cancelFee),
    sessionMinutes: Math.max(1, amount(source.sessionMinutes, defaultCourseRules.sessionMinutes)),
    examQuestions: Math.max(1, amount(source.examQuestions, defaultCourseRules.examQuestions)),
    passScore: Math.min(100, amount(source.passScore, defaultCourseRules.passScore)),
    examAttempts: Math.max(1, amount(source.examAttempts, defaultCourseRules.examAttempts)),
  };
}

export function toman(value: number) {
  return `${value.toLocaleString("fa-IR")} تومان`;
}

export function courseRuleSteps(rules: CourseRules) {
  const needed = Math.max(1, Math.ceil((rules.examQuestions * rules.passScore) / 100));
  return [
    {
      id: "cancel",
      titleFa: "انصراف",
      titleEn: "Withdrawal",
      headingFa: "هزینه دوره و شرایط انصراف چگونه است؟",
      headingEn: "What are the course fee and withdrawal rules?",
      bulletsFa: [
        "پلی‌کلینیک پروفسور ایران‌نژاد (AI) دوره‌ها را با مسیر مشخص و تمرین روزانه ارائه می‌کند تا عادت یادگیری ساخته شود.",
        "با پذیرش قوانین، لازم است دوره را حداقل تا پایان جلسه سوم تکمیل کنید؛ یعنی همه جلسات این بازه را کامل ببینید و تکالیف را منظم انجام دهید. پس از آن، امکان انصراف طبق همین تعهدنامه خواهد بود.",
        "بعد از ورود به نیمه دوره، ملزم هستید مسیر را تا پایان همان مرحله تکمیل کنید و سپس می‌توانید انصراف دهید.",
        "اگر وارد مرحله پایانی شوید، باید دوره را به اتمام برسانید.",
        `در صورتی که به هر دلیلی خارج از بازه‌های مجاز انصراف دهید، شرعاً موظف هستید مبلغ ${toman(rules.cancelFee)} را به پلی‌کلینیک پروفسور ایران‌نژاد (AI) واریز کنید.`,
      ],
      bulletsEn: [
        "Prof. Irannejad (AI) Polyclinic runs courses on a clear daily-practice path so the habit of learning actually forms.",
        "By accepting the rules you must complete at least the first three lessons in full, including homework. After that, withdrawal follows this pledge.",
        "After you enter the second half of the course you must finish that stage before you may withdraw.",
        "If you enter the final stage, you must complete the course.",
        `If you withdraw outside the allowed windows, you are bound to pay ${rules.cancelFee.toLocaleString("en-US")} Toman to Prof. Irannejad (AI) Polyclinic.`,
      ],
    },
    {
      id: "session",
      titleFa: "فرایند هر جلسه",
      titleEn: "Each lesson",
      headingFa: "چگونه جلسات را ببینیم و آزمون دهیم؟",
      headingEn: "How do we watch lessons and take the test?",
      bulletsFa: [
        "هر جلسه از شروع روز (۰۰:۰۰ بامداد) تا انتهای شب (۲۳:۵۹) به مدت ۲۴ ساعت در دسترس است.",
        `جلسات حدود ${rules.sessionMinutes.toLocaleString("fa-IR")} دقیقه هستند.`,
        `در صورتی که در ۲۴ ساعت وقت ندارید، می‌توانید سرعت جلسه را تا ۲ برابر افزایش دهید و در حدود ${Math.max(1, Math.round(rules.sessionMinutes / 2)).toLocaleString("fa-IR")} دقیقه جلسه را مشاهده نمایید.`,
        `بعد از مشاهده جلسه، لازم است در یک آزمون ساده با ${rules.examQuestions.toLocaleString("fa-IR")} سوال شرکت کنید و پس از کسب حداقل نمره ${rules.passScore.toLocaleString("fa-IR")} از ۱۰۰ (یعنی ${needed.toLocaleString("fa-IR")} پاسخ صحیح)، جلسه بعدی در ۱۲ شب برای شما باز می‌شود.`,
        "آزمون نمره منفی ندارد. یعنی پاسخ‌های اشتباه منجر به کسر نمره نخواهد شد.",
        `شما ${rules.examAttempts.toLocaleString("fa-IR")} بار فرصت شرکت در آزمون دارید.`,
        "در بعضی جلسات، نکات عملی ارائه می‌شود که موظفید آن‌ها را در همان روز و یا طی دوره اجرا نمایید.",
      ],
      bulletsEn: [
        "Each lesson is available for 24 hours, from 00:00 to 23:59.",
        `Lessons are about ${rules.sessionMinutes} minutes.`,
        `If you cannot spare the full window, you may watch at up to 2× speed (about ${Math.max(1, Math.round(rules.sessionMinutes / 2))} minutes).`,
        `After watching, take a short ${rules.examQuestions}-question test and score at least ${rules.passScore}/100 (${needed} correct). The next lesson opens at midnight.`,
        "There is no negative marking.",
        `You have ${rules.examAttempts} attempts at each test.`,
        "Some lessons include practical notes you must apply the same day or during the course.",
      ],
    },
    {
      id: "fines",
      titleFa: "جریمه‌ها",
      titleEn: "Penalties",
      headingFa: "هدف جریمه چیست و چند نوع جریمه داریم؟",
      headingEn: "Why penalties exist, and which types apply?",
      bulletsFa: [
        "جریمه‌ها برای بازدارندگی هستند. در واقع باید تلاش کنید که جریمه نشوید.",
        "در دوره سه نوع جریمه داریم:",
        `عدم مشاهده جلسه: در صورتی که یک روز کامل غیبت داشته باشید و جلسه را مشاهده نکنید.`,
        "عدم شرکت در آزمون: زمانی که جلسه را مشاهده کنید اما تا پایان زمان مجاز، آزمون را ثبت نکنید.",
        `عدم موفقیت در دو بار آزمون: برای هر جلسه ${rules.examAttempts.toLocaleString("fa-IR")} فرصت آزمون دارید. اگر در هر ${rules.examAttempts.toLocaleString("fa-IR")} نوبت موفق به کسب نمره قبولی نشوید، مشمول جریمه می‌شوید.`,
        `مبلغ پایه هر جریمه ${toman(rules.penaltyBase)} است و برای هر بار تکرار، مبلغ آن ${toman(rules.penaltyStep)} افزایش می‌یابد و تا سقف ${toman(rules.penaltyCap)} ادامه پیدا می‌کند.`,
        "مبلغ اعلام‌شده، مبلغ قابل پرداخت در زمان ثبت‌نام شماست. با توجه به شرایط و سیاست‌های اجرایی دوره، پلی‌کلینیک پروفسور ایران‌نژاد (AI) می‌تواند در طول دوره نسبت به بازنگری و تغییر این مبلغ اقدام کند.",
        "افزایش جریمه برای هر نوع جریمه جداگانه حساب می‌شود.",
        `برای مثال، ممکن است بسته به تعداد دفعات، جریمه «عدم مشاهده جلسه» به ${toman(Math.min(rules.penaltyCap, rules.penaltyBase * 2))} برسد، در حالی که به‌خاطر «عدم شرکت در آزمون» مجبور شوید ${toman(Math.min(rules.penaltyCap, rules.penaltyBase * 5))} پرداخت کنید.`,
      ],
      bulletsEn: [
        "Penalties exist to keep you on the path. The real goal is not to be fined.",
        "There are three penalty types:",
        "Missed lesson: you were absent a full day and did not watch the session.",
        "Missed test: you watched the lesson but did not submit the test in time.",
        `Failed twice: each lesson has ${rules.examAttempts} attempts. If you do not pass, a penalty applies.`,
        `The base fine is ${rules.penaltyBase.toLocaleString("en-US")} Toman, rising by ${rules.penaltyStep.toLocaleString("en-US")} each repeat, up to ${rules.penaltyCap.toLocaleString("en-US")} Toman.`,
        "The published amount is what applies at your enrollment. Prof. Irannejad (AI) Polyclinic may revise it during the course.",
        "Each penalty type is counted separately.",
        `Example: a missed-lesson fine may reach ${Math.min(rules.penaltyCap, rules.penaltyBase * 2).toLocaleString("en-US")} Toman, while a missed-test fine may reach ${Math.min(rules.penaltyCap, rules.penaltyBase * 5).toLocaleString("en-US")} Toman.`,
      ],
    },
    {
      id: "confirm",
      titleFa: "تایید نهایی",
      titleEn: "Final confirm",
      headingFa: "آیا شرعا متعهد می‌شوید که این دوره را با توجه به قوانین مطرح شده و مطابق متن زیر ادامه دهید؟",
      headingEn: "Do you pledge, in good faith, to continue this course under the rules below?",
      bulletsFa: [],
      bulletsEn: [],
    },
  ] as const;
}
