"use client";

import React from "react";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrganizationListFilters } from "@/types/systemGlobal";
import { PlanType } from "@/types/organization";
import is from "zod/v4/locales/is.js";

type VerifiedFilterValue = "all" | "true" | "false";

interface OrganizationsFiltersProps {
    filters: OrganizationListFilters;
    onChange: (patch: Partial<OrganizationListFilters>) => void;
    onApply: () => void;
    onReset: () => void;
    isFetching?: boolean;
}

const OrganizationsFilters = ({
    filters,
    onChange,
    onApply,
    onReset,
    isFetching,
}: OrganizationsFiltersProps) => {
    const verifiedValue: VerifiedFilterValue =
        filters.verified === undefined ? "all" : filters.verified ? "true" : "false";
const is_active: VerifiedFilterValue =
        filters.is_active === undefined ? "all" : filters.is_active ? "true" : "false";

    return (
        <section className="rounded-2xl border border-border bg-card dark:bg-slate-800 dark:border-slate-500 p-4 shadow-sm transition-colors">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground dark:text-white">
                    <SlidersHorizontal className="size-4" />
                    Organization Filters
                </div>
                {isFetching ? (
                    <span className="text-xs text-muted-foreground dark:text-white/50">Refreshing...</span>
                ) : null}
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground dark:text-white/50">Search</label>
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={filters.search ?? ""}
                            onChange={(e) => onChange({ search: e.target.value, page: 1 })}
                            placeholder="Search org by keyword"
                            className="pl-8"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground dark:text-white/50">Organization Name</label>
                    <Input
                        value={filters.name ?? ""}
                        onChange={(e) => onChange({ name: e.target.value, page: 1 })}
                        placeholder="Exact or partial name"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground dark:text-white/50">Organization ID</label>
                    <Input
                        value={filters.organizationId ?? ""}
                        onChange={(e) => onChange({ organizationId: e.target.value, page: 1 })}
                        placeholder="org_xxx"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground dark:text-white/50">Verification</label>
                    <select
                        value={verifiedValue}
                        onChange={(e) => {
                            const value = e.target.value as VerifiedFilterValue;
                            onChange({
                                verified: value === "all" ? undefined : value === "true",
                                page: 1,
                            });
                        }}
                        className="h-8 w-full rounded-lg border border-input bg-background px-2.5 py-1 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:scheme-dark"
                    >
                        <option value="all">All</option>
                        <option value="true">Verified Only</option>
                        <option value="false">Unverified Only</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground dark:text-white/50">Organization Preference (Active/Inactive)</label>
                    <select
                        value={is_active}
                        onChange={(e) => {
                            const value = e.target.value as VerifiedFilterValue;
                            onChange({
                                is_active: value === "all" ? undefined : value === "true",
                                page: 1,
                            });
                        }}
                        className="h-8 w-full rounded-lg border border-input bg-background px-2.5 py-1 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:scheme-dark"
                    >
                        <option value="all">All</option>
                        <option value="true">Active Only</option>
                        <option value="false">Inactive Only</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground dark:text-white/50">Organization Preference</label>
                    <select
                        value={
                            filters.showDeletedOrg ? "true" : 'false'
                        }
                        onChange={(e) => {
                            const value = e.target.value as VerifiedFilterValue;
                            onChange({
                                showDeletedOrg: value === "true" ? true : value === "false" ? false : undefined,
                                page: 1,
                            });
                        }}
                        className="h-8 w-full rounded-lg border border-input bg-background px-2.5 py-1 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:scheme-dark"
                    >
                        <option value="false">None </option>
                        <option value="true">Only restorable</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground dark:text-white/50">Plan Type</label>
                    <select
                        value={
                            filters.planType ? filters.planType : "all"
                        }
                        onChange={(e) => {
                            const value = e.target.value as VerifiedFilterValue;
                            onChange({
                                planType: value === "all" ? undefined : value as PlanType,
                                page: 1,
                            });
                        }}
                        className="h-8 w-full rounded-lg border border-input bg-background px-2.5 py-1 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:scheme-dark"
                    >
                        <option value="all">All</option>
                        <option value={PlanType.FREE}>Free</option>
                        <option value={PlanType.PRO}>Pro</option>
                        <option value={PlanType.ENTERPRISE}>Enterprise</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground dark:text-white/50">Page</label>
                    <Input
                        type="number"
                        min={1}
                        value={filters.page ?? 1}
                        onChange={(e) => {
                            const value = Math.max(1, Number(e.target.value) || 1);
                            onChange({ page: value });
                        }}
                    />
                </div>


            </div>

            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={onReset}>
                    <RotateCcw className="size-4" />
                    Reset
                </Button>
                <Button type="button" size="sm" onClick={onApply}>
                    Apply Filters
                </Button>
            </div>
        </section>
    );
};

export default OrganizationsFilters;
