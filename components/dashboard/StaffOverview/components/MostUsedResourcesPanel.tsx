import { Landmark } from 'lucide-react'
import { Panel, EmptyInline } from './SharedComponents'
import { StaffDashboardData } from '@/types/dashboard'
import BookingStatusBadge from '../../my-bookings/BookingStatus';
import { BookingStatus } from '@/types/booking';

type MostUsedResourcesPanelProps = {
    resources: StaffDashboardData['mostUsedResources']
}

export function MostUsedResourcesPanel({ resources }: MostUsedResourcesPanelProps) {
    return (
        <Panel title="Most used resources" description="Your top 5 most repeated resources.">
            <div className="space-y-3">
                {resources?.length > 0 ? (
                    resources?.map((resource) => (
                        <div
                            key={resource.id}
                            className="flex items-center flex-wrap gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-2.5 transition-colors hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-800/50 sm:p-3"
                        >
                            {/* Image Container: Shrinks slightly on mobile to save space */}
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:h-14 sm:w-14 sm:rounded-2xl">
                                {resource?.image ? (
                                    <img
                                        src={resource?.image}
                                        alt={resource?.name}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                                        <Landmark className="size-5" aria-hidden="true" />
                                    </div>
                                )}
                            </div>

                            {/* Content: Takes up remaining space */}
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50 sm:text-base">
                                    {resource?.name}
                                </p>
                                {
                                    resource?.isOccupied ? (
                                    <div className="w-max">
                                        <BookingStatusBadge status={BookingStatus.CHECKED_IN} />
                                    </div>
                                ) : (<p className="truncate text-xs capitalize text-slate-500 dark:text-slate-400 sm:text-sm">
                                        {resource?.type?.replaceAll('_', ' ')?.toLowerCase()}
                                    </p>)
                                }

                            </div>

                            {/* Stats Badge: Minimalist on mobile, full detail on desktop */}
                            <div className="shrink-0 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-center dark:border-slate-800 dark:bg-slate-950 sm:rounded-2xl sm:px-3 sm:py-2 sm:text-right">
                                <p className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 sm:block">
                                    uses
                                </p>
                                <p className="text-sm font-bold text-slate-950 dark:text-slate-50">
                                    {resource?.usageCount}
                                    <span className="ml-1 text-[10px] font-medium text-slate-400 sm:hidden">pts</span>
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <EmptyInline text="No frequently used resources yet." />
                )}
            </div>
        </Panel>
    )
}
