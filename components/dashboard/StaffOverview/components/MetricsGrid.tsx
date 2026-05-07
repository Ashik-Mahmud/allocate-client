import { Activity, ArrowDownRight, CalendarClock, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatCredits, formatLastTransaction } from './utils'
import { StaffDashboardData } from '@/types/dashboard'

type MetricsGridProps = {
    metrics: StaffDashboardData['metrics']
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
    return (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
                label="Current balance"
                value={formatCredits(metrics?.myCurrentBalance || 0)}
                helper="Available credits"
                icon={Wallet}
                accent="emerald"
            />
            <StatCard
                label="Total spent"
                value={formatCredits(metrics?.totalSpent || 0)}
                helper={formatLastTransaction(metrics?.lastTransaction?.date)}
                icon={ArrowDownRight}
                accent="rose"
            />
            <StatCard
                label="Usage count"
                value={metrics?.usageCount?.toLocaleString() || '0'}
                helper="Bookings logged"
                icon={Activity}
                accent="cyan"
            />
            <StatCard
                label="This month"
                value={formatCredits(metrics?.currentMonthSpent || 0)}
                helper="Current month spent"
                icon={CalendarClock}
                accent="amber"
            />
        </section>
    )
}

interface StatCardProps {
    label: string
    value: string
    helper: string
    icon: React.ElementType
    accent: 'emerald' | 'rose' | 'cyan' | 'amber'
}

function StatCard({ label, value, helper, icon: Icon, accent }: StatCardProps) {
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
