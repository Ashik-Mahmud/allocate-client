"use client"
import React, { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button';
import { useFetchResourceAvailableSlots } from '@/features/bookings';
import { Resource } from '@/types/resources';
import { Clock, CalendarDays, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have shadcn's utility
import { format } from 'date-fns';

const formatISOToTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
    });
};

type Slot = { start: string; end: string };

type Props = {
    dialogResource: Resource | null;
    dialogDate: string;
    setDialogDate: (date: string) => void;
    setSlotsDialogOpen: (open: boolean) => void;
    slotsDialogOpen: boolean;
    onSlotConfirm: (slot: Slot) => void; // Added callback for the next popup
}
type AvailableSlotApiResponse = {

    day: string; // e.g., "Saturday"

    availableSlots: Array<{ start: string; end: string }>;

    date: string;

};
const ShowAvailableSlots = ({
    dialogResource,
    dialogDate,
    slotsDialogOpen,
    setDialogDate,
    setSlotsDialogOpen,
    onSlotConfirm
}: Props) => {
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

    const dialogSlotsQuery = useFetchResourceAvailableSlots({
        resourceId: dialogResource?.id,
        date: dialogDate,
        enabled: Boolean(slotsDialogOpen && dialogResource?.id),
    });

    const apiData = dialogSlotsQuery.data?.data as AvailableSlotApiResponse | undefined;
    const dayName = apiData?.day;

    const normalizedDialogSlots = useMemo(() => {
        const slots = apiData?.availableSlots;
        if (!Array.isArray(slots)) return [];
        return slots.map(slot => ({
            display: `${formatISOToTime(slot.start)} — ${formatISOToTime(slot.end)}`,
            raw: slot
        }));
    }, [apiData]);

    const handleConfirm = () => {
        if (selectedSlot) {
            onSlotConfirm(selectedSlot);
            // This is where you'd trigger your "Open Next Popup" logic
        }
    };

    return (
        <div className="flex flex-col h-137.5 antialiased bg-white dark:bg-slate-950">
            {/* STICKY HEADER */}
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {dialogResource?.name || 'Resource'}
                    </h3>
                    {dayName && (
                        <span className="px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                            {dayName}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <CalendarDays className="w-4 h-4" />
                    <span>{new Date(dialogDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                </div>

                <input
                    type="date"
                    value={dialogDate}
                    onChange={(e) => {
                        setDialogDate(e.target.value);
                        setSelectedSlot(null); // Reset selection on date change
                    }}
                    min={format(new Date(), 'yyyy-MM-dd')}

                    className="w-full bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-lg text-xs font-medium outline-none border border-transparent focus:border-slate-200 transition-all"
                />
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto py-4 pr-1 custom-scrollbar">
                {dialogSlotsQuery.isFetching ? (
                    <div className="flex flex-col gap-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-14 w-full bg-slate-50 dark:bg-slate-900 animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : normalizedDialogSlots.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                        {normalizedDialogSlots.map((slot, idx) => {
                            const isSelected = selectedSlot?.start === slot.raw.start;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedSlot(slot.raw)}
                                    className={cn(
                                        "group flex items-center justify-between p-4 rounded-2xl border transition-all duration-200",
                                        isSelected
                                            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 shadow-sm"
                                            : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 bg-transparent"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "p-2 rounded-lg transition-colors",
                                            isSelected ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-900 text-slate-400 group-hover:text-slate-600"
                                        )}>
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <span className={cn(
                                            "text-sm font-semibold",
                                            isSelected ? "text-emerald-900 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"
                                        )}>
                                            {slot.display}
                                        </span>
                                    </div>
                                    {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-in zoom-in-50 duration-300" />}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <Clock className="w-8 h-8 mb-2 opacity-20" />
                        <p className="text-sm">Fully booked for this date</p>
                    </div>
                )}
            </div>

            {/* STICKY FOOTER */}
            <div className="sticky -bottom-6 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                <Button
                    disabled={!selectedSlot}
                    onClick={handleConfirm}
                    className={cn(
                        "w-full h-12 rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-slate-200 dark:shadow-none",
                        selectedSlot
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                    )}
                >
                    {selectedSlot
                        ? `Book ${formatISOToTime(selectedSlot.start)}`
                        : 'Select a time slot'}
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => setSlotsDialogOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                >
                    Close
                </Button>
            </div>
        </div>
    )
}

export default ShowAvailableSlots;