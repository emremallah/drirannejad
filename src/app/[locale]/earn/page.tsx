import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, isLocale, localePath } from "@/lib/i18n";
import { getEarnPlan } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export default async function EarnPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const fa = locale === "fa";
  const plan = await getEarnPlan();

  const title = fa ? plan.titleFa : plan.titleEn;
  const subtitle = fa ? plan.subtitleFa : plan.subtitleEn;
  const intro = fa ? plan.introFa : plan.introEn;

  return (
    <div className="mx-auto w-[min(960px,calc(100%-32px))] py-10">
      <p className="text-xs font-extrabold text-accent">
        {fa ? "کیف پول معرفی" : "Referral wallet"}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-base leading-8 text-muted">{subtitle}</p>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{intro}</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl bg-accent-soft p-5">
          <p className="text-xs font-bold text-accent">{fa ? "پاداش هر معرفی" : "Reward per referral"}</p>
          <p className="mt-2 text-2xl font-extrabold">{formatPrice(plan.rewardPerReferral, locale)}</p>
        </article>
        <article className="rounded-2xl bg-primary-soft p-5">
          <p className="text-xs font-bold text-primary-ink">{fa ? "کمیسیون دوره‌ها" : "Course commission"}</p>
          <p className="mt-2 text-2xl font-extrabold">
            {plan.commissionMin}٪ — {plan.commissionMax}٪
          </p>
        </article>
        <article className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-bold text-muted">{fa ? "شروع کار" : "Get started"}</p>
          <p className="mt-2 text-lg font-extrabold">
            {fa ? "کد اختصاصی بعد از ثبت‌نام" : "Personal code after signup"}
          </p>
        </article>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-extrabold">{fa ? "چطور کار می‌کند؟" : "How it works"}</h2>
        <ol className="mt-4 grid gap-3">
          {plan.steps.map((step, index) => (
            <li key={step.id} className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-extrabold text-primary-ink">
                {index + 1}
              </span>
              <span>
                <span className="block font-bold">{fa ? step.titleFa : step.titleEn}</span>
                <span className="mt-1 block text-sm leading-7 text-muted">
                  {fa ? step.textFa : step.textEn}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-extrabold">{fa ? "سطوح درآمد" : "Income tiers"}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {plan.tiers.map((tier) => (
            <article key={tier.id} className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="font-extrabold text-primary">{fa ? tier.titleFa : tier.titleEn}</h3>
              <p className="mt-2 text-2xl font-extrabold">
                {tier.percent > 0 ? `${tier.percent}٪` : formatPrice(tier.amount, locale)}
              </p>
              {tier.percent > 0 && tier.amount > 0 ? (
                <p className="mt-1 text-sm text-muted">+ {formatPrice(tier.amount, locale)}</p>
              ) : null}
              <p className="mt-2 text-sm leading-7 text-muted">{fa ? tier.textFa : tier.textEn}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-extrabold">{fa ? "مزایای طرح" : "Plan perks"}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {plan.perks.map((perk) => (
            <article key={perk.id} className="rounded-2xl bg-bg p-5">
              <p className="text-xs font-bold text-accent">{fa ? perk.titleFa : perk.titleEn}</p>
              <p className="mt-2 text-2xl font-extrabold">
                {perk.value.toLocaleString(fa ? "fa-IR" : "en-US")} {fa ? perk.unitFa : perk.unitEn}
              </p>
              <p className="mt-2 text-sm leading-7 text-muted">{fa ? perk.textFa : perk.textEn}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href={localePath(locale, "/register")} className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary-hover">
          {fa ? "ثبت‌نام و دریافت کد" : "Sign up and get a code"}
        </Link>
        <Link href={localePath(locale, "/account")} className="rounded-full border border-primary px-5 py-3 text-sm font-bold text-primary">
          {fa ? "کیف پول من" : "My wallet"}
        </Link>
      </div>
    </div>
  );
}
