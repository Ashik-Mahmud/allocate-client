"use client"
import React from 'react'
import OrgDashboardOverview from './OrgOverview';
import { useOrganizationInsights } from '@/features/dashboard/hooks';
import useSubscription from '@/hooks/use-subscription';
import { OrgOverviewPro } from '../OrgOverviewPro';
import { OrgInsights } from '../OrgOverviewPro/OrgOverviewPro';
import NextDayRoadmap from '@/components/shared/NextDayTask';

type Props = {}

const OrgDashboardMain = (props: Props) => {
    const { isPaid } = useSubscription()
    const orgInsights = useOrganizationInsights()
    return (
        <div>
            {/* <NextDayRoadmap /> */}
            {
                isPaid ? <OrgOverviewPro
                    insights={orgInsights?.data?.insights as OrgInsights}
                    isLoading={orgInsights?.isLoading || orgInsights?.isFetching}
                /> : <OrgDashboardOverview orgInsights={orgInsights} />
            }
        </div>
    )
}

export default OrgDashboardMain