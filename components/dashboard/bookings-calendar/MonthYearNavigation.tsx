"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { getCalendarMonthLabel, getCalendarNow } from '@/lib/utils/timezone-date'

interface MonthYearNavigationProps {
    month: number
    year: number
    timeZone?: string
    onMonthChange: (month: number, year: number) => void
}

const MonthYearNavigation = ({
    month,
    year,
    timeZone,
    onMonthChange
}: MonthYearNavigationProps) => {
    const handlePreviousMonth = () => {
        if (month === 1) {
            onMonthChange(12, year - 1)
        } else {
            onMonthChange(month - 1, year)
        }
    }

    const handleNextMonth = () => {
        if (month === 12) {
            onMonthChange(1, year + 1)
        } else {
            onMonthChange(month + 1, year)
        }
    }

    const handleToday = () => {
        const today = getCalendarNow(timeZone)
        onMonthChange(today.month, today.year)
    }

    return (
        <div className="flex items-center justify-between bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousMonth}
                className="rounded-xl h-10 w-10"
            >
                <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <div className="text-center">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {getCalendarMonthLabel(year, month, timeZone)}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {timeZone || 'UTC'}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToday}
                    className="text-xs h-8 rounded-lg"
                >
                    Today
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextMonth}
                    className="rounded-xl h-10 w-10"
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}

export default MonthYearNavigation
