"use client"
import { useOrganizationInsights } from '@/features/dashboard/hooks'
import React, { useState } from 'react'
import { OrgHeader } from './OrgHeader'
import { MetricsSummary } from './MetricsSummary'
import { RecentActivity } from './RecentActivity'
import { LowCreditAlerts } from './LowCreditAlerts'
import { ActivityDrawer } from './ActivityDrawer'
import {
    OrgHeaderSkeleton,
    MetricsSummarySkeleton,
    RecentActivitySkeleton,
    LowCreditAlertsSkeleton,
} from './Skeletons'
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';
import AssignCredits from '../credit-management/assignCredits';
import { useAssignCreditsToMultipleStaffMutation } from '@/features/staff';
import { toast } from 'sonner';
import { useCurrentUser } from '@/features/auth';
import { OrgOverviewPro } from '../OrgOverviewPro';
import { FileText, Map, Sparkles, TrendingUp, Users } from 'lucide-react';
import UpgradeProOverview from './UpgradeProOverview';

type Props = {
    orgInsights: any;
}

const OrgDashboardOverview = ({ orgInsights }: Props) => {
    const { user } = useCurrentUser()
    const router = useRouter()
    const [showActivityDrawer, setShowActivityDrawer] = useState(false)
    const [assignOpen, setAssignOpen] = useState(false)
    const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([])


    const assignCreditsMutation = useAssignCreditsToMultipleStaffMutation();

    const data: any = orgInsights?.data?.insights
    const metrics = data?.metrics
    const recentStaffActivity = data?.recentStaffActivity || []
    const lowCreditAlerts = data?.lowCreditAlerts || []


    const handleManageCredits = () => {
        // TODO: Navigate to credit management
        console.log('Navigate to credit management')
        router.push(ROUTES.dashboardOrgAdmin.creditManagement)
    }

    const handleTopUp = (userId: string) => {
        // TODO: Open top-up modal
        // console.log('Top up for user:', userId)
        setSelectedStaffIds([userId])
        setAssignOpen(true)
    }

    const handleViewAllActivity = () => {
        setShowActivityDrawer(true)
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

    if (orgInsights?.isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-50 to-blue-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-blue-950/20 font-sans">
                <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                    <OrgHeaderSkeleton />
                    <MetricsSummarySkeleton />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                        <div className="lg:col-span-2">
                            <RecentActivitySkeleton />
                        </div>
                        <div>
                            <LowCreditAlertsSkeleton />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-50 to-blue-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-blue-950/20 font-sans">
                <div className="p-4 md:p-6 lg:p-8 mx-auto">
                    {/* Header */}
                    <OrgHeader organizationName={data?.organization?.name} onManageCredits={handleManageCredits} />

                    {/* Metrics Summary Grid */}
                    <MetricsSummary
                        totalStaff={metrics?.totalStaff || 0}
                        organizationCreditPool={metrics?.organizationCreditPool || 0}
                        totalCreditsAssigned={metrics?.totalCreditsAssigned || 0}
                        lowCreditAlertsCount={metrics?.lowCreditAlertsCount || 0}
                        totalBookings={metrics?.totalBookings || 0}
                        upcomingBookings={metrics?.upcomingBookings || 0}
                    />

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                        {/* Recent Activity - Spans 2 cols on desktop */}
                        <div className="lg:col-span-2">
                            <RecentActivity activities={recentStaffActivity} onViewAll={handleViewAllActivity} />
                        </div>

                        {/* Low Credit Alerts - Right Column */}
                        <div>
                            <LowCreditAlerts
                                alerts={lowCreditAlerts}
                                count={metrics?.lowCreditAlertsCount || 0}
                                onTopUp={handleTopUp}
                            />
                        </div>
                    </div>
                </div>

                {/* Activity Drawer */}
                <ActivityDrawer
                    isOpen={showActivityDrawer}
                    activities={recentStaffActivity}
                    onClose={() => setShowActivityDrawer(false)}
                />
                <AssignCredits
                    open={assignOpen}
                    onOpenChange={setAssignOpen}
                    selectedStaffIds={selectedStaffIds}
                    onSubmit={handleAssignSubmit}
                    isLoading={assignCreditsMutation.isPending}
                    orgCreditPool={user?.organization?.credit_pool || 0}
                    position='bottom'
                    error={assignCreditsMutation.error?.message}
                />
                <div className="px-5 pb-8">
                    <UpgradeProOverview orgName={data?.organization?.name} />
                </div>
            </div>

        </>
    )
}

export default OrgDashboardOverview

