import React from 'react'
import { Skeleton } from '../shared/Skeleton'

export const OrgHeaderSkeleton = () => {
    return (
        <div className="mb-6 md:mb-8 relative overflow-hidden">
            <div className="relative p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-3 md:gap-4 flex-1">
                    <Skeleton variant="circle" className="w-12 h-12 flex-shrink-0" />
                    <div className="flex-1">
                        <Skeleton className="h-8 w-40 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
                <Skeleton className="h-10 w-40" />
            </div>
        </div>
    )
}

export const MetricsSummarySkeleton = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <Skeleton className="h-3 w-12 mb-3" />
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-1.5 w-full" />
                </div>
            ))}
        </div>
    )
}

export const RecentActivitySkeleton = () => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Skeleton variant="circle" className="w-10 h-10" />
                    <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-3 w-40" />
                    </div>
                </div>
                <Skeleton className="h-4 w-16" />
            </div>

            {/* Activity Items */}
            <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="flex gap-3">
                            <Skeleton variant="circle" className="w-2 h-2 mt-1.5 flex-shrink-0" />
                            <div className="flex-1">
                                <Skeleton className="h-3 w-40 mb-2" />
                                <Skeleton className="h-2.5 w-32" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export const LowCreditAlertsSkeleton = () => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Skeleton variant="circle" className="w-12 h-12" />
                <div>
                    <Skeleton className="h-5 w-28 mb-1" />
                    <Skeleton className="h-3 w-40" />
                </div>
            </div>

            {/* Alert Items */}
            <div className="space-y-2.5">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <Skeleton className="h-4 w-32 mb-1" />
                                <Skeleton className="h-3 w-40" />
                            </div>
                            <Skeleton className="h-5 w-6" />
                        </div>
                        <Skeleton className="h-1.5 w-full mb-2.5" />
                        <Skeleton className="h-8 w-full rounded" />
                    </div>
                ))}
            </div>
        </div>
    )
}
