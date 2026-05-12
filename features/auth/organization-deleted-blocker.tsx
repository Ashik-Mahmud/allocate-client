"use client";

import { useState } from "react";
import { signOut as nextAuthSignOut, useSession } from "next-auth/react";
import { AlertTriangle, Building2, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { clearAuthSession } from "./storage";
import { useCurrentUserContext } from "./current-user-context";

function getCallbackUrl(reason: string) {
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/sign-in?reason=${encodeURIComponent(reason)}`;
  }

  return `/sign-in?reason=${encodeURIComponent(reason)}`;
}

export function OrganizationDeletedBlocker() {
  const { user, isLoading } = useCurrentUserContext();
  const session = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sessionUser = session.data?.user ?? null;
  const isOrgDeleted = Boolean(user?.organization?.deletedAt || sessionUser?.organization?.deletedAt);
  if (isLoading || !isOrgDeleted) {
    return null;
  }

  const orgName = user?.organization?.name ?? sessionUser?.organization?.name ?? "your organization";

  async function handleLogoutNow() {
    if (isSubmitting) return;

    setIsSubmitting(true);
    clearAuthSession();
    await nextAuthSignOut({ redirect: false });

    if (typeof window !== "undefined") {
      window.location.assign(getCallbackUrl("organization-deleted"));
      return;
    }

    setIsSubmitting(false);
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-6 shadow-2xl dark:border-red-900/50 dark:bg-slate-900">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-full bg-red-100 p-2 text-red-700 dark:bg-red-950/40 dark:text-red-300">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Organization Access Removed</h2>
        </div>

        <p className="mb-3 text-sm text-slate-700 dark:text-slate-300">
          <span className="font-semibold">{orgName}</span> is no longer active. You must log out to continue.
        </p>

        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <Building2 className="h-4 w-4" />
            Organization Status
          </div>
          <div className="text-sm text-red-700 dark:text-red-300">Deleted / Deactivated</div>
        </div>

        <Button
          onClick={handleLogoutNow}
          disabled={isSubmitting}
          className="h-11 w-full bg-red-600 text-white hover:bg-red-700"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isSubmitting ? "Logging out..." : "Log out now"}
        </Button>
      </div>
    </div>
  );
}
