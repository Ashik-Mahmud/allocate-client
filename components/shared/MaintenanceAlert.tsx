"use client";

import React from 'react';
import { Cog, Activity, Hammer, AlertCircle, Info } from 'lucide-react';
import useGlobalSettings from '@/hooks/use-global-settings';
import { cn } from '@/lib/utils/cn';

type Props = {
  type?: 'maintenance' | 'update' | 'outage';
  view?: 'compact' | 'detailed' | 'alert';
  className?: string;
}

const MaintenanceAlert = ({ type = 'maintenance', view = 'detailed',className }: Props) => {
  const { isMaintenanceMode, isLoading } = useGlobalSettings();

  // Content Configuration
  const config = {
    maintenance: {
      icon: <Hammer className="shrink-0" strokeWidth={1.5} />,
      title: "Under Maintenance",
      description: "We're fine-tuning our systems. We'll be back shortly.",
      statusText: "System Maintenance in Progress",
      color: "amber"
    },
    update: {
      icon: <Cog className="shrink-0" strokeWidth={1.5} />,
      title: "System Update",
      description: "Deploying new features for a better experience.",
      statusText: "Applying Core Updates",
      color: "blue"
    },
    outage: {
      icon: <AlertCircle className="shrink-0" strokeWidth={1.5} />,
      title: "Service Disruption",
      description: "We're working on fixing service issues right now.",
      statusText: "Emergency Repair in Progress",
      color: "red"
    }
  };

  const current = config[type] || config.maintenance;

  if (!isMaintenanceMode || isLoading) return null;


  if (view === 'alert') {
    return (
      <div className={cn(
        "flex items-center gap-4 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 ",
        type === 'maintenance' && "bg-amber-50 border-amber-200 text-amber-800",
        type === 'update' && "bg-blue-50 border-blue-200 text-blue-800",
        type === 'outage' && "bg-red-50 border-red-200 text-red-800",
        className
      )}>
        <div className={cn(
          "p-2 rounded-lg",
          type === 'maintenance' && "bg-amber-100",
          type === 'update' && "bg-blue-100",
          type === 'outage' && "bg-red-100"
        )}>
          {React.cloneElement(current.icon as React.ReactElement<any>, { size: 20 })}
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold leading-none mb-1">{current.title}</p>
          <p className="text-xs opacity-80">{current.description}</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/50 rounded-full border border-current/10">
           <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-tight">{current.statusText}</span>
        </div>
      </div>
    );
  }

  // --- Full Page View (Compact & Detailed) ---
  return (
    <div className={cn("absolute inset-0 z-9999 flex items-center justify-center bg-white font-sans transition-all duration-500", className)}>
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="pattern-hex" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 0L40 10V30L20 40L0 30V10L20 0Z" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#pattern-hex)" />
        </svg>
      </div>

      <div className={cn(
        "relative text-center px-6 transition-all",
        view === 'compact' ? "max-w-sm" : "max-w-2xl"
      )}>
        <div className={cn("flex justify-center text-slate-400", view === 'compact' ? "mb-4" : "mb-8")}>
          <div className="animate-[spin_10s_linear_infinite]">
            {React.cloneElement(current.icon as React.ReactElement<any>, { size: view === 'compact' ? 40 : 64 })}
          </div>
        </div>

        <h1 className={cn(
          "font-extralight text-slate-900 tracking-tight",
          view === 'compact' ? "text-2xl mb-2" : "text-4xl md:text-6xl mb-4"
        )}>
          {current.title}
        </h1>

        <p className={cn(
          "mx-auto text-slate-500 font-light leading-relaxed",
          view === 'compact' ? "text-sm mb-6" : "text-lg mb-10"
        )}>
          {current.description}
        </p>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
              {current.statusText}
            </span>
          </div>

          {view === 'detailed' && (
            <div className="mt-8 pt-8 border-t border-slate-100 w-full text-[10px] uppercase tracking-[0.3em] text-slate-300">
               Estimated Restoration: 45 Minutes
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceAlert;