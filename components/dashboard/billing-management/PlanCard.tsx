"use client"

import React from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { SUBSCRIPTION_LIMITS } from '@/lib/constants/subscription'
import { cn } from '@/lib/utils/cn'
import { PlanType } from '@/types/organization'
import { FEATURE_CATALOG, type PlanMeta } from './billing-constants'

interface PlanCardProps {
  plan: PlanMeta
  isCurrent: boolean
}

function FeatureChip({ label, supported }: { label: string; supported: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium',
        supported
          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
          : 'border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
      )}
    >
      {supported ? <CheckCircle2 className="size-3.5" /> : null}
      {label}
    </span>
  )
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, isCurrent }) => {
  const limits = SUBSCRIPTION_LIMITS[plan.plan]
  const featureCount = FEATURE_CATALOG.filter(({ key }) => Boolean(limits?.FEATURES?.[key])).length ?? 0

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-3xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
        plan.surface,
        plan.border,
        isCurrent && 'ring-2 ring-slate-900/10 dark:ring-slate-100/10'
      )}
    >
      <div className={cn('absolute inset-x-0 top-0 h-1 bg-linear-to-r', plan.accent)} />

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{plan.name}</h3>
            {plan.featured ? (
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                Popular
              </span>
            ) : null}
            {isCurrent ? (
              <span className="rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                Current
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{plan.subtitle}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-950/40">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Users</p>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{limits?.MAX_USERS ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-950/40">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Resources</p>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{limits?.MAX_RESOURCES ?? 0}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {FEATURE_CATALOG.map(({ key, label }) => (
          <FeatureChip key={key} label={label} supported={Boolean(limits?.FEATURES?.[key])} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
        <span>{featureCount} features enabled</span>
        <span>{limits?.BOOKING_WINDOW_DAYS ?? 0}d window</span>
      </div>

      <Button asChild size="sm" variant={isCurrent ? 'outline' : 'default'} className="mt-4 w-full rounded-xl">
        <Link href={plan.ctaHref}>
          {isCurrent ? 'Stay on plan' : plan.ctaLabel}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </article>
  )
}
