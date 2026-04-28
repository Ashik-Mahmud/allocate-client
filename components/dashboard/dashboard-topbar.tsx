"use client";
import { Building2, CircleDollarSign, LayoutDashboard, User } from "lucide-react";

import { APP_ROLES, type AppRole } from "@/lib/constants/roles";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import NotificationPopover from "./notifcationPopover";
import { useCurrentUser } from "@/features/auth";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { PlanType } from "@/types/organization";
const planStyles = {
    [PlanType.FREE]: "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-zinc-900 dark:text-zinc-400",
    [PlanType.PRO]: "border-indigo-200 bg-indigo-50/50 text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/5 dark:text-indigo-300 shadow-sm shadow-indigo-500/5",
    [PlanType.ENTERPRISE]: "border-amber-200 bg-amber-50/50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-300 shadow-sm shadow-amber-500/10",
}; export function DashboardTopbar() {
    const { user } = useCurrentUser();
    const role = user?.role ?? null;

    return (
        <div className="rounded-xl border-0 border-slate-200   py-3 dark:border-slate-800 dark:bg-slate-950  md:py-2">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className=" min-w-0 items-center gap-3 hidden md:flex">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                        <LayoutDashboard className="size-5" />
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">Dashboard</p>
                        </div>
                        <span
                            className={cn(
                                "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                                "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"

                            )}
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {formatRole(role)}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">

                    <div className="flex flex-wrap items-center gap-4">
                        {/* Show the current Plan for organization */}
                        {user?.role === APP_ROLES.ORG_ADMIN && (
                            <Link href={ROUTES.dashboardOrgAdmin.billing} className={
                                cn(
                                    "group relative  items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300 hover:shadow-md hidden md:flex",
                                    planStyles[user.organization?.plan_type || PlanType.FREE]
                                )
                            }>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800">
                                    <CircleDollarSign className="size-4 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                                        Current Plan
                                    </span>
                                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                                        {user.organization?.plan_type || "Free"}
                                    </span>
                                </div>
                            </Link>
                        )}

                        {/* Organization Credits Chip */}
                        {user?.role === APP_ROLES.ORG_ADMIN && (
                            <Link href={ROUTES.dashboardOrgAdmin.creditManagement} className="group relative flex items-center gap-2 rounded-2xl border border-emerald-200/60 bg-emerald-50/50 pl-2 pr-4 py-0.5 transition-all hover:bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:hover:bg-emerald-500/10">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/20">
                                    <Building2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700/70 dark:text-emerald-400/70">
                                        Org Credits
                                    </span>
                                    <span className="flex items-center gap-1.5 font-mono text-sm font-bold text-emerald-900 dark:text-emerald-100">
                                        {typeof user?.organization?.credit_pool === "number"
                                            ? user.organization?.credit_pool.toLocaleString()
                                            : "0"}
                                        <span className="text-[10px] font-medium opacity-70">CR</span>
                                    </span>
                                </div>
                            </Link>
                        )}

                        {/* Personal Credits Chip */}
                        <div className="group relative flex items-center gap-2 rounded-2xl border border-slate-200 bg-white pl-2 pr-4 py-0.5 transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-zinc-950 dark:hover:border-slate-700">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-800">
                                <User className="size-4 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                                    Personal
                                </span>
                                <span className="flex items-center gap-1.5 font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                                    {typeof user?.personal_credits === "number"
                                        ? user.personal_credits.toLocaleString()
                                        : "0"}
                                    <span className="text-[10px] font-medium opacity-60">CR</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <NotificationPopover unreadCount={10} notifications={[]} />

                    <ThemeToggle
                        floating={false}
                        className="hidden sm:grid h-10 w-10 rounded-xl border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    />


                </div>
            </div>
        </div>
    );
}

function formatRole(role: AppRole | null | undefined) {
    if (role === APP_ROLES.ADMIN) return "System Admin";
    if (role === APP_ROLES.ORG_ADMIN) return "Organization Admin";
    if (role === APP_ROLES.STAFF) return "Staff";
    return "Unknown";
}