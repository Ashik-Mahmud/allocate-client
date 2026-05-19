"use client";

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CommunityTrialAlertProps {
    isTrialExpired: boolean;
    trialEndDate?: string | Date | null;
    pricingUrl?: string;
}

export const CommunityTrialAlert = ({
    isTrialExpired,
    trialEndDate,
    pricingUrl = "/pricing"
}: CommunityTrialAlertProps) => {


    if (!isTrialExpired && !trialEndDate) return null;


    const config = isTrialExpired
        ? {
            bg: "bg-white dark:bg-slate-900 border-rose-200/80 dark:border-rose-950/60",
            iconBg: "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/20",
            title: "Trial Period Expired",
            titleColor: "text-rose-600 dark:text-rose-400/90",
            btnBg: "bg-slate-900 hover:bg-slate-800 dark:bg-rose-600 dark:hover:bg-rose-500",
            btnText: "Upgrade Workspace",
            icon: <AlertTriangle className="w-4 h-4" />,
            description: "Your 1-month free trial has ended. Upgrade your workspace now to unlock full team collaboration, post generation, and deep insights."
        }
        : {
            bg: "bg-white dark:bg-slate-900 border-amber-200/70 dark:border-amber-950/40",
            iconBg: "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100/70 dark:border-amber-900/20",
            title: "Trial Ending Soon",
            titleColor: "text-amber-600 dark:text-amber-400/90",
            btnBg: "bg-amber-600 hover:bg-amber-500",
            btnText: "Upgrade Now",
            icon: <Clock className="w-4 h-4" />,
            description: `Your Community Hub free access will conclude on ${trialEndDate
                    ? `${formatDistanceToNow(trialEndDate, { addSuffix: true })} (${(new Date(trialEndDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }))})`
                    : ''
                }. Upgrade now to ensure uninterrupted workspace collaboration.`
        };

    return (
        <div className={`mb-4 overflow-hidden rounded-xl border p-4 shadow-xs transition-all ${config.bg}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">

                    <div className={`p-2 rounded-lg shrink-0 border ${config.iconBg}`}>
                        {config.icon}
                    </div>


                    <div className="space-y-0.5">
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${config.titleColor}`}>
                            {config.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-135 leading-relaxed">
                            {config.description}
                        </p>
                    </div>
                </div>


                <div className="flex items-center shrink-0 w-full sm:w-auto">
                    <Link
                        href={pricingUrl}
                        className={`w-full sm:w-auto text-center px-4 py-1.5 text-white text-xs font-semibold rounded-lg transition-all active:scale-[0.98] cursor-pointer ${config.btnBg}`}
                    >
                        {config.btnText}
                    </Link>
                </div>
            </div>
        </div>
    );
};