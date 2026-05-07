import React from 'react';
import { Calendar, CreditCard, TrendingUp, Activity } from "lucide-react";
import { format, formatDate } from 'date-fns';
import { formatCalendarDate, getCalendarDateKey } from '@/lib/utils/timezone-date';
import useTimezone from '@/hooks/use-timezone';

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
  // Calculate Totals using optional chaining and reduce
  const totalBookings = data?.reduce((acc, curr) => acc + (curr?.bookingsCount ?? 0), 0) ?? 0;
  const totalCreditsSpent = data?.reduce((acc, curr) => acc + (curr?.totalCredits ?? 0), 0) ?? 0;
  
  // Find max booking for chart scaling
  const maxBookingInPeriod = Math.max(...(data?.map(d => d?.bookingsCount ?? 0) ?? [0]), 1);

  return (
    <div className="w-full space-y-6">
      {/* 1. High-Level Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-zinc-200 dark:bg-slate-900 dark:border-slate-800  rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <Activity className="h-4 w-4 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-200">Total Bookings</span>
          </div>
          <h4 className="text-2xl font-bold text-zinc-900 dark:text-white">{totalBookings}</h4>
          <p className="text-xs text-zinc-400 mt-1">Activity in selected period</p>
        </div>

        <div className="p-5 bg-white border border-zinc-200 dark:bg-slate-900 dark:border-slate-800  rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <CreditCard className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-200">Credits Consumed</span>
          </div>
          <h4 className="text-2xl font-bold text-zinc-900 dark:text-white">{totalCreditsSpent}</h4>
          <p className="text-xs text-zinc-400 mt-1">Total credit utilization</p>
        </div>

        <div className="p-5 bg-white border border-zinc-200 dark:bg-slate-900 dark:border-slate-800  rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-200">Avg. Credits/Booking</span>
          </div>
          <h4 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {(totalCreditsSpent / (totalBookings || 1)).toFixed(2)}
          </h4>
          <p className="text-xs text-zinc-400 mt-1">Cost efficiency metric</p>
        </div>
      </div>

      {/* 2. Custom Tailwind Bar Chart (Booking Trend) */}
      <div className="p-6 bg-white border border-zinc-200 dark:bg-slate-900 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-300 uppercase tracking-wider">Booking Intensity</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Daily booking volume over time</p>
          </div>
          <Calendar className="h-4 w-4 text-zinc-400" />
        </div>

        <div className="relative h-48 w-full flex items-end justify-between gap-2 px-2">
          {data?.length && data?.length > 0 ? (
            data?.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center group relative">
                {/* Tooltip on Hover */}
                <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-zinc-900 text-white text-[10px] py-1 px-2 rounded font-bold whitespace-nowrap z-10">
                  {item?.bookingsCount ?? 0} Bookings | {item?.totalCredits ?? 0} Credits
                </div>
                
                {/* Bar */}
                <div 
                  className="w-full bg-zinc-100 group-hover:bg-indigo-500 rounded-t-sm transition-all duration-500"
                  style={{ 
                    height: `${((item?.bookingsCount ?? 0) / maxBookingInPeriod) * 100}%`,
                    minHeight: '4px'
                  }}
                />
                
                {/* Date Label */}
                <span className="text-[10px] text-zinc-400 mt-3 rotate-45 md:rotate-0 origin-left">
                  {item?.period ?? 'N/A'}
                </span>
              </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm italic">
              No data available for the period
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationBookingStats;