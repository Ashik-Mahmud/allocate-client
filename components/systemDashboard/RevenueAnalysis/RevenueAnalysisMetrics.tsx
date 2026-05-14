"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueAnalyticsData } from '@/types/systemGlobal';
import { CreditCard, DollarSign, TrendingUp, Users } from 'lucide-react';
import React from 'react'

type Props = {
    summary: RevenueAnalyticsData['summary']
    subscribers: RevenueAnalyticsData['subscribers']
}

const RevenueAnalysisMetrics = ({ summary, subscribers }: Props) => {
    const metrics = [
        {
            title: "Total Revenue",
            value: `$${summary?.totalRevenue.toLocaleString()}`,
            icon: <DollarSign className="h-4 w-4 text-emerald-500" />,
            description: "Lifetime earnings"
        },
        {
            title: "Active Paid Orgs",
            value: summary?.activePayingOrganizations,
            icon: <Users className="h-4 w-4 text-blue-500" />,
            description: `${subscribers?.paid} out of ${subscribers?.totalOrganizations} organizations`
        },
        {
            title: "Avg. Transaction",
            value: `$${summary?.avgTransactionValue.toFixed(2)}`,
            icon: <CreditCard className="h-4 w-4 text-purple-500" />,
            description: "Revenue per top-up"
        },
        {
            title: "ARPO",
            value: `$${summary?.avgRevenuePerPayingOrganization.toFixed(2)}`,
            icon: <TrendingUp className="h-4 w-4 text-orange-500" />,
            description: "Avg revenue per paying org"
        }
    ];
    return (
        <div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map((item, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-2xl dark:bg-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.title}</CardTitle>
                            {item.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-800 dark:text-white">{item.value}</div>
                            <p className="text-[11px] text-slate-400 mt-1">{item.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default RevenueAnalysisMetrics