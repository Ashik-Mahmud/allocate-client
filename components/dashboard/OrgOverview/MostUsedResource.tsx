import React from 'react';
import { BarChart3, Box } from "lucide-react";
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';

interface ResourceAnalytic {
  name?: string;
  bookings?: number;
  type?: string;
  photo?: string;
}

interface Props {
  data?: ResourceAnalytic[];
}

const MostUsedResource = ({ data }: Props) => {
    const router =useRouter()
  const maxBookings = Math.max(...(data?.map((item) => item?.bookings ?? 0) ?? [0]), 1);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-zinc-900 tracking-tight dark:text-white">Resource Analytics</h3>
          <p className="text-xs text-zinc-500 mt-0.5 dark:text-slate-400">Most booked assets this month</p>
        </div>
        <div className="h-9 w-9 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100">
          <BarChart3 className="h-4 w-4 text-zinc-600" />
        </div>
      </div>

      {/* List Body */}
      <div className="p-2">
        <div className="flex flex-col">
          {data?.length && data?.length > 0 ? (
            data?.map((resource, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-zinc-50 transition-colors group"
              >
                {/* Resource Photo */}
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50 dark:bg-slate-800 dark:border-slate-700">
                  {resource?.photo ? (
                    <img 
                      src={resource?.photo} 
                      alt={resource?.name ?? 'Resource'} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Box className="h-6 w-6 text-zinc-300 dark:text-slate-500" />
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-800 truncate">
                        {resource?.name ?? 'Unnamed Resource'}
                      </h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {resource?.type ?? 'General'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-zinc-900 block">
                        {resource?.bookings ?? 0}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium uppercase">
                        Bookings
                      </span>
                    </div>
                  </div>

                  {/* Progress Visualization */}
                  <div className="relative w-full h-1.5 bg-zinc-100 rounded-full mt-2">
                    <div 
                      className="absolute top-0 left-0 h-full bg-zinc-900 rounded-full transition-all duration-1000 ease-in-out"
                      style={{ 
                        width: `${((resource?.bookings ?? 0) / maxBookings) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-zinc-400">No resource data found</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Subtle Footer */}
      <div className="bg-zinc-50/50 px-6 py-3 border-t border-zinc-100 dark:bg-slate-800/50 dark:border-slate-700 flex items-center justify-end">
         <button
          type="button"
          onClick={() => {
            router.push(ROUTES.dashboardOrgAdmin.resourcesManagement)
          }}
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-slate-400 transition-colors cursor-pointer">
            View resources →
         </button>
      </div>
    </div>
  );
};

export default MostUsedResource;