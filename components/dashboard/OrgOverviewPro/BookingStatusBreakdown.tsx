import { BarChart3, CheckCircle2, Clock, XCircle } from 'lucide-react'
import React from 'react'

interface BookingStatusBreakdownProps {
    confirmed: number
    completed: number
    pending: number
    cancelled: number
}

export const BookingStatusBreakdown = ({
    confirmed,
    completed,
    pending,
    cancelled,
}: BookingStatusBreakdownProps) => {
    const total = confirmed + completed + pending + cancelled
    const statuses = [
        { label: 'Confirmed', count: confirmed, color: 'from-green-400 to-green-600', bgColor: 'from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10', borderColor: 'border-green-200 dark:border-green-900/30', icon: <CheckCircle2 size={18} className="text-green-600 dark:text-green-400" /> },
        { label: 'Completed', count: completed, color: 'from-blue-400 to-blue-600', bgColor: 'from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10', borderColor: 'border-blue-200 dark:border-blue-900/30', icon: <CheckCircle2 size={18} className="text-blue-600 dark:text-blue-400" /> },
        { label: 'Pending', count: pending, color: 'from-amber-400 to-amber-600', bgColor: 'from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10', borderColor: 'border-amber-200 dark:border-amber-900/30', icon: <Clock size={18} className="text-amber-600 dark:text-amber-400" /> },
        { label: 'Cancelled', count: cancelled, color: 'from-rose-400 to-rose-600', bgColor: 'from-rose-50 to-rose-100/50 dark:from-rose-900/20 dark:to-rose-900/10', borderColor: 'border-rose-200 dark:border-rose-900/30', icon: <XCircle size={18} className="text-rose-600 dark:text-rose-400" /> },
    ]

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-200 to-cyan-100 dark:from-cyan-800/50 dark:to-cyan-900/30">
                    <BarChart3 size={24} className="text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">
                        Booking Status Breakdown
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{total} total bookings</p>
                </div>
            </div>

            <div className="space-y-3">
                {statuses.map((status, idx) => {
                    const percentage = total > 0 ? (status.count / total) * 100 : 0

                    return (
                        <div
                            key={idx}
                            className={`p-4 rounded-lg border bg-gradient-to-r ${status.bgColor} ${status.borderColor} hover:shadow-md transition-all`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    {status.icon}
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{status.label}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{status.count} bookings</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{status.count}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{percentage.toFixed(0)}%</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${status.color} transition-all duration-500`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {statuses.map((status, idx) => (
                    <div key={idx} className="p-3 text-center rounded-lg border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{status.count}</p>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 font-medium">{status.label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
