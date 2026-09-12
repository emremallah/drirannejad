import type { Locale } from "./types";

const fa = {
  brand: "آکادمی دکتر ایران‌نژاد",
  brandShort: "آ",
  nav: {
    home: "خانه",
    courses: "دوره‌ها",
    featured: "منتخب",
    free: "رایگان",
    path: "مسیر یادگیری",
    reviews: "نظرات",
    faq: "سوالات",
    about: "مدرس",
    contact: "تماس",
    more: "بیشتر",
    search: "جستجو",
    searchPlaceholder: "جستجوی دوره...",
  },
  tabs: {
    home: "خانه",
    courses: "دوره‌ها",
    free: "رایگان",
    about: "مدرس",
    more: "بیشتر",
  },
  actions: {
    start: "شروع یادگیری",
    login: "ورود",
    viewCourses: "مشاهده دوره‌ها",
    enroll: "ثبت‌نام در دوره",
    freeCourse: "دوره رایگان",
    back: "بازگشت به دوره‌ها",
    send: "ارسال درخواست",
    sending: "در حال ارسال...",
    sent: "درخواست شما ثبت شد",
    enrollNow: "ثبت‌نام سریع",
    close: "بستن",
    view: "مشاهده دوره",
    empty: "دوره‌ای با این جستجو پیدا نشد.",
  },
  hero: {
    kicker: "فن بیان · هوش هیجانی · مهارت‌های رشد",
    title: "با حال خوب آموزش ببینید تا فردا اثرگذار باشید",
    lead: "آکادمی دکتر ایران‌نژاد دوره‌های فن بیان، ارتباطات، هوش هیجانی و مهارت‌های کاربردی را به فارسی و انگلیسی ارائه می‌کند.",
  },
  stats: {
    students: "آموزش‌پذیر",
    studentsValue: "۳۰۰ هزار+",
    courses: "دوره تخصصی",
    coursesValue: "۷",
    hours: "ساعت آموزش",
    hoursValue: "۱۲۰+",
  },
  sections: {
    featured: "دوره‌های منتخب",
    featuredLead: "سه دوره اصلی همین حالا برای ثبت‌نام آماده‌اند",
    all: "همه دوره‌ها",
    allLead: "مسیر یادگیری را مطابق هدف خود انتخاب کنید",
    instructor: "مدرس آکادمی",
    why: "چرا این آکادمی",
  },
  why: [
    {
      title: "آموزش کاربردی",
      text: "تمرین، بازخورد و مسیر مشخص؛ نه فقط تئوری.",
    },
    {
      title: "محتوای دو زبانه",
      text: "همین دوره‌ها به فارسی و انگلیسی در دسترس هستند.",
    },
    {
      title: "همراهی بعد از دوره",
      text: "ثبت‌نام فقط خرید ویدیو نیست؛ مسیر رشد ادامه دارد.",
    },
  ],
  coursesPage: {
    title: "دوره‌های آموزشی",
    lead: "دوره‌های منتخب و مسیرهای مکمل آکادمی را اینجا ببینید.",
    all: "همه",
    featured: "منتخب",
    finance: "هوش مالی",
    eq: "هوش هیجانی",
    ai: "هوش مصنوعی",
    speaking: "فن بیان",
    free: "رایگان",
  },
  course: {
    instructor: "مدرس",
    instructorName: "دکتر فرشته ایران‌نژاد",
    duration: "مدت",
    format: "نحوه برگزاری",
    level: "سطح",
    tuition: "شهریه",
    outcomes: "آنچه یاد می‌گیرید",
    enrollTitle: "ثبت‌نام در این دوره",
    enrollLead: "فرم را پر کنید تا جزئیات ثبت‌نام برایتان ارسال شود.",
  },
  about: {
    title: "دکتر فرشته ایران‌نژاد",
    role: "مدرس تخصصی سخنرانی، فن بیان و مهارت‌های ارتباطی",
    p1: "او به‌عنوان مشاور و مربی سخنرانی در کنار کارآفرینان، مدیران ارشد و صاحبان کسب‌وکار کار می‌کند.",
    p2: "رسالت آکادمی، ایجاد تحول در سبک ارتباطی ماندگار است؛ با آموزش‌هایی که هم برای زندگی روزمره و هم برای جایگاه حرفه‌ای قابل استفاده‌اند.",
    p3: "بیش از سیصد هزار نفر از آموزش‌های این مسیر استفاده کرده‌اند. حالا همان نگاه، در قالبی روشن و دو زبانه ادامه پیدا می‌کند.",
  },
  contact: {
    title: "تماس و ثبت‌نام",
    lead: "برای مشاوره دوره یا همکاری، پیام بگذارید. در اولین فرصت پاسخ می‌دهیم.",
    phone: "تلفن",
    address: "آدرس",
    addressValue:
      "تهران، صادقیه، ستارخان، خیابان سازمان آب، زیر پل یادگار امام، ضلع غربی فاز یک بازارچه سنتی، ورودی شمالی",
    phones: ["۰۲۱ ۹۱۳۲ ۲۲۹۱۸", "۰۲۱ ۹۱۴۹ ۵۰۵۱"],
  },
  form: {
    name: "نام و نام خانوادگی",
    phone: "شماره تماس",
    email: "ایمیل",
    course: "دوره مورد نظر",
    message: "پیام",
    success:
      "درخواست شما ثبت شد. به‌زودی برای نهایی کردن ثبت‌نام با شما تماس می‌گیریم.",
  },
  footer: {
    blurb:
      "آموزش فن بیان، ارتباطات و مهارت‌های رشد؛ روشن، کاربردی و دو زبانه.",
    rights: "تمامی حقوق برای آکادمی دکتر ایران‌نژاد محفوظ است.",
  },
  faq: {
    title: "سوالات پرتکرار",
    lead: "قبل از ثبت‌نام، پاسخ این سوال‌ها مسیر را روشن‌تر می‌کند.",
    items: [
      {
        q: "دوره‌ها آنلاین هستند یا حضوری؟",
        a: "بیشتر دوره‌ها آنلاین و آفلاین‌اند. مسیر ارتباطات ۳۶۰ درجه به‌صورت ترکیبی برگزار می‌شود.",
      },
      {
        q: "زبان سایت و دوره‌ها چیست؟",
        a: "سایت کاملاً فارسی و انگلیسی است. محتوای هر دوره را به همان زبانی که انتخاب می‌کنید می‌بینید.",
      },
      {
        q: "بعد از پر کردن فرم چه می‌شود؟",
        a: "درخواست ثبت می‌شود و برای نهایی کردن ثبت‌نام با شما تماس می‌گیریم. هنوز پرداخت آنلاین داخل سایت فعال نشده است.",
      },
      {
        q: "از کجا شروع کنم؟",
        a: "اگر تازه‌واردید، دوره رایگان «منِ مقتدر» بهترین شروع است. بعد می‌توانید فن بیان یا هوش هیجانی را انتخاب کنید.",
      },
      {
        q: "گواهینامه دارید؟",
        a: "دوره تربیت مدرس هوش هیجانی شامل گواهینامه است. برای بقیه دوره‌ها جزئیات را در صفحه همان دوره ببینید.",
      },
    ],
  },
  reviews: {
    title: "نظر دانشجویان",
    lead: "صدای کسانی که این مسیر را رفته‌اند.",
    items: [
      {
        name: "سارا م.",
        role: "مدیر فروش",
        text: "بعد از دوره فن بیان، در جلسات دیگر فقط گوش نمی‌کنم؛ حرف می‌زنم و جمع همراهم می‌شود.",
      },
      {
        name: "امیر ر.",
        role: "کارآفرین",
        text: "هوش هیجانی را برای تیم برداشتم. تنش جلسات کمتر شد و مذاکره با مشتری روان‌تر پیش می‌رود.",
      },
      {
        name: "نگار ک.",
        role: "معلم",
        text: "دوره رایگان را در یک عصر تمام کردم. همان تمرین‌های کوتاه، ترس شروع را کم کرد.",
      },
    ],
  },
  path: {
    title: "مسیر یادگیری",
    lead: "اگر نمی‌دانید از کجا شروع کنید، این ترتیب ساده‌ترین راه است.",
    steps: [
      {
        title: "شروع رایگان",
        text: "با «منِ مقتدر» صدا و اعتماد اولیه را بسازید.",
        href: "/courses/powerful-me",
      },
      {
        title: "حضور و بیان",
        text: "فن بیان یا زبان بدن را انتخاب کنید تا در جمع دیده شوید.",
        href: "/courses/fan-bayan",
      },
      {
        title: "عمق ارتباط",
        text: "هوش هیجانی و ارتباطات ۳۶۰ درجه برای روابط پایدار.",
        href: "/courses/emotional-intelligence",
      },
      {
        title: "مهارت مکمل",
        text: "هوش مالی یا انیمیشن با هوش مصنوعی، مسیر شغلی را بازتر می‌کند.",
        href: "/courses?topic=featured",
      },
    ],
  },
};

