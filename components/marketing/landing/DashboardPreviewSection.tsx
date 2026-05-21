"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LandingDashboardBar, LandingDashboardTab } from "./landing-types";

type DashboardPreviewSectionProps = {
  title: string;
  subtitle: string;
  tabs: LandingDashboardTab[];
};

export function DashboardPreviewSection({ title, subtitle, tabs }: DashboardPreviewSectionProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200/80 bg-white/75 p-5 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-700 dark:bg-slate-950/60 sm:p-8">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50">{title}</h2>
        <p className="mt-3 text-slate-700 dark:text-slate-300">{subtitle}</p>
      </div>

      <Tabs defaultValue={tabs[0]?.id} className="mt-8">
        <TabsList className="rounded-full border border-slate-200/80 bg-slate-100/80 p-1 dark:border-slate-800 dark:bg-slate-900/70">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="rounded-full px-4 py-2 text-sm">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6">
            <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <Card className="border-slate-200/80 bg-white/85 shadow-sm dark:border-slate-700 dark:bg-slate-950/60">
                <CardHeader>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{tab.eyebrow}</p>
                  <CardTitle className="pt-1 text-2xl font-bold text-slate-950 dark:text-slate-50">{tab.title}</CardTitle>
                  <CardDescription className="text-slate-700 dark:text-slate-300">{tab.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-3">
                  {tab.metrics.map((metric) => (
                    <div key={metric.label} className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                      <p className="text-2xl font-black text-slate-950 dark:text-slate-50">{metric.value}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{metric.label}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-slate-200/80 bg-white/85 shadow-sm dark:border-slate-700 dark:bg-slate-950/60">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-950 dark:text-slate-50">Working queue</CardTitle>
                  <CardDescription>Tasks and capacity signals for the active role.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  {tab.cards.map((card) => (
                    <div key={card.title} className="rounded-2xl border border-slate-200/80 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                      <p className="font-semibold text-slate-950 dark:text-slate-50">{card.title}</p>
                      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{card.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="mt-4 border-slate-200/80 bg-white/85 shadow-sm dark:border-slate-700 dark:bg-slate-950/60">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-950 dark:text-slate-50">Demand snapshot</CardTitle>
                <CardDescription>Simple bar view of activity and utilization.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {tab.bars.map((bar) => (
                  <BarRow key={bar.label} bar={bar} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

function BarRow({ bar }: { bar: LandingDashboardBar }) {
  const toneClasses = {
    primary: "from-primary to-brand-secondary",
    secondary: "from-cyan-500 to-sky-500",
    muted: "from-slate-400 to-slate-500",
  } as const;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-slate-700 dark:text-slate-300">
        <span>{bar.label}</span>
        <span className="font-semibold">{bar.value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
        <div className={`h-full rounded-full bg-linear-to-r ${toneClasses[bar.tone]}`} style={{ width: `${bar.value}%` }} />
      </div>
    </div>
  );
}
