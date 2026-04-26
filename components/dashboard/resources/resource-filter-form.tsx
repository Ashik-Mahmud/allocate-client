"use client";

import type { ReactNode } from "react";
import type { ResourceType } from "@/types/resources";

type Props = {
  search: string;
  type: "" | ResourceType;
  isAvailable: "" | "true" | "false";
  limit: number;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: "" | ResourceType) => void;
  onAvailabilityChange: (value: "" | "true" | "false") => void;
  onLimitChange: (value: number) => void;
  actions?: ReactNode;
};

const resourceTypes: ResourceType[] = [
  "MEETING_ROOM",
  "WORKSTATION",
  "PARKING",
  "EQUIPMENT",
  "OTHER",
];

export function ResourceFilterForm({
  search,
  type,
  isAvailable,
  limit,
  onSearchChange,
  onTypeChange,
  onAvailabilityChange,
  onLimitChange,
  actions,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Filters</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Search, filter, and create resources from one place.</p>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
          <span>Search</span>
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Meeting room"
            className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
          <span>Type</span>
          <select
            value={type}
            onChange={(event) => onTypeChange(event.target.value as "" | ResourceType)}
            className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="">All</option>
            {resourceTypes.map((resourceType) => (
              <option key={resourceType} value={resourceType}>
                {resourceType}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
          <span>Availability</span>
          <select
            value={isAvailable}
            onChange={(event) => onAvailabilityChange(event.target.value as "" | "true" | "false")}
            className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="">All</option>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </label>

        <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
          <span>Per page</span>
          <select
            value={String(limit)}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </label>
      </div>
    </div>
  );
}
