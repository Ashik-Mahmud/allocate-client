"use client"
import React from 'react'
import { BookingCalendarAvailableStatus } from '@/types/booking'
import { cn } from '@/lib/utils'
import { CheckCircle2, AlertCircle, Clock, Ban } from 'lucide-react'

interface CalendarStatusBadgeProps {
    status: BookingCalendarAvailableStatus
    availableSlotsCount: number
    isHovering?: boolean
}

const STATUS_CONFIG: Record<BookingCalendarAvailableStatus, {
    label: string
    color: string
    bgColor: string
    icon: React.ReactNode
    description: string
}> = {
    FULLY_BOOKED: {
        label: 'Fully Booked',
        color: 'text-rose-600 dark:text-rose-400',
        bgColor: 'bg-rose-100 dark:bg-rose-500/10',
        icon: <Ban className="w-4 h-4" />,
        description: 'No availability'
    },
    PARTIALLY_AVAILABLE: {
        label: 'Partial Availability',
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-100 dark:bg-amber-500/10',
        icon: <Clock className="w-4 h-4" />,
        description: 'Limited slots available'
    },
    AVAILABLE: {
        label: 'Available',
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-100 dark:bg-emerald-500/10',
        icon: <CheckCircle2 className="w-4 h-4" />,
        description: 'All slots available'
    },
    OFF_DAY: {
        label: 'Off Day',
        color: 'text-slate-500 dark:text-slate-400',
        bgColor: 'bg-slate-100 dark:bg-slate-800',
        icon: <AlertCircle className="w-4 h-4" />,
        description: 'Resource unavailable'
    }
}

const CalendarStatusBadge = ({
    status,
    availableSlotsCount,
    isHovering = false
}: CalendarStatusBadgeProps) => {
    const config = STATUS_CONFIG[status]

    return (
        <div className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200',
            config.bgColor,
            config.color,
            isHovering && 'ring-2 ring-offset-1 dark:ring-offset-0'
        )}>
            <span className="text-sm">{config.icon}</span>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-tighter leading-none">
                    {config.label}
                </p>
                {status !== 'OFF_DAY' && (
                    <p className="text-[9px] opacity-75">
                        {availableSlotsCount} slot{availableSlotsCount !== 1 ? 's' : ''}
                    </p>
                )}
            </div>
        </div>
    )
}

export default CalendarStatusBadge
