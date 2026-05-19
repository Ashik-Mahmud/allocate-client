import { BOOKING_STATUS_CONFIG, BookingStatus } from '@/types/booking'
import { X, Clock, User, Filter } from 'lucide-react'
import React, { useState } from 'react'
import BookingStatusBadge from '../my-bookings/BookingStatus';

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

interface ActivityDrawerProps {
    isOpen: boolean
    activities: ActivityItem[]
    onClose: () => void
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
    const colors = {
        CONFIRMED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
        PENDING: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        COMPLETED: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        CANCELLED: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    }
    return colors[status as keyof typeof colors] || colors.PENDING
}

export const ActivityDrawer = ({ isOpen, activities, onClose }: ActivityDrawerProps) => {
    const [filterStatus, setFilterStatus] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredActivities = activities.filter(activity => {
        const matchesStatus = !filterStatus || activity.status === filterStatus
        const matchesSearch = 
            activity.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.resourceName.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesStatus && matchesSearch
    })

    const statuses = Array.from(new Set(activities.map(a => a.status)))

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 z-50 flex flex-col shadow-lg animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="shrink-0 p-4 md:p-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">All Activities</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-slate-600 dark:text-slate-400" />
                        </button>
                    </div>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search by name or resource..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                </div>

                {/* Filters */}
                <div className="shrink-0 px-4 md:px-6 py-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Filter size={14} className="text-slate-500" />
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Filter by Status</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilterStatus(null)}
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                filterStatus === null
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                            }`}
                        >
                            All
                        </button>
                        {statuses.map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                    filterStatus === status
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Activity List */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {filteredActivities.length > 0 ? (
                        <div className="space-y-3">
                            {filteredActivities.map((activity, idx) => (
                                <div
                                    key={`${activity.bookingId}-${idx}`}
                                    className="p-4 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all group"
                                >
                                    <div className="flex gap-3 mb-3">
                                        <div className="shrink-0 mt-0.5">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{backgroundColor: BOOKING_STATUS_CONFIG?.[activity.status as keyof typeof BOOKING_STATUS_CONFIG]?.color || '#888'}}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start flex-wrap justify-between gap-2 mb-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800">
                                                        <User size={14} className="text-slate-600 dark:text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs md:text-sm font-semibold text-slate-900 dark:text-white truncate">{activity.staffName}</p>
                                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{activity.resourceName}</p>
                                                    </div>
                                                </div>
                                                {/* <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${getStatusBadge(activity.status)}`}>
                                                    {activity.status}
                                                </span> */}
                                                <BookingStatusBadge status={activity.status as BookingStatus} />
                                            </div>
                                            <p className="text-[10px] md:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{activity.message}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                                            <Clock size={12} />
                                            <span>{getTimeAgo(activity.createdAt)} ago</span>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-mono">{activity.bookingId.slice(0, 8)}...</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40">
                            <p className="text-sm text-slate-500 dark:text-slate-400">No activities found</p>
                        </div>
                    )}
                </div>

                {/* Footer Stats */}
                <div className="shrink-0 p-4 md:p-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                        <p>Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredActivities.length}</span> of <span className="font-semibold text-slate-900 dark:text-white">{activities.length}</span> activities</p>
                    </div>
                </div>
            </div>
        </>
    )
}
