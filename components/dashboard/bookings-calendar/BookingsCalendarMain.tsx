"use client"
import { useCreateBooking, useFetchResourceBookingCalendar } from '@/features/bookings'
import { useGetBrowseResourcesListQuery } from '@/features/resources'
import { useCurrentUser } from '@/features/auth'
import { BookingCalendarEntry, CreateBookingPayload } from '@/types/booking'
import React, { useState } from 'react'
import ResourceSelector from './ResourceSelector'
import MonthYearNavigation from './MonthYearNavigation'
import CalendarGrid from './CalendarGrid'
import { CalendarDays, Info } from 'lucide-react'
import { formatCalendarDate, formatCalendarDateKey, formatDateTimeLocalInTimeZone, getCalendarDateKey, getCalendarMonthStart, getTodayCalendarKey } from '@/lib/utils/timezone-date'
import FeatureGuard from '@/components/shared/FeatureGuard'
import DialogPopup from '@/components/shared/dialog-popup'
import ShowAvailableSlots from '../staff-resources/showAvailableSlots'
import CreateBooking from '../staff-resources/CreateBooking'
import { Resource } from '@/types/resources'
import { toast } from 'sonner'
import { ROUTES } from '@/lib/constants/routes'
import { useRouter } from 'next/navigation'

const BookingsCalendarMain = () => {
    const router = useRouter()
    const { user } = useCurrentUser()
    const timeZone = user?.organization?.timezone || 'UTC'
    const initialCalendarMonth = React.useMemo(() => getCalendarMonthStart(timeZone), [timeZone])
    const [month, setMonth] = React.useState(initialCalendarMonth.month)
    const [year, setYear] = React.useState(initialCalendarMonth.year)
    const [resourceId, setResourceId] = React.useState<string | undefined>()
    const [selectedDateDetails, setSelectedDateDetails] = React.useState<{
        date: string
        entry: BookingCalendarEntry
    } | null>(null)

    const [slotsDialogOpen, setSlotsDialogOpen] = useState(false);
    const [dialogResource, setDialogResource] = useState<Resource | null>(null);
    const [dialogDate, setDialogDate] = useState(
        getTodayCalendarKey(timeZone)
    );
    const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);
    const [isOpenBookingDialog, setIsOpenBookingDialog] = useState(false);



    React.useEffect(() => {
        const current = getCalendarMonthStart(timeZone)
        setMonth(current.month)
        setYear(current.year)
    }, [timeZone])

    // Fetch & Mutation 
    const bookingMutation = useCreateBooking();
    const { data: resourcesData, isLoading: resourcesLoading } = useGetBrowseResourcesListQuery({
        limit: 9999, // Fetch all resources for selection
    }, user?.id ? true : false) // Only enable query if user ID is available

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
        enabled: Boolean(resourceId) // Only fetch when resourceId is set
    })

    const calendarEntries = React.useMemo(() => {
        if (calendarData?.data?.calendar) {
            return Array.isArray(calendarData?.data?.calendar) ? calendarData?.data?.calendar : [calendarData?.data?.calendar]
        }
        return []
    }, [calendarData?.data?.calendar])

    const handleMonthChange = (newMonth: number, newYear: number) => {
        setMonth(newMonth)
        setYear(newYear)
    }

    const handleDateClick = (date: string, entry: BookingCalendarEntry) => {
        // setSelectedDateDetails({ date, entry })
        const selected = resources?.find((item: Resource) => item.id === resourceId) ?? null;
        setDialogResource(selected);
        setDialogDate(
            date ??
            getTodayCalendarKey(timeZone));
        setSlotsDialogOpen(true);
    }


    // handle booking submission from the CreateBooking component
    const handleBooking = async (data: CreateBookingPayload) => {
        const result = await bookingMutation.mutateAsync(data);
        if (result?.success) {
            setIsOpenBookingDialog(false);
            toast.success("Booking created successfully! Redirecting to My Bookings...");
            setTimeout(() => {
                router.push(ROUTES.dashboardCommon.myBookings);
            }, 2000);
        }
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
            <FeatureGuard
                // showChildrenInBlur
                description="Booking Calendar is a powerful tool that allows you to view real-time availability of your resources. By selecting a resource, you can see a detailed calendar that highlights available, partially booked, fully booked, and off days. This feature helps you manage your bookings more efficiently and make informed decisions about resource allocation."
            >
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
                                    <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
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
                                                {formatCalendarDate(selectedDateDetails.date, timeZone)}
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
                                        {calendarEntries.filter(e => e.status === 'PARTIALLY_BOOKED' || String(e.status) === 'PARTIALLY_AVAILABLE').length}
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
                        {/* Month/Year Navigation */}
                        <MonthYearNavigation
                            month={month}
                            year={year}
                            timeZone={timeZone}
                            onMonthChange={handleMonthChange}
                        />

                        {/* Calendar Grid */}
                        <CalendarGrid
                            month={month}
                            year={year}
                            timeZone={timeZone}
                            entries={calendarEntries}
                            onDateClick={handleDateClick}
                            isLoading={calendarLoading}
                        />


                    </div>
                </div>
            </FeatureGuard>
            {/* Slots Dialog */}
            <DialogPopup
                open={slotsDialogOpen}
                onOpenChange={(open) => {
                    setSlotsDialogOpen(open);
                    if (!open) {
                        setDialogResource(null);
                    }
                }}
                title={dialogResource ? `Available slots — ${dialogResource.name}` : "Available slots"}
                description={dialogResource ? `Pick a date to view available slots for ${dialogResource.name}.` : "Pick a resource and date to view slots."}
                size="md"
                className='p-0'
            >
                <ShowAvailableSlots
                    onSlotConfirm={
                        (date) => {
                            setSlotsDialogOpen(false);
                            setSelectedSlot(date);
                            setIsOpenBookingDialog(true);
                        }
                    }
                    dialogResource={dialogResource}
                    dialogDate={dialogDate}
                    setDialogDate={setDialogDate}
                    setSlotsDialogOpen={setSlotsDialogOpen}
                    slotsDialogOpen={slotsDialogOpen}
                />
            </DialogPopup>

            {/* Create booking dialog */}
            <DialogPopup
                open={isOpenBookingDialog}
                onOpenChange={setIsOpenBookingDialog}
                title="Confirm Booking"
                description="Review the details and confirm your booking."
                size="md"
                className='p-0'
            >
                {dialogResource && <CreateBooking
                    onSubmit={handleBooking}
                    resource={dialogResource}
                    selectedSlot={selectedSlot!}
                    onBack={() => {
                        setIsOpenBookingDialog(false);
                        setSlotsDialogOpen(true)
                    }}
                    isSubmitting={bookingMutation.isPending}
                    error={bookingMutation?.isError ? bookingMutation?.error?.message ?? "" : undefined}
                />}
            </DialogPopup>
        </div>
    )
}

export default BookingsCalendarMain