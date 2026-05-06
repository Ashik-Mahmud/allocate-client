import { BOOKING_STATUS_CONFIG } from '@/types/booking'
import { Activity, ArrowRight, Clock, User } from 'lucide-react'
import React, { useState } from 'react'

interface ActivityItem {
    staffId: string
    staffName: string
    resourceId: string
    resourceName: string
    bookingId: string
    status: string
    message: string
    createdAt: string
}

interface RecentActivityProps {
    activities: ActivityItem[]
    onViewAll?: () => void
}

const getTimeAgo = (date: string): string => {
    const now = new Date()
    const createdDate = new Date(date)
    const diffMs = now.getTime() - createdDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    return `${diffDays}d`
}

const getStatusBadge = (status: string) => {
    const config = BOOKING_STATUS_CONFIG?.[status as keyof typeof BOOKING_STATUS_CONFIG]
    const colors = {
        CONFIRMED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
        PENDING: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        COMPLETED: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        CANCELLED: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    }
    return colors[status as keyof typeof colors] || colors.PENDING
}

export const RecentActivity = ({ activities, onViewAll }: RecentActivityProps) => {
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const displayActivities = activities.slice(0, 5)

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-linear-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/10">
                        <Activity size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">
                            Recent Activity
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{activities.length} activities</p>
                    </div>
                </div>
                {activities.length > 4 && onViewAll && (
                    <button
                        onClick={onViewAll}
                        className="cursor-pointer text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
                    >
                        View All <ArrowRight size={16} />
                    </button>
                )}
            </div>

            {displayActivities.length > 0 ? (
                <div className="space-y-3">
                    {displayActivities.map((activity, idx) => (
                        <div
                            key={`${activity.bookingId}-${idx}`}
                            onClick={() => setExpandedId(expandedId === activity.bookingId ? null : activity.bookingId)}
                            className="p-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-linear-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-linear-to-r hover:from-slate-100 hover:to-transparent dark:hover:from-slate-700/50 transition-all cursor-pointer group"
                        >
                            <div className="flex gap-3 items-start">
                                <div className="shrink-0 mt-1">
                                    <div className="w-2 h-2 rounded-full mt-1.5" style={{backgroundColor: BOOKING_STATUS_CONFIG?.[activity.status as keyof typeof BOOKING_STATUS_CONFIG]?.color || '#888'}} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                                                <User size={14} className="text-slate-600 dark:text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs md:text-sm font-semibold text-slate-900 dark:text-white truncate">{activity.staffName}</p>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{activity.resourceName}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] md:text-xs font-semibold px-2 py-1 rounded-full border whitespace-nowrap ${getStatusBadge(activity.status)}`}>
                                            {activity.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-500 dark:text-slate-400">
                                        <Clock size={12} />
                                        <span>{getTimeAgo(activity.createdAt)} ago</span>
                                    </div>
                                </div>
                            </div>
                            
                            {expandedId === activity.bookingId && (
                                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 animate-in fade-in duration-200">
                                    <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{activity.message}</p>
                                    <div className="mt-3 flex gap-2 text-[10px] text-slate-500">
                                        <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">Booking ID: {activity.bookingId.slice(0, 8)}</span>
                                        <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">{new Date(activity.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Activity size={40} className="text-slate-300 dark:text-slate-700 mb-3" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity</p>
                </div>
            )}
        </div>
    )
}
