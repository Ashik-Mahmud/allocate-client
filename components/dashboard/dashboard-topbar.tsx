import Link from "next/link";
import { Bell, ChevronDown, CircleDollarSign, LayoutDashboard } from "lucide-react";

import { APP_ROLES, type AppRole } from "@/lib/constants/roles";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import NotificationPopover from "./notifcationPopover";

type DashboardNotification = {
    id?: string;
    title?: string;
    message?: string;
    read?: boolean;
};

type DashboardUser = {
    name?: string | null;
    email?: string | null;
    role?: AppRole | null;
    credits?: number | null;
    unreadNotifications?: number | null;
    notifications?: DashboardNotification[];
};

type DashboardTopbarProps = {
    user: DashboardUser | null;
};

export function DashboardTopbar({ user }: DashboardTopbarProps) {
    const role = user?.role ?? null;
    const unreadCount = 50;
    const notifications = Array.isArray(user?.notifications) ? user.notifications.slice(0, 4) : [];

    return (
        <div className="rounded  bg-white/90 px-4 py-1 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/88 md:px-5 md:py-2 border-b border-b-slate-200">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    {/* <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/80 text-white shadow-lg shadow-slate-900/15 dark:from-slate-100 dark:to-slate-300 dark:text-slate-900">
                        <LayoutDashboard className="size-5" />
                    </div> */}

                    <div className="min-w-0 hidden">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">Dashboard</p>
                        </div>
                        <span
                            className={cn(
                                "inline-flex items-center gap-2 rounded-full border-0   text-[11px] font-semibold text-secondary-foreground",
                                role === APP_ROLES.ADMIN
                                    ? "border-slate-900/10  text-white dark:border-slate-100/10 dark:bg-slate-100 dark:text-slate-900"
                                    : "border-slate-200  text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                            )}
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {formatRole(role)}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                        <CircleDollarSign className="size-4 text-emerald-500" />
                        {typeof user?.credits === "number" ? user.credits.toLocaleString() : "0"} credits
                    </span>

                    <div>
                        <NotificationPopover unreadCount={unreadCount} />
                    </div>


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