"use client"
import { useDashboardOverview } from '@/features/dashboard/hooks'
import { BOOKING_STATUS_CONFIG, BookingStatus } from '@/types/booking'
import { cn } from '@/lib/utils/cn'
import { Activity, ArrowDownRight, CalendarClock, Clock3, Landmark, Sparkles, Wallet } from 'lucide-react'
import React from 'react'
import { TransactionType } from '@/types/credits'
import BookingStatusBadge from '../my-bookings/BookingStatus'

const StaffDashboardOverview = () => {
    const { data, isLoading, isError, error } = useDashboardOverview()
    const insights = data?.insights

    if (isLoading) {
        return <OverviewSkeleton />
    }

    if (isError) {
        return <ErrorState message={error instanceof Error ? error.message : 'Unable to load your staff overview right now.'} />
    }

    if (!insights) {
        return <EmptyState />
    }

    const metrics = insights.metrics
    const recentActivity = insights.recentActivity ?? []
    const mostUsedResources = insights.mostUsedResources ?? []
    const usageHistory = insights.usageHistory ?? []


    console.log(insights, 'insights')

    return (
        <main className="space-y-6">
            <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60 sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-3">
                        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                            <Sparkles className="size-3.5" />
                            Staff overview
                        </span>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 sm:text-3xl">
                                Minimal usage snapshot
                            </h1>
                            <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                                A quiet summary of your balance, usage, and the bookings that shaped your activity this month.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        <Chip label="personal scope" />
                        <Chip label={insights.user.email} />
                        <Chip label={`User ${insights.user.id.slice(0, 8)}`} />
                    </div>
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Current balance"
                    value={formatCredits(metrics.myCurrentBalance)}
                    helper="Available credits"
                    icon={Wallet}
                    accent="emerald"
                />
                <StatCard
                    label="Total spent"
                    value={formatCredits(metrics.totalSpent)}
                    helper={formatLastTransaction(metrics?.lastTransaction?.date)}
                    icon={ArrowDownRight}
                    accent="rose"
                />
                <StatCard
                    label="Usage count"
                    value={metrics.usageCount.toLocaleString()}
                    helper="Bookings logged"
                    icon={Activity}
                    accent="cyan"
                />
                <StatCard
                    label="This month"
                    value={formatCredits(metrics.currentMonthSpent)}
                    helper="Current month spent"
                    icon={CalendarClock}
                    accent="amber"
                />
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">
                    <Panel title="Recent activity" description="Latest booking events and their current status.">
                        <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
                            {recentActivity.length > 0 ? recentActivity.map((activity) => {
                                const statusMeta = getBookingStatusMeta(activity.status)

                                return (
                                    <div key={activity.bookingId} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                                        <div className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border", statusMeta.dotClass)}>
                                            <statusMeta.icon className="size-4" aria-hidden="true" />
                                        </div>

                                        <div className="min-w-0 flex-1 space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="truncate font-medium text-slate-950 dark:text-slate-50">{activity.resourceName}</p>
                                                <StatusPill label={statusMeta.label} className={statusMeta.pillClass} />
                                            </div>
                                            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                                                {normalizeDescription(activity.description, activity.resourceName)}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-500">
                                                {formatRelativeTime(activity.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <EmptyInline text="No recent booking activity yet." />
                            )}
                        </div>
                    </Panel>

                    <Panel title="Usage history" description="A compact history of resource usage and cost.">
                        <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800">
                            {usageHistory.length > 0 ? (
                                <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
                                    {usageHistory.map((entry) => {
                                        const statusMeta = getBookingStatusMeta(entry.status)

                                        return (
                                            <div key={entry.bookingId} className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                                                <div className="min-w-0 space-y-1">
                                                    <p className="truncate font-medium text-slate-950 dark:text-slate-50">{entry.resourceName}</p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                                        {entry.durationMinutes} min • {formatCredits(entry.totalCost)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 sm:justify-end">
                                                    <StatusPill label={statusMeta.label} className={statusMeta.pillClass} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <EmptyInline text="No usage history to display yet." />
                            )}
                        </div>
                    </Panel>
                </div>

                <Panel title="Most used resources" description="Your most repeated resources at a glance.">
                    <div className="space-y-3">
                        {mostUsedResources.length > 0 ? mostUsedResources.map((resource) => (
                            <div key={resource.id} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/40">
                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                                    {resource.image ? (
                                        <img src={resource.image} alt={resource.name} className="h-full w-full object-cover" loading="lazy" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                                            <Landmark className="size-5" aria-hidden="true" />
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium text-slate-950 dark:text-slate-50">{resource.name}</p>

                                    {
                                        resource?.isOccupied ? <div className='w-max my-1'>
                                            <BookingStatusBadge status={BookingStatus.CHECKED_IN} />
                                        </div> : <p className="text-sm text-slate-600 dark:text-slate-400">{resource.type.replaceAll('_', ' ').toLowerCase()}</p>

                                    }
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-right dark:border-slate-800 dark:bg-slate-950">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">uses</p>
                                    <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">{resource.usageCount}</p>
                                </div>

                            </div>
                        )) : (
                            <EmptyInline text="No frequently used resources yet." />
                        )}
                    </div>
                </Panel>
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60 lg:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Last transaction</p>
                    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <p className="truncate text-base font-medium text-slate-950 dark:text-slate-50">
                                {metrics.lastTransaction.description}
                            </p>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                {formatTransactionType(metrics?.lastTransaction?.type as TransactionType)} • {formatDateTime(metrics.lastTransaction.date)}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right dark:border-slate-800 dark:bg-slate-900">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Amount</p>
                            <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">{formatCredits(metrics.lastTransaction.amount)}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Quick note</p>
                    <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        This dashboard is intentionally quiet: only the essentials are surfaced, and every panel collapses cleanly on smaller screens.
                    </p>
                </div>
            </section>
        </main>
    )
}

export default StaffDashboardOverview

function formatCredits(value: number) {
    return `${value.toLocaleString()} CR`
}

function formatTransactionType(type: TransactionType) {
    return type === TransactionType.SPEND ? 'Credits deducted' : 'Credits added'
}

function formatDateTime(value: string) {
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value))
}

function formatLastTransaction(date: string) {
    return `Last activity ${formatRelativeTime(date)}`
}

function formatRelativeTime(value: string) {
    const diffMs = Date.now() - new Date(value).getTime()
    const minutes = Math.max(1, Math.floor(diffMs / 60000))

    if (minutes < 60) {
        return `${minutes}m ago`
    }

    const hours = Math.floor(minutes / 60)
    if (hours < 24) {
        return `${hours}h ago`
    }

    const days = Math.floor(hours / 24)
    return `${days}d ago`
}

function normalizeDescription(description: string, resourceName: string) {
    const sanitized = description.replace(/\bundefined\b\s*/gi, '').trim()

    if (sanitized.length > 0) {
        return sanitized
    }

    return `Activity recorded for ${resourceName}.`
}

function getBookingStatusMeta(status: BookingStatus) {
    const config = BOOKING_STATUS_CONFIG[status] ?? BOOKING_STATUS_CONFIG[BookingStatus.CANCELLED]

    return {
        label: config.label,
        pillClass: config.color,
        dotClass: status === BookingStatus.COMPLETED || status === BookingStatus.CONFIRMED || status === BookingStatus.CHECKED_IN
            ? 'border-emerald-200/70 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
            : status === BookingStatus.PENDING
                ? 'border-amber-200/70 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300'
                : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400',
        icon: config.icon,
    }
}

function Panel({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
    return (
        <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60 sm:p-6">
            <div className="space-y-1.5">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{title}</h2>
                {description ? <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p> : null}
            </div>
            <div className="mt-4">{children}</div>
        </section>
    )
}

function StatCard({ label, value, helper, icon: Icon, accent }: { label: string; value: string; helper: string; icon: React.ElementType; accent: 'emerald' | 'rose' | 'cyan' | 'amber' }) {
    const accentStyles = {
        emerald: 'border-emerald-200/80 bg-emerald-50/80 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300',
        rose: 'border-rose-200/80 bg-rose-50/80 text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300',
        cyan: 'border-cyan-200/80 bg-cyan-50/80 text-cyan-600 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-300',
        amber: 'border-amber-200/80 bg-amber-50/80 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300',
    }[accent]

    return (
        <article className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">{value}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{helper}</p>
                </div>
                <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl border', accentStyles)}>
                    <Icon className="size-5" aria-hidden="true" />
                </div>
            </div>
        </article>
    )
}

function StatusPill({ label, className }: { label: string; className: string }) {
    return (
        <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]', className)}>
            {label}
        </span>
    )
}

function Chip({ label }: { label: string }) {
    return (
        <span className="inline-flex max-w-full items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <span className="truncate">{label}</span>
        </span>
    )
}

function EmptyInline({ text }: { text: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
            {text}
        </div>
    )
}

function EmptyState() {
    return (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
            <Clock3 className="mx-auto size-8 text-slate-400 dark:text-slate-500" aria-hidden="true" />
            <h1 className="mt-4 text-xl font-semibold text-slate-950 dark:text-slate-50">No overview data yet</h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
                Once your first bookings and transactions sync in, the staff overview will populate with balance, usage, and activity.
            </p>
        </div>
    )
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-6 text-sm text-rose-700 shadow-sm dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
            <p className="font-semibold">Could not load staff overview.</p>
            <p className="mt-1 leading-6">{message}</p>
        </div>
    )
}

function OverviewSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60 sm:p-6">
                <div className="h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="mt-4 h-8 w-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="mt-3 h-4 w-full max-w-xl rounded-2xl bg-slate-100 dark:bg-slate-800/70" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-32 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950/60" />
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">
                    <div className="h-72 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950/60" />
                    <div className="h-64 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950/60" />
                </div>
                <div className="h-96 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950/60" />
            </div>
        </div>
    )
}