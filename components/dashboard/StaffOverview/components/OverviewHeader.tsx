import { Sparkles } from 'lucide-react'
import { Chip } from './SharedComponents'

interface OverviewHeaderProps {
    user: {
        id: string
        email: string
    }
}

export function OverviewHeader({ user }: OverviewHeaderProps) {
    return (
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
                    <Chip label={user.email} />
                    <Chip label={`User ${user.id.slice(0, 8)}`} />
                </div>
            </div>
        </section>
    )
}
