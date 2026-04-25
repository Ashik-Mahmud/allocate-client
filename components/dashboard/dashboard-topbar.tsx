import { CircleDollarSign, LayoutDashboard } from "lucide-react";

import { APP_ROLES, type AppRole } from "@/lib/constants/roles";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/theme-toggle";
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
    const notifications = Array.isArray(user?.notifications) ? user.notifications : [];
    const unreadCount = 10; /* typeof user?.unreadNotifications === "number"
        ? Math.max(user.unreadNotifications, 0)
        : notifications.filter((item) => !item?.read).length */

    return (
        <div className="rounded-xl border-0 border-slate-200   py-3 dark:border-slate-800 dark:bg-slate-950  md:py-2">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-3">
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
                                role === APP_ROLES.ADMIN
                                    ? "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                    : "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                            )}
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {formatRole(role)}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 font-mono!">
                        <CircleDollarSign className="size-4 text-emerald-500" />
                        {typeof user?.credits === "number" ? user.credits.toLocaleString() : "100"} credits
                    </span>

                    <NotificationPopover unreadCount={unreadCount} notifications={notifications} />

                    <ThemeToggle
                        floating={false}
                        className="h-10 w-10 rounded-xl border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
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