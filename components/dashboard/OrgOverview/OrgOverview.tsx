"use client"
import { useOrganizationInsights } from '@/features/dashboard/hooks'
import { BOOKING_STATUS_CONFIG } from '@/types/booking'
import { AlertCircle, ArrowUpRight, BookOpen, CreditCard, Users } from 'lucide-react'
import React from 'react'

type Props = {}

const OrgDashboardOverview = (props: Props) => {

    const orgInsights = useOrganizationInsights();
    const data: any = orgInsights?.data?.insights;
    const metrics = data?.metrics;
    const recentStaffActivity = data?.recentStaffActivity || [];
    const lowCreditAlerts = data?.lowCreditAlerts || [];

    return (<div className="p-6 bg-slate-50 dark:bg-slate-950 min-h-screen font-sans">
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-end">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {data?.organization?.name} Dashboard
                </h1>
                <p className="text-slate-500 text-sm">Overview of your workforce and resources</p>
            </div>
            <button className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all">
                Manage Credits <ArrowUpRight size={16} />
            </button>
        </div>

        {/* 1. Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard title="Total Staff" value={metrics?.totalStaff} icon={<Users size={20} />} />
            <MetricCard
                title="Organization Pool"
                value={`${metrics?.organizationCreditPool} Cr`}
                icon={<CreditCard size={20} />}
                isCritical={metrics?.organizationCreditPool < 50}
            />
            <MetricCard title="Total Bookings" value={metrics?.totalBookings} icon={<BookOpen size={20} />} />
            <MetricCard title="Low Credit Alerts" value={metrics?.lowCreditAlertsCount} icon={<AlertCircle size={20} />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 2. Recent Activity - Left Column (Main) */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Recent Staff Activity</h2>
                <div className="space-y-6">
                    {recentStaffActivity.map((activity: any, idx: number) => (
                        <div key={idx} className="flex gap-4 items-start">
                            <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${BOOKING_STATUS_CONFIG?.[activity.status as keyof typeof BOOKING_STATUS_CONFIG].color}`} />
                            <div className="flex-1">
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    <span className="font-bold">{activity.staffName}</span> {activity.status.toLowerCase()}
                                    <span className="font-medium text-slate-900 dark:text-white"> {activity.resourceName}</span>
                                </p>
                                <p className="text-xs text-slate-400 mt-1">{activity.message}</p>
                            </div>
                            <span className="text-xs text-slate-400 font-medium">
                                {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Action Center - Right Column */}
            <div className="space-y-6">
                {/* Low Credit Alerts */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold flex items-center gap-2 text-rose-600">
                            <AlertCircle size={18} /> Credit Alerts
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {lowCreditAlerts.map((user: any) => (
                            <div key={user.id} className="flex items-center justify-between p-2 rounded-lg bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30">
                                <div>
                                    <p className="text-xs font-bold text-slate-900 dark:text-slate-200">{user.name}</p>
                                    <p className="text-[10px] text-slate-500">{user.email}</p>
                                </div>
                                <button className="text-[10px] bg-white dark:bg-slate-800 border border-rose-200 text-rose-600 px-2 py-1 rounded font-bold hover:bg-rose-600 hover:text-white transition-colors">
                                    Top Up
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default OrgDashboardOverview

// Sub-components
type MetricCardProps = {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    isCritical?: boolean;
}
const MetricCard = ({ title, value, icon, isCritical }: MetricCardProps) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                {icon}
            </div>
            {isCritical && <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>}
        </div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
    </div>
);

