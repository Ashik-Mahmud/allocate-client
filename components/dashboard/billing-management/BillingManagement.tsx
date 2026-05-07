"use client"

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Banknote, CheckCircle2, Clock3, Crown, Layers3, ShieldCheck, Sparkles, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/features/auth'
import { ROUTES } from '@/lib/constants/routes'
import { SUBSCRIPTION_LIMITS } from '@/lib/constants/subscription'
import { cn } from '@/lib/utils/cn'
import { PaymentStatus, PlanType, type Subscription } from '@/types/organization'

type FeatureKey = 'AI_INSIGHTS' | 'ADVANCED_RULES' | 'PRIORITY_SUPPORT'

type FeatureMeta = {
  key: FeatureKey
  label: string
  icon: React.ComponentType<{ className?: string }>
}

type PlanMeta = {
  plan: PlanType
  name: string
  subtitle: string
  accent: string
  surface: string
  border: string
  ctaLabel: string
  ctaHref: string
  featured?: boolean
}

const FEATURE_CATALOG: FeatureMeta[] = [
  { key: 'AI_INSIGHTS', label: 'AI insights', icon: Sparkles },
  { key: 'ADVANCED_RULES', label: 'Advanced rules', icon: Layers3 },
  { key: 'PRIORITY_SUPPORT', label: 'Priority support', icon: ShieldCheck },
]

const PLAN_CARDS: PlanMeta[] = [
  {
    plan: PlanType.FREE,
    name: 'Starter',
    subtitle: 'For small teams getting organized.',
    accent: 'from-slate-900 via-slate-800 to-slate-700',
    surface: 'bg-slate-50/90 dark:bg-slate-950/70',
    border: 'border-slate-200 dark:border-slate-800',
    ctaLabel: 'View pricing',
    ctaHref: ROUTES.pricing,
  },
  {
    plan: PlanType.PRO,
    name: 'Pro',
    subtitle: 'The practical upgrade for growing teams.',
    accent: 'from-emerald-600 via-emerald-500 to-cyan-500',
    surface: 'bg-white dark:bg-slate-950/80',
    border: 'border-emerald-200/80 dark:border-emerald-500/20',
    ctaLabel: 'Upgrade to Pro',
    ctaHref: ROUTES.pricing,
    featured: true,
  },
  {
    plan: PlanType.ENTERPRISE,
    name: 'Enterprise',
    subtitle: 'For large organizations with custom needs.',
    accent: 'from-amber-500 via-orange-500 to-rose-500',
    surface: 'bg-slate-50/90 dark:bg-slate-950/70',
    border: 'border-slate-200 dark:border-slate-800',
    ctaLabel: 'Talk to sales',
    ctaHref: ROUTES.pricing,
  },
]

function formatDate(value?: string | Date | null) {
  if (!value) return 'Not available'

  const parsed = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Not available'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed)
}

function formatPlanLabel(plan?: PlanType | null) {
  if (!plan) return 'Starter'

  return plan
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function SectionShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
      {children}
    </section>
  )
}

function MetricCard({ label, value, helper, icon: Icon }: { label: string; value: string; helper?: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{value}</p>
          {helper ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helper}</p> : null}
        </div>
        <div className="rounded-xl bg-slate-100 p-2 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <Icon className="size-4" />
        </div>
      </div>
    </div>
  )
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

