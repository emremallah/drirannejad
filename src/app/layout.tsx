import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "آکادمی دکتر ایران‌نژاد",
  description:
    "دوره‌های فن بیان، ارتباطات، هوش هیجانی و مهارت‌های رشد به فارسی و انگلیسی.",
  icons: {
    icon: "/brand/logo.png",
    apple: "/brand/logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return children;
}
