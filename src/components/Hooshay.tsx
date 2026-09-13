"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { hooshayAnswers, sloganEn, sloganFa } from "@/lib/content";

export function Hooshay() {
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState<{ from: "you" | "bot"; text: string }[]>([
    { from: "bot", text: `من هوشای هستم. ${sloganFa}. ${sloganEn}` },
  ]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="no-print fixed start-4 bottom-[9.5rem] z-30 lg:start-auto lg:end-4 lg:bottom-6">
      {open ? (
        <div
          role="dialog"
          aria-label="گفتگو با هوشای"
          className="mb-3 w-[min(340px,calc(100vw-32px))] overflow-hidden rounded-3xl border border-border bg-surface shadow-lg"
        >
          <div className="flex items-center gap-3 bg-primary px-4 py-3 text-white">
            <Image src="/brand/hooshay.jpg" alt="" width={40} height={40} className="rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold">هوشای</p>
              <p className="text-[11px] text-white/80">{sloganEn}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid size-8 place-items-center rounded-full bg-white/15 text-white"
              aria-label="بستن گفتگو"
            >
              ×
            </button>
          </div>
          <div className="grid max-h-56 gap-2 overflow-y-auto p-3 text-sm">
            {log.map((item, index) => (
              <p
                key={`${item.text}-${index}`}
                className={`rounded-2xl px-3 py-2 leading-6 ${
                  item.from === "bot" ? "bg-primary-soft text-primary-ink" : "bg-accent-soft text-ink"
                }`}
              >
                {item.text}
              </p>
            ))}
          </div>
          <div className="grid gap-1 border-t border-border p-3">
            {hooshayAnswers.map((item) => (
              <button
                key={item.q}
                type="button"
                className="rounded-xl bg-bg px-3 py-2 text-start text-xs font-bold hover:bg-primary-soft"
                onClick={() =>
                  setLog((current) => [
                    ...current,
                    { from: "you", text: item.q },
                    { from: "bot", text: item.a },
                  ])
                }
              >
                {item.q}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="گفتگو با هوشای"
        className="flex items-center gap-2 rounded-full bg-accent px-3 py-2 text-sm font-extrabold text-white shadow-md hover:brightness-110"
      >
        <Image src="/brand/hooshay.jpg" alt="" width={28} height={28} className="rounded-full object-cover" />
        هوشای
      </button>
    </div>
  );
}
