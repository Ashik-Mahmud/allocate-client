"use client";

import { useFetchResourceAvailableSlots } from "@/features/bookings";
import { useGetBrowseResourcesListQuery } from "@/features/resources";
import { Resource } from "@/types/resources";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const getTodayDate = () => new Date().toISOString().slice(0, 10);

const formatSlotLabel = (slot: unknown): string | null => {
  if (typeof slot === "string") {
    return slot;
  }

  if (!slot || typeof slot !== "object") {
    return null;
  }

  const record = slot as Record<string, unknown>;
  const directValue = record.slot || record.time || record.label;

  if (typeof directValue === "string") {
    return directValue;
  }

  const start = record.start_time || record.start || record.from;
  const end = record.end_time || record.end || record.to;

  if (typeof start === "string" && typeof end === "string") {
    return `${start} - ${end}`;
  }

  return null;
};

export default function BookingAvailabilityPage() {
  const searchParams = useSearchParams();
  const initialResourceId = searchParams.get("resourceId") ?? "";
  const initialDate = searchParams.get("date") ?? getTodayDate();

  const [resourceId, setResourceId] = useState(initialResourceId);
  const [date, setDate] = useState(initialDate);

  const resourcesQuery = useGetBrowseResourcesListQuery({
    page: 1,
    limit: 100,
    sortBy: "name",
    sortOrder: "asc",
  });

  const slotsQuery = useFetchResourceAvailableSlots({
    resourceId,
    date,
    enabled: Boolean(resourceId && date),
  });

  const activeResource = useMemo(() => {
    return resourcesQuery.data?.data?.find((item: Resource) => item.id === resourceId) ?? null;
  }, [resourceId, resourcesQuery.data?.data]);

  const normalizedSlots = useMemo(() => {
    const payload = slotsQuery.data?.data as unknown;

    if (!payload) {
      return [] as string[];
    }

    const slotSources: unknown[] = Array.isArray(payload)
      ? payload
      : Array.isArray((payload as Record<string, unknown>).availableSlots)
        ? ((payload as Record<string, unknown>).availableSlots as unknown[])
        : Array.isArray((payload as Record<string, unknown>).slots)
          ? ((payload as Record<string, unknown>).slots as unknown[])
          : [];

    return slotSources
      .map((slot) => formatSlotLabel(slot))
      .filter((slot): slot is string => Boolean(slot));
  }, [slotsQuery.data]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Booking Availability</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Pick a resource and date to view available slots.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Resource</span>
            <select
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-sm"
              value={resourceId}
              onChange={(event) => setResourceId(event.target.value)}
            >
              <option value="">Select resource</option>
              {(resourcesQuery.data?.data ?? []).map((resource: Resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Date</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-sm"
            />
          </label>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Available Slots</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {activeResource ? `For ${activeResource.name} on ${date}` : "Select a resource to view slots."}
          </p>

          <div className="mt-3">
            {!resourceId ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">No resource selected.</p>
            ) : slotsQuery.isFetching ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">Loading slots...</p>
            ) : slotsQuery.isError ? (
              <p className="text-sm text-rose-600">Unable to load slots for this selection.</p>
            ) : normalizedSlots.length ? (
              <div className="flex flex-wrap gap-2">
                {normalizedSlots.map((slot) => (
                  <span
                    key={slot}
                    className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                  >
                    {slot}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300">No slots available on this date.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}