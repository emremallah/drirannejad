"use client";

import { useParams } from "next/navigation";
import { ResumePanel } from "@/components/resume/ResumePanel";
import { isLocale } from "@/lib/i18n";

export default function MyResumePage() {
  const params = useParams<{ locale: string }>();
  return <ResumePanel locale={isLocale(params.locale) ? params.locale : "fa"} />;
}
