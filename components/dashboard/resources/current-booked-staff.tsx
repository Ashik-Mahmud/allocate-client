import { Booking } from '@/types/booking';
import React from 'react'

type Props = {
    currentBooking: Partial<Booking> | undefined;
}

const CurrentBookedStaff = ({ currentBooking }: Props) => {
    return (
        <div className="p-2 space-y-4">
            {/* Header Section */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="relative size-10 rounded-full overflow-hidden border-2 border-emerald-500/20 shrink-0">
                    {currentBooking?.user?.photo ? (
                        <img
                            src={currentBooking.user.photo}
                            alt={currentBooking.user.name ?? "User"}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                            {currentBooking?.user?.name?.charAt(0) ?? "U"}
                        </div>
                    )}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {currentBooking?.user?.name || "Anonymous User"}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">
                        {currentBooking?.user?.email || "No email provided"}
                    </span>
                </div>
            </div>

            {/* Timing Section */}
            <div className="space-y-3">
                <div className="flex justify-between items-center text-[11px]">
                    <div className="flex flex-col">
                        <span className="text-slate-400 uppercase tracking-tight font-semibold">Started</span>
                        <span className="text-slate-700 dark:text-slate-300 font-mono font-bold">
                            {currentBooking?.start_time
                                ? new Date(currentBooking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : "--:--"
                            }
                        </span>
                    </div>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800 mx-4 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 size-1.5 rounded-full" />
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-slate-400 uppercase tracking-tight font-semibold">Ends At</span>
                        <span className="text-slate-700 dark:text-slate-300 font-mono font-bold">
                            {currentBooking?.end_time
                                ? new Date(currentBooking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : "--:--"
                            }
                        </span>
                    </div>
                </div>

                {/* Info Label */}
                <div className="bg-emerald-50/50 dark:bg-emerald-500/5 rounded-xl p-2.5 border border-emerald-100/50 dark:border-emerald-500/10">
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-tight">
                        This resource is currently occupied. New allocations will be available after the session ends.
                    </p>
                </div>
            </div>

            {/* Footer Detail */}
            {currentBooking?.total_cost && (
                <div className="flex justify-between items-center pt-2 text-[11px]">
                    <span className="text-slate-400">Resource Credit Usage</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                        {currentBooking.total_cost} Credits
                    </span>
                </div>
            )}
        </div>
    )
}

export default CurrentBookedStaff