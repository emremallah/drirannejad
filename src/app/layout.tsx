import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "پلی‌کلینیک فوق‌تخصصی هوش مصنوعی و کارآفرینی پروفسور ایران‌نژاد (AI)",
  description:
    "دوره‌های فن بیان، ارتباطات، هوش هیجانی و مهارت‌های رشد به فارسی و انگلیسی.",
  icons: {
    icon: "/brand/clinic-mark.png",
    apple: "/brand/clinic-mark.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return children;
}
