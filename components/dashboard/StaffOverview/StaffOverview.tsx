"use client"
import { useDashboardOverview } from '@/features/dashboard/hooks'
import React from 'react'
import { OverviewHeader } from './components/OverviewHeader'
import { MetricsGrid } from './components/MetricsGrid'
import { RecentActivityPanel } from './components/RecentActivityPanel'
import { UsageHistoryPanel } from './components/UsageHistoryPanel'
import { MostUsedResourcesPanel } from './components/MostUsedResourcesPanel'
import { LastTransactionSection } from './components/LastTransactionSection'
import { EmptyState, ErrorState, OverviewSkeleton } from './components/OverviewStates'


const StaffDashboardOverview = () => {
    const { data, isLoading, isError, error } = useDashboardOverview()
    const insights = data?.insights

    if (isLoading) {
        return <OverviewSkeleton />
    }

    if (isError) {
        return <ErrorState message={error instanceof Error ? error.message : 'Unable to load your staff overview right now.'} />
    }

    if (!insights) {
        return <EmptyState />
    }

    const metrics = insights.metrics
    const recentActivity = insights.recentActivity ?? []
    const mostUsedResources = insights.mostUsedResources?.slice(0, 5) ?? []
    const usageHistory = insights.usageHistory ?? []

    return (
        <main className="space-y-6">
            <OverviewHeader user={insights.user} />
            <MetricsGrid metrics={metrics} />

            <section className="grid gap-6 xl:grid-cols-3 ">

                <div className='col-span-1 md:col-span-2'>
                    <RecentActivityPanel activities={recentActivity} />
                </div>
                <MostUsedResourcesPanel resources={mostUsedResources} />

                <div className="col-span-1 lg:col-span-3">
                    <UsageHistoryPanel history={usageHistory} />
                </div>



            </section>

            <LastTransactionSection metrics={metrics} />
        </main>
    )
}

export default StaffDashboardOverview
