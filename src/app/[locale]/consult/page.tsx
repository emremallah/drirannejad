import { FormBox } from "@/components/FormBox";

export default function ConsultPage() {
  return (
    <div className="mx-auto w-[min(640px,calc(100%-32px))] py-10">
      <h1 className="text-3xl font-extrabold">درخواست مشاوره</h1>
      <p className="mt-2 text-sm leading-7 text-muted">
        این اطلاعات برای رتبه‌بندی مرکز لازم است. بعد از ارسال، در سایت عضو پیگیری می‌شوید.
      </p>
      <div className="mt-6">
        <FormBox
          kind="consult"
          fields={[
            { name: "firstName", label: "نام", required: true },
            { name: "lastName", label: "نام خانوادگی", required: true },
            { name: "nationalId", label: "کد ملی", required: true },
            { name: "email", label: "ایمیل", type: "email", required: true },
            { name: "mobile", label: "شماره موبایل", required: true },
            { name: "gender", label: "جنسیت", required: true, options: ["مرد", "زن"] },
            { name: "consultType", label: "نوع مشاوره", required: true, options: ["حضوری در مرکز", "آنلاین", "تلفنی"] },
            { name: "city", label: "شهر", required: true },
            { name: "county", label: "شهرستان", required: true },
            { name: "address", label: "آدرس سکونت", required: true },
            { name: "category", label: "دسته‌بندی مشاوره مورد نیاز", required: true, options: ["مشاوره حقوقی", "مشاوره کسب‌وکار", "مشاوره آموزشی", "مشاوره شغلی"] },
            { name: "coverage", label: "تحت پوشش", options: ["تحت پوشش کمیته امداد", "بیمه تأمین اجتماعی", "آزاد"] },
            { name: "details", label: "توضیحات", type: "textarea", required: true },
          ]}
        />
      </div>
    </div>
  );
}
