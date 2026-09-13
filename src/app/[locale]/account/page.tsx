"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { clearUserId, getUserId } from "@/lib/auth-client";
import { isLocale, localePath } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

type Me = {
  user: {
    name: string;
    phone: string;
    email?: string;
    referralCode: string;
    referredBy?: string;
    wallet: number;
  };
  docs: { type: string; title: string; code: string }[];
  tests: { testSlug: string; score: number; summary: string; id: string }[];
};

export default function AccountPage() {
  const params = useParams<{ locale: string }>();
  const locale: Locale = isLocale(params.locale) ? params.locale : "fa";
  const [me, setMe] = useState<Me | null>(null);
  const [status, setStatus] = useState<"loading" | "guest" | "ready">("loading");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = getUserId();
    if (!id) {
      setStatus("guest");
      return;
    }
    fetch(`/api/me?id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data?.user) {
          setMe(data);
          setStatus("ready");
        } else {
          setStatus("guest");
        }
      })
      .catch(() => setStatus("guest"));
  }, []);

  if (status === "loading") {
    return (
      <div className="mx-auto w-[min(720px,calc(100%-32px))] py-10">
        <p className="text-sm text-muted">{locale === "fa" ? "در حال بارگذاری پروفایل..." : "Loading profile..."}</p>
      </div>
    );
  }

  if (status === "guest" || !me?.user) {
    return (
      <div className="mx-auto w-[min(720px,calc(100%-32px))] py-10">
        <h1 className="text-2xl font-extrabold">{locale === "fa" ? "پروفایل کاربری" : "Your profile"}</h1>
        <p className="mt-2 text-muted">
          {locale === "fa"
            ? "برای دیدن کیف پول، کارت و گواهینامه وارد شوید."
            : "Sign in to see your wallet, card, and certificates."}
        </p>
        <div className="mt-4 flex gap-3">
          <Link href={localePath(locale, "/login")} className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-white">
            {locale === "fa" ? "ورود" : "Sign in"}
          </Link>
          <Link href={localePath(locale, "/register")} className="rounded-md border border-primary px-4 py-2 text-sm font-bold text-primary">
            {locale === "fa" ? "ثبت‌نام" : "Register"}
          </Link>
        </div>
      </div>
    );
  }

  const { user, docs, tests } = me;
  const referralPath = localePath(locale, `/register?ref=${user.referralCode}`);
  const referralLink =
    typeof window !== "undefined" ? `${window.location.origin}${referralPath}` : referralPath;

  const nav = [
    { href: "#profile", label: locale === "fa" ? "پروفایل من" : "Profile" },
    { href: "#wallet", label: locale === "fa" ? "کیف پول" : "Wallet" },
    { href: "#docs", label: locale === "fa" ? "کارت و گواهی" : "Certificates" },
    { href: "#tests", label: locale === "fa" ? "آزمون‌های من" : "My tests" },
    { href: localePath(locale, "/courses"), label: locale === "fa" ? "دروس من" : "My courses" },
    { href: localePath(locale, "/resume-builder"), label: locale === "fa" ? "رزومه‌ساز" : "Resume" },
  ];

  return (
    <div className="mx-auto grid w-[min(1000px,calc(100%-32px))] gap-6 py-8 lg:grid-cols-[220px_1fr]">
      <aside className="h-fit rounded-2xl bg-primary p-4 text-white">
        <p className="text-sm font-extrabold">{locale === "fa" ? "پیشخوان" : "Dashboard"}</p>
        <nav className="mt-4 grid gap-1 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg px-2 py-2 hover:bg-white/10">
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="mt-6 text-xs text-orange-200 hover:text-white"
          onClick={() => {
            clearUserId();
            location.reload();
          }}
        >
          {locale === "fa" ? "خروج" : "Sign out"}
        </button>
      </aside>
      <div className="grid gap-4">
        <section id="profile" className="scroll-mt-28 rounded-2xl border border-border bg-surface p-5">
          <h1 className="text-2xl font-extrabold">{user.name}</h1>
          <p className="text-sm text-muted">{user.phone}</p>
          {user.email ? <p className="text-sm text-muted">{user.email}</p> : null}
        </section>
        <section id="wallet" className="scroll-mt-28 rounded-2xl bg-accent-soft p-5">
          <p className="text-xs font-bold text-accent">
            {locale === "fa" ? "کیف پول طرح راحت پول دربیار" : "Referral wallet"}
          </p>
          <p className="mt-1 text-2xl font-extrabold">{user.wallet.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")} {locale === "fa" ? "تومان" : "Toman"}</p>
          <p className="mt-2 text-sm">
            {locale === "fa" ? "کد معرفی شما:" : "Your referral code:"} <b>{user.referralCode}</b>
          </p>
          <p className="mt-1 break-all text-xs text-muted">{referralLink}</p>
          <button
            type="button"
            className="mt-3 rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-white"
            onClick={async () => {
              await navigator.clipboard.writeText(referralLink);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied
              ? locale === "fa"
                ? "کپی شد"
                : "Copied"
              : locale === "fa"
                ? "کپی لینک معرفی"
                : "Copy referral link"}
          </button>
          {user.referredBy ? (
            <p className="mt-2 text-xs">
              {locale === "fa" ? "معرف شما:" : "Referred by:"} {user.referredBy}
            </p>
          ) : null}
        </section>
        <section id="docs" className="scroll-mt-28 rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-extrabold">{locale === "fa" ? "کارت و گواهینامه رمزگذاری‌شده" : "Encrypted card & certificates"}</h2>
          {docs.length ? (
            <ul className="mt-3 grid gap-2 text-sm">
              {docs.map((doc) => (
                <li key={doc.code} className="rounded-xl bg-bg p-3">
                  {doc.title} — <b>{doc.code}</b>
                  <Link href={`${localePath(locale, "/verify")}?code=${doc.code}`} className="ms-2 text-primary">
                    {locale === "fa" ? "استعلام" : "Verify"}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">
              {locale === "fa" ? "هنوز مدرکی صادر نشده است." : "No certificates yet."}
            </p>
          )}
        </section>
        <section id="tests" className="scroll-mt-28 rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-extrabold">{locale === "fa" ? "نتیجه آزمون‌ها در رزومه" : "Test results for your resume"}</h2>
          {tests.length ? (
            <ul className="mt-3 grid gap-2 text-sm">
              {tests.map((test) => (
                <li key={test.id} className="rounded-xl bg-bg p-3">
                  {test.testSlug} — {locale === "fa" ? "نمره" : "score"} {test.score} — {test.summary}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">
              {locale === "fa" ? "آزمونی ثبت نشده. از صفحه آزمون شروع کنید." : "No tests yet. Start from the tests page."}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href={localePath(locale, "/tests")} className="text-sm font-bold text-primary">
              {locale === "fa" ? "رفتن به آزمون‌ها" : "Go to tests"}
            </Link>
            <Link href={localePath(locale, "/resume-builder")} className="text-sm font-bold text-primary">
              {locale === "fa" ? "رزومه‌ساز" : "Resume builder"}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
