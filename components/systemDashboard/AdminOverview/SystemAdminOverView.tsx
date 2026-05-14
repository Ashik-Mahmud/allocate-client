'use client';

import React, { useState } from 'react';
import { AlertCircle, BarChart3, Building2 } from 'lucide-react';
import MetricsGrid from './MetricsGrid';
import RevenueTrendChart from './RevenueTrendChart';
import TopOrganizations from './TopOrganizations';
import SystemHealth from './SystemHealth';
import PlanDistribution from './PlanDistribution';
import { MOCK_DASHBOARD_INSIGHTS } from './constants';
import type { DashboardInsights } from './types';
import { useSystemInsights } from '@/features/dashboard/hooks';
import TenantAndUsagesMain from './TenantAndUsagesMain';

type TabType = 'overview' | 'revenue' | 'tenants-usages' | 'health';

const SystemAdminOverView = () => {
  const { data, isLoading } = useSystemInsights();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // In production, this would come from an API
  const dashboardData: DashboardInsights = (data?.insights as DashboardInsights) || MOCK_DASHBOARD_INSIGHTS;

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'revenue', label: 'Revenue', icon: <Building2 className="w-4 h-4" /> },
    { id: 'tenants-usages', label: 'Tenants & Usages Monitoring', icon: <Building2 className="w-4 h-4" /> },
    { id: 'health', label: 'System Health', icon: <AlertCircle className="w-4 h-4" /> },
  ];

  return (
    <main className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Platform Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Monitor key metrics, revenue trends, and system health
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        {tabs?.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${activeTab === tab.id
              ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <MetricsGrid data={{
              platformSummary: dashboardData?.platformSummary,
              newSignups: dashboardData?.revenueAndGrowth?.newSignups,
            }} />
            <PlanDistribution data={dashboardData?.revenueAndGrowth?.planDistribution} />
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <RevenueTrendChart data={dashboardData?.revenueAndGrowth?.revenueTrends} />
          </div>
        )}

        {/* Tenants & Usages Monitoring Tab */}
        {activeTab === 'tenants-usages' && (
          <div className="space-y-6">
            <TenantAndUsagesMain data={dashboardData?.tenantAndUsageMonitoring} />
          </div>
        )}

        {/* System Health Tab */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <SystemHealth data={dashboardData?.systemHealthAndSecurity} />
          </div>
        )}
      </div>
    </main>
  );
};

export default SystemAdminOverView;