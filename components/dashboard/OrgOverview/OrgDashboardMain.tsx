"use client"
import React from 'react'
import OrgDashboardOverview from './OrgOverview';
import { useOrganizationInsights } from '@/features/dashboard/hooks';
import useSubscription from '@/hooks/use-subscription';
import { OrgOverviewPro } from '../OrgOverviewPro';
import { OrgInsights } from '../OrgOverviewPro/OrgOverviewPro';

type Props = {}

const OrgDashboardMain = (props: Props) => {
    const { isPaid } = useSubscription()
    const orgInsights = useOrganizationInsights()
    return (
        <div>
            {
                isPaid ? <OrgOverviewPro
                    insights={orgInsights?.data?.insights as OrgInsights}
                    isLoading={orgInsights?.isLoading}
                /> : <OrgDashboardOverview orgInsights={orgInsights} />
            }
        </div>
    )
}

export default OrgDashboardMain