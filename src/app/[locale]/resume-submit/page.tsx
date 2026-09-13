import { FormBox } from "@/components/FormBox";

export default function ResumeSubmitPage() {
  return (
    <div className="mx-auto w-[min(720px,calc(100%-32px))] py-10">
      <h1 className="text-3xl font-extrabold">ارسال رزومه</h1>
      <FormBox
        kind="resume"
        fields={[
          { name: "name", label: "نام", required: true },
          { name: "phone", label: "شماره تماس", required: true },
          { name: "role", label: "موقعیت مورد نظر", required: true },
          { name: "text", label: "متن رزومه", type: "textarea", required: true },
        ]}
      />
    </div>
  );
}
