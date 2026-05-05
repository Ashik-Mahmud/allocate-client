"use client"
import React from 'react'
import { useCurrentUser } from '@/features/auth'
import { SUBSCRIPTION_LIMITS } from '@/lib/constants/subscription'
import { PlanType } from '@/types/organization'
import { AlertCircle, AlertTriangle, ChevronRight, Zap } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'

const PlanLimitExceed = () => {
    const { MAX_RESOURCES, MAX_USERS } = SUBSCRIPTION_LIMITS.FREE;
    const { user } = useCurrentUser();

    const isFreePlan = user?.organization?.plan_type === PlanType.FREE;
    const currentResourcesCount = user?.organization?._count?.resources || 0;
    const currentUsersCount = user?.organization?._count?.users || 0;

    const isResourceLimitExceeded = currentResourcesCount > MAX_RESOURCES;
    const isUserLimitExceeded = currentUsersCount > MAX_USERS;

    if (!isFreePlan || (!isResourceLimitExceeded && !isUserLimitExceeded)) return null;

    return (
        <div className="w-full bg-rose-100 dark:bg-rose-200 px-4 py-2 text-white">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-1.5 rounded-md">
                        <AlertCircle size={18} className="text-rose-500" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <p className="text-sm font-medium text-rose-600">
                            <span className="font-bold underline mr-1 uppercase tracking-tight">Limit Reached:</span>
                            {isResourceLimitExceeded && `Resources at ${currentResourcesCount}/${MAX_RESOURCES}. `}
                            {isUserLimitExceeded && `Staff at ${currentUsersCount}/${MAX_USERS}. `}


                            <span className="block sm:inline font-semibold">
                                New bookings are automatically disabled
                            </span>
                            {" "}until you upgrade to Pro or reduce your usage.
                        </p>
                    </div>
                </div>

                <Link
                    href={ROUTES.dashboardOrgAdmin.billing}
                    className="flex items-center gap-2 bg-white text-red-600 px-4 py-1.5 rounded-md text-sm font-bold hover:bg-slate-100 transition-colors shrink-0 shadow-sm"
                >
                    <Zap size={14} fill="currentColor" />
                    Upgrade to Pro
                </Link>
            </div>
        </div>
    )
}

export default PlanLimitExceed;