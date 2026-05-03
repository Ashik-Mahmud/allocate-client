"use client"
import { useFetchResourceBookingCalendar } from '@/features/bookings'
import { useGetBrowseResourcesListQuery, useResourcesListQuery } from '@/features/resources'
import { BookingCalendarEntry } from '@/types/booking'
import React from 'react'
import ResourceSelector from './ResourceSelector'
import MonthYearNavigation from './MonthYearNavigation'
import CalendarGrid from './CalendarGrid'
import { CalendarDays, Info } from 'lucide-react'

const BookingsCalendarMain = () => {
    const [month, setMonth] = React.useState(new Date().getMonth() + 1)
    const [year, setYear] = React.useState(new Date().getFullYear())
    const [resourceId, setResourceId] = React.useState<string | undefined>()
    const [selectedDateDetails, setSelectedDateDetails] = React.useState<{
        date: string
        entry: BookingCalendarEntry
    } | null>(null)

    // Fetch resources
    const { data: resourcesData, isLoading: resourcesLoading } = useGetBrowseResourcesListQuery({
        limit: 9999, // Fetch all resources for selection
    })

    const resources = resourcesData?.data || []

    // Auto-select first resource if available
    React.useEffect(() => {
        if (!resourceId && resources.length > 0) {
            setResourceId(resources[0].id)
        }
    }, [resources, resourceId])

    // Fetch calendar data
    const { data: calendarData, isLoading: calendarLoading } = useFetchResourceBookingCalendar({
        resourceId: resourceId as string,
        month: month.toString(),
        year: year.toString(),
    })

    const calendarEntries = React.useMemo(() => {
        if (calendarData?.data) {
            return Array.isArray(calendarData.data) ? calendarData.data : [calendarData.data]
        }
        return []
    }, [calendarData])

    const handleMonthChange = (newMonth: number, newYear: number) => {
        setMonth(newMonth)
        setYear(newYear)
    }

    const handleDateClick = (date: string, entry: BookingCalendarEntry) => {
        setSelectedDateDetails({ date, entry })
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-widest">
                    <CalendarDays className="w-4 h-4" />
                    Booking Calendar
                </div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                    Resource Availability
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    View real-time booking availability for your resources. Select a resource to see detailed booking calendar.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar: Resource Selector */}
                <div className="lg:col-span-1">
                    <div className="sticky top-4 space-y-4">
                        <ResourceSelector
                            resources={resources}
                            selectedResourceId={resourceId}
                            onResourceSelect={setResourceId}
                            isLoading={resourcesLoading}
                        />

                        {/* Info Box */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2">
                            <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        About Calendar
                                    </p>
                                    <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 leading-relaxed">
                                        <li>• <span className="font-medium">Green:</span> Slots available</li>
                                        <li>• <span className="font-medium">Orange:</span> Limited availability</li>
                                        <li>• <span className="font-medium">Red:</span> Fully booked</li>
                                        <li>• <span className="font-medium">Gray:</span> Off day</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Selected Date Details */}
                        {selectedDateDetails && (
                            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 space-y-3">
                                <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                    Selected Date Details
                                </p>
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">Date</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                                            {new Date(selectedDateDetails.date + 'T00:00:00').toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">Available Slots</p>
                                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                            {selectedDateDetails.entry.availableSlotsCount}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">Status</p>
                                        <p className="text-sm font-bold capitalize text-indigo-600 dark:text-indigo-400">
                                            {selectedDateDetails.entry.status}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content: Calendar */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Month/Year Navigation */}
                    <MonthYearNavigation
                        month={month}
                        year={year}
                        onMonthChange={handleMonthChange}
                    />

                    {/* Calendar Grid */}
                    <CalendarGrid
                        month={month}
                        year={year}
                        entries={calendarEntries}
                        onDateClick={handleDateClick}
                        isLoading={calendarLoading}
                    />

                    {/* Additional Stats (Optional) */}
                    {calendarEntries.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                                    Available Days
                                </p>
                                <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                                    {calendarEntries.filter(e => e.status === 'AVAILABLE').length}
                                </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
                                <p className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                                    Partial Days
                                </p>
                                <p className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1">
                                    {calendarEntries.filter(e => e.status === 'PARTIALLY_AVAILABLE').length}
                                </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20">
                                <p className="text-xs text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">
                                    Fully Booked
                                </p>
                                <p className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-1">
                                    {calendarEntries.filter(e => e.status === 'FULLY_BOOKED').length}
                                </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <p className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                                    Off Days
                                </p>
                                <p className="text-2xl font-black text-slate-700 dark:text-slate-400 mt-1">
                                    {calendarEntries.filter(e => e.status === 'OFF_DAY').length}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BookingsCalendarMain