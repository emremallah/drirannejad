"use client";

import { useState } from "react";

export function HeroCopy() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3 text-[15px] leading-8 text-ink md:text-base md:leading-8">
      <h2 className="text-[15px] font-extrabold leading-8 md:text-base md:leading-8">
        انسانِ امروزی در یک بستر کاملاً جدید و دگرگون‌شده زندگی می‌کند که در آن تمام معناهای سنتیِ زیستن، ارتباط برقرار کردن، کار کردن و موفق شدن دچار دگرگونی شده‌اند.
      </h2>
      {open ? (
        <>
          <p>
            سرعت تحولات به قدری بالاست که تجربه‌ی زیسته‌ی نسل‌ها با هم متفاوت شده است. مفاهیمی مثل موفقیت، ارتباط، آرامش و هویت، دیگر تعریف‌های ثابتی ندارند و مدام در حال نو شدن هستند.
          </p>
          <p>
            همان‌گونه که سیستم بدن انسان با حواس پنجگانه کار می‌کند؛ سیستم موفقیت در عصر مدرنیته هم با «هوش پنج‌گانه» کار می‌کند؛
          </p>
          <p>
            انسانِ مدرن به نوعی سازگاریِ ساختاری و چندبعدی (همان هوش‌های پنج‌گانه) نیاز دارد تا در این دنیای پر از ابهام و تحول، دچار فروپاشی روانی یا سردرگمی آموزشی نشود.
          </p>
          <p className="font-extrabold">
            آیا آماده‌ی جهش در عصر مدرن هستید؟ همین حالا مهارت‌های هوش هیجانی، هوش ارتباطی، هوش مصنوعی، هوش مالی و هوش تجاری خودت را تقویت کن.
          </p>
        </>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="text-sm font-extrabold text-primary hover:text-primary-hover"
        aria-expanded={open}
      >
        {open ? "نمایش کمتر" : "مشاهده بیشتر"}
      </button>
    </div>
  );
}
