import { Users, Star } from 'lucide-react'
import React from 'react'

interface TopStaff {
    staffId: string
    staffName: string
    recentBookings: number
}

interface StaffEngagementProps {
    totalStaff: number
    activeStaffThisMonth: number
    mostActiveStaff: TopStaff[]
}

export const StaffEngagement = ({
    totalStaff,
    activeStaffThisMonth,
    mostActiveStaff,
}: StaffEngagementProps) => {
    const utilizationRate = Math.round((activeStaffThisMonth / totalStaff) * 100)
    const maxBookings = Math.max(...mostActiveStaff.map(s => s.recentBookings), 1)

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-200 to-purple-100 dark:from-purple-800/50 dark:to-purple-900/30">
                    <Users size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">
                        Staff Engagement
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Team activity & performance</p>
                </div>
            </div>

            {/* Engagement Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-200 dark:border-purple-900/30">
                    <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide">Total Staff</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-300 mt-1">{totalStaff}</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-900/10 border border-pink-200 dark:border-pink-900/30">
                    <p className="text-xs font-semibold text-pink-700 dark:text-pink-400 uppercase tracking-wide">Active</p>
                    <p className="text-2xl font-bold text-pink-900 dark:text-pink-300 mt-1">
                        {activeStaffThisMonth} ({utilizationRate}%)
                    </p>
                </div>
            </div>

            {/* Top Performers */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                    <Star size={16} className="text-purple-600 dark:text-purple-400" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Top Performers</p>
                </div>

                <div className="space-y-2.5">
                    {mostActiveStaff.map((staff, idx) => {
                        const percentage = (staff.recentBookings / maxBookings) * 100
                        return (
                            <div key={staff.staffId} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-900/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2 flex-1">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                {staff.staffName}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400 flex-shrink-0">
                                        {staff.recentBookings}
                                    </p>
                                </div>

                                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">Recent bookings</p>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Engagement Rate */}
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-50/50 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-100 dark:border-purple-900/20">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide">Engagement Rate</p>
                        <p className="text-lg font-bold text-purple-900 dark:text-purple-300 mt-1">{utilizationRate}%</p>
                    </div>
                    <p className="text-[10px] text-purple-600 dark:text-purple-500 text-right">
                        {activeStaffThisMonth} active / {totalStaff} total this month
                    </p>
                </div>
            </div>
        </div>
    )
}
