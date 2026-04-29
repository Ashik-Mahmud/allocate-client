"use client"

import React, { useEffect, useMemo } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Coins,
    Loader2,
    TrendingUp,
    Info,
    ArrowRight,
    Wallet,
    UserCheck,
    
} from 'lucide-react'
import { cn } from '@/lib/utils'
import AllocateDrawer from '@/components/shared/allocate-drawer'
import { useGetStaffsQuery } from '@/features/staff'
import { ROUTES } from '@/lib/constants/routes'
import Link from 'next/link'

export const ManageMultipleStaffCreditsSchema = z.object({
    staffCredits: z.array(z.object({
        staff_id: z.string(),
        name: z.string(),
        current_credits: z.number(),
        credits: z.number().int().min(0, "Credits must be 0 or more"),
    })),
});

type FormValues = z.infer<typeof ManageMultipleStaffCreditsSchema>;

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedStaffIds: string[];
    onSubmit: (data: FormValues) => void;
    isLoading?: boolean;
    orgCreditPool?: number;
}

const AssignCredits = ({
    open,
    onOpenChange,
    selectedStaffIds,
    onSubmit,
    isLoading,
    orgCreditPool = 10000 // Replace with real data from your Org hook
}: Props) => {

    const { data: staffData, isLoading: isFetching } = useGetStaffsQuery({ limit: 9999 });
    const formId = React.useId();

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: zodResolver(ManageMultipleStaffCreditsSchema as any),
        defaultValues: { staffCredits: [] }
    });

    const { fields } = useFieldArray({
        control,
        name: "staffCredits"
    });

    // 1. Calculate Real-time Allocation Totals
    const staffCreditsValues = useWatch({
        control,
        name: "staffCredits",
    });

    const totalAllocating = useMemo(() => {
        if (!staffCreditsValues) return 0;

        return staffCreditsValues.reduce((acc, curr) => {
            // Ensure we handle potential undefined or non-number values safely
            const creditValue = Number(curr?.credits) || 0;
            return acc + creditValue;
        }, 0);
    }, [staffCreditsValues]);

    // 2. Load ONLY selected staff into the form
    useEffect(() => {
        if (staffData?.data && open) {
            const selectedStaffData = staffData.data.filter((s: any) =>
                selectedStaffIds.includes(s.id)
            );

            reset({
                staffCredits: staffData.data.map((s: any) => ({
                    staff_id: s.id,
                    name: s.name,
                    current_credits: s.personal_credits || 0,
                    credits: 0
                }))
            });
        }
    }, [staffData, open, reset, selectedStaffIds]);

    const applyToAll = (amount: number) => {
        fields.forEach((_, index) => {
            setValue(`staffCredits.${index}.credits`, amount);
        });
    };

    // 3. Final submission filter: Only send staff with credits > 0
    const handleFilteredSubmit = (data: FormValues) => {
        const filteredList = data.staffCredits.filter(item => item.credits > 0);

        if (filteredList.length === 0) return; // Optionally show a toast here

        onSubmit({ staffCredits: filteredList });
    };


    return (
        <AllocateDrawer
            open={open}
            onOpenChange={onOpenChange}
            title="Allocate Credits"
            description="Manage and distribute credits to selected team members."
            className="max-w-xl"
            position='left'

            footer={
                <div>
                    {/* Submit Actions */}
                    {totalAllocating > orgCreditPool && (
                        <div className="space-y-4 py-4 border-t border-slate-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-2 text-[11px] font-bold text-rose-600 dark:bg-rose-500/10">
                                <Info className="size-4" />
                                Allocation exceeds organization credit pool balance.

                                <Link href={ROUTES.dashboardOrgAdmin.billing} className="ml-auto whitespace-nowrap text-xs px-3 py-1 rounded-2xl font-bold border border-red-600 text-rose-600 ">
                                    Upgrade Plan
                                </Link>
                            </div>
                        </div>
                    )}
                                    
                    <button
                        type="submit"
                        form={formId}
                        disabled={isLoading || totalAllocating === 0 || totalAllocating > orgCreditPool}
                        className="flex w-full h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-50 dark:text-slate-950"
                    >
                        {isLoading ? <Loader2 className="size-5 animate-spin" /> : <TrendingUp className="size-5" />}
                        Confirm & Distribute Credits
                    </button>
                </div>

            }
        >
            <div className="p-5 space-y-6">

                {/* --- ORG CREDIT POOL SUMMARY --- */}
                <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-5 text-white dark:bg-white dark:text-slate-900 shadow-xl">
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Available Pool</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black">
                                    {orgCreditPool - totalAllocating}
                                </span>
                                <Coins className="size-4 text-amber-400" />
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Total Allocation</p>
                            <p className={cn(
                                "text-xl font-bold",
                                totalAllocating > orgCreditPool ? "text-rose-400" : "text-emerald-400"
                            )}>
                                -{totalAllocating}
                            </p>
                        </div>
                    </div>
                    <Wallet className="absolute -bottom-6 -right-6 size-24 opacity-10 rotate-12" />
                </div>

                {isFetching ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="size-8 animate-spin text-indigo-500" />
                        <p className="text-sm text-slate-500 font-medium">Fetching balances...</p>
                    </div>
                ) : (
                    <form id={formId} onSubmit={handleSubmit(handleFilteredSubmit)} className="space-y-6">

                        {/* Bulk Action Buttons */}
                        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/5">
                            <div className="mb-3 flex items-center gap-2">
                                <UserCheck className="size-4 text-indigo-500" />
                                <span className="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400">Quick Apply</span>
                            </div>
                            <div className="flex gap-2">
                                {[0, 50, 100, 250, 500].map((amt) => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => applyToAll(amt)}
                                        className="flex-1 rounded-lg border border-indigo-200 bg-white py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50 dark:border-indigo-500/30 dark:bg-zinc-900 dark:text-indigo-300"
                                    >
                                        +{amt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Selected Staff List */}
                        <div className="max-h-[45vh] space-y-2 overflow-y-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {fields.map((field, index) => {
                                const hasValue = (staffCreditsValues?.[index]?.credits ?? 0) > 0;
                                return (
                                    <div
                                        key={field.id}
                                        className={cn(
                                            "flex items-center justify-between rounded-xl border p-3 transition-all duration-200",
                                            hasValue
                                                ? "border-indigo-500/50 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-sm"
                                                : "border-slate-100 bg-slate-50/30 dark:border-zinc-800 dark:bg-zinc-900/20"
                                        )}
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{field.name}</span>
                                            <span className="flex items-center gap-1 text-[11px] text-slate-500">
                                                Balance: <Coins className="size-3" /> {field.current_credits}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <ArrowRight className={cn("size-4", hasValue ? "text-indigo-500" : "text-slate-300")} />
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    {...register(`staffCredits.${index}.credits` as const, { valueAsNumber: true })}
                                                    className="w-24 h-10 rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-sm font-bold transition-all focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                                                />
                                                <Coins className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>


                    </form>
                )}
            </div>
        </AllocateDrawer>
    )
}

export default AssignCredits