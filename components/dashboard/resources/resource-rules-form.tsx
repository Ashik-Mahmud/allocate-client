"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/services/http";
import type { UpdateResourceRulesPayload, Weekday } from "@/types/resources";
import { is } from "zod/v4/locales";
import FeatureGuard from "@/components/shared/FeatureGuard";

const days: Weekday[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type Props = {
  resourceId: string;
  onSubmit: (resourceId: string, payload: UpdateResourceRulesPayload) => Promise<void>;
  isSubmitting: boolean;
  onSuccess?: () => void;
  className?: string;
  defaultValues?: UpdateResourceRulesPayload | null;
};

export function ResourceRulesForm({
  resourceId,
  onSubmit,
  isSubmitting,
  onSuccess,
  className,
  defaultValues,
}: Props) {
  const [maxBookingHours, setMaxBookingHours] = useState("4");
  const [minLeadTime, setMinLeadTime] = useState("1");
  const [bufferTime, setBufferTime] = useState("0.5");
  const [openingHours, setOpeningHours] = useState("9");
  const [closingHours, setClosingHours] = useState("18");
  const [slotDurationMin, setSlotDurationMin] = useState("30");
  const [isWeekendAllowed, setIsWeekendAllowed] = useState(false);
  const [availableDays, setAvailableDays] = useState<Weekday[]>([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function toggleDay(day: Weekday) {
    setAvailableDays((current) =>
      current.includes(day) ? current.filter((item) => item !== day) : [...current, day]
    );
  }

  useEffect(() => {
    if (defaultValues) {
      setMaxBookingHours(defaultValues.max_booking_hours?.toString() ?? "4");
      setMinLeadTime(defaultValues.min_lead_time?.toString() ?? "1");
      setBufferTime(defaultValues.buffer_time?.toString() ?? "0.5");
      setOpeningHours(defaultValues.opening_hours?.toString() ?? "9");
      setClosingHours(defaultValues.closing_hours?.toString() ?? "18");
      setSlotDurationMin(defaultValues.slot_duration_min?.toString() ?? "30");
      setIsWeekendAllowed(defaultValues.is_weekend_allowed ?? false);
      setAvailableDays(defaultValues.availableDays ?? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
    }
  }, [defaultValues]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await onSubmit(resourceId, {
        max_booking_hours: Number(maxBookingHours),
        min_lead_time: Number(minLeadTime),
        buffer_time: Number(bufferTime),
        opening_hours: Number(openingHours),
        closing_hours: Number(closingHours),
        slot_duration_min: Number(slotDurationMin),
        is_weekend_allowed: isWeekendAllowed,
        availableDays,
      });

      setSuccess("Rules updated.");
      onSuccess?.();
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, "Failed to update rules."));
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className ?? "space-y-3"}>
      {/* <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Update booking rules</h2> */}

      <div className="grid gap-3 md:grid-cols-3">
        <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
          <span>Max booking hours</span>
          <input value={maxBookingHours} onChange={(event) => setMaxBookingHours(event.target.value)} type="number" step="0.5" className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950" />
        </label>

        <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
          <span>Min lead time</span>
          <input value={minLeadTime} onChange={(event) => setMinLeadTime(event.target.value)} type="number" step="0.5" className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950" />
        </label>

        <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
          <span>Buffer time</span>
          <input value={bufferTime} onChange={(event) => setBufferTime(event.target.value)} type="number" step="0.5" className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950" />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
          <span>Opening hour</span>
          <input value={openingHours} onChange={(event) => setOpeningHours(event.target.value)} type="number" className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950" />
        </label>

        <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
          <span>Closing hour</span>
          <input value={closingHours} onChange={(event) => setClosingHours(event.target.value)} type="number" className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950" />
        </label>

        <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
          <span>Slot duration (min)</span>
          <input value={slotDurationMin} onChange={(event) => setSlotDurationMin(event.target.value)} type="number" className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950" />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2">
        <input type="checkbox" checked={isWeekendAllowed} onChange={(event) => setIsWeekendAllowed(event.target.checked)} />
        <div className="flex flex-col">
          <span>
            {isWeekendAllowed ? "Weekend booking allowed" : "Weekend booking not allowed"}
          </span>
          <small>
            (Bookings on Saturday and Sunday)
          </small>
        </div>
      </label>

      <div className="space-y-1 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2">
        <p className="text-sm text-slate-700 dark:text-slate-300">Available days</p>
        <div className="flex flex-wrap gap-2 my-2">
          {days.map((day) => {
            const selected = availableDays.includes(day);

            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={selected ? "rounded-full border border-slate-900 bg-slate-900 px-3 py-1 text-xs text-white dark:border-slate-200 dark:bg-slate-200 dark:text-slate-900" : "rounded-full border border-slate-300 bg-transparent px-3 py-1 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-300"}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p> : null}

      <FeatureGuard 
        // put title and description cause this org admin is on free plan
        title="Premium Feature"
        description="Upgrade to Pro to set custom booking rules for your resources, including lead times, buffer times, and weekend availability."
        showChildrenInBlur={true}
        view="table"
      >
        <div className="text-right sticky bottom-0  bg-white dark:bg-slate-950 ">
          <Button type="submit" size={"lg"} disabled={isSubmitting} className="px-5 cursor-pointer">
            {isSubmitting ? "Saving..." : "Save rules"}
          </Button>
        </div>
      </FeatureGuard>
    </form>
  );
}
