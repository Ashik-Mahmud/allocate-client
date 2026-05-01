"use client"
import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Clock, Calendar, Coins, Zap, Edit2, ChevronRight, Info } from 'lucide-react'
import { Resource } from '@/types/resources'
import { cn, formatTime } from '@/lib/utils'
import { format } from 'date-fns'
import { useCurrentUser } from '@/features/auth'

type CreateBookingPayload = {
    resource_id: string;
    start_time: string;
    end_time: string;
    notes: string;
    // metadata: Record<string, string>;
}

type Props = {
    selectedSlot: { start: string; end: string };
    resource: Resource;
    onBack: () => void;
    onSubmit: (data: CreateBookingPayload) => void;
    isSubmitting?: boolean;
    error?: string | null;
}

const CreateBooking = ({ selectedSlot, resource, onBack, onSubmit, isSubmitting, error }: Props) => {

    const { user } = useCurrentUser();
    const [startTime, setStartTime] = useState(selectedSlot.start);
    const [endTime, setEndTime] = useState(selectedSlot.end);
    const [isEditing, setIsEditing] = useState(false);

    // Hourly rate in Credits
    const creditRate = Number(resource?.hourly_rate) || 0;

    const { totalCredits, durationHrs } = useMemo(() => {
        const diff = new Date(endTime).getTime() - new Date(startTime).getTime();
        const hrs = Math.max(0, diff / (1000 * 60 * 60));
        return {
            durationHrs: hrs.toFixed(1),
            totalCredits: Math.ceil(hrs * creditRate)
        };
    }, [startTime, endTime, creditRate]);


    const { hasEnoughCredits } = useMemo(() => {
        if (!user) return {};
        // If user has insufficient credits, we could disable the submit button and show a warning (not implemented here)
        const userCredits = user.personal_credits || 0;
        const hasEnoughCredits = userCredits >= totalCredits;
        return { hasEnoughCredits };
    }, [user, totalCredits]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onSubmit({
            resource_id: resource.id,
            start_time: startTime,
            end_time: endTime,
            notes: formData.get('notes') as string,
            // metadata: {
            //     purpose: formData.get('purpose') as string,
            //     dept: formData.get('dept') as string,
            // }
        });
    };

    return (
        <div className="flex flex-col h-full px-2  mx-auto bg-white dark:bg-slate-950 antialiased animate-in fade-in duration-500">

            {/* Minimal Header */}
            <header className="mb-8 ">
                <div className="flex  justify-between items-end mb-2">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            {resource.name}
                        </h1>
                        <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-1.5 text-emerald-500 font-bold text-xl">
                            <Coins className="w-5 h-5" />
                            {totalCredits}
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">Credits Required</p>
                    </div>
                </div>
            </header>

            {/* Time Adjuster Strip */}
            <section className="group relative bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 mb-8 transition-all hover:border-slate-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">From</p>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{formatTime(startTime)}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">To</p>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{formatTime(endTime)}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                </div>

                {isEditing && (
                    <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800 grid grid-cols-2 gap-8 animate-in slide-in-from-top-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] uppercase font-bold text-slate-400">Start (24h UTC)</span>
                            </div>
                            <input
                                type="datetime-local"
                                // Using UTC ISO string for min prevents timezone "yesterday" bugs
                                min={format(new Date(), 'yyyy-MM-dd\'T\'HH:mm')}
                                className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg text-xs font-mono focus:outline-none appearance-none"
                                value={new Date(startTime).toISOString().slice(0, 16)}
                                onChange={(e) => {
                                    if (!e.target.value) return;
                                    const date = new Date(e.target.value + ":00Z"); // Force treat as UTC
                                    setStartTime(date.toISOString());
                                    if (date.getTime() >= new Date(endTime).getTime()) {
                                        setEndTime(new Date(date.getTime() + 30 * 60000).toISOString());
                                    }
                                }}
                            />
                            <span className="text-[10px] text-emerald-500 font-mono italic">
                                {new Date(startTime).toISOString().slice(11, 16)} UTC
                            </span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] uppercase font-bold text-slate-400">End (24h UTC)</span>
                            </div>
                            <input
                                type="datetime-local"
                                min={new Date(startTime).toISOString().slice(0, 16)}
                                className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg text-xs font-mono focus:outline-none appearance-none"
                                value={new Date(endTime).toISOString().slice(0, 16)}
                                onChange={(e) => {
                                    if (!e.target.value) return;
                                    setEndTime(new Date(e.target.value + ":00Z").toISOString());
                                }}
                            />
                            <span className="text-[10px] text-emerald-500 font-mono italic text-right">
                                {new Date(endTime).toISOString().slice(11, 16)} UTC
                            </span>
                        </div>
                    </div>
                )}
            </section>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                <div className="space-y-6">
                    {/*         <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-semibold text-slate-400 uppercase ml-1">Purpose</label>
                            <Input name="purpose" placeholder="Meeting" className="border-none bg-slate-50 dark:bg-slate-900 rounded-xl h-11 focus-visible:ring-1 focus-visible:ring-slate-200" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-semibold text-slate-400 uppercase ml-1">Dept.</label>
                            <Input name="dept" placeholder="Design" className="border-none bg-slate-50 dark:bg-slate-900 rounded-xl h-11 focus-visible:ring-1 focus-visible:ring-slate-200" required />
                        </div>
                    </div> */}

                    <div className="space-y-2">
                        <label className="text-[11px] font-semibold text-slate-400 uppercase ml-1">Notes</label>
                        <Textarea
                            name="notes"
                            placeholder="Any specific requirements?"
                            className="border-none bg-slate-50 dark:bg-slate-900 rounded-xl min-h-25 focus-visible:ring-1 focus-visible:ring-slate-200 resize-none"
                        />
                    </div>
                </div>

                {/* Footer Action */}
                <div className="mt-auto pt-8">

                    {
                        !hasEnoughCredits && (
                            <div className='flex items-center bg-rose-50 border border-rose-200 text-rose-600 rounded-lg p-3 mb-6'>
                                <p className="text-sm text-rose-600  flex items-center gap-1 justify-center">
                                    <Zap className="w-4 h-4 text-rose-400 fill-rose-400" />
                                    You need {totalCredits} credits but only you have <b>{user?.personal_credits || 0} Cr</b>.
                                </p>

                            </div>
                        )
                    }
                    {
                        error && (
                            <div className='flex items-center bg-rose-50 border border-rose-200 text-rose-600 rounded-lg p-3 mb-6'>
                                <p className="text-sm text-rose-600  flex items-center gap-1 justify-center">
                                    <Info className="w-4 h-4 text-rose-400 fill-rose-400" />
                                    {error}
                                </p>

                            </div>
                        )
                    }

                    <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            {durationHrs}h session @ {creditRate} cr/hr
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting || parseFloat(durationHrs) <= 0 || !hasEnoughCredits}
                        className="cursor-pointer w-full h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 rounded-2xl font-bold transition-all shadow-lg active:scale-[0.99]"
                    >
                        {isSubmitting ? "Processing..." : `Confirm Booking`}
                    </Button>

                    <button
                        type="button"
                        onClick={onBack}
                        className="w-full mt-4 cursor-pointer text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                    >
                        View Other Slots
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateBooking