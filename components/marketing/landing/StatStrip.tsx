import { Card, CardContent } from "@/components/ui/card";
import type { LandingStat } from "./landing-types";

type StatStripProps = {
  stats: LandingStat[];
};

export function StatStrip({ stats }: StatStripProps) {
  return (
    <section className="grid gap-3 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-slate-200/80 bg-white/75 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/55">
          <CardContent className="p-4">
            <p className="text-3xl font-black text-slate-950 dark:text-slate-50">{stat.value}</p>
            <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">{stat.label}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{stat.detail}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
