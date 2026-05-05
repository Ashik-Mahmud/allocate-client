"use client"
import { useChangeBookingStatus, useFetchAllBookings } from '@/features/bookings'
import { Calendar, Filter, Search, X, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import React from 'react'
import BookingRow from './BookingRow'
import { Booking, BookingStatus } from '@/types/booking'
import AllocateDrawer from '@/components/shared/allocate-drawer'
import ViewBookingDetails from './ViewBookingDetails'
import { Popover } from '@/components/ui/popover'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog"
import AllocatePopover from '@/components/shared/allocate-popover'
import { toast } from 'sonner'

type Props = {}

const BookingManagementMain = (props: Props) => {

    const [searchTerm, setSearchTerm] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<string | undefined>(undefined);
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [resourceIdFilter, setResourceIdFilter] = React.useState<string | undefined>(undefined);
    const [userIdFilter, setUserIdFilter] = React.useState<string | undefined>(undefined);
    const [dateRangeFilter, setDateRangeFilter] = React.useState<{ start: Date; end: Date } | undefined>(undefined);
    const [isOpenViewDetails, setIsOpenViewDetails] = React.useState(false);
    const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);
    const [isOpenFilters, setIsOpenFilters] = React.useState(false);
    const [isOpenCancelDialog, setIsOpenCancelDialog] = React.useState(false);
    const [cancelReason, setCancelReason] = React.useState("");
    const [bookingToCancel, setBookingToCancel] = React.useState<Booking | null>(null);


    const { data, isLoading, isError } = useFetchAllBookings({
        limit,
        page,
        search: searchTerm,
        status: statusFilter as BookingStatus | undefined,
    })
    const statusMutation = useChangeBookingStatus()

    const pagination = data?.pagination;
    const bookings = data?.data ?? [];

    const handleResetFilters = () => {
        setSearchTerm("");
        setStatusFilter(undefined);
        setResourceIdFilter(undefined);
        setUserIdFilter(undefined);
        setDateRangeFilter(undefined);
        setPage(1);
    };

    const handleCancelBooking = async () => {
        if (bookingToCancel) {
            console.log(`Cancelling booking ${bookingToCancel.id} with reason: ${cancelReason}`);
            // TODO: Call API to cancel booking with reason
            const result = await statusMutation.mutateAsync({
                bookingId: bookingToCancel.id,
                payload: {
                    status: BookingStatus.CANCELLED,
                    ...(cancelReason ? { cancel_reason: cancelReason } : {})
                }
            });

            if (result?.success) {
                toast.success("Booking cancelled successfully");
                setIsOpenCancelDialog(false);
                setCancelReason("");
                setBookingToCancel(null);
            }
        }

    };






    return (
        <div className="mx-auto space-y-8 p-4 ">
            {/* Header Section */}
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Bookings</h1>
                    <p className="text-sm text-slate-500">Manage and oversee all organization reservations.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex-1 md:flex-initial">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 dark:border-slate-800 dark:bg-slate-950 md:w-48"
                        />
                    </div>
                    <AllocatePopover trigger={<button className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium dark:border-slate-800 dark:bg-slate-950">
                        <Filter className="size-4" />
                        Filters
                    </button>}>
                        <div className="relative w-max">
                            <div className=" right-0 top-2 z-50   dark:border-slate-800 dark:bg-slate-950">
                                <div className="space-y-4">
                                    {/* Status Filter */}
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                            Status
                                        </label>
                                        <select
                                            value={statusFilter || ''}
                                            onChange={(e) => {
                                                setStatusFilter(e.target.value || undefined);
                                                setPage(1);
                                            }}
                                            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
                                        >
                                            <option value="">All Statuses</option>
                                            <option value="PENDING">Pending</option>
                                            <option value="CONFIRMED">Confirmed</option>
                                            <option value="CHECKED_IN">Checked In</option>
                                            <option value="COMPLETED">Completed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </div>

                                    {/* Date Range Filter */}
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                            Date Range
                                        </label>
                                        <div className="mt-2 flex gap-2">
                                            <input
                                                type="date"
                                                value={dateRangeFilter?.start ? new Date(dateRangeFilter.start).toISOString().split('T')[0] : ''}
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        setDateRangeFilter({
                                                            start: new Date(e.target.value),
                                                            end: dateRangeFilter?.end || new Date(),
                                                        });
                                                        setPage(1);
                                                    }
                                                }}
                                                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
                                            />
                                            <input
                                                type="date"
                                                value={dateRangeFilter?.end ? new Date(dateRangeFilter.end).toISOString().split('T')[0] : ''}
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        setDateRangeFilter({
                                                            start: dateRangeFilter?.start || new Date(),
                                                            end: new Date(e.target.value),
                                                        });
                                                        setPage(1);
                                                    }
                                                }}
                                                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
                                            />
                                        </div>
                                    </div>

                                    {/* Active Filters Display */}
                                    {(searchTerm || statusFilter || dateRangeFilter) && (
                                        <div className="flex flex-wrap gap-2">
                                            {searchTerm && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-900">
                                                    Search: {searchTerm}
                                                    <button onClick={() => setSearchTerm("")} className="ml-1">
                                                        <X className="size-3" />
                                                    </button>
                                                </span>
                                            )}
                                            {statusFilter && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-900">
                                                    Status: {statusFilter}
                                                    <button onClick={() => setStatusFilter(undefined)} className="ml-1">
                                                        <X className="size-3" />
                                                    </button>
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Reset Button */}
                                    <button
                                        onClick={handleResetFilters}
                                        className="w-full rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </AllocatePopover>
                    <Popover open={isOpenFilters} onOpenChange={setIsOpenFilters}>


                    </Popover>
                </div>
            </header>

            {/* Bookings List */}
            <div className="grid gap-4">
                {isLoading ? (
                    // Loading Skeleton
                    Array.from({ length: 5 }).map((_, idx) => (
                        <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                            <div className="space-y-3">
                                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                                <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                                <div className="flex gap-2">
                                    <div className="h-8 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                                    <div className="h-8 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : isError ? (
                    // Error State
                    <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20">
                        <AlertCircle className="mb-2 size-8 text-red-500" />
                        <p className="text-red-600 dark:text-red-400">Failed to load bookings. Please try again.</p>
                    </div>
                ) : bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <BookingRow
                            key={booking.id}
                            booking={booking}
                            onViewDetails={() => {
                                setSelectedBooking(booking);
                                setIsOpenViewDetails(true);
                            }}
                            onConfirm={() => {
                                console.log(`Confirming booking ${booking.id}`);
                                // TODO: Call API to confirm booking
                            }}
                            onCancel={() => {
                                setBookingToCancel(booking);
                                setIsOpenCancelDialog(true);
                            }}
                            onMarkCompleted={() => {
                                console.log(`Marking booking ${booking.id} as completed`);
                                // TODO: Call API to mark as completed
                            }}
                            onReschedule={() => {
                                console.log(`Rescheduling booking ${booking.id}`);
                                // TODO: Open reschedule dialog
                            }}
                            onViewUserProfile={() => {
                                setSelectedBooking(booking);
                                setIsOpenViewDetails(true);
                                console.log(`Viewing user profile for booking ${booking.id}`);
                                // TODO: Open user profile modal
                            }}
                            onSendReminder={() => {
                                console.log(`Sending reminder for booking ${booking.id}`);
                                // TODO: Call API to send reminder
                            }}
                        />
                    ))
                ) : (
                    // No Data Found
                    <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
                        <Calendar className="mb-3 size-12 text-slate-300 dark:text-slate-700" />
                        <p className="text-base font-medium text-slate-600 dark:text-slate-400">No bookings found</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
                            {searchTerm || statusFilter ? "Try adjusting your filters" : "Create your first booking to get started"}
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!isLoading && bookings.length > 0 && pagination && (
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                        Page <span className="font-semibold text-slate-900 dark:text-slate-50">{page}</span> of{' '}
                        <span className="font-semibold text-slate-900 dark:text-slate-50">{pagination.totalPages}</span> •{' '}
                        <span className="font-semibold text-slate-900 dark:text-slate-50">{pagination.total}</span> total bookings
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800"
                        >
                            <ChevronLeft className="size-4" />
                            Previous
                        </button>

                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, idx) => {
                                const pageNum = Math.max(1, page - 2) + idx;
                                if (pageNum > pagination.totalPages) return null;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`rounded-lg px-3 py-2 text-sm font-medium ${page === pageNum
                                            ? 'bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900'
                                            : 'border border-slate-200 dark:border-slate-800'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                            disabled={page === pagination.totalPages}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800"
                        >
                            Next
                            <ChevronRight className="size-4" />
                        </button>
                    </div>

                    <select
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setPage(1);
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                        <option value={50}>50 per page</option>
                    </select>
                </div>
            )}

            {/* View Details Drawer */}
            <AllocateDrawer
                open={isOpenViewDetails}
                onOpenChange={() => setIsOpenViewDetails(false)}
                title='Booking details'
                description='Here is the booking details'
                position='bottom'
                showHandler={false}
                showHeader={false}
                footer={<div className="flex justify-center gap-2">
                    <button
                        onClick={() => setIsOpenViewDetails(false)}
                        className="rounded-xl border w-full cursor-pointer border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium dark:border-slate-800 dark:bg-slate-950"
                    >
                        Close
                    </button>
                </div>}
            >
                {/* The content of the drawer will be handled by the AllocateDrawer component */}
                {selectedBooking && <ViewBookingDetails booking={selectedBooking} />}
            </AllocateDrawer>

            {/* Cancel Confirmation Dialog */}
            <AlertDialog open={isOpenCancelDialog} onOpenChange={setIsOpenCancelDialog}>
                <AlertDialogContent>
                    <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to cancel this booking? This action cannot be undone.
                    </AlertDialogDescription>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Cancellation Reason (Required)
                        </label>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Please provide a reason for cancellation..."
                            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
                            rows={3}
                        />
                    </div>
                    <div className="mt-6 flex gap-2">
                        <AlertDialogCancel className="flex-1">Keep Booking</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancelBooking}
                            disabled={!cancelReason.trim() || statusMutation.isPending}
                            className="flex-1 bg-red-600 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {statusMutation.isPending ? "Cancelling..." : "Cancel Booking"}
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default BookingManagementMain