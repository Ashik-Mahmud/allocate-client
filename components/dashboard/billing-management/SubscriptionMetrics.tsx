"use client"

import React from 'react'
import { Banknote, CalendarPlus, CheckCircle2, ChevronRight, Clock3, Layers3, Users } from 'lucide-react'

import { SUBSCRIPTION_LIMITS } from '@/lib/constants/subscription'
import { cn } from '@/lib/utils/cn'
import { PaymentStatus, PlanType, type Subscription } from '@/types/organization'
import type { CreditTransaction } from '@/types/credits'
import { FEATURE_CATALOG } from './billing-constants'
import { RenewalCountdown } from './RenewalCountdown'
import PaymentProviderBadge from '@/components/shared/payment-method';
import { InvoiceDownloadCard } from './InvoiceDownloadCard'

interface SubscriptionMetricsProps {
    currentPlan: PlanType
    billingStatus: PaymentStatus
    subscription: Subscription | null
    creditPool: number
    organizationName?: string | null
    creditTransactions?: CreditTransaction[]
    onExtend?: () => void
}

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

export const SubscriptionMetrics: React.FC<SubscriptionMetricsProps> = ({ currentPlan, billingStatus, subscription, creditPool, organizationName, creditTransactions, onExtend }) => {

    const currentLimits = SUBSCRIPTION_LIMITS[currentPlan]
    const isPaidPlan = currentPlan !== PlanType.FREE && currentPlan !== null && subscription?.is_active

    const statusClassName =
        billingStatus === PaymentStatus.COMPLETED
            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
            : billingStatus === PaymentStatus.PENDING
                ? 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                : billingStatus === PaymentStatus.FAILED
                    ? 'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                    : 'border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'

    function formatPlanLabel(plan?: PlanType | null) {
        if (!plan) return 'Starter'

        return plan
            .toLowerCase()
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    // Show renewal countdown if subscription is expiring within the next 7 days
    const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;
    const today = new Date().getTime();
    const expiryDate = subscription?.end_date ? new Date(subscription.end_date).getTime() : 0;
    const isShowRenewalCountdown = expiryDate > today && expiryDate < (today + SEVEN_DAYS_IN_MS);

    return (
        <SectionShell title="Current billing" subtitle="The active subscription record and the limits it carries." >
            <div className="space-y-4 relative">
                {
                    isShowRenewalCountdown && (
                        <div className="absolute -top-20 -right-3">
                            <RenewalCountdown endDate={subscription?.end_date} variant="card" showSecondsInCard={true} animation={true} />
                        </div>
                    )
                }
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
                    {isPaidPlan && (
                        <button className="group relative flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/50 px-4 py-1.5 text-xs font-medium text-amber-700 transition-all hover:bg-amber-100 hover:shadow-sm dark:border-amber-900/30 dark:bg-amber-900/10 dark:text-amber-400 dark:hover:bg-amber-900/20 cursor-pointer" onClick={onExtend}>
                            <CalendarPlus className="h-3.5 w-3.5 animate-pulse" />
                            <span>Extend Current Plan</span>
                            <ChevronRight className="h-3 w-3 opacity-50 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard label="Credit pool" value={`${creditPool.toLocaleString()}`} helper="Organization credits" icon={Banknote} />
                    <MetricCard label="Users" value={`${currentLimits?.MAX_USERS ?? 0}`} helper="Workspace limit" icon={Users} />
                    <MetricCard label="Resources" value={`${currentLimits?.MAX_RESOURCES ?? 0}`} helper="Workspace limit" icon={Layers3} />
                    <MetricCard label="Renewal" value={formatDate(subscription?.end_date ?? null)} helper="Billing period end" icon={Clock3} />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Started</p>
                        <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">{formatDate(subscription?.start_date ?? null)}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Billing status</p>
                        <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">{subscription?.payment_status ?? '-'}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                        <p className="text-[11px] mb-1 font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Provider </p>

                        {
                            <PaymentProviderBadge
                                provider={subscription?.provider || 'unknown'}
                                showIcon={true}
                                transactionId={subscription?.last_transaction_id ?? ''}
                            />
                        }
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {FEATURE_CATALOG.map(({ key, label }) => (
                        <FeatureChip key={key} label={label} supported={Boolean(currentLimits?.FEATURES?.[key])} />
                    ))}
                </div>

                <InvoiceDownloadCard
                    organizationName={organizationName}
                    subscription={subscription}
                    creditTransactions={creditTransactions}
                />
            </div>
        </SectionShell>
    )
}
