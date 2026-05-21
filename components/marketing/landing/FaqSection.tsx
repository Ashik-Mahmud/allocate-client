import type { LandingFaqItem } from "./landing-types";

type FaqSectionProps = {
  title: string;
  items: LandingFaqItem[];
};

export function FaqSection({ title, items }: FaqSectionProps) {
  return (
    <section>
      <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50">{title}</h2>
      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        {items.map((item) => (
          <details key={item.question} className="group rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/60">
            <summary className="cursor-pointer list-none text-base font-semibold text-slate-950 dark:text-slate-50">
              {item.question}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
