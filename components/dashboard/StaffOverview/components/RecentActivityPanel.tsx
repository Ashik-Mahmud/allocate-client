import { cn } from '@/lib/utils/cn'
import { Panel, StatusPill, EmptyInline } from './SharedComponents'
import { formatRelativeTime, normalizeDescription, getBookingStatusMeta } from './utils'
import { StaffDashboardData } from '@/types/dashboard'

type RecentActivityPanelProps = {
    activities: StaffDashboardData['recentActivity']
}

export function RecentActivityPanel({ activities }: RecentActivityPanelProps) {
    return (
        <Panel title="Recent activity" description="Latest booking events and their current status.">
            <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
                {activities.length > 0 ? activities.map((activity) => {
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
                                    {formatRelativeTime(activity?.createdAt)}
                                </p>
                            </div>
                        </div>
                    )
                }) : (
                    <EmptyInline text="No recent booking activity yet." />
                )}
            </div>
        </Panel>
    )
}
