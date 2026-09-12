"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Dictionary } from "@/lib/dictionary";
import { localePath } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

type SearchBoxProps = {
  locale: Locale;
  t: Dictionary;
  compact?: boolean;
  defaultValue?: string;
  onSubmit?: () => void;
};

export function SearchBox({
  locale,
  t,
  compact,
  defaultValue,
  onSubmit,
}: SearchBoxProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <form
      className={compact ? "w-full" : "w-full max-w-md"}
      onSubmit={(event) => {
        event.preventDefault();
        const query = value.trim();
        router.push(
          query
            ? `${localePath(locale, "/courses")}?q=${encodeURIComponent(query)}`
            : localePath(locale, "/courses"),
        );
        onSubmit?.();
      }}
    >
      <label className="sr-only" htmlFor="course-search">
        {t.nav.search}
      </label>
      <input
        id="course-search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t.nav.searchPlaceholder}
        className="h-11 w-full rounded-xl border border-border bg-bg px-4 text-sm outline-none focus:border-primary"
      />
    </form>
  );
}
