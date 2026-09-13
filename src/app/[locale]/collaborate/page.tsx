import { FormBox } from "@/components/FormBox";

export default function CollaboratePage() {
  return (
    <div className="mx-auto w-[min(720px,calc(100%-32px))] py-10">
      <h1 className="text-3xl font-extrabold">همکاری با ما</h1>
      <p className="mt-2 text-muted">اگر می‌خواهید مدرس یا مشاور کلینیک باشید، از این فرم اقدام کنید.</p>
      <div className="mt-6">
        <FormBox
          kind="collaborate"
          fields={[
            { name: "name", label: "نام و نام خانوادگی", required: true },
            { name: "phone", label: "شماره تماس", required: true },
            { name: "role", label: "نوع همکاری", required: true, options: ["استخدام مدرس", "استخدام مشاور"] },
            { name: "field", label: "زمینه تخصصی", required: true },
            { name: "resume", label: "خلاصه رزومه", type: "textarea", required: true },
          ]}
        />
      </div>
    </div>
  );
}
