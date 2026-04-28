"use client";

import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import {
    ArrowLeft,
    BadgeCheck,
    Building2,
    CalendarDays,
    Coins,
    Hash,
    Mail,
    MoreVertical,
    Shield,
    UserRound,
} from "lucide-react";

import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import type { StaffDetails } from "@/types/staff";

import StaffCreditTransactionsTable, { type StaffCreditTransaction } from "./staff-credit-transactions-table";
import AllocateDropdown from "@/components/shared/dropdown";

type Props = {
    staff: StaffDetails;
    transactions: StaffCreditTransaction[];
    backHref?: string;
};

function formatMaybeDate(value?: string | Date | null) {
    if (!value) {
        return "N/A";
    }

    return format(new Date(value), "dd MMM yyyy, p");
}

function buildStatCard(label: string, value: string, helper: string, accent: string) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{label}</p>
            <p className={cn("mt-2 text-xl font-semibold", accent)}>{value}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helper}</p>
        </article>
    );
}

export default function StaffDetailsPanel({ staff, transactions, backHref = ROUTES.dashboardOrgAdmin.staffManagement }: Props) {
    const currentBalance = staff.personal_credits ?? 0;
    const totalCreditsAdded = transactions
        .filter((transaction) => transaction.type === "credit")
        .reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalCreditsSpent = transactions
        .filter((transaction) => transaction.type === "debit")
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    const roleLabel = staff.role ? staff.role.replaceAll("_", " ") : "Staff";
    const joinedAt = formatMaybeDate(staff.createdAt);
    const updatedAt = formatMaybeDate(staff.updatedAt);
    const lastLogin = staff.last_login ? formatDistanceToNow(new Date(staff.last_login), { addSuffix: true }) : "Never";
    const organizationName = staff.organization?.name ?? "No organization linked";
    const initials = (staff.name ?? staff.email ?? "ST")
        .slice(0, 2)
        .toUpperCase();

    return (
        <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                    href={backHref}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                    <ArrowLeft className="size-4" />
                    Back to staff list
                </Link>

                {/* <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          Demo page for org admin review
        </div> */}
                {/* Added three dot menu */}
                <AllocateDropdown dropdownOptions={[

                    {
                        label: "Assign credits",
                        onClick: () => {
                            // Handle activate/deactivate logic here

                        },

                    },
                    {
                        label: "Revoke credits",
                        onClick: () => {
                            // Handle activate/deactivate logic here

                        }
                    },
                    {
                        label: 'Edit User',
                        onClick: () => {
                            // Handle edit user logic here

                        }
                    },
                    {
                        label: 'Delete User',
                        onClick: () => {
                            // Handle delete user logic here

                        },
                        destructive: true
                    }

                ]} >
                    <button className="rounded-lg p-1 cursor-pointer text-slate-400 bg-slate-100 dark:bg-slate-700 dark:hover:bg-zinc-800">
                        <MoreVertical className="size-6" />
                    </button>
                </AllocateDropdown>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-6 py-8 text-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10 text-xl font-bold">
                                {staff.photo ? (
                                    <img src={staff.photo} alt={staff.name ?? staff.email} className="h-full w-full object-cover" />
                                ) : (
                                    initials
                                )}
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-2xl font-semibold tracking-tight">{staff.name ?? staff.email}</h1>
                                    {staff.is_verified ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-200">
                                            <BadgeCheck className="size-3.5" />
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-200">
                                            <Shield className="size-3.5" />
                                            Unverified
                                        </span>
                                    )}
                                </div>
                                <p className="mt-1 text-sm text-white/75">{roleLabel}</p>
                                <p className="mt-1 text-sm text-white/60">{organizationName}</p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {buildStatCard("Current balance", `${currentBalance.toLocaleString()} CR`, "Available personal credits", "text-emerald-600 dark:text-emerald-300")}
                            {buildStatCard("Added credits", `${totalCreditsAdded.toLocaleString()} CR`, "Demo inflow from adjustments", "text-sky-600 dark:text-sky-300")}
                            {buildStatCard("Spent credits", `${totalCreditsSpent.toLocaleString()} CR`, "Demo outflow from usage", "text-rose-600 dark:text-rose-300")}
                            {buildStatCard("Last login", lastLogin, "Most recent activity", "text-amber-600 dark:text-amber-300")}
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 px-6 py-6 lg:grid-cols-2">
                    <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/30">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                            <UserRound className="size-4" />
                            Staff information
                        </div>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <InfoRow icon={<Mail className="size-4" />} label="Email" value={staff.email} />
                            <InfoRow icon={<Hash className="size-4" />} label="Staff ID" value={staff.id ?? "N/A"} mono />
                            <InfoRow icon={<Building2 className="size-4" />} label="Organization ID" value={staff.org_id ?? "N/A"} mono />
                            <InfoRow icon={<CalendarDays className="size-4" />} label="Joined" value={joinedAt} />
                            <InfoRow icon={<CalendarDays className="size-4" />} label="Updated" value={updatedAt} />
                            <InfoRow icon={<Coins className="size-4" />} label="Personal credits" value={`${currentBalance.toLocaleString()} CR`} />
                        </div>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/30">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                            <Shield className="size-4" />
                            Account summary
                        </div>

                        <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                            <SummaryLine label="Role" value={roleLabel} />
                            <SummaryLine label="Verification" value={staff.is_verified ? "Verified account" : "Verification pending"} />
                            <SummaryLine label="Last login" value={lastLogin} />
                            <SummaryLine label="Organization" value={organizationName} />
                            <SummaryLine label="Email status" value={staff.email ? "Available" : "Missing"} />
                        </div>
                    </article>
                </div>
            </div>

            <StaffCreditTransactionsTable transactions={transactions} />
        </section>
    );
}

function InfoRow({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value?: string; mono?: boolean }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                {icon}
                {label}
            </div>
            <p className={cn("mt-2 text-sm text-slate-900 dark:text-slate-100", mono ? "font-mono text-xs" : "")}>{value}</p>
        </div>
    );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">{label}</span>
            <span className="text-right font-medium text-slate-900 dark:text-slate-100">{value}</span>
        </div>
    );
}