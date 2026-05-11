"use client";

import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Info, ShieldCheck, Globe } from 'lucide-react';
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils/cn';
import {
    formatCalendarDate,
    parseDateTimeLocalInTimeZone,
    formatDateTimeLocalInTimeZone,
    formatTimeInTimeZone
} from '@/lib/utils/timezone-date';
import { Organizations } from '@/types/organization';

type Props = {
    selectedOrg: Organizations;
    onConfirm: (newDate: Date | string | any) => void;
}

const ExtendTrialForm = ({ selectedOrg, onConfirm }: Props) => {
    const [date, setDate] = useState<Date | undefined>(selectedOrg?.trialEndsAt ? new Date(selectedOrg.trialEndsAt) : undefined);

    // Get organization timezone - fallback to UTC if not available
    // This is the source of truth for all date calculations
    const orgTimezone = (selectedOrg as any)?.timezone || "UTC";

    // Current date and time in org timezone
    const currentDateTimeInTZ = useMemo(() => {
        const now = new Date();
        return {
            date: formatCalendarDate(now, orgTimezone),
            time: formatTimeInTimeZone(now, orgTimezone)
        };
    }, [orgTimezone]);

    // Current trial end date formatted in org timezone
    const currentTrialEndInTZ = useMemo(() => {
        if (!selectedOrg?.trialEndsAt) return null;
        const trialDate = new Date(selectedOrg.trialEndsAt);
        return formatCalendarDate(trialDate, orgTimezone);
    }, [selectedOrg?.trialEndsAt, orgTimezone]);

    // Current trial end time in org timezone
    const currentTrialEndTimeInTZ = useMemo(() => {
        if (!selectedOrg?.trialEndsAt) return null;
        const trialDate = new Date(selectedOrg.trialEndsAt);
        return formatTimeInTimeZone(trialDate, orgTimezone);
    }, [selectedOrg?.trialEndsAt, orgTimezone]);

    // Selected date formatted in org timezone
    const selectedDateInTZ = useMemo(() => {
        if (!date) return null;
        return formatCalendarDate(date, orgTimezone);
    }, [date, orgTimezone]);

    // Selected time in org timezone
    const selectedTimeInTZ = useMemo(() => {
        if (!date) return null;
        return formatTimeInTimeZone(date, orgTimezone);
    }, [date, orgTimezone]);

    // Days being added to trial (calculated in org timezone)
    const daysExtended = useMemo(() => {
        if (!date || !selectedOrg?.trialEndsAt) return 0;
        const current = new Date(selectedOrg.trialEndsAt);
        const diffTime = date.getTime() - current.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }, [date, selectedOrg?.trialEndsAt]);

    // Handle date selection - parse it in the organization's timezone
    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (!selectedDate) {
            setDate(undefined);
            return;
        }
        // Parse the selected date as if it's in the org timezone
        // This ensures consistency regardless of user's local timezone
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const parsedDate = parseDateTimeLocalInTimeZone(`${dateStr}T00:00`, orgTimezone);
        setDate(parsedDate);
    };

    // Handle confirm - convert to UTC-based Date for storage
    const handleConfirm = () => {
        if (date) {
            // The date is already in the correct UTC representation
            // because parseDateTimeLocalInTimeZone converts from org timezone to UTC
            onConfirm(date);
        }
    };

    return (
        <div className="space-y-6 pt-4">
            {/* Organization Summary Card */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">{selectedOrg?.name}</h4>
                        <p className="text-[11px] text-muted-foreground italic">
                            Current Plan: {selectedOrg?.plan_type || 'FREE'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {/* Company Timezone Context Card */}
                <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">Company Timezone</p>
                    </div>
                    <p className="text-sm text-blue-900 dark:text-blue-200 font-mono font-bold">
                        {orgTimezone}
                    </p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-2">
                        All dates are calculated and stored using the company timezone, not your local timezone
                    </p>
                </div>

                {/* Current Date/Time in Organization Timezone */}
                <div className="p-3 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-xl">
                    <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-2">
                        Current Date & Time in {orgTimezone}
                    </p>
                    <div className="space-y-1">
                        <div className="text-sm text-purple-900 dark:text-purple-200 font-mono font-bold">
                            {currentDateTimeInTZ.date}
                        </div>
                        <div className="text-lg text-purple-900 dark:text-purple-100 font-mono font-bold">
                            {currentDateTimeInTZ.time}
                        </div>
                    </div>
                </div>

                {/* Current Trial Info */}
                {currentTrialEndInTZ && (
                    <div className="p-3 bg-slate-100 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Current Trial End Date (in {orgTimezone})
                        </p>
                        <div className="text-sm text-slate-900 dark:text-slate-100 font-mono space-y-1">
                            <div>{currentTrialEndInTZ}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{currentTrialEndTimeInTZ}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    New Trial End Date
                </label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal h-12 rounded-xl border-slate-200",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            required={false}
                            animate
                            disabled={(d: Date) => d < new Date()}
                        />
                    </PopoverContent>
                </Popover>
                {selectedDateInTZ && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-col gap-1 mt-2 p-2 bg-slate-50 dark:bg-slate-700/20 rounded">
                        <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            <span className="font-mono">{selectedDateInTZ}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono ml-4">
                            {selectedTimeInTZ} ({orgTimezone})
                        </div>
                    </div>
                )}
            </div>

            {/* Extension Summary */}
            {date && selectedOrg?.trialEndsAt && daysExtended > 0 && (
                <div className="p-3 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl">
                    <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">
                        Extension Summary
                    </p>
                    <p className="text-sm text-green-900 dark:text-green-200">
                        Adding <span className="font-bold">{daysExtended} days</span> to trial period
                    </p>
                    <p className="text-[10px] text-green-600 dark:text-green-400 mt-2">
                        ✓ Calculated in {orgTimezone} timezone
                    </p>
                </div>
            )}

            {/* Info Box */}
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl">
                <Info className="h-4 w-4 text-amber-600 mt-0.5" />
                <p className="text-[11px] text-amber-700 dark:text-amber-200 leading-relaxed">
                    Trial extension uses <span className="font-bold">{orgTimezone}</span> timezone. This resets <span className="font-bold">hasUsedTrial</span> to false and updates <span className="font-bold">trialEndsAt</span> accordingly.
                </p>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 pt-2">
                <Button
                    className="flex-1 rounded-xl h-12 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                    disabled={!date}
                    onClick={handleConfirm}
                >
                    Confirm Extension
                </Button>
            </div>
        </div>
    );
};

export default ExtendTrialForm;