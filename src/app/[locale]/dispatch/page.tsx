import { FormBox } from "@/components/FormBox";

export default function DispatchPage() {
  return (
    <div className="mx-auto w-[min(720px,calc(100%-32px))] py-10">
      <h1 className="text-3xl font-extrabold">فرم درخواست اعزام نیرو</h1>
      <p className="mt-2 text-muted">آیتم‌ها مطابق نیاز کلینیک تنظیم شده است.</p>
      <div className="mt-6">
        <FormBox
          kind="dispatch"
          fields={[
            { name: "org", label: "نام سازمان / کسب‌وکار", required: true },
            { name: "manager", label: "نام مسئول", required: true },
            { name: "phone", label: "شماره تماس", required: true },
            { name: "city", label: "شهر محل اعزام", required: true },
            { name: "role", label: "نوع نیروی مورد نیاز", required: true, options: ["مدرس فن بیان", "مدرس هوش هیجانی", "مشاور کارآفرینی", "تسهیل‌گر کارگاه"] },
            { name: "count", label: "تعداد نیرو", required: true },
            { name: "date", label: "بازه زمانی", required: true },
            { name: "desc", label: "شرح نیاز", type: "textarea", required: true },
          ]}
        />
      </div>
    </div>
  );
}
