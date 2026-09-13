export default function StorePage() {
  return (
    <div className="mx-auto w-[min(800px,calc(100%-32px))] py-10">
      <h1 className="text-3xl font-extrabold">فروشگاه زی‌رضا</h1>
      <p className="mt-3 leading-8 text-muted">
        فروشگاه زی‌رضا زیرمجموعه این کلینیک است. محصولات و خدمات جانبی اینجا معرفی می‌شوند و بعداً به فروشگاه مستقل لینک خواهند شد.
      </p>
      <p className="mt-4 inline-flex rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent">به‌زودی</p>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {["بسته تمرین فن بیان", "کارت عضویت فیزیکی", "پکیج ابزار انیمیشن"].map((item) => (
          <article key={item} className="rounded-2xl bg-primary-soft p-4">
            <p className="font-bold text-primary-ink">{item}</p>
            <p className="mt-1 text-xs text-muted">فروش آنلاین هنوز فعال نیست.</p>
          </article>
        ))}
      </div>
    </div>
  );
}
