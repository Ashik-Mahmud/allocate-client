"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface MonthYearNavigationProps {
    month: number
    year: number
    onMonthChange: (month: number, year: number) => void
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

const MonthYearNavigation = ({
    month,
    year,
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
        const today = new Date()
        onMonthChange(today.getMonth() + 1, today.getFullYear())
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
                        {MONTHS[month - 1]} {year}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {format(new Date(year, month - 1, 1), 'EEEE, MMMM yyyy')}
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
