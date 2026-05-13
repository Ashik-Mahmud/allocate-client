"use client";
import React, { useState } from 'react';
import { useFetchRevenueAnalytics } from '@/features/system/hooks';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, CreditCard, TrendingUp, Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ComposedChart, Line, Legend
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RevenueAnalyticsFilters } from '@/types/systemGlobal';
import { SearchableSelect } from '@/components/shared/searchable-select';
import { fetchOrganizations } from '@/lib/services/system';
import { DatePickerField } from '@/components/shared/datePickerField';

const RevenueAnalysisMain = () => {
  const [filters, setFilters] = useState({ groupBy: 'month', organizationId: undefined, startDate: undefined, endDate: undefined } as RevenueAnalyticsFilters);
  const { data, isLoading } = useFetchRevenueAnalytics(filters as RevenueAnalyticsFilters);
  const [searchedOrgs, setSearchedOrgs] = useState<{ value: string; label: string }[]>([]);

  // handle organization search for filter
  const handleOrgSearch = async (query: string) => {
    try {
      const result = await fetchOrganizations({ search: query, limit: 5, showDeletedOrg: false });

      if (result?.success) {
        const options = result?.data?.map(org => ({ value: org.id, label: org.name }));
        setSearchedOrgs(
          options || []
        );
      }

    } catch (error) {
      console.error("Error fetching organizations for search:", error);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Generating analytical insights...</div>;
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
    <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Revenue Analytics</h1>
          <p className="text-sm text-slate-500">Detailed financial performance and subscriber growth.</p>
        </div>

        <div className="flex items-center gap-4">

          {/* By Date Range */}
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <DatePickerField
            label=""
            value={filters.startDate ? new Date(filters.startDate) : undefined}
            onChange={(value) => setFilters(prev => ({ ...prev, startDate: value?.toDateString() }))}
            placeholder="Start Date"
            className="text-left"
          />
          <span className="text-slate-400">to</span>
          <DatePickerField
            label=""
            value={filters.endDate ? new Date(filters.endDate) : undefined}
            onChange={(value) => setFilters(prev => ({ ...prev, endDate: value?.toDateString() }))}
            placeholder="End Date"
            className="text-left"
          />

          </div>

          {/* By Orgnization */}
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <SearchableSelect
              label=""
              placeholder="Filter by organization"
              onChange={(value) => setFilters(prev => ({ ...prev, organizationId: value }))}
              value={filters.organizationId}
              options={searchedOrgs}
              onSearchChange={handleOrgSearch}
              emptyMessage='Search for organization by name...'
              isMulti={false}
              inputClassName="text-left "
              icon={<CalendarIcon className="h-4 w-4 text-slate-400 dark:text-slate-600" />}
            />
          </div>

          {/* Group By */}
          <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100">
            <span className="text-xs font-medium text-slate-400 ml-2">Group By</span>
            <Select
              value={filters.groupBy}
              onValueChange={(val: any) => setFilters(prev => ({ ...prev, groupBy: val }))}
            >
              <SelectTrigger className="w-30 border-none shadow-none focus:ring-0 font-semibold h-8 uppercase text-[10px] tracking-wider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Reset Filters */}
          <div className="flex items-center gap-2 bg-white py-5 px-4 active:scale-95 rounded-2xl shadow-sm border border-slate-100 cursor-pointer" onClick={() => setFilters({ groupBy: 'month', organizationId: undefined, startDate: undefined, endDate: undefined })}>
            <RefreshCw className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-400 ">Reset</span>
          </div>


        </div>
      </div>

      {/* 1. Summary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((item, i) => (
          <Card key={i} className="border-none shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.title}</CardTitle>
              {item.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{item.value}</div>
              <p className="text-[11px] text-slate-400 mt-1">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* 2. Main Analytics Chart: Revenue vs Transactions */}
        <Card className="md:col-span-4 border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Revenue vs Transaction Volume
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={grouped}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }} />
                  <Area
                    yAxisId="left"
                    name="Revenue"
                    type="monotone"
                    dataKey="revenue"
                    fill="#10b981"
                    fillOpacity={0.05}
                    stroke="#10b981"
                    strokeWidth={3}
                  />
                  <Line
                    yAxisId="right"
                    name="Transaction Count"
                    type="monotone"
                    dataKey="transactionCount"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#6366f1' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 3. Subscription Distribution Card */}
        <Card className="md:col-span-3 border-none shadow-sm rounded-2xl">
          <CardHeader className="border-b border-slate-50">
            <CardTitle className="text-sm font-semibold">Subscriber Composition</CardTitle>
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
                    <span className="text-sm font-medium text-slate-600">{item.label}</span>
                  </div>
                  <span className="font-bold text-slate-800">{item.val}</span>
                </div>
              ))}

              <div className="pt-6 border-t border-slate-100 mt-6">
                <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Conversion Rate</p>
                    <p className="text-xl font-black text-slate-800">
                      {((subscribers?.paid / subscribers?.totalOrganizations) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Plan Revenue Breakdown (Stacked Bar) */}
        <Card className="md:col-span-7 border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-50">
            <CardTitle className="text-sm font-semibold">Revenue Stream Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={grouped} margin={{ top: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" align="right" iconType="rect" wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }} />
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