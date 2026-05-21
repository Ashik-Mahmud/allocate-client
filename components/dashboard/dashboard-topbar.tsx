"use client";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useCurrentUser } from "@/features/auth";
import useGlobalSettings from "@/hooks/use-global-settings";
import { APP_ROLES, type AppRole } from "@/lib/constants/roles";
import { cn } from "@/lib/utils/cn";
import { Role } from "@/types";
import { LayoutDashboard } from "lucide-react";
import { LocaleSwitcher } from "../shared/LanguageToggler";
import { AccountMetricsDropdown } from "./account-metrics-dropdown"; // Import the new component
import NotificationPopover from "./notifcationPopover";

export function DashboardTopbar() {
  const { user } = useCurrentUser();
  const role = user?.role ?? null;
  const { isThemeMode, languageChanger } = useGlobalSettings();

  return (
    <div className="rounded-xl border-0 border-slate-200 z-50 py-3 dark:border-slate-800 dark:bg-slate-950 md:py-2">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Left Side: Route Icon and Active Role Identity */}
        <div className="min-w-0 items-center gap-3 hidden md:flex">
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

        {/* Right Side: Consolidated Controls */}
        <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end">
          
          {/* Unified Rotating Dropdown Component */}
          {user?.role !== Role.ADMIN && <AccountMetricsDropdown user={user} />}

          <div className="flex items-center gap-2">
            <NotificationPopover />

            {isThemeMode || user?.role === Role.ADMIN ? (
              <ThemeToggle
                floating={false}
                className="hidden sm:grid h-10 w-10 rounded-xl border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
            ) : null}

            {languageChanger || user?.role === Role.ADMIN ? (
              <LocaleSwitcher variant="minimal-code" />
            ) : null}
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