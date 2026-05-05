import { Calendar, Check, Eye, X, Clock, MoreHorizontal, Ban, CheckCircle } from "lucide-react"
import BookingStatusBadge from "../my-bookings/BookingStatus"
import { Booking, BookingStatus } from "@/types/booking"
import AllocateDropdown from "@/components/shared/dropdown"

type Props = {
    booking: Booking;
    onViewDetails: (booking: Booking) => void;
    onConfirm: (booking: Booking) => void;
    onCancel: (booking: Booking) => void;
    onMarkCompleted?: (booking: Booking) => void;
    onReschedule?: (booking: Booking) => void;
    onViewUserProfile?: (booking: Booking) => void;
    onSendReminder?: (booking: Booking) => void;

}

const BookingRow = ({ booking, onViewDetails, onConfirm, onCancel, onMarkCompleted, onReschedule, onViewUserProfile, onSendReminder }: Props) => {
    const status = booking.status || BookingStatus.PENDING;

    // Actions
    const canConfirm = status === BookingStatus.PENDING;
    const canCancel = status === BookingStatus.PENDING || status === BookingStatus.CONFIRMED;

    return (
        <div className="group relative flex flex-col gap-4 rounded-[2rem] border border-slate-200/80 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-950/50 md:flex-row md:items-center md:justify-between sm:p-5">

            <div className="flex items-center gap-4">
                {/* Resource Photo */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                    {booking?.resource?.photo ? (
                        <img
                            src={booking.resource.photo}
                            alt={booking.resource.name}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <Calendar className="m-auto size-6 text-slate-400" />
                    )}
                </div>

                {/* Main Info */}
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {booking?.resource?.name || "Resource Name"}
                        </h3>
                        <BookingStatusBadge status={status} />
                    </div>

                    <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-0">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            {booking?.user?.name || "Anonymous User"}
                        </p>
                        <span className="hidden mx-2 text-slate-300 dark:text-slate-700 sm:inline">•</span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="size-3" />
                            <TimeInfo booking={booking} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Group */}
            <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-4 md:border-none md:pt-0">
                <div className="flex items-center gap-1.5">
                    {/* View Details - Always Visible */}
                    <button
                        title="View Full Details"
                        className="flex h-10 items-center gap-2 rounded-xl px-3 text-xs font-bold text-slate-600 transition-all hover:bg-slate-100 active:scale-95 dark:text-slate-400 dark:hover:bg-slate-900"
                        onClick={() => onViewDetails(booking)}
                    >
                        <Eye className="size-4" />
                        <span className="hidden lg:inline">Details</span>
                    </button>

                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5">
                        {/* Confirm Button */}
                        <button
                            disabled={!canConfirm}
                            title={canConfirm ? "Confirm Booking" : "Already Processed"}
                            onClick={() => onConfirm(booking)}
                            className={`flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-bold transition-all active:scale-95 
                                ${canConfirm
                                    ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white dark:bg-emerald-950/30 dark:text-emerald-500"
                                    : "cursor-not-allowed opacity-30 bg-slate-100 text-slate-400 dark:bg-slate-800"
                                }`}
                        >
                            <Check className="size-4" />
                            <span>Confirm</span>
                        </button>

                        {/* Cancel/Reject Button */}
                        <button
                            disabled={!canCancel}
                            onClick={() => onCancel(booking)}
                            title={canCancel ? "Cancel/Reject Booking" : "Cannot Cancel"}
                            className={`flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-bold transition-all active:scale-95 
                                ${canCancel
                                    ? "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white dark:bg-rose-950/30 dark:text-rose-500"
                                    : "cursor-not-allowed opacity-30 bg-slate-100 text-slate-400 dark:bg-slate-800"
                                }`}
                        >
                            <Ban className="size-4" />
                            <span>Cancel</span>
                        </button>
                    </div>

                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

                    {/* More Menu */}
                    <AllocateDropdown dropdownOptions={[
                        {
                            label: "Mark as Completed",
                            onClick: () => { 
                                onMarkCompleted && onMarkCompleted(booking)
                            },
                            icon: CheckCircle
                        },
                        {
                            label: "Reschedule",
                            onClick: () => { 
                                onReschedule && onReschedule(booking)
                            },
                            icon: Calendar
                        },
                        {
                            label: "View User Profile",
                            onClick: () => { 
                                onViewUserProfile && onViewUserProfile(booking)
                            },
                            icon: Eye
                        },
                        {
                            label: "Send Reminder",
                            onClick: () => { 
                                onSendReminder && onSendReminder(booking)
                            },
                            icon: Clock
                        },
                        {
                            label: "Cancel",
                            onClick: () => { 
                                onCancel && onCancel(booking)
                            },
                            icon: Ban,
                            destructive: true
                        },

                    ]}>
                        <button
                            title="More Options"
                            className="flex size-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                        >
                            <MoreHorizontal className="size-5" />
                        </button>
                    </AllocateDropdown>
                </div>
            </div>
        </div>
    )
}

function TimeInfo({ booking }: { booking: Booking }) {
    const start = new Date(booking.start_time)
    const end = new Date(booking.end_time)

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: booking?.organization?.timezone || 'UTC',
    }

    const dateOptions: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        timeZone: booking?.organization?.timezone || 'UTC',
    }

    return (
        <span className="tabular-nums">
            {start.toLocaleDateString('en-US', dateOptions)} • {start.toLocaleTimeString('en-US', timeOptions)} - {end.toLocaleTimeString('en-US', timeOptions)}
        </span>
    )
}

export default BookingRow