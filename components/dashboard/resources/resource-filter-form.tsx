"use client";

import type { ReactNode } from "react";
import type { ResourceType } from "@/types/resources";
import { Plus } from "lucide-react";

type Props = {
  search: string;
  type: "" | ResourceType;
  isActive: "" | "true" | "false";
  limit: number;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: "" | ResourceType) => void;
  onActivityChange: (value: "" | "true" | "false") => void;
  onMaintenanceChange: (value: "" | "true" | "false") => void;
  onLimitChange: (value: number) => void;
  onCreate?: () => void;
  isMaintenance: "" | "true" | "false";
};

const resourceTypes: ResourceType[] = [
  "MEETING_ROOM",
  "WORKSTATION",
  "PARKING",
  "EQUIPMENT",
  "COLLABORATION_SPACE", // Booths, pods, lounge areas
  "IT_INFRASTRUCTURE",   // Printers, routers, servers
  "LOCKER",               // Personal storage
  "KITCHEN_FACILITY",     // Coffee machines, catering prep areas
  "VIRTUAL_LICENSE",      // Software seats, Zoom rooms
  "VEHICLE",              // Company cars, delivery vans
  "HEALTH_SAFETY",        // First aid kits, AEDs, fire extinguishers
  "OTHER",
];

export function ResourceFilterForm({
  search,
  type,
  isActive,
  limit,
  onSearchChange,
  onTypeChange,
  onActivityChange,
  onMaintenanceChange,
  onLimitChange,
  onCreate,
  isMaintenance,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Filters</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Search, filter, and create resources from one place.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm text-primary hover:underline cursor-pointer" onClick={() => {
            onSearchChange("");
            onTypeChange("");
            onActivityChange("");
            onMaintenanceChange("");
            onLimitChange(10);
          }}>
            Reset filters
          </button>

          <button className="flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm text-white hover:bg-primary/80 cursor-pointer" onClick={onCreate}>
            <Plus className="size-4" />
            Create new resource
          </button>
        </div>
      </div>




      <div className="mt-4 flex flex-wrap gap-4">
        <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300 flex-1">
          <span>Search</span>
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Meeting room"
            className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300 flex-1">
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

        <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300 flex-1">
          <span>Active status</span>
          <select
            value={isActive}
            onChange={(event) => onActivityChange(event.target.value as "" | "true" | "false")}
            className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </label>

        <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300 flex-1">
          <span>Maintenance status</span>
          <select
            value={isMaintenance}
            onChange={(event) => onMaintenanceChange(event.target.value as "" | "true" | "false")}
            className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </label>

        <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300 flex-1">
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
