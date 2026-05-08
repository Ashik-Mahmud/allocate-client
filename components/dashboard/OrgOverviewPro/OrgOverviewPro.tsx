"use client"
import React, { useState } from 'react'
import { ExecutiveSummary } from './ExecutiveSummary'
import { CriticalAlerts } from './CriticalAlerts'
import { ResourceAnalytics } from './ResourceAnalytics'
import { StaffEngagement } from './StaffEngagement'
import { FinancialOverview } from './FinancialOverview'
import { AdminRecommendations } from './AdminRecommendations'
import { BookingStatusBreakdown } from './BookingStatusBreakdown'
import {
    ExecutiveSummarySkeleton,
    CriticalAlertsSkeleton,
    ResourceAnalyticsSkeleton,
    StaffEngagementSkeleton,
    FinancialOverviewSkeleton,
    AdminRecommendationsSkeleton,
    BookingStatusBreakdownSkeleton,
} from './Skeletons'
import { useAssignCreditsToMultipleStaffMutation } from '@/features/staff';
import { toast } from 'sonner';
import AssignCredits from '../credit-management/assignCredits';
import { useCurrentUser } from '@/features/auth';

export interface OrgInsights {
    scope: string
    organization: {
        id: string
        name: string
    }
    timezone: string
    executiveSummary: string
    criticalAlerts: Array<{
        id: string
        name: string
        email: string
        personalCredits: number
        reason: string
    }>
    activityInsights: {
        bookingAndResourcePatterns: {
            totalBookings: number
            upcomingBookings: number
            bookingStatusDistribution: {
                confirmed: number
                completed: number
                pending: number
                cancelled: number
            }
            mostUsedResource: string
            resourceAnalytics: Array<{
                name: string
                bookings: number
                totalHours: number
            }>
        }
        staffEngagement: {
            totalStaff: number
            activeStaffThisMonth: number
            mostActiveStaff: Array<{
                staffId: string
                staffName: string
                recentBookings: number
            }>
        }
        financialOverview: {
            organizationCreditPool: number
            totalCreditsAssigned: number
            creditCoverageRatio: number
            lowCreditAlertsCount: number
            lowCreditSeverity: string
            totalCreditsSpentThisMonth: number
            topSpenders: Array<{
                name: string
                creditsSpent: number
            }>
        }
    }
    adminRecommendations: string[]
}

interface OrgOverviewProProps {
    insights?: OrgInsights
    onTopUpCredits?: (userId: string) => void
    isLoading?: boolean
}

