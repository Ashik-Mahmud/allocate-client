import React from 'react'
import { Skeleton } from '../shared/Skeleton'

export const ExecutiveSummarySkeleton = () => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3 flex-1">
                    <Skeleton variant="circle" className="w-12 h-12" />
                    <div className="flex-1">
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <Skeleton className="w-24 h-8" />
            </div>

            {/* Summary Text */}
            <div className="mb-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <Skeleton className="h-3 w-16 mb-2" />
                        <Skeleton className="h-6 w-12 mb-2" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export const CriticalAlertsSkeleton = () => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Skeleton variant="circle" className="w-12 h-12" />
                <div>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-40" />
                </div>
            </div>

            {/* Alert Cards */}
            <div className="space-y-2.5">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="flex items-start gap-3 mb-3">
                            <Skeleton variant="circle" className="w-2 h-2 mt-1" />
                            <div className="flex-1">
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-3 w-40" />
                            </div>
                            <Skeleton className="w-16 h-6" />
                        </div>
                        <Skeleton className="h-1.5 w-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export const ResourceAnalyticsSkeleton = () => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Skeleton variant="circle" className="w-12 h-12" />
                <div>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>

            {/* Most Used Banner */}
            <div className="mb-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-6 w-40" />
            </div>

            {/* Resources List */}
            <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="flex items-start justify-between mb-2">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-6 w-8" />
                        </div>
                        <Skeleton className="h-2 w-full mb-2" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export const StaffEngagementSkeleton = () => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Skeleton variant="circle" className="w-12 h-12" />
                <div>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <Skeleton className="h-3 w-16 mb-2" />
                        <Skeleton className="h-6 w-12" />
                    </div>
                ))}
            </div>

            {/* Top Performers */}
            <div className="space-y-2.5">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <Skeleton className="h-4 w-40 mb-2" />
                        <Skeleton className="h-1.5 w-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export const FinancialOverviewSkeleton = () => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Skeleton variant="circle" className="w-12 h-12" />
                <div>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <Skeleton className="h-3 w-16 mb-2" />
                        <Skeleton className="h-6 w-12" />
                    </div>
                ))}
            </div>

            {/* Spending */}
            <div className="mb-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                <Skeleton className="h-3 w-32 mb-2" />
                <Skeleton className="h-8 w-20" />
            </div>

            {/* Top Spenders */}
            <div className="space-y-2 mb-4">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <Skeleton className="h-1.5 w-full" />
                    </div>
                ))}
            </div>

            {/* Alert */}
            <Skeleton className="h-16 w-full rounded-lg" />
        </div>
    )
}

export const AdminRecommendationsSkeleton = () => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Skeleton variant="circle" className="w-12 h-12" />
                <div>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-40" />
                </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-3 mb-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="flex gap-3">
                            <Skeleton variant="circle" className="w-5 h-5 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-3 w-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                <Skeleton className="h-3 w-24 mb-3" />
                <div className="grid grid-cols-3 gap-2">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-full rounded" />
                    ))}
                </div>
            </div>
        </div>
    )
}

export const BookingStatusBreakdownSkeleton = () => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Skeleton variant="circle" className="w-12 h-12" />
                <div>
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>

            {/* Status Breakdown */}
            <div className="space-y-3 mb-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="flex items-start justify-between mb-3">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-6 w-12" />
                        </div>
                        <Skeleton className="h-2.5 w-full" />
                    </div>
                ))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                        <Skeleton className="h-6 w-8 mx-auto mb-1" />
                        <Skeleton className="h-3 w-12 mx-auto" />
                    </div>
                ))}
            </div>
        </div>
    )
}
