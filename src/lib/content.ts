export const clinicName =
  "پلی‌کلینیک فوق‌تخصصی هوش مصنوعی و کارآفرینی پروفسور ایران‌نژاد (AI)";

export const clinicBanner =
  "آکادمی پلی‌کلینیک فوق‌تخصصی هوش مصنوعی و کارآفرینی پروفسور ایران‌نژاد (AI)؛ مبدع و مبتکر اکوسیستم آموزشی نوین ارائه‌دهنده متدولوژی مبتنی بر هوش پنج‌گانه در ایران و جهان";

export const sloganFa = "از پیله تا پروانه، پیوسته ادامه بده";
export const sloganEn = "Keep Going";

export const licenses = [
  { title: "مجوز آموزش مهارت‌های نرم", issuer: "اداره توسعه کارآفرینی استان تهران" },
  { title: "مجوز کلینیک تخصصی", issuer: "مرکز صدور مجوزهای صنفی" },
  { title: "تأییدیه هوش پنج‌گانه", issuer: "اکوسیستم آموزشی نوین" },
  { title: "گواهی ثبت اختراع آموزشی", issuer: "مرجع ثبت اختراعات" },
];

export const zizaaStoreUrl = "https://zizaa.ir/";

export const socialChannels = [
  {
    id: "eitaa",
    nameFa: "ایتا",
    nameEn: "Eitaa",
    labelFa: "کانال ایتا",
    labelEn: "Eitaa channel",
    href: "https://eitaa.com/ClinicDrIrannejad",
  },
  {
    id: "bale",
    nameFa: "بله",
    nameEn: "Bale",
    labelFa: "کانال بله",
    labelEn: "Bale channel",
    href: "https://ble.ir/join/N2FkNTc1YT",
  },
] as const;

export const sisterSites: {
  name: string;
  nameEn: string;
  path?: string;
  href?: string;
  soon?: boolean;
}[] = [
  { name: "فروشگاه زی‌ضا", nameEn: "Zizaa Store", href: zizaaStoreUrl },
  { name: "اکوتراست", nameEn: "EchoTrust", href: "https://www.echotrust.ir" },
  { name: "سایت بعدی (به‌زودی)", nameEn: "Next site (soon)", soon: true },
];

export const instructors = [
  {
    name: "پروفسور اعظم ایران‌نژاد (AI)",
    role: "مؤسس و مخترع اکوسیستم هوش پنج‌گانه",
    bio: "بنیان‌گذار پلی‌کلینیک فوق‌تخصصی هوش مصنوعی و کارآفرینی پروفسور ایران‌نژاد (AI). مربی سخنرانی مدیران و طراح مسیر آموزشی از پیله تا پروانه.",
  },
  {
    name: "تیم مدرسان هوش هیجانی",
    role: "اساتید ارتباطات و EQ",
    bio: "مربیان تربیت‌مدرس که مسیر هوش هیجانی، فن بیان و مهارت ارتباطی را همراهی می‌کنند.",
  },
];

export const articles = [
  { title: "هوش پنج‌گانه چیست؟", tag: "تألیف", excerpt: "چارچوب آموزشی کلینیک برای رشد همزمان هیجان، بیان، مالی، اجتماعی و مصنوعی." },
  { title: "اختراع اکوسیستم آموزشی نوین", tag: "اختراع", excerpt: "مسیر ثبت و کاربرد روش آموزشی مبتنی بر هوش پنج‌گانه در ایران." },
  { title: "از پیله تا پروانه", tag: "مقاله", excerpt: "چرا شعار Keep Going ستون تحول فردی در این کلینیک است." },
];

export const gifts = [
  { title: "پاداش معرفی دوست", text: "با کد اختصاصی، به ازای هر ثبت‌نام موفق ۵۰ هزار تومان در طرح راحت پول دربیار ثبت می‌شود." },
  { title: "چکاپ رایگان EQ", text: "شرکت‌کنندگان دوره هوش هیجانی سه مرحله چکاپ دریافت می‌کنند." },
  { title: "کارت عضویت باشگاه کارآفرینی", text: "بعد از ثبت‌نام صادر می‌شود. گواهینامه جدا است و بعد از پایان دوره صادر می‌شود." },
];

export const lessons: Record<
  string,
  { id: number; title: string; type: "video" | "audio-ppt"; minutes: number }[]
> = {
  "financial-intelligence": [
    { id: 1, title: "کنترل درآمد", type: "video", minutes: 18 },
    { id: 2, title: "بودجه‌بندی هوشمند", type: "audio-ppt", minutes: 14 },
    { id: 3, title: "فرار از تله تورم", type: "video", minutes: 16 },
  ],
  "emotional-intelligence": [
    { id: 1, title: "شناخت هیجان", type: "video", minutes: 22 },
    { id: 2, title: "همدلی و نفوذ", type: "audio-ppt", minutes: 20 },
    { id: 3, title: "حل تعارض", type: "video", minutes: 18 },
  ],
  "ai-animation": [
    { id: 1, title: "ایده تا کاراکتر", type: "video", minutes: 15 },
    { id: 2, title: "استوری‌بورد با هوش مصنوعی", type: "audio-ppt", minutes: 17 },
    { id: 3, title: "خروجی قابل فروش", type: "video", minutes: 19 },
  ],
  "fan-bayan": [
    { id: 1, title: "ترس شروع", type: "video", minutes: 16 },
    { id: 2, title: "ساخت صدا", type: "audio-ppt", minutes: 15 },
    { id: 3, title: "ساختار سخنرانی", type: "video", minutes: 20 },
  ],
  "communication-360": [
    { id: 1, title: "نقشه ارتباط", type: "video", minutes: 18 },
    { id: 2, title: "گفت‌وگوی سخت", type: "audio-ppt", minutes: 16 },
    { id: 3, title: "شبکه اثرگذار", type: "video", minutes: 14 },
  ],
  "powerful-me": [
    { id: 1, title: "اولین صدا", type: "audio-ppt", minutes: 10 },
    { id: 2, title: "جرئت شروع", type: "video", minutes: 12 },
  ],
  "body-language": [
    { id: 1, title: "حضور در اتاق", type: "video", minutes: 13 },
    { id: 2, title: "دست و نگاه", type: "audio-ppt", minutes: 12 },
    { id: 3, title: "هماهنگی حرف و بدن", type: "video", minutes: 14 },
  ],
};

export const hooshayAnswers: { q: string; a: string }[] = [
  { q: "از کجا شروع کنم؟", a: "اگر تازه‌واردی، آموزش رایگان و آزمون هوش هیجانی بهترین شروع است. من هوشای‌ام؛ از پیله تا پروانه کنارت می‌مانم." },
  { q: "آزمون‌ها رایگان‌اند؟", a: "دو آزمون رایگان داریم و آزمون سبک ارتباطی با شهریه پایین است. نتیجه همان لحظه و به‌صورت PDF آماده می‌شود." },
  { q: "کد معرفی چیست؟", a: "بعد از ثبت‌نام یک کد اختصاصی می‌گیری. هر کسی با آن کد عضو شود، پورسانت در طرح راحت پول دربیار ثبت می‌شود." },
  { q: "گواهینامه جعل می‌شود؟", a: "کارت عضویت باشگاه کارآفرینی بعد از ثبت‌نام صادر می‌شود و گواهینامه بعد از پایان دوره. هر کدام کد یکتا دارد و در صفحه استعلام همان لحظه چک می‌شود." },
];
