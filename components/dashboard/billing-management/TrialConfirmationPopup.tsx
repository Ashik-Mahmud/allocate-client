"use client"

import React, { useState } from 'react';
import { Zap, CheckCircle2, ShieldCheck, Clock, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FREE_TRIAL_DAYS, SUBSCRIPTION_LIMITS } from '@/lib/constants/subscription';
import Link from 'next/link';
import { useStartFreeTrial } from '@/features/billings/hooks';

type Props = {
    onSuccess?: () => void;
    onCancel?: () => void;
}

const TrialConfirmationPopup = ({ onSuccess, onCancel }: Props) => {
    const trialMutation = useStartFreeTrial();

    const handleConfirm = async () => {
        try {
            const result = await trialMutation.mutateAsync();
            if (result?.success) {
                onSuccess && onSuccess();
            } else {
                // Handle error case if needed
            }
        } catch (error) {
            // Handle network or unexpected errors
            console.error("Failed to start trial:", error);
        }
    };

    return (
        <div className="w-full bg-white dark:bg-slate-950">
            {/* Minimal Header */}
            <div className="flex flex-col items-center pt-2 pb-6">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-4">
                    <Sparkles className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center leading-tight">
                    Start your {FREE_TRIAL_DAYS}-days <span className="text-indigo-600">PRO</span> trial
                </h2>
                <p className="text-slate-500 text-sm mt-2 text-center max-w-70">
                    Get immediate access to premium features and scale your organization.
                </p>
            </div>

            {/* Feature List - Minimalist Grid */}
            <div className="grid grid-cols-1 gap-3 py-4 border-y border-slate-100 dark:border-slate-800">
                {Object.entries(SUBSCRIPTION_LIMITS.PRO.FEATURES)?.slice(0, 7).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-3 px-2 text-sm text-slate-600 dark:text-slate-400">
                        <div className="mt-0.5 bg-emerald-50 dark:bg-emerald-900/20 p-0.5 rounded-full">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500 shrink-0" />
                        </div>
                        <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                    </div>
                ))}
                <Link href="/pricing" className="flex items-center gap-1 text-sm text-indigo-600 hover:underline mt-2">
                    View full feature list
                    <ArrowRight size={14} />
                </Link>
            </div>

            {/* Info Section - More Compact */}
            <div className="py-5 space-y-2.5">
                <div className="flex items-center gap-2.5 text-[13px] text-slate-500">
                    <Clock size={16} className="text-slate-400" />
                    <span>No credit card required. Cancel anytime.</span>
                </div>
                <div className="flex items-center gap-2.5 text-[13px] text-slate-500">
                    <ShieldCheck size={16} className="text-slate-400" />
                    <span>Auto-reverts to Free plan after {FREE_TRIAL_DAYS} days.</span>
                </div>
            </div>

            {/* Actions - Modern Layout */}
            <div className="flex flex-col gap-2 pt-2">
                {
                    trialMutation?.isError && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{trialMutation?.error?.message || 'Failed to start trial. Please try again.'}</span>
                        </div>
                    )
                }
                <Button
                    onClick={handleConfirm}
                    disabled={trialMutation?.isPending}
                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all gap-2"
                >
                    {trialMutation?.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <>
                            Start My Trial Now
                            <ArrowRight size={16} />
                        </>
                    )}
                </Button>
                <Button
                    variant="ghost"
                    onClick={onCancel}
                    disabled={trialMutation?.isPending}
                    className="w-full h-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium text-sm"
                >
                    No thanks, keep current plan
                </Button>
            </div>
        </div>
    );
};

export default TrialConfirmationPopup;