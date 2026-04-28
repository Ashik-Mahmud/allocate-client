"use client";

import { Loader2 } from "lucide-react";

import { useCurrentUser } from "@/features/auth/hooks";
import ProfileView from "@/components/dashboard/profile/profile-view";

export default function ProfilePage() {
  const { user, isLoading, error } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/40">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <Loader2 className="size-5 animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user || error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-500/20 dark:bg-rose-500/10">
        <h1 className="text-xl font-semibold text-rose-900 dark:text-rose-100">Unable to load profile</h1>
        <p className="mt-2 text-sm text-rose-700/90 dark:text-rose-200/90">
          {error instanceof Error ? error.message : "We could not find your current account profile."}
        </p>
      </div>
    );
  }

  return <ProfileView user={user} />;
}
