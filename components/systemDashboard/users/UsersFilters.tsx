"use client";

import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminUserFilters } from "@/types/systemGlobal";

type UsersFiltersProps = {
  filters: AdminUserFilters;
  onFiltersChange: (filters: Partial<AdminUserFilters>) => void;
  onApply: () => void;
  onReset: () => void;
  activeFilterCount: number;
  isApplying?: boolean;
};

export function UsersFilters({
  filters,
  onFiltersChange,
  onApply,
  onReset,
  activeFilterCount,
  isApplying = false,
}: UsersFiltersProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/40 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground dark:text-white">User Filters</h3>
        </div>
        <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground dark:bg-slate-700/60">
          {activeFilterCount} active
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <div >
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name or email"
              value={filters.search ?? ""}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className="h-10 pl-9"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Name
          </label>
          <Input
            placeholder="e.g. John"
            value={filters.name ?? ""}
            onChange={(e) => onFiltersChange({ name: e.target.value })}
            className="h-10"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Email
          </label>
          <Input
            placeholder="e.g. john@company.com"
            type="email"
            value={filters.email ?? ""}
            onChange={(e) => onFiltersChange({ email: e.target.value })}
            className="h-10"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Role
          </label>
          <Select
            value={filters.role ?? "all"}
            onValueChange={(val) =>
              onFiltersChange({ role: val === "all" ? undefined : (val as "ORG_ADMIN" | "STAFF") })
            }
          >
            <SelectTrigger className="h-10.5! w-full">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="ORG_ADMIN">Organization Admin</SelectItem>
              <SelectItem value="STAFF">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Organization ID
          </label>
          <Input
            placeholder="org_xxx"
            value={filters.organizationId ?? ""}
            onChange={(e) => onFiltersChange({ organizationId: e.target.value })}
            className="h-10"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Rows Per Page
          </label>
          <Select
            value={String(filters.limit ?? 20)}
            onValueChange={(val) => onFiltersChange({ limit: Number(val) })}
          >
            <SelectTrigger className="h-10.5! w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onReset} className="h-10">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button type="button" onClick={onApply} disabled={isApplying} className="h-10">
          {isApplying ? "Applying..." : "Apply Filters"}
        </Button>
      </div>
    </div>
  );
}

