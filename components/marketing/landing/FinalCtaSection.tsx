import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { ArrowRight } from "lucide-react";

type FinalCtaSectionProps = {
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
};

export function FinalCtaSection({ title, subtitle, primaryCta, secondaryCta }: FinalCtaSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-linear-to-r from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-2xl shadow-slate-950/30 sm:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_32%)]" />
      <div className="relative max-w-3xl">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h2>
        <p className="mt-4 max-w-2xl text-white/80">{subtitle}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full bg-white px-5 text-slate-950 hover:bg-slate-100">
            <Link href="/sign-up">
              {primaryCta}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full border-white/20 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white">
            <Link href="/pricing">{secondaryCta}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
