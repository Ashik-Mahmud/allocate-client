"use client";

import { APP_ROLES } from "@/lib/constants/roles";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";
import { PlanType } from "@/types/organization";
import { Building2, ChevronDown, CircleDollarSign, User } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AccountMetricsDropdownProps {
    user: any;
}

type MetricType = "org" | "plan" | "personal";

export function AccountMetricsDropdown({ user }: AccountMetricsDropdownProps) {
    const isOrgAdmin = user?.role === APP_ROLES.ORG_ADMIN;
    const plan = user?.organization?.plan_type || PlanType.FREE;
    const orgCredits = user?.organization?.credit_pool ?? 0;
    const personalCredits = user?.personal_credits ?? 0;

    const availableMetrics = React.useMemo(() => {
        const metrics: MetricType[] = [];
        if (isOrgAdmin) {
            metrics.push("org");
            metrics.push("plan");
        }
        metrics.push("personal");
        return metrics;
    }, [isOrgAdmin]);

    const [activeMetric, setActiveMetric] = React.useState<MetricType>(availableMetrics[0]);
    const [isOpen, setIsOpen] = React.useState(false);

    const [animationState, setAnimationState] = React.useState<"idle" | "exit" | "enter">("idle");

    const handleMetricChange = React.useCallback((nextMetric: MetricType) => {
        if (nextMetric === activeMetric) return;

        setAnimationState("exit");

        setTimeout(() => {
            setActiveMetric(nextMetric);
            setAnimationState("enter");

            setTimeout(() => {
                setAnimationState("idle");
            }, 50);

        }, 180);
    }, [activeMetric]);

    // Auto-rotation effect
    React.useEffect(() => {
        if (isOpen || availableMetrics.length <= 1) return;

        const interval = setInterval(() => {
            const currentIndex = availableMetrics.indexOf(activeMetric);
            const nextIndex = (currentIndex + 1) % availableMetrics.length;
            handleMetricChange(availableMetrics[nextIndex]);
        }, 10000);

        return () => clearInterval(interval);
    }, [availableMetrics, isOpen, activeMetric, handleMetricChange]);

    const renderTriggerContent = () => {
        switch (activeMetric) {
            case "plan":
                return (
                    <>
                        <CircleDollarSign className="size-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
                        <div className="flex flex-col items-start text-left leading-tight">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Plan</span>
                            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">{plan}</span>
                        </div>
                    </>
                );
            case "org":
                return (
                    <>
                        <Building2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div className="flex flex-col items-start text-left leading-tight">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600/80 dark:text-emerald-400/70">Org Balance</span>
                            <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
                                {orgCredits.toLocaleString()} <span className="text-[9px] opacity-70">CR</span>
                            </span>
                        </div>
                    </>
                );
            case "personal":
                return (
                    <>
                        <User className="size-4 text-slate-500 dark:text-zinc-400 shrink-0" />
                        <div className="flex flex-col items-start text-left leading-tight">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Personal</span>
                            <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
                                {personalCredits.toLocaleString()} <span className="text-[9px] opacity-60">CR</span>
                            </span>
                        </div>
                    </>
                );
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <button className="group relative flex h-10 items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/50 pl-3 pr-2.5 py-1 transition-all duration-300 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-zinc-950/50 dark:hover:border-slate-700 dark:hover:bg-zinc-950 focus:outline-none select-none min-w-37.5 overflow-hidden">

                    {/* Vertical Slide Motion Wrapper */}
                    <div
                        className={cn(
                            "flex items-center gap-2 flex-1 transition-all cubic-bezier(0.4, 0, 0.2, 1)",
                            animationState === "idle" && "opacity-100 translate-y-0 duration-200",
                            animationState === "exit" && "opacity-0 -translate-y-3 duration-150",
                            animationState === "enter" && "opacity-0 translate-y-3 duration-0"
                        )}
                    >
                        {renderTriggerContent()}
                    </div>

                    <ChevronDown className="size-3.5 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180 shrink-0" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5 shadow-xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-zinc-950">
                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 px-2 py-1.5">
                    Account Metrics
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800/60 my-1" />
                {/* Org Credits Item */}
                {isOrgAdmin && (
                    <DropdownMenuItem
                        onClick={() => handleMetricChange("org")}
                        className={cn(
                            "flex items-center justify-between rounded-lg px-2.5 py-2 cursor-pointer focus:bg-slate-50 dark:focus:bg-zinc-900/60",
                            activeMetric === "org" && "bg-slate-50/80 dark:bg-zinc-900/40"
                        )}
                        asChild
                    >
                        <Link href={ROUTES.dashboardOrgAdmin.creditManagement}>
                            <div className="flex items-center gap-2.5">
                                <Building2 className="size-4 text-emerald-600" />
                                <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">Organization Credits</span>
                            </div>
                            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                {orgCredits.toLocaleString()}
                            </span>
                        </Link>
                    </DropdownMenuItem>
                )}
                {/* Plan Item */}
                {isOrgAdmin && (
                    <DropdownMenuItem
                        onClick={() => handleMetricChange("plan")}
                        className={cn(
                            "flex items-center justify-between rounded-lg px-2.5 py-2 cursor-pointer focus:bg-slate-50 dark:focus:bg-zinc-900/60",
                            activeMetric === "plan" && "bg-slate-50/80 dark:bg-zinc-900/40"
                        )}
                        asChild
                    >
                        <Link href={ROUTES.dashboardOrgAdmin.billing}>
                            <div className="flex items-center gap-2.5">
                                <CircleDollarSign className="size-4 text-indigo-500" />
                                <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">Subscription Plan</span>
                            </div>
                            <span className="text-xs font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 px-2 py-0.5 rounded-md">
                                {plan}
                            </span>
                        </Link>
                    </DropdownMenuItem>
                )}



                {/* Personal Credits Item */}
                <DropdownMenuItem
                    onClick={() => handleMetricChange("personal")}
                    className={cn(
                        "flex items-center justify-between rounded-lg px-2.5 py-2 cursor-pointer focus:bg-slate-50 dark:focus:bg-zinc-900/60",
                        activeMetric === "personal" && "bg-slate-50/80 dark:bg-zinc-900/40"
                    )}
                >
                    <div className="flex items-center gap-2.5">
                        <User className="size-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">Personal Credits</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400">
                        {personalCredits.toLocaleString()}
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}