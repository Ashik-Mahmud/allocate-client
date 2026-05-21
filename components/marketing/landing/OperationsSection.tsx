import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LandingContent } from "./landing-types";

type OperationsSectionProps = {
  notifications: LandingContent["notifications"];
  billing: LandingContent["billing"];
};

export function OperationsSection({ notifications, billing }: OperationsSectionProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <Card className="border-slate-200/80 bg-white/80 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/60">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-slate-950 dark:text-slate-50">{notifications.title}</CardTitle>
          <CardDescription className="text-slate-700 dark:text-slate-300">{notifications.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{notifications.inboxTitle}</p>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{notifications.summary}</p>
              </div>
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/20">
                Live
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {notifications.highlights.map((item) => (
                <div key={item} className="rounded-2xl border border-dashed border-slate-300 bg-white px-3 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {notifications.items.map((item) => (
              <div key={item.title} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950/60">
                <div>
                  <p className="font-semibold text-slate-950 dark:text-slate-50">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{item.description}</p>
                </div>
                <span className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                  {item.state}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white/80 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/60">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-slate-950 dark:text-slate-50">{billing.title}</CardTitle>
          <CardDescription className="text-slate-700 dark:text-slate-300">{billing.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="grid gap-3 sm:grid-cols-3">
            {billing.cards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{card.meta}</p>
                <p className="mt-2 text-lg font-bold text-slate-950 dark:text-slate-50">{card.title}</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{card.description}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2 rounded-3xl border border-primary/10 bg-primary/5 p-4 dark:border-primary/20 dark:bg-primary/10">
            {billing.bullets.map((bullet) => (
              <div key={bullet} className="flex items-start gap-2 text-sm text-slate-800 dark:text-slate-200">
                <span className="mt-1 size-2 rounded-full bg-primary" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
