"use client"
import { useOrganizationInsights } from '@/features/dashboard/hooks';
import useSubscription from '@/hooks/use-subscription';
import { PlanType } from '@/types/organization';
import { OrgOverviewPro } from '../OrgOverviewPro';
import { OrgInsights } from '../OrgOverviewPro/OrgOverviewPro';
import OrgDashboardOverview from './OrgOverview';

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