import { Zap, TrendingUp } from 'lucide-react'
import React from 'react'

interface Resource {
    name: string
    bookings: number
    totalHours: number
}

interface ResourceAnalyticsProps {
    resources: Resource[]
    mostUsedResource: string
}

export const ResourceAnalytics = ({ resources, mostUsedResource }: ResourceAnalyticsProps) => {
    const maxBookings = Math.max(...resources.map(r => r.bookings), 1)

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-200 to-yellow-100 dark:from-yellow-800/50 dark:to-yellow-900/30">
                    <Zap size={24} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">
                        Resource Analytics
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Usage patterns & demand</p>
                </div>
            </div>

            {/* Most Used Resource Banner */}
            <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-900/30">
                <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 uppercase tracking-wide mb-1">Most In-Demand</p>
                <p className="text-base md:text-lg font-bold text-yellow-900 dark:text-yellow-300">{mostUsedResource}</p>
            </div>

            {/* Resources List */}
            <div className="space-y-3">
                {resources.map((resource, idx) => {
                    const percentage = (resource.bookings / maxBookings) * 100
                    const isMostUsed = resource.name === mostUsedResource

                    return (
                        <div
                            key={idx}
                            className={`p-4 rounded-lg border transition-all ${
                                isMostUsed
                                    ? 'border-yellow-200 dark:border-yellow-900/30 bg-gradient-to-r from-yellow-50/50 to-yellow-50/25 dark:from-yellow-950/30 dark:to-yellow-950/10'
                                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{resource.name}</p>
                                    <div className="flex items-center gap-4 mt-1">
                                        <div className="flex items-center gap-1">
                                            <TrendingUp size={14} className="text-slate-500 dark:text-slate-400" />
                                            <span className="text-xs text-slate-600 dark:text-slate-400">{resource.bookings} bookings</span>
                                        </div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">
                                            {resource.totalHours} hrs
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 text-right">
                                    <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">{resource.bookings}</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${
                                        isMostUsed
                                            ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                                            : 'bg-gradient-to-r from-blue-400 to-blue-600'
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>

                            {/* Badge */}
                            {isMostUsed && (
                                <div className="mt-2 flex items-center gap-1">
                                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400">
                                        ⭐ Highest Demand
                                    </span>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
