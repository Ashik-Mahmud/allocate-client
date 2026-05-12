"use client"

import { useCurrentUser } from '@/features/auth';
import { PlanType } from '@/types/organization';
import React from 'react'
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FREE_TRIAL_DAYS } from '@/lib/constants/subscription';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';
import { Role } from '@/types';


const FreeTrialAlert = () => {
    const { user, isLoading } = useCurrentUser();
    const [isVisible, setIsVisible] = React.useState(true);


    const isAllowedTrial = user?.organization?.isTrialAllowed &&
        !user?.organization?.hasUsedTrial &&
        user?.organization?.plan_type === PlanType.FREE && user?.role === Role.ORG_ADMIN;

    if (!isAllowedTrial || !isVisible || isLoading) {
        return null;
    }

    return (
        <div className="mx-4 mt-4">
            <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-slate-900 px-6 py-2.5 sm:px-3.5 sm:before:flex-1 rounded-xl shadow-lg border border-slate-800">
                {/* Background Decoration */}
                <div className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl" aria-hidden="true">
                    <div className="aspect-577/310 w-144.25 bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-30" style={{ clipPath: 'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 52.1% 97.5%, 74.8% 41.9%)' }}></div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex items-center gap-2 bg-indigo-500/20 px-2 py-1 rounded-md border border-indigo-500/30">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-tighter">Limited Offer</span>
                    </div>

                    <p className="text-sm leading-6 text-white">
                        <strong className="font-bold">Pro Trial Available</strong>
                        <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true"><circle cx="1" cy="1" r="1" /></svg>
                        Experience all premium features for {FREE_TRIAL_DAYS} days without any credit card.
                    </p>

                    <Link
    
                        className="flex-none rounded-full bg-white px-4 py-1 text-sm font-bold text-slate-900 hover:bg-slate-100 transition-all gap-2 group flex items-center"
                        // onClick={() =>}
                        href={ROUTES?.dashboardOrgAdmin?.billing}
                        
                    >
                        Start My Free Trial
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="flex flex-1 justify-end">
                    <button
                        type="button"
                        onClick={() => setIsVisible(false)}
                        className="-m-3 p-3 focus-visible:-outline-offset-4 text-slate-400 hover:text-white transition-colors"
                    >
                        <span className="sr-only">Dismiss</span>
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FreeTrialAlert;