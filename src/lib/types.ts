export type Locale = "fa" | "en";

export type CourseCategory =
  | "finance"
  | "eq"
  | "ai"
  | "speaking"
  | "free";

export type LocalizedText = {
  title: string;
  subtitle: string;
  excerpt: string;
  description: string;
  outcomes: { title: string; detail: string }[];
  extras?: string[];
  extrasTitle?: string;
  cta: string;
};

export type Course = {
  slug: string;
  featured: boolean;
  category: CourseCategory;
  price: number | "free";
  duration: { fa: string; en: string };
  format: { fa: string; en: string };
  level: { fa: string; en: string };
  cover: string;
  image: string;
  fa: LocalizedText;
  en: LocalizedText;
};
