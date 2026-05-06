import { Panel, StatusPill, EmptyInline } from './SharedComponents'
import { formatCredits, getBookingStatusMeta } from './utils'
import { StaffDashboardData } from '@/types/dashboard'

type UsageHistoryPanelProps = {
    history: StaffDashboardData['usageHistory']
}

export function UsageHistoryPanel({ history }: UsageHistoryPanelProps) {
    return (
        <Panel title="Usage history" description="A compact history of resource usage and cost.">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800">
                {history.length > 0 ? (
                    <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
                        {history.map((entry) => {
                            const statusMeta = getBookingStatusMeta(entry?.status)

                            return (
                                <div key={entry?.bookingId} className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                                    <div className="min-w-0 space-y-1">
                                        <p className="truncate font-medium text-slate-950 dark:text-slate-50">{entry?.resourceName}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {entry?.durationMinutes} min • {formatCredits(entry?.totalCost)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 sm:justify-end">
                                        <StatusPill label={statusMeta?.label} className={statusMeta?.pillClass} />
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
    )
}
