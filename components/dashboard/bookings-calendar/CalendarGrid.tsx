"use client"
import React from 'react'
import { BookingCalendarEntry } from '@/types/booking'
import { cn } from '@/lib/utils'
import CalendarStatusBadge from './CalendarStatusBadge'

interface CalendarGridProps {
    month: number
    year: number
    entries: BookingCalendarEntry[]
    onDateClick?: (date: string, entry: BookingCalendarEntry) => void
    isLoading?: boolean
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const CalendarGrid = ({
    month,
    year,
    entries,
    onDateClick,
    isLoading = false
}: CalendarGridProps) => {
    const [hoveredDate, setHoveredDate] = React.useState<string | null>(null)

    // Get first day of month and number of days
    const firstDay = new Date(year, month - 1, 1).getDay()
    const daysInMonth = new Date(year, month, 0).getDate()

    // Create array of calendar days
    const calendarDays: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i)
    }

    const getEntryForDate = (day: number): BookingCalendarEntry | undefined => {
        const dateStr = new Date(year, month - 1, day).toISOString().split('T')[0]
        return entries.find(e => e.date === dateStr)
    }

    const isToday = (day: number) => {
        const today = new Date()
        return day === today.getDate() &&
            month === today.getMonth() + 1 &&
            year === today.getFullYear()
    }

    return (
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-6">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2">
                {WEEKDAYS.map(day => (
                    <div
                        key={day}
                        className="text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-2"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Days */}
            {isLoading ? (
                <div className="grid grid-cols-7 gap-2">
                    {[...Array(35)].map((_, i) => (
                        <div
                            key={i}
                            className="aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
                        />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, idx) => {
                        const entry = day ? getEntryForDate(day) : undefined
                        const today = day ? isToday(day) : false
                        const dateStr = day ? new Date(year, month - 1, day).toISOString().split('T')[0] : ''

                        return (
                            <div
                                key={idx}
                                className={cn(
                                    'aspect-square rounded-2xl transition-all duration-200 flex flex-col items-center justify-center p-2',
                                    day === null && 'bg-transparent cursor-default',
                                    day !== null && [
                                        'cursor-pointer group relative',
                                        today && 'ring-2 ring-indigo-500 dark:ring-indigo-400',
                                        entry && 'hover:shadow-lg hover:-translate-y-1 hover:scale-105',
                                        entry?.status === 'FULLY_BOOKED' && 'bg-rose-50 dark:bg-rose-500/10 border-2 border-rose-200 dark:border-rose-500/20',
                                        entry?.status === 'PARTIALLY_AVAILABLE' && 'bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-200 dark:border-amber-500/20',
                                        entry?.status === 'AVAILABLE' && 'bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-200 dark:border-emerald-500/20',
                                        entry?.status === 'OFF_DAY' && 'bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700',
                                        !entry && 'bg-slate-50 dark:bg-slate-900/30 border-2 border-slate-100 dark:border-slate-800'
                                    ]
                                )}
                                onMouseEnter={() => day && setHoveredDate(dateStr)}
                                onMouseLeave={() => setHoveredDate(null)}
                                onClick={() => day && entry && onDateClick?.(dateStr, entry)}
                            >
                                {day && (
                                    <>
                                        {/* Date Number */}
                                        <div className={cn(
                                            'text-sm font-bold',
                                            today ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-slate-100'
                                        )}>
                                            {day}
                                        </div>

                                        {/* Status Indicator Dot */}
                                        {entry && (
                                            <div className={cn(
                                                'w-1.5 h-1.5 rounded-full mt-1',
                                                entry.status === 'FULLY_BOOKED' && 'bg-rose-500',
                                                entry.status === 'PARTIALLY_AVAILABLE' && 'bg-amber-500',
                                                entry.status === 'AVAILABLE' && 'bg-emerald-500',
                                                entry.status === 'OFF_DAY' && 'bg-slate-400'
                                            )} />
                                        )}

                                        {/* Tooltip on Hover */}
                                        {entry && hoveredDate === dateStr && (
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 whitespace-nowrap">
                                                <CalendarStatusBadge
                                                    status={entry.status}
                                                    availableSlotsCount={entry.availableSlotsCount}
                                                    isHovering={true}
                                                />
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent"
                                                    style={{
                                                        borderTopColor: entry.status === 'FULLY_BOOKED' ? '#fca5a5' :
                                                            entry.status === 'PARTIALLY_AVAILABLE' ? '#fcd34d' :
                                                                entry.status === 'AVAILABLE' ? '#86efac' :
                                                                    '#d1d5db'
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Legend */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                    Status Legend
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Available</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">Partial</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50 dark:bg-rose-500/10">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-xs text-rose-700 dark:text-rose-400 font-medium">Fully Booked</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                        <div className="w-2 h-2 rounded-full bg-slate-400" />
                        <span className="text-xs text-slate-700 dark:text-slate-400 font-medium">Off Day</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CalendarGrid
