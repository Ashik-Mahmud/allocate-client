import React from 'react'
import { ExpiringSubscription, InactiveOrg, TenantAndUsageMonitoring } from './types';
import TopOrganizations from './TopOrganizations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, BuildingIcon, Sparkle } from 'lucide-react';
import ExpiringSubscriptions from './ExpiringSubscriptions';
import { PlanType } from '@/types/organization';
import InactiveOrganization from './InactiveOrganization';

type Props = {
    data?: TenantAndUsageMonitoring;
}

const TenantAndUsagesMain = ({ data }: Props) => {
    return (
        <div>

            <Tabs defaultValue="expiringSubscriptions">
                <TabsList
                    variant="default"
                    className="w-full flex justify-start overflow-x-auto no-scrollbar py-6! dark:bg-slate-800/50 rounded-lg mb-3"
                >
                    <div className="flex min-w-max "> {/* min-w-max prevents shrinking */}
                        <TabsTrigger value="expiringSubscriptions" className="p-4! whitespace-nowrap dark:text-white cursor-pointer">
                            <Sparkle className="w-4 h-4 mr-2" />
                            Expiring Subscriptions
                        </TabsTrigger>

                        <TabsTrigger value="topOrganizations" className="p-4! whitespace-nowrap dark:text-white cursor-pointer">
                            <Building2 className="w-4 h-4 mr-2" />
                            Top Organizations
                        </TabsTrigger>

                        <TabsTrigger value="inactiveOrganizations" className="p-4! whitespace-nowrap dark:text-white cursor-pointer" >
                            <BuildingIcon className="w-4 h-4 mr-2" />
                            Inactive Organizations
                        </TabsTrigger>
                    </div>
                </TabsList>
                <TabsContent value="topOrganizations">
                    <TopOrganizations data={data?.top5Organizations} />
                </TabsContent>
                <TabsContent value="expiringSubscriptions">
                    <ExpiringSubscriptions subscriptions={data?.expiringSubscriptions || []} />
                </TabsContent>
                <TabsContent value="inactiveOrganizations">
                    <InactiveOrganization organizations={data?.inactiveOrganizations || []} />
                </TabsContent>
            </Tabs>

        </div>
    )
}

export default TenantAndUsagesMain