"use client";
import React, { useState } from 'react';
import { useFetchRevenueAnalytics } from '@/features/system/hooks';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, CreditCard, TrendingUp, Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ComposedChart, Line, Legend
} from 'recharts';
import { RevenueAnalyticsFilters } from '@/types/systemGlobal';
import { SearchableSelect } from '@/components/shared/searchable-select';
import { fetchOrganizations } from '@/lib/services/system';
import { DatePickerField } from '@/components/shared/datePickerField';
import FilterRevenueAnalysis from './FilterRevenueAnalysis';
import Loader from '@/components/shared/loader';
import RevenueAnalysisMetrics from './RevenueAnalysisMetrics';

const RevenueAnalysisMain = () => {
  const [filters, setFilters] = useState({ groupBy: 'month', organizationId: undefined, startDate: undefined, endDate: undefined } as RevenueAnalyticsFilters);
  const { data, isLoading } = useFetchRevenueAnalytics(filters as RevenueAnalyticsFilters);


  if (isLoading) return <div className="p-8 text-center text-slate-500">
    <Loader type="component" componentName="Generating Revenue Analytics" />
  </div>;
  if (!data?.data) return null;

  const { summary, subscribers, grouped } = data.data;

  // Custom Tooltip for better readability
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-100 shadow-xl rounded-xl">
          <p className="font-bold text-slate-700 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm py-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              <span className="text-slate-500">{entry.name}:</span>
              <span className="font-semibold text-slate-900">
                {entry.name.includes("Revenue") ? `$${entry.value.toLocaleString()}` : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };



  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen">
      {/* Header & Filters */}
      <FilterRevenueAnalysis onFilterChange={setFilters} filters={filters} />
      {/* 1. Summary Metrics */}
      <RevenueAnalysisMetrics summary={summary} subscribers={subscribers} />

      <div className="grid gap-6 md:grid-cols-7">
        {/* 2. Main Analytics Chart: Revenue vs Transactions */}
        <Card className="md:col-span-4 border-none shadow-sm rounded-2xl overflow-hidden dark:bg-slate-800">
          <CardHeader className="bg-white dark:bg-slate-800 border-b border-slate-50 dark:border-b-slate-600">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Revenue vs Transaction Volume
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={grouped}>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f1f5f9" />
                  <XAxis dataKey="period" axisLine={false} tickLine={true} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" align="center" iconType="rect" wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }} />
                  <Area
                    yAxisId="left"
                    name="Revenue"
                    type="monotone"
                    dataKey="revenue"
                    fill="#10b981"
                    fillOpacity={0.05}
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#10b981' }}
                  />
                  <Line
                    yAxisId="right"
                    name="Transaction Count"
                    type="monotone"
                    dataKey="transactionCount"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 2, fill: '#6366f1' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 3. Subscription Distribution Card */}
        <Card className="md:col-span-3 border-none shadow-sm rounded-2xl dark:bg-slate-800">
          <CardHeader className="border-b border-slate-50 dark:border-slate-600 ">
            <CardTitle className="text-sm font-semibold dark:text-white">Subscriber Composition</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-5">
              {[
                { label: "Pro Plan", val: subscribers?.pro, color: "bg-blue-500" },
                { label: "Enterprise", val: subscribers?.enterprise, color: "bg-emerald-500" },
                { label: "Free Plan", val: subscribers?.free, color: "bg-slate-300" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{item.label}</span>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white">{item.val}</span>
                </div>
              ))}

              <div className="pt-6 border-t border-slate-100 dark:border-slate-600 mt-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Conversion Rate</p>
                    <p className="text-xl font-black text-slate-800 dark:text-white">
                      {((subscribers?.paid / subscribers?.totalOrganizations) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-white dark:bg-slate-600 flex items-center justify-center shadow-sm">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Plan Revenue Breakdown (Stacked Bar) */}
        <Card className="md:col-span-7 border-none shadow-sm rounded-2xl overflow-hidden dark:bg-slate-800">
          <CardHeader className="bg-white dark:bg-slate-800 border-b border-slate-50 dark:border-b-slate-600">
            <CardTitle className="text-sm font-semibold">Revenue Stream Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={grouped} margin={{ top: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"  />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }}  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" align="center" iconType="rect" wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }} />
                  <Bar name="Pro Revenue" dataKey="revenueByPlan.pro" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={40} />
                  <Bar name="Enterprise Revenue" dataKey="revenueByPlan.enterprise" stackId="a" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div >
  );
}

export default RevenueAnalysisMain;