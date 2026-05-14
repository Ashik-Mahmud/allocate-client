'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { PlanDistributionItem } from '../AdminOverview/types';
import { PLAN_COLORS } from '../AdminOverview/constants';

interface PlanDistributionProps {
  data?: PlanDistributionItem[];
}

const PlanDistribution: React.FC<PlanDistributionProps> = ({ data = [] }) => {
  const chartData = data?.map((item) => ({
    name: item?.planType ?? 'Unknown',
    value: item?.count ?? 0,
    ratio: item?.ratio ?? 0,
  })) ?? [];

  const colors: Record<string, string> = {
    FREE: '#3b82f6', // blue
    PRO: '#a855f7', // purple
    ENTERPRISE: '#f59e0b', // amber
  };

  const totalOrgs = chartData.reduce((sum, item) => sum + (item.value ?? 0), 0);

  const renderCustomLabel = (entry: any) => {
    const percentage = ((entry.value / totalOrgs) * 100).toFixed(0);
    return `${percentage}%`;
  };

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Plan Distribution</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Organization breakdown by plan type
        </p>
      </div>

      {chartData?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={renderCustomLabel}
                  labelLine={true}
                >
                  {chartData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={colors[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value} organizations`}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Statistics */}
          <div className="flex flex-col justify-center space-y-4">
            {chartData?.map((item) => {
              const planType = item.name as 'FREE' | 'PRO' | 'ENTERPRISE';
              const planColors = PLAN_COLORS[planType] || PLAN_COLORS.FREE;
              const chartColor = colors[planType] || '#94a3b8';
              const percentage = ((item.value / totalOrgs) * 100).toFixed(1);

              return (
                <div
                  key={item.name}
                  className={`${planColors.bg} rounded-lg border border-slate-200/50 dark:border-slate-700/50 p-4`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: chartColor }}
                      />
                      <span className={`font-semibold text-sm ${planColors.text}`}>{item.name}</span>
                    </div>
                    <span className={`${planColors.badge} px-2 py-1 rounded text-xs font-semibold`}>
                      {item.value} org{item.value !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all`}
                      style={{
                        backgroundColor: chartColor,
                        width: `${(item.value / totalOrgs) * 100}%`,
                      }}
                    />
                  </div>

                  <p className={`text-xs font-medium mt-2 ${planColors.text}`}>
                    {percentage}% of total organizations
                  </p>
                </div>
              );
            })}

            {/* Total Summary */}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Organizations</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalOrgs}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">No plan distribution data available</p>
        </div>
      )}
    </div>
  );
};

export default PlanDistribution;
