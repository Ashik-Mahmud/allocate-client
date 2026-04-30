"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Loader2, TriangleAlert } from "lucide-react";

import { useGetStaffByIdQuery } from "@/features/staff";
import type { StaffDetails as StaffRecord } from "@/types/staff";

import StaffDetailsPanel from "@/components/dashboard/staff/staff-details-panel";
import { CreditTransaction } from "@/types/credits";

export default function StaffDetailsPage() {
  const params = useParams<{ staffId?: string | string[] }>();
  const staffId = Array.isArray(params?.staffId) ? params.staffId[0] : params?.staffId;

  const staffQuery = useGetStaffByIdQuery(staffId);

  const staff = useMemo<StaffRecord | null>(() => {
    const data = staffQuery.data as { data?: StaffRecord } | StaffRecord | undefined;

    if (!data) {
      return null;
    }

    if (typeof data === "object" && data && "data" in data) {
      return data.data ?? null;
    }

    return data as StaffRecord;
  }, [staffQuery.data]);

  const demoTransactions = useMemo(() => {
    const balance = staff?.personal_credits ?? 0;

    return [
      {
        id: "CR-1042",
        occurredAt: staff?.updatedAt ?? new Date().toISOString(),
        source: "Monthly allocation adjustment",
        note: "Demo inflow added by org admin",
        amount: 120,
        balanceAfter: balance,
        status: "completed",
        type: "credit",
      },
      {
        id: "DR-1041",
        occurredAt: staff?.createdAt ?? new Date().toISOString(),
        source: "Service usage deduction",
        note: "Demo debit for completed bookings",
        amount: 45,
        balanceAfter: Math.max(balance - 45, 0),
        status: "completed",
        type: "debit",
      },
      {
        id: "CR-1040",
        occurredAt: staff?.createdAt ?? new Date().toISOString(),
        source: "Performance bonus credits",
        note: "Demo bonus for high activity",
        amount: 75,
        balanceAfter: balance + 30,
        status: "completed",
        type: "credit",
      },
      {
        id: "DR-1039",
        occurredAt: staff?.createdAt ?? new Date().toISOString(),
        source: "Manual correction",
        note: "Pending review on admin request",
        amount: 30,
        balanceAfter: balance + 60,
        status: "pending",
        type: "debit",
      },
    ];
  }, [staff]);


  if (!staffId) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-950/40">
        <TriangleAlert className="mx-auto size-10 text-amber-500" />
        <h1 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Missing staff id</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">The details page needs a staff id in the URL.</p>
      </div>
    );
  }

  if (staffQuery.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/40">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <Loader2 className="size-5 animate-spin" />
          Loading staff details...
        </div>
      </div>
    );
  }

  if (staffQuery.isError || !staff) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-500/20 dark:bg-rose-500/10">
        <TriangleAlert className="mx-auto size-10 text-rose-600 dark:text-rose-300" />
        <h1 className="mt-4 text-xl font-semibold text-rose-900 dark:text-rose-100">Could not load staff details</h1>
        <p className="mt-2 text-sm text-rose-700/90 dark:text-rose-200/90">
          {staffQuery.error instanceof Error ? staffQuery.error.message : "The requested staff member was not found."}
        </p>
      </div>
    );
  }

  return <StaffDetailsPanel staff={staff} transactions={(staff?.creditTransactions ?? []) as CreditTransaction[]} />;
}