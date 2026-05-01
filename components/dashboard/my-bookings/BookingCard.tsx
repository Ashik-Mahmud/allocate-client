"use client"
import React, { useState } from 'react'
import { Clock, Calendar, MoreVertical, XCircle, Coins, Eye, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

import { BookingStatus } from '@/types/booking'
import BookingDetailsDialog from './BookingDetailsDialog'

interface BookingCardProps {
    booking: any;
    onCancel: (id: string) => void;
    onUpdateNotes: (id: string, notes: string) => void;
}

const BookingCard = ({ booking, onCancel, onUpdateNotes }: BookingCardProps) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const startTime = new Date(booking.start_time);
    const endTime = new Date(booking.end_time);

    const statusStyles: Record<string, string> = {
        CONFIRMED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100",
        PENDING: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100",
        CANCELLED: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500 border-slate-200",
        REJECTED: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-100",
        COMPLETED: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100",
    };

    return (
        <>
            <div className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 transition-all hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1">
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border", statusStyles[booking.status] || statusStyles.PENDING)}>
                        {booking.status}
                    </span>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-slate-400" onClick={() => setIsDetailsOpen(true)}>
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </div>

                {/* Resource Info */}
                <div className="mb-4">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight truncate">
                        {booking.resource?.name || "Resource"}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span className="text-[11px] font-medium uppercase tracking-wider">
                            {format(startTime, 'MMM dd, yyyy')}
                        </span>
                    </div>
                </div>

                {/* Time & Credits */}
                <div className="grid grid-cols-2 gap-2 mb-6 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                    <div className="space-y-0.5">
                        <p className="text-[9px] uppercase font-bold text-slate-400">Duration</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                            {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
                        </p>
                    </div>
                    <div className="space-y-0.5 text-right">
                        <p className="text-[9px] uppercase font-bold text-slate-400">Tokens</p>
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                            <Coins className="w-3 h-3" /> {booking.total_cost}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="flex-1 cursor-pointer rounded-xl h-10 text-xs font-bold gap-2 border-slate-100 dark:border-slate-800"
                        onClick={() => setIsDetailsOpen(true)}
                    >
                        <Eye className="w-3.5 h-3.5" />
                        View Details
                    </Button>

                    {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                        <Button
                            variant="ghost"
                            onClick={() => onCancel(booking.id)}
                            className="px-3 cursor-pointer rounded-xl h-10 bg-rose-100/50 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        >
                            <XCircle className="w-4 h-4" />
                            Cancel Booking
                        </Button>
                    )}
                </div>
            </div>

            <BookingDetailsDialog
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                booking={booking}
                onUpdateNotes={onUpdateNotes}
            />
        </>
    )
}

export default BookingCard;