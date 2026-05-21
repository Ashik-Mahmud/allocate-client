import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/lib/navigation";
import { ArrowRight, CheckCircle2, Globe2, Sparkles, TriangleAlert } from "lucide-react";
import type { LandingContent } from "./landing-types";

type HeroSectionProps = {
  locale: string;
  content: LandingContent["hero"];
  badge: string;
};

export function HeroSection({ locale, content, badge }: HeroSectionProps) {
  return (
    <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 shadow-sm backdrop-blur dark:border-primary/30 dark:bg-slate-950/50 dark:text-slate-200">
          <Globe2 className="size-3.5" aria-hidden="true" />
          {badge}
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600 dark:text-slate-400">
          {locale.toUpperCase()} · {content.eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-balance text-4xl font-black leading-[1.02] text-slate-950 sm:text-5xl lg:text-6xl dark:text-slate-50">
          {content.title}
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
          {content.subtitle}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="rounded-full px-5 shadow-lg shadow-primary/25">
            <Link href="/features">
              {content.primaryCta}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full border-primary/20 bg-white/80 px-5 dark:bg-slate-950/55">
            <Link href="/case-study">{content.secondaryCta}</Link>
          </Button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-300/70 bg-white/70 px-3 py-1 backdrop-blur dark:border-slate-700 dark:bg-slate-950/60">
            <CheckCircle2 className="size-3.5 text-primary" />
            Multi-tenant organizations
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-300/70 bg-white/70 px-3 py-1 backdrop-blur dark:border-slate-700 dark:bg-slate-950/60">
            <Sparkles className="size-3.5 text-primary" />
            Live booking visibility
          </span>
        </div>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-amber-50/80 px-4 py-2 text-sm text-amber-900 shadow-sm dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-100">
          <TriangleAlert className="size-4" aria-hidden="true" />
          {content.note}
        </div>
      </div>

      <Card className="relative overflow-hidden border-white/60 bg-white/80 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.5)] backdrop-blur dark:border-slate-700/70 dark:bg-slate-950/70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_35%)]" />
        <CardHeader className="relative border-b border-slate-200/70 dark:border-slate-800">
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">Allocate command center</CardTitle>
          <CardDescription>Bookings, credits, notifications, and staff actions in one view.</CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-4 p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <MiniMetric label="Rooms online" value="128" accent="primary" />
            <MiniMetric label="Unread alerts" value="14" accent="secondary" />
            <MiniMetric label="Credits used" value="82%" accent="muted" />
          </div>

          <div className="grid gap-3 md:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-950 px-4 py-4 text-slate-50 shadow-lg dark:border-slate-700">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                <span>Live bookings</span>
                <span>Updated 2 min ago</span>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { time: "08:30", label: "Meeting room A", state: "Confirmed" },
                  { time: "11:00", label: "Focus desk 4", state: "Pending" },
                  { time: "15:30", label: "Training room", state: "Maintenance" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <div>
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.time}</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-slate-200">
                      {item.state}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Card className="border-slate-200/80 bg-white/85 shadow-sm dark:border-slate-700 dark:bg-slate-950/60">
                <CardContent className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Realtime inbox</p>
                  <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">Team reminders, booking approvals, and service notices.</p>
                </CardContent>
              </Card>
              <Card className="border-slate-200/80 bg-white/85 shadow-sm dark:border-slate-700 dark:bg-slate-950/60">
                <CardContent className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Policy check</p>
                  <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">Availability rules applied before a booking is confirmed.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

type MiniMetricProps = {
  label: string;
  value: string;
  accent: "primary" | "secondary" | "muted";
};

function MiniMetric({ label, value, accent }: MiniMetricProps) {
  const toneClasses = {
    primary: "from-primary/15 to-primary/5 text-primary",
    secondary: "from-brand-secondary/20 to-brand-secondary/5 text-brand-secondary",
    muted: "from-slate-200/70 to-slate-100/50 text-slate-700 dark:from-slate-800 dark:to-slate-900 dark:text-slate-200",
  } as const;

  return (
    <div className={`rounded-2xl border border-slate-200/80 bg-linear-to-br px-4 py-4 shadow-sm dark:border-slate-700 ${toneClasses[accent]}`}>
      <p className="text-2xl font-black text-slate-950 dark:text-slate-50">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400">{label}</p>
    </div>
  );
}
