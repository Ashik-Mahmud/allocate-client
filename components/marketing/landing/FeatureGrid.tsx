import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Inbox, Sparkles, Users, Wallet, Workflow } from "lucide-react";
import type { LandingFeature } from "./landing-types";

type FeatureGridProps = {
  title: string;
  subtitle: string;
  features: LandingFeature[];
};

const iconMap = {
  workflow: Workflow,
  sparkles: Sparkles,
  checkCircle: CheckCircle2,
  shield: CheckCircle2,
  inbox: Inbox,
  wallet: Wallet,
  users: Users,
} as const;

export function FeatureGrid({ title, subtitle, features }: FeatureGridProps) {
  return (
    <section>
      <div className="max-w-3xl">
        <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50">{title}</h2>
        <p className="mt-3 text-slate-700 dark:text-slate-300">{subtitle}</p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => {
          const Icon = iconMap[feature.icon];
          return (
            <Card key={feature.title} className="border-slate-200/80 bg-white/80 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-950/60">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-grid size-11 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 dark:bg-white dark:text-slate-950">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                    {feature.tag}
                  </span>
                </div>
                <CardTitle className="mt-4 text-xl font-bold text-slate-950 dark:text-slate-50">{feature.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="rounded-2xl border border-dashed border-slate-300/80 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
                  {feature.tag}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
