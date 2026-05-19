"use client";

import React from "react";
import { Building2, CheckCircle2, Clock, Coins, Copy, Edit, Eye, MoreHorizontal, Receipt, ShieldAlert, Trash, Trash2, Verified, XCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Organizations, PlanType } from "@/types/organization";
import AllocateDropdown from "@/components/shared/dropdown";
import { GoUnverified } from "react-icons/go";
import { OrgTableActionTypes } from "./OrganizationMain";
import { BiReset } from "react-icons/bi";

interface OrganizationsTableProps {
    organizations: Organizations[];
    isLoading?: boolean;
    onAction: (action: OrgTableActionTypes, org: Organizations) => void;
}

const formatDate = (value: Date | string | null | undefined) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString();
};

const StatusBadge = ({ ok, labelOn, labelOff }: { ok: boolean; labelOn: string; labelOff: string }) => (
    <span
        className={[
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            ok
                ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                : "bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
        ].join(" ")}
    >
        {ok ? labelOn : labelOff}
    </span>
);

const OrganizationsTable = ({ organizations, isLoading, onAction }: OrganizationsTableProps) => {
    if (isLoading) {
        return (
            <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
                <div className="animate-pulse">
                    <div className="mb-4 h-8 w-full rounded bg-gray-300 dark:bg-gray-600" />
                    <div className="mb-2 h-8 w-full rounded bg-gray-300 dark:bg-gray-600" />
                    <div className="mb-2 h-8 w-full rounded bg-gray-300 dark:bg-gray-600" />
                    <div className="mb-2 h-8 w-full rounded bg-gray-300 dark:bg-gray-600" />
                    <div className="mb-2 h-8 w-full rounded bg-gray-300 dark:bg-gray-600" />
                    <div className="mb-2 h-8 w-full rounded bg-gray-300 dark:bg-gray-600" />
                    <div className="mb-2 h-8 w-full rounded bg-gray-300 dark:bg-gray-600" />
                    <div className="mb-2 h-8 w-full rounded bg-gray-300 dark:bg-gray-600" />
                    <div className="mb-2 h-8 w-full rounded bg-gray-300 dark:bg-gray-600" />
                    <div className="mb-2 h-8 w-full rounded bg-gray-300 dark:bg-gray-600" />
                </div>
                {/* <span className="text-xs italic">Loading organizations...</span> */}
            </div>
        );
    }

    if (!organizations.length) {
        return (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                <Building2 className="mx-auto mb-2 size-6 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">No organizations found</p>
                <p className="text-xs text-muted-foreground">Try adjusting filters to find matching records.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="hidden rounded-2xl border h-[50dvh] overflow-auto border-border bg-card dark:border-slate-900 dark:bg-slate-900 transition-colors md:block">
                <Table>
                    <TableHeader>
                        <TableRow className="  dark:border-slate-800">
                            <TableHead className="dark:text-white">Organization</TableHead>
                            <TableHead className="dark:text-white">Type</TableHead>
                            <TableHead className="dark:text-white">Plan</TableHead>
                            <TableHead className="dark:text-white">Business Email</TableHead>
                            <TableHead className="dark:text-white">Users</TableHead>
                            <TableHead className="dark:text-white">Credit Pool</TableHead>
                            <TableHead className="dark:text-white">Frozen Credits</TableHead>
                            <TableHead className="dark:text-white">Used Trial</TableHead>
                            <TableHead className="dark:text-white">Verified</TableHead>
                            <TableHead className="dark:text-white">Status</TableHead>
                            <TableHead className="dark:text-white">Created</TableHead>
                            <TableHead className="text-right dark:text-white">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {organizations?.map((org) => {
                            const isVerified = !!org.isVerified;
                            const isActive = !!org.is_active;
                            const isAllowTrial = !!org.isTrialAllowed;
                            const needUpdate = !!org.needUpdateOrg;
                            return (
                                <TableRow key={org.id} className="hover:bg-primary/5 dark:hover:bg-white/5 data-[state=open]:bg-primary/10 dark:data-[state=open]:bg-white/10 dark:border-slate-700">
                                    <TableCell>
                                        <div className="flex min-w-55 items-center gap-2">
                                            <div className="rounded-md bg-primary/10 dark:bg-white/10 p-1.5 text-primary dark:text-white">
                                                <Building2 className="size-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground dark:text-white">{org.name}</p>
                                                <p className="max-w-45 truncate text-xs text-muted-foreground dark:text-white/50">{org.id}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{org.org_type ?? "-"}</TableCell>
                                    <TableCell>
                                        <span
                                            className={[
                                                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                                                org?.plan_type !== PlanType.FREE ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
                                            ].join(" ")}
                                        >
                                            {org.plan_type ?? "-"}
                                        </span>

                                    </TableCell>
                                    <TableCell className="max-w-45 truncate">{org.business_email ?? "-"}</TableCell>
                                    <TableCell>{org?._count?.users ?? 0}</TableCell>
                                    <TableCell>{org.credit_pool ?? 0}</TableCell>
                                    <TableCell>{org.frozen_credits ?? 0}</TableCell>
                                    <TableCell>{org.hasUsedTrial ? <CheckCircle2 className="size-4 text-green-500" /> : <XCircle className="size-4 text-red-500" />}</TableCell>
                                    <TableCell>
                                        <StatusBadge ok={isVerified} labelOn="Verified" labelOff="Unverified" />
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge ok={isActive} labelOn="Active" labelOff="Inactive" />
                                    </TableCell>
                                    <TableCell>{formatDate(org.createdAt)}</TableCell>
                                    <TableCell className="text-right">

                                        <AllocateDropdown dropdownOptions={[
                                            {
                                                label: "View details",
                                                onClick: () => onAction("view", org),
                                                icon: Eye,
                                            },
                                            {
                                                label: "View Subscription",
                                                onClick: () => onAction("view-subscription", org),
                                                icon: Receipt,
                                            },
                                            {
                                                label: "Copy organization ID",
                                                onClick: () => onAction("copy-id", org),
                                                icon: Copy,

                                            },
                                            {
                                                label: needUpdate ? 'Disable edit organization' : 'Enable edit organization',
                                                onClick: () => onAction("need-update", org),
                                                icon: Edit,
                                                disabled: org?.is_active === false || !!org?.deletedAt,
                                            },
                                            {
                                                label: 'Top up credits',
                                                onClick: () => onAction("top-up-credits", org),
                                                icon: Coins,
                                                disabled: org?.is_active === false || !!org?.deletedAt,
                                            },
                                            {
                                                label: 'Extend trial',
                                                onClick: () => onAction("extend-trial", org),
                                                icon: Clock,
                                                disabled: !org?.trialEndsAt || new Date(org?.trialEndsAt) < new Date() || org?.is_active === false || !!org?.deletedAt,
                                            },
                                            {
                                                label: isVerified ? "Mark as unverified" : "Mark as verified",
                                                onClick: () => onAction("toggle-verify", org),
                                                destructive: isVerified,
                                                icon: isVerified ? GoUnverified : Verified,
                                                isSeparator: true,
                                                disabled: org?.is_active === false || !!org?.deletedAt,
                                            },
                                            {
                                                label: isActive ? "Deactivate" : "Activate",
                                                onClick: () => onAction("toggle-active", org),
                                                destructive: isActive,
                                                icon: isActive ? XCircle : CheckCircle2,
                                            },
                                            {
                                                label: !isAllowTrial ? "Allow Trial" : "Disallow Trial",
                                                onClick: () => onAction("trial", org),
                                                icon: isAllowTrial ? CheckCircle2 : XCircle,
                                                destructive: isAllowTrial,
                                                disabled: org.plan_type !== PlanType.FREE || !!org?.deletedAt || org?.is_active === false,
                                            },
                                            {
                                                label: org?.deletedAt ? "Restore organization" : "Delete organization",
                                                onClick: () => onAction(org?.deletedAt ? 'restore' : 'delete', org),
                                                destructive: true,
                                                icon: org?.deletedAt ? BiReset : Trash2,
                                            },


                                        ]}
                                            label="Organization Actions"
                                            align="end"
                                            className="w-48 min-w-48"
                                        >
                                            <Button variant="ghost" size="icon-sm" aria-label="Organization actions">
                                                <MoreHorizontal className="size-4" />
                                            </Button>
                                        </AllocateDropdown>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <div className="grid grid-cols-1 gap-3 md:hidden">
                {organizations.map((org) => {
                    const isVerified = !!org.isVerified;
                    const isActive = !!org.is_active;
                    const isAllowTrial = !!org.isTrialAllowed;
                    const needUpdate = !!org.needUpdateOrg;
                    return (
                        <div key={org.id} className="rounded-xl border border-border bg-card dark:bg-slate-700 dark:border-slate-600 p-3 shadow-sm transition-colors">
                            <div className="mb-2 flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-sm font-semibold text-foreground dark:text-white">{org.name}</p>
                                    <p className="text-xs text-muted-foreground">{org.id}</p>
                                </div>
                                <AllocateDropdown dropdownOptions={[
                                    {
                                        label: "View details",
                                        onClick: () => onAction("view", org),
                                        icon: Eye,
                                    },
                                    {
                                        label: "View Subscription",
                                        onClick: () => onAction("view-subscription", org),
                                        icon: Receipt,
                                    },
                                    {
                                        label: "Copy organization ID",
                                        onClick: () => onAction("copy-id", org),
                                        icon: Copy,

                                    },
                                    {
                                        label: needUpdate ? 'Disable edit organization' : 'Enable edit organization',
                                        onClick: () => onAction("need-update", org),
                                        icon: Edit,
                                    },
                                    {
                                        label: 'Top up credits',
                                        onClick: () => onAction("top-up-credits", org),
                                        icon: Coins,
                                    },
                                    {
                                        label: 'Extend trial',
                                        onClick: () => onAction("extend-trial", org),
                                        icon: Clock,
                                        disabled: !org?.trialEndsAt || new Date(org?.trialEndsAt) < new Date(),
                                    },
                                    {
                                        label: isVerified ? "Mark as unverified" : "Mark as verified",
                                        onClick: () => onAction("toggle-verify", org),
                                        destructive: isVerified,
                                        icon: isVerified ? GoUnverified : Verified,
                                        isSeparator: true,
                                    },
                                    {
                                        label: isActive ? "Deactivate" : "Activate",
                                        onClick: () => onAction("toggle-active", org),
                                        destructive: isActive,
                                        icon: isActive ? XCircle : CheckCircle2,
                                    },
                                    {
                                        label: !isAllowTrial ? "Allow Trial" : "Disallow Trial",
                                        onClick: () => onAction("trial", org),
                                        icon: isAllowTrial ? CheckCircle2 : XCircle,
                                        destructive: isAllowTrial,
                                        disabled: org.plan_type !== PlanType.FREE,
                                    },
                                    {
                                        label: org?.deletedAt ? "Restore organization" : "Delete organization",
                                        onClick: () => onAction(org?.deletedAt ? 'restore' : 'delete', org),
                                        destructive: true,
                                        icon: org?.deletedAt ? BiReset : Trash2,
                                    },


                                ]}
                                    label="Organization Actions"
                                    align="end"
                                    className="w-48 min-w-48"
                                >
                                    <Button variant="ghost" size="icon-sm" aria-label="Organization actions">
                                        <MoreHorizontal className="size-4" />
                                    </Button>
                                </AllocateDropdown>

                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <p className="text-muted-foreground">Plan</p>
                                    <p className="font-medium text-foreground dark:text-white">{org.plan_type ?? "-"}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Type</p>
                                    <p className="font-medium text-foreground dark:text-white">{org.org_type ?? "-"}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Users</p>
                                    <p className="font-medium text-foreground dark:text-white">{org._count?.users ?? 0}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Credits</p>
                                    <p className="font-medium text-foreground dark:text-white">{org.credit_pool ?? 0}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    {isVerified ? (
                                        <CheckCircle2 className="size-3.5 text-emerald-500" />
                                    ) : (
                                        <ShieldAlert className="size-3.5 text-amber-500" />
                                    )}
                                    <StatusBadge ok={isVerified} labelOn="Verified" labelOff="Unverified" />
                                </div>
                                <div className="flex items-center gap-1">
                                    {isActive ? (
                                        <CheckCircle2 className="size-3.5 text-emerald-500" />
                                    ) : (
                                        <XCircle className="size-3.5 text-rose-500" />
                                    )}
                                    <StatusBadge ok={isActive} labelOn="Active" labelOff="Inactive" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrganizationsTable;
