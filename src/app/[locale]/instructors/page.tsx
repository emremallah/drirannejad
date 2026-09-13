import { instructors } from "@/lib/content";

export default function InstructorsPage() {
  return (
    <div className="mx-auto w-[min(800px,calc(100%-32px))] py-10">
      <h1 className="text-3xl font-extrabold">معرفی اساتید</h1>
      <div className="mt-6 grid gap-4">
        {instructors.map((item) => (
          <article key={item.name} className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-xl font-extrabold">{item.name}</h2>
            <p className="text-sm font-bold text-accent">{item.role}</p>
            <p className="mt-2 leading-8 text-muted">{item.bio}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
