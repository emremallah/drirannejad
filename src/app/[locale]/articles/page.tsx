import { articles } from "@/lib/content";

export default function ArticlesPage() {
  return (
    <div className="mx-auto w-[min(800px,calc(100%-32px))] py-10">
      <h1 className="text-3xl font-extrabold">مقالات، تألیفات و اختراعات</h1>
      <div className="mt-6 grid gap-4">
        {articles.map((item) => (
          <article key={item.title} className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-bold text-accent">{item.tag}</p>
            <h2 className="mt-1 font-extrabold">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">{item.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
