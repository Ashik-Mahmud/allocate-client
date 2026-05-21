"use client";

import { MarketingLocaleNav } from "@/components/marketing/MarketingLocaleNav";
import { Link } from "@/lib/navigation";
import { LayoutGrid } from "lucide-react";

type MarketingHeaderProps = {
  badge: string;
  activePath: "/" | "/pricing" | "/about-us" | "/features" | "/case-study" | "/docs";
  ctaLabel?: string;
  ctaHref?: string;
};

export function MarketingHeader({ badge, activePath, ctaLabel, ctaHref }: MarketingHeaderProps) {
  return (
    <header className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <Link
        href="/"
        className="group inline-flex items-center gap-3 self-start rounded-full border border-white/60 bg-white/80 px-3 py-2 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/70 dark:bg-slate-950/60"
      >
        <span className="inline-grid size-10 place-items-center rounded-full bg-linear-to-br from-primary to-brand-secondary text-white shadow-lg shadow-primary/25">
          <LayoutGrid className="size-5" aria-hidden="true" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-black uppercase tracking-[0.18em] text-slate-950 dark:text-slate-50">Allocate</span>
          <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{badge}</span>
        </span>
      </Link>

      <MarketingLocaleNav activePath={activePath} ctaLabel={ctaLabel} ctaHref={ctaHref} />
    </header>
  );
}
