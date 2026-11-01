import Link from "next/link";

type InfoSection = { title: string; body: string };
type InfoAction = { href: string; label: string; primary?: boolean };

export function InfoPage({
  eyebrow,
  title,
  lead,
  sections,
  actions,
}: {
  eyebrow?: string;
  title: string;
  lead: string;
  sections: InfoSection[];
  actions: InfoAction[];
}) {
  return (
    <div className="mx-auto w-[min(800px,calc(100%-32px))] py-10 md:py-14">
      {eyebrow ? <p className="text-sm font-bold text-primary">{eyebrow}</p> : null}
      <h1 className="mt-2 text-3xl font-extrabold text-ink md:text-4xl">{title}</h1>
      <p className="mt-4 text-base leading-8 text-muted">{lead}</p>
      <div className="mt-8 space-y-6">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-extrabold text-ink">{section.title}</h2>
            <p className="mt-2 text-base leading-8 text-muted">{section.body}</p>
          </section>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={
              action.primary
                ? "rounded-full bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary-hover"
                : "rounded-full border border-primary px-5 py-3 text-sm font-bold text-primary"
            }
          >
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