export const OrgOverviewPro = ({ insights, onTopUpCredits, isLoading = false }: OrgOverviewProProps) => {

    const { user } = useCurrentUser();
    const [assignOpen, setAssignOpen] = useState(false)
    const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([])

    const assignCreditsMutation = useAssignCreditsToMultipleStaffMutation();

    const handleTopUp = (userId: string) => {
        if (onTopUpCredits) {
            onTopUpCredits(userId)
        } else {
            setSelectedStaffIds([userId])
            setAssignOpen(true)
        }
    }


    const handleAssignSubmit = async (data: { staffCredits: { staff_id: string; credits: number }[] }) => {
        try {
            const payload = {
                staffCredits: data.staffCredits.map((item) => ({
                    staff_id: item.staff_id,
                    credits: item.credits,
                })),
            };
            const response = await assignCreditsMutation.mutateAsync(payload);

            if (response?.success) {
                toast.success(`Successfully assigned credits to ${payload.staffCredits.length} staff member(s).`);
                setAssignOpen(false);
                setSelectedStaffIds([]);
            }
        } catch (error: any) {
            toast.error(error?.message || 'Failed to assign credits.');
        }
    };


    if (isLoading || !insights  ) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-50 to-blue-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-blue-950/20 font-sans">
                <div className="p-0 md:p-3  mx-auto">
                    {/* Header Skeleton */}
                    <div className="mb-8">
                        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-2 animate-pulse" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 animate-pulse" />
                    </div>

                    {/* Executive Summary */}
                    <div className="mb-6 md:mb-8">
                        <ExecutiveSummarySkeleton />
                    </div>

                    {/* Critical Alerts */}
                    <div className="mb-6 md:mb-8">
                        <CriticalAlertsSkeleton />
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
                        <ResourceAnalyticsSkeleton />
                        <StaffEngagementSkeleton />
                        <FinancialOverviewSkeleton />
                        <BookingStatusBreakdownSkeleton />
                    </div>

                    {/* Recommendations */}
                    <div className="mb-6 md:mb-8">
                        <AdminRecommendationsSkeleton />
                    </div>
                </div>
            </div>
        )
    }

    const {
        organization,
        executiveSummary,
        criticalAlerts,
        activityInsights,
        adminRecommendations,
    } = insights

    const {
        bookingAndResourcePatterns,
        staffEngagement,
        financialOverview,
    } = activityInsights ?? {}

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-50 to-blue-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-blue-950/20 font-sans">
            <div className="p-0 md:p-3  mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent mb-2">
                        {organization?.name}
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Advanced organizational insights & analytics dashboard
                    </p>
                </div>

                {/* Executive Summary */}
                <div className="mb-6 md:mb-8">
                    <ExecutiveSummary
                        summary={executiveSummary}
                        criticalAlertCount={criticalAlerts?.length}
                        staffCount={staffEngagement?.totalStaff}
                        activeStaffCount={staffEngagement?.activeStaffThisMonth}
                        totalBookings={bookingAndResourcePatterns?.totalBookings}
                        upcomingBookings={bookingAndResourcePatterns?.upcomingBookings}
                        creditCoverageRatio={financialOverview?.creditCoverageRatio}
                    />
                </div>

                {/* Critical Alerts */}
                {criticalAlerts?.length > 0 && (
                    <div className="mb-6 md:mb-8">
                        <CriticalAlerts alerts={criticalAlerts} onTopUp={handleTopUp} />
                    </div>
                )}

                {/* Unified Insights Grid - Perfectly Aligned */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">

                    {/* 1. Resource Analytics */}
                    <ResourceAnalytics
                        resources={bookingAndResourcePatterns?.resourceAnalytics ?? []}
                        mostUsedResource={bookingAndResourcePatterns?.mostUsedResource ?? ''}
                    />

                    {/* 2. Financial Overview */}
                    <FinancialOverview
                        organizationCreditPool={financialOverview?.organizationCreditPool}
                        totalCreditsAssigned={financialOverview?.totalCreditsAssigned}
                        creditCoverageRatio={financialOverview?.creditCoverageRatio}
                        lowCreditAlertsCount={financialOverview?.lowCreditAlertsCount}
                        lowCreditSeverity={financialOverview?.lowCreditSeverity}
                        totalCreditsSpentThisMonth={financialOverview?.totalCreditsSpentThisMonth}
                        topSpenders={financialOverview?.topSpenders ?? []}
                    />

                    {/* 3. Staff Engagement */}
                    <StaffEngagement
                        totalStaff={staffEngagement?.totalStaff ?? 0}
                        activeStaffThisMonth={staffEngagement?.activeStaffThisMonth ?? 0}
                        mostActiveStaff={staffEngagement?.mostActiveStaff ?? []}
                    />

                    {/* 4. Booking Status Breakdown */}
                    <BookingStatusBreakdown
                        confirmed={bookingAndResourcePatterns?.bookingStatusDistribution?.confirmed}
                        completed={bookingAndResourcePatterns?.bookingStatusDistribution?.completed}
                        pending={bookingAndResourcePatterns?.bookingStatusDistribution?.pending}
                        cancelled={bookingAndResourcePatterns?.bookingStatusDistribution?.cancelled}
                    />

                </div>
                {/* Admin Recommendations */}
                <div className="mb-6 md:mb-8">
                    <AdminRecommendations recommendations={adminRecommendations} />
                </div>
            </div>
            {assignOpen ? <AssignCredits
                open={assignOpen}
                onOpenChange={setAssignOpen}
                selectedStaffIds={selectedStaffIds}
                onSubmit={handleAssignSubmit}
                isLoading={assignCreditsMutation.isPending}
                orgCreditPool={user?.organization?.credit_pool || 0}
                position='bottom'
                error={assignCreditsMutation.error?.message}
            /> : null}
        </div>
    )
}

export default OrgOverviewPro
