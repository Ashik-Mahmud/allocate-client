"use client"
import React from 'react'
import OrgDashboardOverview from './OrgOverview';
import { useOrganizationInsights } from '@/features/dashboard/hooks';
import useSubscription from '@/hooks/use-subscription';
import { OrgOverviewPro } from '../OrgOverviewPro';
import { OrgInsights } from '../OrgOverviewPro/OrgOverviewPro';
import NextDayRoadmap from '@/components/shared/NextDayTask';
import { PlanType } from '@/types/organization';

type Props = {}

const OrgDashboardMain = (props: Props) => {
    const { planType } = useSubscription()
    const orgInsights = useOrganizationInsights()
    switch (planType) {
        case PlanType.FREE:
            return (
                <OrgDashboardOverview orgInsights={orgInsights} />
            )
        default:
            return (
                <OrgOverviewPro
                    insights={orgInsights?.data?.insights as OrgInsights}
                    isLoading={orgInsights?.isLoading || orgInsights?.isFetching}
                />
            )
    }
}



export default OrgDashboardMain