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
    MinusCircle,
    PlusCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import AllocateDrawer from '@/components/shared/allocate-drawer'
import { useGetStaffsQuery } from '@/features/staff'
import { ROUTES } from '@/lib/constants/routes'
import NextLink from 'next/link' // Aliased to avoid conflict with Lucide Link icon
import Link from 'next/link'
import FeatureGuard from '@/components/shared/FeatureGuard'

export const ManageMultipleStaffCreditsSchema = z.object({
    staffCredits: z.array(z.object({
        staff_id: z.string(),
        name: z.string(),
        current_credits: z.number(),
        credits: z.number().int().min(0, "Amount must be 0 or more"),
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
    position?: "top" | "bottom" | "left" | "right";
    type?: "assign" | "revoke";
    error?: string;
}

const AssignCredits = ({
    open,
    onOpenChange,
    selectedStaffIds,
    onSubmit,
    isLoading,
    position = "left",
    type = "assign",
    orgCreditPool = 10000,
    error
}: Props) => {
    const isRevoke = type === "revoke";
    const { data: staffData, isLoading: isFetching } = useGetStaffsQuery({ limit: 9999 });
    const formId = React.useId();

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: zodResolver(ManageMultipleStaffCreditsSchema as any),
        defaultValues: { staffCredits: [] }
    });

    const { fields } = useFieldArray({
        control,
        name: "staffCredits"
    });

    const staffCreditsValues = useWatch({
        control,
        name: "staffCredits",
    });

    const totalAllocating = useMemo(() => {
        if (!staffCreditsValues) return 0;
        return staffCreditsValues.reduce((acc, curr) => {
            const val = Number(curr?.credits) || 0;
            return acc + val;
        }, 0);
    }, [staffCreditsValues]);

    useEffect(() => {
        if (staffData?.data && open) {
            // If specific IDs are passed, show only those, otherwise show all
            const staffList = selectedStaffIds?.length > 0
                ? staffData.data.filter((s: any) => selectedStaffIds.includes(s.id))
                : staffData.data;

            reset({
                staffCredits: staffList.map((s: any) => ({
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

    const handleFilteredSubmit = (data: FormValues) => {
        const filteredList = data.staffCredits.filter(item => item.credits > 0);
        if (filteredList.length === 0) return;
        onSubmit({ staffCredits: filteredList });
    };

    // Validation: Check if any row is revoking more than the user's current balance
    const hasError = useMemo(() => {
        if (!isRevoke) return totalAllocating > orgCreditPool;
        return staffCreditsValues?.some(field => (Number(field.credits) || 0) > field.current_credits);
    }, [isRevoke, totalAllocating, orgCreditPool, staffCreditsValues]);

    return (
        <AllocateDrawer
            open={open}
            onOpenChange={onOpenChange}
            title={isRevoke ? "Revoke Credits" : "Allocate Credits"}
            description={isRevoke ? "Remove credits from selected team members." : "Distribute credits to your team members."}
            className="max-w-xl"
            position={position}
            showHandler={false}
            footer={

                <div className="w-full space-y-4">
                    {!isRevoke && totalAllocating > orgCreditPool && (
                        <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-2 text-[11px] font-bold text-rose-600 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20">
                            <Info className="size-4 shrink-0" />
                            <span className="flex-1">Allocation exceeds organization credit pool balance.</span>
                            <Link href={ROUTES.dashboardOrgAdmin.billing} className="whitespace-nowrap rounded-md bg-rose-600 px-2 py-1 text-white hover:bg-rose-700 transition-colors">
                                Upgrade Plan
                            </Link>
                        </div>
                    )}

                    {/* If is revoke */}
                    {isRevoke && staffCreditsValues?.some(field => (Number(field.credits) || 0) > field.current_credits) && (
                        <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-2 text-[11px] font-bold text-rose-600 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20">
                            <Info className="size-4 shrink-0" />
                            <span className="flex-1">Ensure that revocation amounts do not exceed individual staff's current credits.</span>
                        </div>
                    )}
                    {
                        error && (
                            <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-2 text-[11px] font-bold text-rose-600 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20">
                                <Info className="size-4 shrink-0" />
                                <span className="flex-1">{error}</span>
                            </div>
                        )
                    }
                    <button
                        type="submit"
                        form={formId}
                        disabled={isLoading || totalAllocating === 0 || hasError}
                        className={cn(
                            "flex w-full h-12 items-center justify-center gap-2 rounded-xl font-bold text-white transition-all disabled:opacity-50",
                            isRevoke
                                ? "bg-rose-600 hover:bg-rose-700"
                                : "bg-slate-900 dark:bg-slate-50 dark:text-slate-950 hover:opacity-90"
                        )}
                    >
                        {isLoading ? <Loader2 className="size-5 animate-spin" /> : (isRevoke ? <MinusCircle className="size-5" /> : <PlusCircle className="size-5" />)}
                        {isRevoke ? "Confirm Revocation" : "Confirm & Distribute Credits"}
                    </button>
                </div>

            }
        >
            <div className="p-5 space-y-6">
                {/* --- HEADER SUMMARY --- */}
                <div className={cn(
                    "relative overflow-hidden rounded-2xl p-5 text-white shadow-xl transition-colors duration-500",
                    isRevoke ? "bg-rose-900" : "bg-slate-900 dark:bg-white dark:text-slate-900"
                )}>
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                                {isRevoke ? "Total to Revoke" : "Available Pool"}
                            </p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black">
                                    {isRevoke ? totalAllocating : orgCreditPool - totalAllocating}
                                </span>
                                <Coins className={cn("size-4", isRevoke ? "text-rose-300" : "text-amber-400")} />
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Impact</p>
                            <p className={cn("text-xl font-bold", isRevoke ? "text-emerald-400" : (totalAllocating > orgCreditPool ? "text-rose-400" : "text-emerald-400"))}>
                                {isRevoke ? "+" : "-"}{totalAllocating}
                            </p>
                        </div>
                    </div>
                    <Wallet className="absolute -bottom-6 -right-6 size-24 opacity-10 rotate-12" />
                </div>

                {isFetching ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="size-8 animate-spin text-indigo-500" />
                        <p className="text-sm text-slate-500 font-medium">Loading staff list...</p>
                    </div>
                ) : (
                    <form id={formId} onSubmit={handleSubmit(handleFilteredSubmit)} className="space-y-6">
                        {/* Quick Apply Buttons */}
                        <div className={cn(
                            "rounded-2xl border p-4 transition-colors",
                            isRevoke ? "border-rose-100 bg-rose-50/30 dark:border-rose-500/10" : "border-indigo-100 bg-indigo-50/30 dark:border-indigo-500/10"
                        )}>
                            <div className="mb-3 flex items-center gap-2">
                                <UserCheck className={cn("size-4", isRevoke ? "text-rose-500" : "text-indigo-500")} />
                                <span className={cn("text-xs font-bold uppercase", isRevoke ? "text-rose-600" : "text-indigo-600")}>
                                    Quick {isRevoke ? "Revoke" : "Allocate"}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                {[0, 50, 100, 250, 500].map((amt) => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => applyToAll(amt)}
                                        className="flex-1 rounded-lg border bg-white py-2 text-xs font-bold hover:bg-slate-50 dark:bg-slate-900 transition-colors"
                                    >
                                        {isRevoke ? "-" : "+"}{amt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Staff List */}
                        <div className="max-h-[45vh] space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                            {fields.map((field, index) => {
                                const currentCredits = staffCreditsValues?.[index]?.credits || 0;
                                const isInvalid = isRevoke && currentCredits > field.current_credits;

                                return (
                                    <div
                                        key={field.id}
                                        className={cn(
                                            "flex items-center justify-between rounded-xl border p-3 transition-all duration-200",
                                            isInvalid ? "border-rose-500 bg-rose-50 dark:bg-rose-500/10" :
                                                currentCredits > 0
                                                    ? (isRevoke ? "border-rose-500/50 bg-rose-50/50" : "border-indigo-500/50 bg-indigo-50/50")
                                                    : "border-slate-100 bg-slate-50/30 dark:border-zinc-800 dark:bg-gray-800"
                                        )}
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-bold">{field.name}</span>
                                            <span className="flex items-center gap-1 text-[11px] text-slate-500">
                                                Current: <Coins className="size-3" /> {field.current_credits}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <ArrowRight className={cn("size-4", currentCredits > 0 ? "text-slate-900" : "text-slate-300")} />
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    {...register(`staffCredits.${index}.credits` as const, { valueAsNumber: true })}
                                                    className={cn(
                                                        "w-24 h-10 rounded-lg border bg-white pl-8 pr-2 text-sm font-bold focus:ring-2 outline-none transition-all",
                                                        isInvalid ? "border-rose-500 ring-rose-500" : "border-slate-200 focus:ring-indigo-500 dark:bg-slate-950"
                                                    )}
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