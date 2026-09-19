"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserId } from "@/lib/auth-client";
import { lessons } from "@/lib/content";
import { getCourse } from "@/lib/courses";

export default function LearnPage() {
  const params = useParams<{ slug: string; locale: string }>();
  const locale = params.locale === "en" ? "en" : "fa";
  const course = getCourse(params.slug);
  const items = lessons[params.slug] ?? [];
  const [unlocked, setUnlocked] = useState(1);
  const [note, setNote] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const id = getUserId();
    setUserId(id);
    if (!id) return;
    fetch(`/api/progress?userId=${id}&course=${params.slug}`)
      .then((response) => response.json())
      .then((data) => setUnlocked(data.unlocked ?? 1));
  }, [params.slug]);

  if (!course) return <p className="p-8">دوره پیدا نشد.</p>;

  return (
    <div className="mx-auto w-[min(860px,calc(100%-32px))] py-8" onContextMenu={(event) => event.preventDefault()}>
      <Link href={`/${locale}/courses/${params.slug}`} className="text-sm font-bold text-primary">
        {locale === "fa" ? "بازگشت به معرفی دوره" : "Back to course"}
      </Link>
      <h1 className="mt-3 text-3xl font-extrabold">
        {locale === "fa" ? "جلسات" : "Lessons"} {course[locale].title}
      </h1>
      <p className="mt-2 text-sm text-muted">
        جلسه بعد فقط وقتی باز می‌شود که تمرین همین جلسه را بفرستید. محتوا قابل دانلود نیست و با شماره شما نشانه‌گذاری می‌شود.
      </p>
      {!userId ? (
        <p className="mt-4">
          {locale === "fa" ? "برای دیدن جلسات" : "To see the lessons"}{" "}
          <Link href={`/${locale}/login`} className="font-bold text-primary">
            {locale === "fa" ? "وارد شوید" : "sign in"}
          </Link>
          .
        </p>
      ) : (
        <ol className="mt-6 grid gap-4">
          {items.map((lesson) => {
            const open = lesson.id <= unlocked;
            return (
              <li key={lesson.id} className="rounded-2xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-extrabold">
                    جلسه {lesson.id}: {lesson.title}
                  </h2>
                  <span className="text-xs font-bold text-accent">
                    {lesson.type === "video" ? "تصویری" : "صوتی + پاورپوینت متحرک"}
                  </span>
                </div>
                {open ? (
                  <div className="relative mt-3 overflow-hidden rounded-xl bg-scrim p-8 text-center text-white">
                    <p className="text-sm opacity-80">پخش امن جلسه {lesson.minutes} دقیقه‌ای</p>
                    <p className="pointer-events-none absolute inset-x-4 bottom-3 text-[11px] text-white/50">
                      {userId} · کپی و ذخیره ممنوع
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted">قفل است. اول تمرین جلسه قبل را بفرستید.</p>
                )}
                {open && lesson.id === unlocked ? (
                  <form
                    className="mt-3 grid gap-2"
                    onSubmit={async (event) => {
                      event.preventDefault();
                      const response = await fetch("/api/progress", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId, course: params.slug, note }),
                      });
                      const data = await response.json();
                      setUnlocked(data.unlocked);
                      setNote("");
                    }}
                  >
                    <textarea
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      required
                      placeholder="تمرین این جلسه را بنویسید"
                      className="rounded-md border border-border px-3 py-2 text-sm"
                    />
                    <button className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-white">
                      ارسال تمرین و باز شدن جلسه بعد
                    </button>
                  </form>
                ) : null}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
