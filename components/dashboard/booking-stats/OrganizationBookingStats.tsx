import React from 'react';
import { Calendar, CreditCard, TrendingUp, Activity } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

export interface BookingData {
  period?: string;
  bookingsCount?: number;
  totalCredits?: number;
  averageCredits?: string;
}

interface Props {
  data?: BookingData[];
}

const OrganizationBookingStats = ({ data }: Props) => {
  const totalBookings = data?.reduce((acc, curr) => acc + (curr?.bookingsCount ?? 0), 0) ?? 0;
  const totalCreditsSpent = data?.reduce((acc, curr) => acc + (curr?.totalCredits ?? 0), 0) ?? 0;

  // Custom Tooltip for a minimalistic look
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 dark:bg-white p-3 shadow-xl rounded-lg border-none">
          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase mb-1">
            {payload[0].payload.period}
          </p>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-white dark:text-zinc-900">
              {payload[0].value} Bookings
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
              {payload[0].payload.totalCredits} Credits used
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Bookings" 
          value={totalBookings} 
          sub="Activity in period" 
          icon={<Activity className="h-4 w-4 text-indigo-600" />}
          color="indigo"
        />
        <StatCard 
          title="Credits Consumed" 
          value={totalCreditsSpent} 
          sub="Total utilization" 
          icon={<CreditCard className="h-4 w-4 text-emerald-600" />}
          color="emerald"
        />
        <StatCard 
          title="Avg. Credits" 
          value={(totalCreditsSpent / (totalBookings || 1)).toFixed(2)} 
          sub="Cost efficiency" 
          icon={<TrendingUp className="h-4 w-4 text-orange-600" />}
          color="orange"
        />
      </div>

      {/* 2. Recharts Bar Chart */}
      <div className="p-6 bg-white border border-zinc-100 dark:bg-slate-900/50 dark:border-slate-800 rounded-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Booking Intensity</h3>
          </div>
          <Calendar className="h-4 w-4 text-zinc-300" />
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid 
                vertical={false} 
                strokeDasharray="3 3" 
                stroke="rgba(161, 161, 170, 0.1)" 
              />
              <XAxis 
                dataKey="period" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#A1A1AA' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#A1A1AA' }} 
              />
              <Tooltip cursor={{ fill: 'rgba(99, 102, 241, 0.04)' }} content={<CustomTooltip />} />
              <Bar 
                dataKey="bookingsCount" 
                radius={[4, 4, 0, 0]} 
                barSize={32}
              >
                {data?.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    className="fill-indigo-500/40 hover:fill-indigo-500 transition-all duration-300" 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card
const StatCard = ({ title, value, sub, icon, color }: any) => (
  <div className="p-5 bg-white border border-zinc-100 dark:bg-slate-900/50 dark:border-slate-800 rounded-2xl">
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 bg-${color}-50 dark:bg-${color}-900/20 rounded-lg`}>
        {icon}
      </div>
      <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{title}</span>
    </div>
    <h4 className="text-2xl font-black text-zinc-900 dark:text-white">{value}</h4>
    <p className="text-[10px] text-zinc-400 mt-1">{sub}</p>
  </div>
);

export default OrganizationBookingStats;