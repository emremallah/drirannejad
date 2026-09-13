import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "پلی‌کلینیک فوق‌تخصصی هوش مصنوعی و کارآفرینی پروفسور ایران‌نژاد",
  description:
    "دوره‌های فن بیان، ارتباطات، هوش هیجانی و مهارت‌های رشد به فارسی و انگلیسی.",
  icons: {
    icon: "/brand/clinic-logo.jpg",
    apple: "/brand/clinic-logo.jpg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return children;
}
