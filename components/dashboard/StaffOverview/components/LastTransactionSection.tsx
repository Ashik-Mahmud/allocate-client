import { formatCredits, formatTransactionType, formatDateTime } from './utils'
import { StaffDashboardData } from '@/types/dashboard'

type LastTransactionSectionProps = {
    metrics: StaffDashboardData['metrics']
}

export function LastTransactionSection({ metrics }: LastTransactionSectionProps) {
    return (
        <section className="grid grid-cols-1 gap-4 overflow-hidden lg:grid-cols-3">
    {/* Last Transaction: Spans 1 column on mobile/tablet, 2 on desktop */}
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60 lg:col-span-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            Last transaction
        </p>
        
        {/* 
            Flex Logic: 
            - Stacks vertically on small mobile (gap-4)
            - Side-by-side on 'sm' screens (640px+) and above 
        */}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
                <p className="truncate text-base font-medium text-slate-950 dark:text-slate-50">
                    {metrics.lastTransaction.description}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {formatTransactionType(metrics.lastTransaction.type)} • {formatDateTime(metrics.lastTransaction.date)}
                </p>
            </div>

            {/* Price badge: Centered on mobile text, right-aligned on desktop */}
            <div className="shrink-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left sm:text-right dark:border-slate-800 dark:bg-slate-900">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Amount</p>
                <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
                    {formatCredits(metrics.lastTransaction.amount)}
                </p>
            </div>
        </div>
    </div>

    {/* Quick Note: Stacks naturally below the transaction on mobile */}
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Quick note</p>
        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
            This dashboard is intentionally quiet: only the essentials are surfaced, and every panel collapses cleanly on smaller screens.
        </p>
    </div>
</section>
    )
}