const en: typeof fa = {
  brand: "Dr. Irannejad Academy",
  brandShort: "A",
  nav: {
    home: "Home",
    courses: "Courses",
    featured: "Featured",
    free: "Free",
    path: "Learning path",
    reviews: "Reviews",
    faq: "FAQ",
    about: "Instructor",
    contact: "Contact",
    more: "More",
    search: "Search",
    searchPlaceholder: "Search courses...",
  },
  tabs: {
    home: "Home",
    courses: "Courses",
    free: "Free",
    about: "Instructor",
    more: "More",
  },
  actions: {
    start: "Start learning",
    login: "Sign in",
    viewCourses: "Browse courses",
    enroll: "Enroll now",
    freeCourse: "Free course",
    back: "Back to courses",
    send: "Send request",
    sending: "Sending...",
    sent: "Request received",
    enrollNow: "Enroll now",
    close: "Close",
    view: "View course",
    empty: "No course matched this search.",
  },
  hero: {
    kicker: "Speaking · Emotional intelligence · Growth skills",
    title: "Learn well today. Be heard tomorrow.",
    lead: "Dr. Irannejad Academy offers speaking, communication, emotional intelligence, and practical growth courses in Persian and English.",
  },
  stats: {
    students: "learners",
    studentsValue: "300k+",
    courses: "courses",
    coursesValue: "7",
    hours: "hours of teaching",
    hoursValue: "120+",
  },
  sections: {
    featured: "Featured courses",
    featuredLead: "The three core programs are open for enrollment",
    all: "All courses",
    allLead: "Choose the path that matches your goal",
    instructor: "Meet the instructor",
    why: "Why this academy",
  },
  why: [
    {
      title: "Practical training",
      text: "Practice, feedback, and a clear path — not theory alone.",
    },
    {
      title: "Truly bilingual",
      text: "The same courses are available in Persian and English.",
    },
    {
      title: "Support after class",
      text: "Enrollment is the start of a growth path, not just a video pack.",
    },
  ],
  coursesPage: {
    title: "Courses",
    lead: "Featured programs and complementary academy paths, in one place.",
    all: "All",
    featured: "Featured",
    finance: "Finance",
    eq: "EQ",
    ai: "AI",
    speaking: "Speaking",
    free: "Free",
  },
  course: {
    instructor: "Instructor",
    instructorName: "Dr. Fereshteh Irannejad",
    duration: "Duration",
    format: "Format",
    level: "Level",
    tuition: "Tuition",
    outcomes: "What you will learn",
    enrollTitle: "Enroll in this course",
    enrollLead: "Fill in the form and we will send you the enrollment details.",
  },
  about: {
    title: "Dr. Fereshteh Irannejad",
    role: "Instructor of public speaking, expression, and communication skills",
    p1: "She coaches entrepreneurs, senior managers, and business owners on presence, speaking, and lasting communication.",
    p2: "The academy exists to change how people are heard — with training that works in daily life and in professional rooms.",
    p3: "More than 300,000 learners have taken this path. The same work now continues in a clear, bilingual classroom.",
  },
  contact: {
    title: "Contact & enrollment",
    lead: "Write for course advice or collaboration. We will get back to you shortly.",
    phone: "Phone",
    address: "Address",
    addressValue:
      "Tehran, Sadeghieh, Sattarkhan, Sazman-e Ab St., under Yadegar Imam Bridge, west side of Traditional Bazaar Phase 1, north entrance",
    phones: ["021 9132 22918", "021 9149 5051"],
  },
  form: {
    name: "Full name",
    phone: "Phone number",
    email: "Email",
    course: "Course",
    message: "Message",
    success:
      "Your request was received. We will contact you to complete enrollment.",
  },
  footer: {
    blurb:
      "Speaking, communication, and growth skills — taught in a clear bilingual classroom.",
    rights: "All rights reserved by Dr. Irannejad Academy.",
  },
  faq: {
    title: "Frequently asked questions",
    lead: "These answers make enrollment clearer before you start.",
    items: [
      {
        q: "Are the courses online or in person?",
        a: "Most courses are online or offline. The 360° Communication path is blended.",
      },
      {
        q: "What language are the site and courses in?",
        a: "The site is fully Persian and English. You see each course in the language you choose.",
      },
      {
        q: "What happens after I send the form?",
        a: "We receive the request and call you to finish enrollment. Online payment is not inside the site yet.",
      },
      {
        q: "Where should I start?",
        a: "If you are new, start with the free Powerful Me course. Then choose speaking or emotional intelligence.",
      },
      {
        q: "Do you issue certificates?",
        a: "The EQ trainer course includes certificates. Check each course page for the rest.",
      },
    ],
  },
  reviews: {
    title: "Student reviews",
    lead: "Voices from people who have taken this path.",
    items: [
      {
        name: "Sara M.",
        role: "Sales manager",
        text: "After the speaking course I no longer just listen in meetings. I speak, and the room stays with me.",
      },
      {
        name: "Amir R.",
        role: "Founder",
        text: "I took EQ for the team. Meetings got calmer and customer talks became easier.",
      },
      {
        name: "Negar K.",
        role: "Teacher",
        text: "I finished the free course in one evening. Those short drills lowered the fear of starting.",
      },
    ],
  },
  path: {
    title: "Learning path",
    lead: "If you are unsure where to begin, this order is the simplest route.",
    steps: [
      {
        title: "Start free",
        text: "Build your first voice and confidence with The Powerful Me.",
        href: "/courses/powerful-me",
      },
      {
        title: "Presence and speech",
        text: "Choose public speaking or body language to be seen in the room.",
        href: "/courses/fan-bayan",
      },
      {
        title: "Deeper connection",
        text: "EQ and 360° Communication for lasting relationships.",
        href: "/courses/emotional-intelligence",
      },
      {
        title: "A complementary skill",
        text: "Financial intelligence or AI animation opens another career door.",
        href: "/courses?topic=featured",
      },
    ],
  },
};

export type Dictionary = typeof fa;

export function getDictionary(locale: Locale): Dictionary {
  return locale === "en" ? en : fa;
}
