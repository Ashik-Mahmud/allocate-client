"use client"

import { cn } from '@/lib/utils/cn';
import { PaymentStatus, PlanType } from '@/types/organization';
import { Crown } from 'lucide-react';
import React from 'react';
import { RenewalCountdown } from './RenewalCountdown';

interface BillingHeaderProps {
    currentPlan: PlanType
    billingStatus: PaymentStatus
    renewalDate?: string | Date | null
}

function formatPlanLabel(plan?: PlanType | null) {
    if (!plan) return 'Starter'

    return plan
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export const BillingHeader: React.FC<BillingHeaderProps> = ({ currentPlan, billingStatus, renewalDate }) => {
    return (
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
            <div className="relative bg-linear-to-r from-slate-950 via-slate-900 to-slate-700 px-5 py-6 text-white sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

                  

                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                            <Crown className="size-3.5" />
                            Billing Management
                        </div>
                        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Simple billing, clear choices</h1>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
                            Manage your billing information, view invoices, and update payment methods with our comprehensive billing management dashboard,
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border grid place-items-center border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                            {formatPlanLabel(currentPlan)} plan
                        </span>
                        <span
                            className={cn(
                                'rounded-full border px-3 py-1 text-xs font-medium capitalize grid place-items-center',
                                billingStatus === PaymentStatus.COMPLETED
                                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                                    : billingStatus === PaymentStatus.PENDING
                                        ? 'border-amber-500/20 bg-amber-500/10 text-amber-300'
                                        : billingStatus === PaymentStatus.FAILED
                                            ? 'border-rose-500/20 bg-rose-500/10 text-rose-300'
                                            : 'border-white/10 bg-white/10 text-white/80'
                            )}
                        >
                            {billingStatus.toLowerCase().replace('_', ' ')}
                        </span>
                        <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 grid place-items-center">
                            <RenewalCountdown endDate={renewalDate} variant="inline" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
