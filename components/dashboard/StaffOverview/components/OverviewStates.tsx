import { Clock3 } from 'lucide-react'

export function OverviewSkeleton() {
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

export function EmptyState() {
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

interface ErrorStateProps {
    message: string
}

export function ErrorState({ message }: ErrorStateProps) {
    return (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-6 text-sm text-rose-700 shadow-sm dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
            <p className="font-semibold">Could not load staff overview.</p>
            <p className="mt-1 leading-6">{message}</p>
        </div>
    )
}
