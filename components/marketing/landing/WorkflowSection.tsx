import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LandingWorkflowStep } from "./landing-types";

type WorkflowSectionProps = {
  title: string;
  subtitle: string;
  steps: LandingWorkflowStep[];
};

export function WorkflowSection({ title, subtitle, steps }: WorkflowSectionProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200/80 bg-white/75 p-5 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-700 dark:bg-slate-950/60 sm:p-8">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50">{title}</h2>
        <p className="mt-3 text-slate-700 dark:text-slate-300">{subtitle}</p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {steps.map((step, index) => (
          <Card key={step.title} className="border-slate-200/80 bg-white/85 shadow-sm dark:border-slate-700 dark:bg-slate-950/60">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground shadow-lg shadow-primary/20">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{step.metric}</span>
              </div>
              <CardTitle className="pt-2 text-xl font-bold text-slate-950 dark:text-slate-50">{step.title}</CardTitle>
              <CardDescription className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {step.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full rounded-full bg-linear-to-r from-primary to-brand-secondary" style={{ width: `${55 + index * 15}%` }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
