"use client"
import { useChangeBookingStatus, useFetchAllBookings } from '@/features/bookings'
import { Calendar, Filter, Search, X, ChevronLeft, ChevronRight, AlertCircle, Loader2, Lock, Sparkles } from 'lucide-react'
import React from 'react'
import BookingRow from './BookingRow'
import { Booking, BookingStatus } from '@/types/booking'
import AllocateDrawer from '@/components/shared/allocate-drawer'
import ViewBookingDetails from './ViewBookingDetails'
import { Popover } from '@/components/ui/popover'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog"
import AllocatePopover from '@/components/shared/allocate-popover'
import { toast } from 'sonner'
import { formatCalendarDateKey } from '@/lib/utils/timezone-date'
import AllocateConfirmationAlert from '@/components/shared/TriggerConfirmation'
import { useRefineNote } from '@/hooks/use-refine-note';

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

    const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] = React.useState(false);
    const [bookingToConfirm, setBookingToConfirm] = React.useState<Booking | null>(null);


    const { data, isLoading, isError } = useFetchAllBookings({
        limit,
        page,
        search: searchTerm,
        status: statusFilter as BookingStatus | undefined,
        ...(dateRangeFilter?.start && dateRangeFilter?.end ? {
            dateRange: `${formatCalendarDateKey(dateRangeFilter.start)} to ${formatCalendarDateKey(dateRangeFilter.end)}`
        } : {}),

    })
    const statusMutation = useChangeBookingStatus()

    const pagination = data?.pagination;
    const bookings = data?.data ?? [];


    const isPaidUser = true; // TODO: Replace with actual check for paid user
    const { refineNote, isLoading: isGeneratingReason } = useRefineNote(isPaidUser);



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

    const handleConfirmBooking = async (booking?: Booking) => {
        const selectedBooking = booking || bookingToConfirm;
        if (selectedBooking) {
            console.log(`Confirming booking ${selectedBooking.id}`);
            // TODO: Call API to confirm booking
            const result = await statusMutation.mutateAsync({
                bookingId: selectedBooking.id,
                payload: {
                    status: BookingStatus.CONFIRMED
                }
            });

            if (result?.success) {
                toast.success(`${selectedBooking.resource?.name} has been confirmed successfully`);
                setIsOpenConfirmationDialog(false);
                setBookingToConfirm(null);
            }
        }
    };


    // handle rescheduling booking - open reschedule drawer with selected booking details



    // handle sending reminder - call API to send reminder for the booking and show toast on success


    // handle generate cancellation reason with AI - call refineNote with booking details and set the generated reason to cancelReason state
    const handleGenerateCancelReason = async (booking: Booking) => {
        const aiReason = await refineNote(`Generate a professional reason for cancelling this booking for the resource ${booking.resource?.name} scheduled on ${booking.start_time}. Keep it concise and relevant to the booking context.`);
        if (aiReason) setCancelReason(aiReason);
    };






    return (
        <div className="flex h-[85dvh] flex-col bg-white dark:bg-slate-950">
            {/* Fixed Header Section */}
            <header className="shrink-0 border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 ">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
                </div>
            </header>

            {/* Scrollable Bookings List */}
            <div className="flex-1 overflow-y-auto">
                <div className="grid gap-4 p-4 md:p-8">
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
                                    setIsOpenConfirmationDialog(true);
                                    setBookingToConfirm(booking);
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
            </div>

            {/* Fixed Pagination */}
            {!isLoading && bookings.length > 0 && pagination && (
                <div className="shrink-0 border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 md:p-8">
                    <div className="flex items-center justify-between">
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
            {/* Cancel Confirmation Dialog */}
            <AlertDialog open={isOpenCancelDialog} onOpenChange={setIsOpenCancelDialog}>
                <AlertDialogContent className="max-w-100 rounded-2xl border-none p-6 shadow-xl">
                    <div className="space-y-4">
                        {/* Header */}
                        <div className="space-y-1">
                            <AlertDialogTitle className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                Cancel Booking
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm text-slate-500">
                                This will release your slot and notify the admin.
                            </AlertDialogDescription>
                        </div>

                        {/* Input Section */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Cancellation Reason
                                </label>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        handleGenerateCancelReason(bookingToCancel as Booking);
                                    }}
                                    disabled={!isPaidUser || isGeneratingReason}
                                    className={`flex items-center gap-1 text-[11px] font-medium transition-all ${!isPaidUser
                                        ? "text-slate-300 cursor-not-allowed"
                                        : "text-orange-400 hover:text-orange-600"
                                        }`}
                                >
                                    {!isPaidUser ? <Lock className="w-2.5 h-2.5" /> : <Sparkles className="w-3 h-3" />}
                                    {isGeneratingReason ? "Generating..." : "Generate with AI"}
                                </button>
                            </div>

                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Why are you cancelling?"
                                className="w-full resize-none rounded-xl border-none bg-slate-50 p-3 text-sm transition-all focus:ring-1 focus:ring-slate-200 dark:bg-slate-900 dark:focus:ring-slate-800"
                                rows={3}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <AlertDialogCancel className="flex-1 rounded-xl border-none bg-slate-100 py-6 text-sm font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400">
                                Keep Booking
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleCancelBooking}
                                disabled={!cancelReason.trim() || statusMutation.isPending}
                                className="flex-1 rounded-xl bg-red-500 py-6 text-sm font-medium text-white shadow-lg shadow-red-500/20 hover:bg-red-600 disabled:opacity-50"
                            >
                                {statusMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Cancel Now"
                                )}
                            </AlertDialogAction>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            <AllocateConfirmationAlert
                open={isOpenConfirmationDialog}
                onOpenChange={setIsOpenConfirmationDialog}
                title="Confirm Action"
                description="Are you sure you want to perform this action?"
                confirmText="Yes, Confirm"
                variant='default'
                onConfirm={() => {
                    if (bookingToConfirm) {
                        handleConfirmBooking(bookingToConfirm);
                    }
                    setIsOpenConfirmationDialog(false);
                }}
            />
        </div>
    )
}

export default BookingManagementMain