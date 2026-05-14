'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Calendar } from 'lucide-react';
import type { RevenueTrends } from '../AdminOverview/types';

interface RevenueTrendChartProps {
  data?: RevenueTrends;
}

const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({ data }) => {
  const [view, setView] = useState<'daily' | 'weekly'>('daily');

  const chartData = view === 'daily' ? data?.daily : data?.weekly;

  const formatChartData = () => {
    if (!chartData) return [];

    if (view === 'daily') {
      return (data?.daily ?? []).map((item) => ({
        date: new Date(item?.date ?? '').toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        amount: item?.amount ?? 0,
        fullDate: item?.date,
      }));
    } else {
      return (data?.weekly ?? []).map((item) => ({
        week: item?.weekKey ?? '',
        amount: item?.amount ?? 0,
      }));
    }
  };

  const formattedData = formatChartData();
  const maxAmount = Math.max(...formattedData.map((d) => d.amount ?? 0));
  const avgAmount = formattedData.reduce((sum, d) => sum + (d.amount ?? 0), 0) / formattedData.length;
  const viewLabel = view === 'daily' ? 'Daily' : 'Weekly';

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Revenue Trends</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {view === 'daily' ? 'Daily revenue last 30 days' : 'Weekly revenue breakdown'}
          </p>
        </div>

        <div className="flex gap-2 mt-4 sm:mt-0">
          <button
            onClick={() => setView('daily')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'daily'
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Daily
          </button>
          <button
            onClick={() => setView('weekly')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'weekly'
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Weekly
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Peak in {viewLabel}</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
            ${maxAmount.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase font-mono">Average </p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
            ${avgAmount.toFixed(2)}<small className="text-slate-500 font-medium uppercase font-mono text-xs">/{viewLabel}</small>
          </p> 
           
        </div>
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase font-mono">Total</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
            ${formattedData.reduce((sum, d) => sum + (d.amount ?? 0), 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-80">
        {formattedData?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData as any}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <XAxis
                dataKey={view === 'daily' ? 'date' : 'week'}
                stroke="#94a3b8"
                className="dark:stroke-slate-600"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#94a3b8" className="dark:stroke-slate-600" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                }}
                labelStyle={{ color: '#f1f5f9' }}
                formatter={(value) => `$${Number(value)?.toFixed(2)}`}
              />
              <Area type="monotone" dataKey="amount" stroke="#3b82f6" fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-slate-500 dark:text-slate-400">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueTrendChart;
