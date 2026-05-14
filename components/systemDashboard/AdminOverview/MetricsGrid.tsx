'use client';

import React from 'react';
import { TrendingUp, Users, Building2, DollarSign, SubscriptIcon, SparklesIcon, Sparkles, Users2 } from 'lucide-react';
import type { NewSignups, PlatformSummary } from '../AdminOverview/types';
import { gray } from 'next/dist/lib/picocolors';

interface MetricsGridProps {
  data?: {
    platformSummary?: PlatformSummary;
    newSignups?: NewSignups
  };
}

interface MetricCard {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext: string;
  color: 'blue' | 'purple' | 'green' | 'amber' | 'orange' | 'indigo' | 'gray' | 'teal';
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ data }) => {
  const { platformSummary, newSignups } = data || {};
  const colorClasses = {
    blue: {
      container: 'bg-blue-50 dark:bg-blue-950/30',
      icon: 'text-blue-600 dark:text-blue-400',
      label: 'text-blue-900 dark:text-blue-100',
    },
    purple: {
      container: 'bg-purple-50 dark:bg-purple-950/30',
      icon: 'text-purple-600 dark:text-purple-400',
      label: 'text-purple-900 dark:text-purple-100',
    },
    green: {
      container: 'bg-green-50 dark:bg-green-950/30',
      icon: 'text-green-600 dark:text-green-400',
      label: 'text-green-900 dark:text-green-100',
    },
    amber: {
      container: 'bg-amber-50 dark:bg-amber-950/30',
      icon: 'text-amber-600 dark:text-amber-400',
      label: 'text-amber-900 dark:text-amber-100',
    },
    orange: {
      container: 'bg-orange-50 dark:bg-orange-950/30',
      icon: 'text-orange-600 dark:text-orange-400',
      label: 'text-orange-900 dark:text-orange-100',
    },
    indigo: {
      container: 'bg-indigo-50 dark:bg-indigo-950/30',
      icon: 'text-indigo-600 dark:text-indigo-400',
      label: 'text-indigo-900 dark:text-indigo-100',
    },
    gray: {
      container: 'bg-gray-50 dark:bg-gray-950/30',
      icon: 'text-gray-600 dark:text-gray-400',
      label: 'text-gray-900 dark:text-gray-100',
    },
    teal: {
      container: 'bg-teal-50 dark:bg-teal-950/30',
      icon: 'text-teal-600 dark:text-teal-400',
      label: 'text-teal-900 dark:text-teal-100',
    },

  };

  const metrics: MetricCard[] = [
    {
      icon: <Building2 className="w-5 h-5" />,
      label: 'Total Organizations',
      value: platformSummary?.totalOrganizations ?? 0,
      subtext: 'Active organizations',
      color: 'blue',
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Platform Users',
      value: platformSummary?.totalPlatformUsers ?? 0,
      subtext: 'Total registered users',
      color: 'purple',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Lifetime Revenue',
      value: `$${(platformSummary?.totalRevenue?.lifetimeCreditSales ?? 0).toFixed(2)}`,
      subtext: 'Total credits sold',
      color: 'green',
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Monthly Revenue',
      value: `$${(platformSummary?.totalRevenue?.monthlyCreditSales ?? 0).toFixed(2)}`,
      subtext: 'This month',
      color: 'amber',
    },
    {
      icon: <SparklesIcon className="w-5 h-5" />,
      label: 'Completed Subscriptions',
      value: `${(platformSummary?.totalRevenue?.completedSubscriptionSalesCount ?? 0)}`,
      subtext: 'Total completed subscriptions',
      color: 'orange',
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      label: 'Paid Completed Subscriptions',
      value: `${(platformSummary?.totalRevenue?.completedPaidSubscriptionSalesCount ?? 0)}`,
      subtext: 'Total paid completed subscriptions',
      color: 'indigo',
    },
    {
      icon: <Users2 className="w-5 h-5" />,
      label: 'Signups Last 7 Days',
      value: `${(newSignups?.last7Days ?? 0)}`,
      subtext: 'New users in the last 7 days',
      color: 'gray',
    },
       {
      icon: <Users2 className="w-5 h-5" />,
      label: 'Signups Last 30 Days',
      value: `${(newSignups?.last30Days ?? 0)}`,
      subtext: 'New users in the last 30 days',
      color: 'teal',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4">
      {metrics.map((metric, idx) => {
        const colors = colorClasses[metric.color];
        return (
          <div
            key={idx}
            className={`${colors.container} rounded-lg border border-slate-200/50 dark:border-slate-700/50 p-4 transition-all hover:shadow-md dark:hover:shadow-lg/20`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  {metric.label}
                </p>
                <p className={`text-2xl sm:text-3xl font-bold mt-2 ${colors.label}`}>
                  {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {metric.subtext}
                </p>
              </div>
              <div className={`${colors.icon} opacity-80`}>
                {metric.icon}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsGrid;
