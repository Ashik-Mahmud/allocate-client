"use client";
import React, { useState } from 'react';
import { Mail, Crown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

interface WeeklyReportProps {
  isEnabled: boolean;
  isPro: boolean;
  onToggle: (newStatus: boolean) => Promise<void> | void;
}

const WeeklyReportToggle = ({ isEnabled, isPro, onToggle }: WeeklyReportProps) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!isPro) return; 
    setLoading(true);
    try {
      await onToggle(!isEnabled);
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-4 rounded-xl border transition-all ${isPro ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-80'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isPro ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
            <Mail size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              Weekly Email Report
              {!isPro && (
                <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                  <Crown size={10} /> Pro
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Get a summary of bookings and resource usage every Sunday.
            </p>
          </div>
        </div>

        {/* Custom Toggle Switch */}
        <button
          onClick={handleToggle}
          disabled={!isPro || loading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            isEnabled && isPro ? 'bg-blue-600' : 'bg-slate-300'
          } ${!isPro ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {loading ? (
            <Loader2 className="animate-spin text-white ml-1" size={14} />
          ) : (
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          )}
        </button>
      </div>

      {!isPro && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <Link href={ROUTES.dashboardOrgAdmin.billing}
          className="text-[11px] font-medium text-blue-600 hover:underline">
            Upgrade to Pro to enable weekly reports →
          </Link>
        </div>
      )}
    </div>
  );
};

export default WeeklyReportToggle;