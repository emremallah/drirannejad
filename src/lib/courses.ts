import type { Course, CourseCategory, Locale } from "./types";

export const courses: Course[] = [
  {
    slug: "financial-intelligence",
    featured: true,
    category: "finance",
    price: 450000,
    duration: { fa: "مینی‌دوره", en: "Mini-course" },
    format: { fa: "آنلاین", en: "Online" },
    level: { fa: "مقدماتی تا کاربردی", en: "Beginner to practical" },
    cover: "#1763d6",
    image: "/courses/financial-intelligence.jpg",
    fa: {
      title: "مینی دوره هوش مالی",
      subtitle: "مسیر نهایی ثروت‌آفرینی؛ از کنترل درآمد تا آزادی مالی",
      excerpt: "از کنترل درآمد تا آزادی مالی — مهارت هوش مالی را یاد بگیرید.",
      description:
        "آیا تا به حال فکر کرده‌اید چرا بعضی افراد با درآمد کمتر زندگی مرفه‌تری دارند، در حالی که بعضی دیگر با وجود درآمد بالا همیشه نگران حساب بانکی‌شان هستند؟ راز این تفاوت در هوش مالی است؛ مهارتی که در مدرسه یا دانشگاه به ما یاد ندادند. در این مینی‌دوره یاد می‌گیرید چطور مثل یک سرمایه‌گذار حرفه‌ای فکر کنید، پول‌تان را مدیریت کنید و آن را برای خودتان به کار بگیرید.",
      outcomes: [
        {
          title: "فرمول طلایی مدیریت درآمد",
          detail: "یادگیری روش‌های نوین بودجه‌بندی و پس‌انداز هوشمندانه",
        },
        {
          title: "آشنایی با مهارت سرمایه‌گذاری",
          detail: "شناخت پایه‌های ساخت دارایی و فرار از تله تورم",
        },
        {
          title: "اصلاح عادت‌های مخرب مالی",
          detail: "شناسایی و حذف ترمزهای پنهان در مسیر ثروت‌آفرینی",
        },
        {
          title: "کاربردی و نتیجه‌محور",
          detail: "بدون اصطلاحات پیچیده، مستقیم سراغ راهکارهای عملی می‌رویم",
        },
      ],
      cta: "ثبت‌نام فوری در مینی دوره هوش مالی",
    },
    en: {
      title: "Financial Intelligence Mini-Course",
      subtitle:
        "The ultimate path to wealth creation — from income control to financial freedom",
      excerpt:
        "From income control to financial freedom — learn the skill of financial intelligence.",
      description:
        "Have you ever wondered why some people live more comfortably on a smaller income, while others with high earnings constantly worry about their bank balance? The secret is financial intelligence — a skill they never taught us at school or university. In this mini-course you learn to think like a professional investor, manage your money, and put it to work for you.",
      outcomes: [
        {
          title: "The golden formula for income management",
          detail: "Modern budgeting methods and smart saving",
        },
        {
          title: "Investment fundamentals",
          detail: "Building assets and escaping the inflation trap",
        },
        {
          title: "Fix destructive money habits",
          detail: "Find and remove the hidden brakes on wealth creation",
        },
        {
          title: "Practical and results-driven",
          detail: "No jargon — straight to actionable solutions",
        },
      ],
      cta: "Enroll now in the financial intelligence mini-course",
    },
  },
  {
    slug: "emotional-intelligence",
    featured: true,
    category: "eq",
    price: 450000,
    duration: { fa: "دوره جامع", en: "Comprehensive" },
    format: { fa: "آفلاین + پشتیبانی", en: "Offline + support" },
    level: { fa: "تخصصی / تربیت مدرس", en: "Advanced / trainer track" },
    cover: "#0d3f8f",
    image: "/courses/emotional-intelligence.jpg",
    fa: {
      title: "دوره جامع تربیت مدرس هوش هیجانی و ارتباطات",
      subtitle: "کلید طلایی روابط موفق؛ هوش هیجانی را قفل‌گشایی کنید",
      excerpt: "کلید طلایی روابط موفق — هوش هیجانی (EQ) و هنر ارتباطات.",
      description:
        "موفقیت در کسب‌وکار، روابط شخصی و جایگاه اجتماعی به نحوه ارتباط ما با دیگران وابسته است. هوش هیجانی مهارتی است که تعیین می‌کند چه کسی در دنیای پرچالش امروز ماندگار شود و صعود کند. در این دوره یاد می‌گیرید احساسات خود و دیگران را مدیریت کنید، مذاکره‌کننده حرفه‌ای شوید و روابطی عمیق، تاثیرگذار و پایدار بسازید.",
      outcomes: [
        {
          title: "تسلط بر مدیریت هیجانات",
          detail: "کنترل استرس و خشم در موقعیت‌های حساس و بحرانی",
        },
        {
          title: "هنر ارتباطات موثر",
          detail: "مهارت‌های پیشرفته نفوذ، همدلی و متقاعدسازی",
        },
        {
          title: "حل تعارضات",
          detail: "تکنیک‌های حرفه‌ای برای مدیریت تنش در محیط کار و زندگی",
        },
        {
          title: "ارتقای هوش اجتماعی",
          detail: "درک زبان بدن و خواندن ناگفته‌های دیگران",
        },
      ],
      extrasTitle: "ویژه ثبت‌نام‌کنندگان",
      extras: [
        "سه مرحله چکاپ رایگان هوش هیجانی (قبل، اواسط و بعد از دوره)",
        "عضویت در طرح «راحت پول دربیار» با کمیسیون ۱۰٪ تا ۳۰٪",
        "دو گواهینامه معتبر مورد تأیید اداره توسعه کارآفرینی استان تهران",
        "ورود به بازار کار به‌عنوان مدرس هوش هیجانی",
        "دعوت به حلقه ارتباطی کارآفرینان و افراد زبده این رشته",
        "نسخه آفلاین همان محتوای حضوری هفتاد میلیون تومانی، با شرایط ویژه",
        "کارت عضویت فیروزه‌ای یک‌ساله باشگاه کارآفرینی",
      ],
      cta: "ثبت‌نام فوری + دریافت چکاپ رایگان",
    },
    en: {
      title: "Comprehensive EQ Trainer & Communication Course",
      subtitle:
        "The golden key to successful relationships — unlock emotional intelligence",
      excerpt:
        "The golden key to successful relationships — emotional intelligence (EQ) and the art of communication.",
      description:
        "Success in business, personal relationships, and social standing depends on how we connect with others. Emotional intelligence is the skill that decides who lasts and who rises. In this course you learn to manage your own and others’ emotions, become a professional negotiator, and build deep, lasting relationships.",
      outcomes: [
        {
          title: "Master emotion management",
          detail: "Control stress and anger in high-pressure situations",
        },
        {
          title: "The art of effective communication",
          detail: "Advanced influence, empathy, and persuasion",
        },
        {
          title: "Conflict resolution",
          detail: "Professional techniques for tension at work and in life",
        },
        {
          title: "Raise your social intelligence",
          detail: "Read body language and unspoken signals",
        },
      ],
      extrasTitle: "Exclusive for enrollees",
      extras: [
        "Three free personal EQ checkups (before, mid-course, and after)",
        "Join the Earn Easily plan with 10%–30% commissions",
        "Two accredited certificates endorsed by Tehran Province Entrepreneurship Development Administration",
        "Enter the job market as an emotional intelligence instructor",
        "Join a special circle of entrepreneurs and field experts",
        "The same content as the 70-million-toman in-person course, offline with a special offer",
        "Free one-year turquoise Entrepreneurship Club membership card",
      ],
      cta: "Enroll now + get a free checkup",
    },
  },
  {
    slug: "ai-animation",
    featured: true,
    category: "ai",
    price: 450000,
    duration: { fa: "ورکشاپ کوتاه‌مدت", en: "Short workshop" },
    format: { fa: "ورکشاپ عملی", en: "Hands-on workshop" },
    level: { fa: "صفر تا بازار کار", en: "Zero to job-ready" },
    cover: "#0f7a5a",
    image: "/courses/ai-animation.jpg",
    fa: {
      title: "ورکشاپ انیمیشن‌سازی با هوش مصنوعی",
      subtitle: "جادوی خلق انیمیشن با هوش مصنوعی؛ از رویا تا پرده جادویی",
      excerpt:
        "از رویا تا پرده جادویی — ورکشاپ کوتاه‌مدت انیمیشن با هوش مصنوعی.",
      description:
        "تا حالا فکر کرده‌اید فاصله ایده یک انیمیشن جذاب تا دیدن خروجی نهایی روی پرده چقدر است؟ پیش از این ماه‌ها زمان، تیم بزرگ و هزینه سنگین لازم بود. امروز هوش مصنوعی قوانین بازی را عوض کرده است. در این ورکشاپ کوتاه و تخصصی یاد می‌گیرید بدون مهارت پیچیده نقاشی یا نرم‌افزار سنگین، داستان، کاراکتر و استوری‌بورد خود را زنده کنید و سریع‌تر وارد بازار کار شوید.",
      outcomes: [
        {
          title: "ساخت انیمیشن بدون پیش‌زمینه سنگین",
          detail: "از ایده و کاراکتر تا خروجی قابل ارائه",
        },
        {
          title: "ورود سریع به بازار کار",
          detail: "مسیر عملی برای ساخت نمونه کار و فروش مهارت",
        },
        {
          title: "ابزارهای روز هوش مصنوعی",
          detail: "یادگیری ابزارهایی که تولید انیمیشن را کوتاه و ممکن می‌کنند",
        },
        {
          title: "نگاه درآمدی به این مهارت",
          detail: "درک ارزش بازار و مسیر کسب درآمد از انیمیشن",
        },
      ],
      extrasTitle: "شگفتی بزرگ برای هنرجویان",
      extras: [
        "شهریه استثنایی برای ورود به یک مهارت پردرآمد",
        "اکانت اختصاصی ۱۸ ماهه ابزارهای پیشرفته انیمیشن‌سازی با هوش مصنوعی",
        "اینترنت پرو و وی‌پی‌ان پرسرعت برای دسترسی پایدار به پلتفرم‌های جهانی",
        "پکیج کامل ابزارها با شرایط ویژه ثبت‌نام",
      ],
      cta: "رزرو صندلی ورکشاپ انیمیشن",
    },
    en: {
      title: "AI Animation Workshop",
      subtitle:
        "The magic of creating animation with AI — from dream to the magic screen",
      excerpt:
        "From dream to the magic screen — a short workshop on animation with artificial intelligence.",
      description:
        "There used to be a long gap between imagining a stunning animation and seeing it on screen: months, large teams, and huge budgets. Artificial intelligence has rewritten those rules. In this short, specialized workshop you learn to bring stories, characters, and storyboards to life without complex drawing skills or heavy software — and enter the market faster.",
      outcomes: [
        {
          title: "Animate without a heavy background",
          detail: "From idea and character to a presentable result",
        },
        {
          title: "A faster path to work",
          detail: "A practical route to a portfolio and selling the skill",
        },
        {
          title: "Current AI tools",
          detail: "Learn the tools that make animation shorter and possible",
        },
        {
          title: "An income-aware skill",
          detail: "Understand the market and how this craft can earn",
        },
      ],
      extrasTitle: "A big surprise for students",
      extras: [
        "Special tuition for entering a high-income skill",
        "18-month dedicated access to advanced AI animation tools",
        "Pro internet and high-speed VPN for stable access to global platforms",
        "Full tools package with a special enrollment offer",
      ],
      cta: "Reserve your workshop seat",
    },
  },
  {
    slug: "fan-bayan",
    featured: false,
    category: "speaking",
    price: 15000000,
    duration: { fa: "۲۴ ساعت", en: "24 hours" },
    format: { fa: "آفلاین + منتور", en: "Offline + mentor" },
    level: { fa: "جامع", en: "Complete" },
    cover: "#1554b8",
    image: "/courses/fan-bayan.jpg",
    fa: {
      title: "دوره جامع فن بیان و سخنرانی",
      subtitle: "صدای شما باید شنیده شود",
      excerpt:
        "هوش کلامی، زبان بدن، کنترل استرس و ساختار سخنرانی حرفه‌ای.",
      description:
        "دوره جامع فن بیان برای کسانی است که می‌خواهند در جمع آرام بمانند، واضح حرف بزنند و اثر بگذارند. از موانع ذهنی تا ساخت صدا، از لحن تا ساختار معرفی خود، مسیر تمرین قدم‌به‌قدم طراحی شده است.",
      outcomes: [
        {
          title: "هوش کلامی و حاضرجوابی",
          detail: "تمرین پاسخ‌های دقیق و باوقار در لحظه",
        },
        {
          title: "زبان بدن و میمیک",
          detail: "هماهنگ کردن حضور با حرفی که می‌زنید",
        },
        {
          title: "کنترل استرس جلوی جمع",
          detail: "روش‌های عملی برای آرامش قبل و هنگام سخنرانی",
        },
        {
          title: "ساختار سخنرانی حرفه‌ای",
          detail: "معرفی خود، روایت و جمع‌بندی اثرگذار",
        },
      ],
      extras: [
        "۲۴ ساعت آموزش آفلاین قابل دانلود",
        "۶۰ روز پشتیبانی با منتور تخصصی",
        "تمرین عملی قدم‌به‌قدم فن بیان",
      ],
      extrasTitle: "خدمات دوره",
      cta: "ثبت‌نام در دوره جامع فن بیان",
    },
    en: {
      title: "Complete Public Speaking Course",
      subtitle: "Your voice should be heard",
      excerpt:
        "Verbal agility, body language, stress control, and a professional speech structure.",
      description:
        "This complete speaking course is for people who want to stay calm in a room, speak clearly, and leave a mark. From mental blocks to voice, tone, and self-introduction, the practice path is step by step.",
      outcomes: [
        {
          title: "Verbal agility",
          detail: "Practice precise, composed replies in the moment",
        },
        {
          title: "Body language and expression",
          detail: "Align your presence with what you say",
        },
        {
          title: "Stress control in public",
          detail: "Practical calm before and during a talk",
        },
        {
          title: "Professional speech structure",
          detail: "Introduction, story, and a lasting close",
        },
      ],
      extras: [
        "24 hours of downloadable offline training",
        "60 days of specialist mentor support",
        "Step-by-step speaking practice",
      ],
      extrasTitle: "What’s included",
      cta: "Enroll in the complete speaking course",
    },
  },
  {
    slug: "communication-360",
    featured: false,
    category: "speaking",
    price: 8900000,
    duration: { fa: "۴ ماه", en: "4 months" },
    format: { fa: "ترکیبی", en: "Blended" },
    level: { fa: "پیشرفته", en: "Advanced" },
    cover: "#334155",
    image: "/courses/communication-360.jpg",
    fa: {
      title: "ارتباطات ۳۶۰ درجه",
      subtitle: "همه‌فن‌حریف شدن در ارتباطات",
      excerpt:
        "مسیر چهارماهه برای ارتباط عمیق‌تر در کار، خانواده و جایگاه اجتماعی.",
      description:
        "ارتباطات ۳۶۰ درجه برای کسی است که می‌خواهد در همه میدان‌ها بهتر شنیده شود؛ از جلسه کاری تا گفت‌وگوی سخت خانوادگی. آموزش ویدیویی، همراهی زنده و تمرین مداوم در یک مسیر چهارماهه جمع شده است.",
      outcomes: [
        {
          title: "ارتباط در موقعیت‌های واقعی",
          detail: "تمرین برای کار، فروش، خانواده و جمع‌های رسمی",
        },
        {
          title: "عمق و تداوم",
          detail: "چهار ماه آموزش، نه یک کارگاه یک‌روزه",
        },
        {
          title: "پرسش و پاسخ با مدرس",
          detail: "فضای مطرح کردن مسئله‌های واقعی",
        },
        {
          title: "شبکه رشد",
          detail: "همراهی با گروهی که روی مهارت ارتباطی کار می‌کنند",
        },
      ],
      extras: [
        "آموزش ویدیویی و جلسات زنده تعمیق",
        "امکان پرسش مستقیم از استاد",
        "پشتیبانی منتور در طول مسیر",
      ],
      extrasTitle: "خدمات دوره",
      cta: "رزرو مسیر ارتباطات ۳۶۰ درجه",
    },
    en: {
      title: "360° Communication",
      subtitle: "Become fluent in every room",
      excerpt:
        "A four-month path to stronger communication at work, at home, and in public.",
      description:
        "360° Communication is for people who want to be heard in every arena — from a work meeting to a hard family conversation. Video lessons, live sessions, and ongoing practice are held together in a four-month path.",
      outcomes: [
        {
          title: "Communication in real situations",
          detail: "Practice for work, sales, family, and formal rooms",
        },
        {
          title: "Depth over time",
          detail: "Four months of training, not a one-day workshop",
        },
        {
          title: "Direct Q&A",
          detail: "Space to bring real problems to the instructor",
        },
        {
          title: "A growth circle",
          detail: "Learn with others who are training the same skill",
        },
      ],
      extras: [
        "Video training and live deepening sessions",
        "Direct questions to the instructor",
        "Mentor support throughout the path",
      ],
      extrasTitle: "What’s included",
      cta: "Reserve the 360° communication path",
    },
  },
  {
    slug: "powerful-me",
    featured: false,
    category: "free",
    price: "free",
    duration: { fa: "شروع سریع", en: "Quick start" },
    format: { fa: "ویدیویی و صوتی", en: "Video and audio" },
    level: { fa: "مقدماتی", en: "Beginner" },
    cover: "#0f7a5a",
    image: "/courses/powerful-me.jpg",
    fa: {
      title: "فن بیان؛ منِ مقتدر",
      subtitle: "شروع رایگان مسیر بیان",
      excerpt: "دوره رایگان ویدیویی و صوتی برای برداشتن اولین قدم فن بیان.",
      description:
        "منِ مقتدر نقطه شروع است؛ برای کسی که می‌خواهد ترس صحبت در جمع را کم کند و با یک مسیر کوتاه، صدای خودش را پیدا کند. این دوره رایگان است تا قبل از دوره‌های جامع، یک تجربه واقعی از روش تدریس آکادمی داشته باشید.",
      outcomes: [
        {
          title: "آشنایی با پایه‌های فن بیان",
          detail: "اولین تمرین‌های صدا، وضوح و اعتماد",
        },
        {
          title: "کاهش ترس شروع",
          detail: "گام‌های کوچک برای صحبت کردن جلوی دیگران",
        },
        {
          title: "تجربه روش آکادمی",
          detail: "ببینید مسیر یادگیری اینجا چطور پیش می‌رود",
        },
      ],
      cta: "شروع رایگان دوره منِ مقتدر",
    },
    en: {
      title: "Speaking: The Powerful Me",
      subtitle: "A free start to your voice",
      excerpt:
        "A free video and audio course for the first step in public speaking.",
      description:
        "The Powerful Me is the starting point for anyone who wants less fear in a room and a short path to their own voice. It is free so you can experience the academy’s teaching before the longer programs.",
      outcomes: [
        {
          title: "Speaking basics",
          detail: "First drills for voice, clarity, and confidence",
        },
        {
          title: "Less fear at the start",
          detail: "Small steps for speaking in front of others",
        },
        {
          title: "A taste of the method",
          detail: "See how learning works at this academy",
        },
      ],
      cta: "Start The Powerful Me for free",
    },
  },
  {
    slug: "body-language",
    featured: false,
    category: "speaking",
    price: 4900000,
    duration: { fa: "۱۲ ساعت", en: "12 hours" },
    format: { fa: "آنلاین", en: "Online" },
    level: { fa: "کاربردی", en: "Practical" },
    cover: "#1e3a5f",
    image: "/courses/body-language.jpg",
    fa: {
      title: "زبان بدن و حضور حرفه‌ای",
      subtitle: "قبل از حرف زدن، دیده می‌شوید",
      excerpt: "حضور، نگاه، حرکت و پیام‌هایی که بدون کلمه منتقل می‌شوند.",
      description:
        "بخش بزرگی از اثرگذاری قبل از شروع حرف اتفاق می‌افتد. این دوره روی حضور، ایستادن، نگاه، دست‌ها و هماهنگی بدن با پیام تمرکز می‌کند تا در جلسه، ارائه و گفت‌وگوی سخت، جدی و آرام به نظر برسید.",
      outcomes: [
        {
          title: "خواندن پیام‌های غیرکلامی",
          detail: "تشخیص نشانه‌های اضطراب، مقاومت و همراهی",
        },
        {
          title: "ساخت حضور معتبر",
          detail: "حالت بدن، نگاه و حرکت در اتاق",
        },
        {
          title: "هماهنگی حرف و بدن",
          detail: "وقتی صدا و حرکت یک پیام می‌دهند",
        },
      ],
      cta: "ثبت‌نام در دوره زبان بدن",
    },
    en: {
      title: "Body Language & Professional Presence",
      subtitle: "You are seen before you speak",
      excerpt:
        "Presence, gaze, movement, and the messages that travel without words.",
      description:
        "A large part of impact happens before the first sentence. This course trains presence, stance, eye contact, hands, and the match between body and message — so you look steady in meetings, talks, and hard conversations.",
      outcomes: [
        {
          title: "Read nonverbal signals",
          detail: "Spot anxiety, resistance, and agreement",
        },
        {
          title: "Build credible presence",
          detail: "Posture, gaze, and movement in the room",
        },
        {
          title: "Align speech and body",
          detail: "When voice and movement carry one message",
        },
      ],
      cta: "Enroll in the body language course",
    },
  },
];

export function getCourse(slug: string) {
  return courses.find((course) => course.slug === slug);
}

export function featuredCourses() {
  return courses.filter((course) => course.featured);
}

export function courseCopy(course: Course, locale: Locale) {
  return course[locale];
}

export function filterCourses(category?: CourseCategory | "featured") {
  if (!category) return courses;
  if (category === "featured") return featuredCourses();
  return courses.filter((course) => course.category === category);
}
