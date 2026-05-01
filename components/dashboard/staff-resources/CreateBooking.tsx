"use client"
import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Clock, Calendar, Coins, Zap, Edit2, ChevronRight } from 'lucide-react'
import { Resource } from '@/types/resources'
import { cn, formatTime } from '@/lib/utils'

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
}

const CreateBooking = ({ selectedSlot, resource, onBack, onSubmit, isSubmitting }: Props) => {
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
                    <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800 grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                        <input
                            type="datetime-local"
                            className="bg-transparent text-xs font-medium focus:outline-none"
                            value={startTime.slice(0, 16)}
                            onChange={(e) => setStartTime(new Date(e.target.value).toISOString())}
                        />
                        <input
                            type="datetime-local"
                            className="bg-transparent text-xs font-medium focus:outline-none text-right"
                            value={endTime.slice(0, 16)}
                            onChange={(e) => setEndTime(new Date(e.target.value).toISOString())}
                        />
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
                    <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            {durationHrs}h session @ {creditRate} cr/hr
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting || parseFloat(durationHrs) <= 0}
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