function CompactPlanCard({ plan, limits, isCurrent }: { plan: PlanMeta; limits: (typeof SUBSCRIPTION_LIMITS)[PlanType]; isCurrent: boolean }) {
  const featureCount = FEATURE_CATALOG.filter(({ key }) => Boolean(limits.FEATURES[key])).length

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
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{limits.MAX_USERS}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-950/40">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Resources</p>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{limits.MAX_RESOURCES}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {FEATURE_CATALOG.map(({ key, label }) => (
          <FeatureChip key={key} label={label} supported={Boolean(limits.FEATURES[key])} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
        <span>{featureCount} features enabled</span>
        <span>{limits.BOOKING_WINDOW_DAYS}d window</span>
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

function CurrentSubscriptionPanel({
  currentPlan,
  billingStatus,
  subscription,
  currentLimits,
  creditPool,
}: {
  currentPlan: PlanType
  billingStatus: PaymentStatus
  subscription: Subscription | null
  currentLimits: (typeof SUBSCRIPTION_LIMITS)[PlanType]
  creditPool: number
}) {
  const statusClassName =
    billingStatus === PaymentStatus.COMPLETED
      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
      : billingStatus === PaymentStatus.PENDING
        ? 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300'
        : billingStatus === PaymentStatus.FAILED
          ? 'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300'
          : 'border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'

  return (
    <SectionShell title="Current billing" subtitle="The active subscription record and the limits it carries.">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-950">
            {formatPlanLabel(currentPlan)}
          </span>
          <span className={cn('rounded-full border px-3 py-1 text-xs font-medium capitalize', statusClassName)}>
            {billingStatus.toLowerCase().replace('_', ' ')}
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            {subscription?.is_active ? 'Active cycle' : 'No active cycle'}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Credit pool" value={`${creditPool.toLocaleString()}`} helper="Organization credits" icon={Banknote} />
          <MetricCard label="Users" value={`${currentLimits.MAX_USERS}`} helper="Workspace limit" icon={Users} />
          <MetricCard label="Resources" value={`${currentLimits.MAX_RESOURCES}`} helper="Workspace limit" icon={Layers3} />
          <MetricCard label="Renewal" value={formatDate(subscription?.end_date ?? null)} helper="Billing period end" icon={Clock3} />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Started</p>
            <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">{formatDate(subscription?.start_date ?? null)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Billing status</p>
            <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">{billingStatus.toLowerCase().replace('_', ' ')}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Reminder</p>
            <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">{subscription?.last_reminder_sent ? formatDate(subscription.last_reminder_sent) : 'None sent'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {FEATURE_CATALOG.map(({ key, label }) => (
            <FeatureChip key={key} label={label} supported={Boolean(currentLimits.FEATURES[key])} />
          ))}
        </div>
      </div>
    </SectionShell>
  )
}

const BillingManagement = () => {
  const { user, isLoading } = useCurrentUser()
  const organization = user?.organization ?? null
  const subscription = organization?.subscription ?? null

  console.log(subscription, 'subscription')

  const currentPlan = subscription?.plan_name ?? organization?.plan_type ?? PlanType.FREE
  const currentLimits = SUBSCRIPTION_LIMITS[currentPlan]
  const billingStatus = subscription?.payment_status ?? (currentPlan === PlanType.FREE ? PaymentStatus.PENDING : PaymentStatus.COMPLETED)

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="h-40 animate-pulse rounded-[2rem] border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900/70" />
        <div className="grid gap-4 xl:grid-cols-[1.08fr_1fr]">
          <div className="h-80 animate-pulse rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900/70" />
          <div className="h-80 animate-pulse rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900/70" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
        <div className="bg-linear-to-r from-slate-950 via-slate-900 to-slate-700 px-5 py-6 text-white sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                <Crown className="size-3.5" />
                Billing Management
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Simple billing, clear choices</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
                A compact view of your current plan and the three upgrade paths, designed to stay readable on both desktop and mobile.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                {formatPlanLabel(currentPlan)} plan
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                {billingStatus.toLowerCase().replace('_', ' ')}
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                {formatDate(subscription?.end_date ?? null)} renewal
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-t border-slate-200 p-5 dark:border-slate-800 sm:p-6 xl:grid-cols-[1.08fr_1fr]">
          <CurrentSubscriptionPanel
            currentPlan={currentPlan}
            billingStatus={billingStatus}
            subscription={subscription}
            currentLimits={currentLimits}
            creditPool={organization?.credit_pool ?? 0}
          />

          <SectionShell title="Plan comparison" subtitle="The essentials only, so the cards stay short and easy to compare.">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {PLAN_CARDS.map((plan) => (
                <CompactPlanCard key={plan.plan} plan={plan} limits={SUBSCRIPTION_LIMITS[plan.plan]} isCurrent={plan.plan === currentPlan} />
              ))}
            </div>
          </SectionShell>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 sm:px-6">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Need more capacity?</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Use the upgrade card or move straight to credits management.</p>
        </div>
        <Link
          href={ROUTES.dashboardOrgAdmin.creditManagement}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Manage credits
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}

export default BillingManagement