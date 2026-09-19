import { localePath } from "./i18n";
import type { Locale } from "./types";

function copy(locale: Locale) {
  return locale === "fa"
    ? {
        learn: "یادگیری",
        services: "خدمات",
        collab: "همکاری",
        knowledge: "دانش",
        account: "حساب و پشتیبانی",
        courses: "معرفی دوره‌ها",
        free: "آموزش‌های رایگان",
        tests: "آزمون‌ها",
        path: "مسیر یادگیری",
        consult: "مشاوره",
        resume: "رزومه‌ساز آنلاین",
        resumeSubmit: "ارسال رزومه",
        gifts: "هدایا",
        earn: "طرح راحت پول دربیار",
        earnGroup: "درآمد",
        store: "فروشگاه زی‌رضا",
        collaborate: "همکاری با ما",
        dispatch: "اعزام نیرو",
        instructors: "اساتید",
        founder: "مؤسس",
        articles: "مقالات و اختراعات",
        verify: "استعلام مدرک",
        login: "ورود",
        register: "ثبت‌نام",
        faq: "سوالات پرتکرار",
        reviews: "نظرات",
        contact: "تماس",
        home: "خانه",
        coursesTab: "دوره‌ها",
        testsTab: "آزمون",
        profileTab: "پروفایل",
      }
    : {
        learn: "Learn",
        services: "Services",
        collab: "Collaborate",
        knowledge: "Knowledge",
        account: "Account & help",
        courses: "Courses",
        free: "Free lessons",
        tests: "Tests",
        path: "Learning path",
        consult: "Consultation",
        resume: "Resume builder",
        resumeSubmit: "Submit resume",
        gifts: "Gifts",
        earn: "Earn Easily plan",
        earnGroup: "Earn",
        store: "Zi-Reza store",
        collaborate: "Work with us",
        dispatch: "Talent dispatch",
        instructors: "Instructors",
        founder: "Founder",
        articles: "Articles & patents",
        verify: "Verify certificate",
        login: "Sign in",
        register: "Register",
        faq: "FAQ",
        reviews: "Reviews",
        contact: "Contact",
        home: "Home",
        coursesTab: "Courses",
        testsTab: "Tests",
        profileTab: "Profile",
      };
}

export function navGroups(locale: Locale) {
  const t = copy(locale);
  return [
    {
      title: t.learn,
      links: [
        { href: localePath(locale, "/courses"), label: t.courses },
        { href: localePath(locale, "/free"), label: t.free },
        { href: localePath(locale, "/tests"), label: t.tests },
        { href: localePath(locale, "/path"), label: t.path },
      ],
    },
    {
      title: t.earnGroup,
      links: [{ href: localePath(locale, "/earn"), label: t.earn }],
    },
    {
      title: t.services,
      links: [
        { href: localePath(locale, "/consult"), label: t.consult },
        { href: localePath(locale, "/resume-builder"), label: t.resume },
        { href: localePath(locale, "/resume-submit"), label: t.resumeSubmit },
        { href: localePath(locale, "/gifts"), label: t.gifts },
        { href: localePath(locale, "/store"), label: t.store },
      ],
    },
    {
      title: t.collab,
      links: [
        { href: localePath(locale, "/collaborate"), label: t.collaborate },
        { href: localePath(locale, "/dispatch"), label: t.dispatch },
      ],
    },
    {
      title: t.knowledge,
      links: [
        { href: localePath(locale, "/instructors"), label: t.instructors },
        { href: localePath(locale, "/founder"), label: t.founder },
        { href: localePath(locale, "/articles"), label: t.articles },
        { href: localePath(locale, "/verify"), label: t.verify },
      ],
    },
  ];
}

export function extraGroups(locale: Locale) {
  const t = copy(locale);
  return [
    {
      title: t.account,
      links: [
        { href: localePath(locale, "/login"), label: t.login },
        { href: localePath(locale, "/register"), label: t.register },
        { href: localePath(locale, "/faq"), label: t.faq },
        { href: localePath(locale, "/reviews"), label: t.reviews },
        { href: localePath(locale, "/contact"), label: t.contact },
      ],
    },
  ];
}

export function moreGroups(locale: Locale) {
  return [...navGroups(locale), ...extraGroups(locale)];
}

export function headerLinks(locale: Locale) {
  return navGroups(locale).flatMap((group) => group.links);
}

export function moreLinks(locale: Locale) {
  return moreGroups(locale).flatMap((group) => group.links);
}

export function tabLinks(locale: Locale) {
  const t = copy(locale);
  return [
    { href: localePath(locale), label: t.home, id: "home" as const },
    { href: localePath(locale, "/courses"), label: t.coursesTab, id: "courses" as const },
    { href: localePath(locale, "/tests"), label: t.testsTab, id: "tests" as const },
    { href: localePath(locale, "/account"), label: t.profileTab, id: "about" as const },
  ];
}

export function isTabActive(pathname: string, href: string, id: string) {
  if (id === "home") return pathname === "/fa" || pathname === "/en";
  if (id === "tests") return pathname.includes("/tests");
  if (id === "about") {
    return (
      pathname.includes("/account") ||
      pathname.includes("/login") ||
      pathname.includes("/register")
    );
  }
  if (id === "courses") return pathname.includes("/courses") || pathname.includes("/free");
  return pathname.startsWith(href);
}
