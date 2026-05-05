"use client"
import { useFetchAllBookings } from '@/features/bookings'
import { Calendar, Filter, Search } from 'lucide-react'
import React from 'react'
import BookingRow from './BookingRow'
import { Booking } from '@/types/booking'
import AllocateDrawer from '@/components/shared/allocate-drawer'
import ViewBookingDetails from './ViewBookingDetails'

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


    const { data, isLoading, isError } = useFetchAllBookings({
        limit: 10,
        page: 1,
        search: "",
        status: undefined,
    })

    const pagination = data?.pagination;
    const bookings = data?.data ?? [];






    return (
        <div className="mx-auto space-y-8 p-4 md:p-8">
            {/* Header Section */}
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Bookings</h1>
                    <p className="text-sm text-slate-500">Manage and oversee all organization reservations.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            className="h-10 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 dark:border-slate-800 dark:bg-slate-950"
                        />
                    </div>
                    <button className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium dark:border-slate-800 dark:bg-slate-950">
                        <Filter className="size-4" />
                        Filters
                    </button>
                </div>
            </header>

            {/* Bookings List */}
            <div className="grid gap-4">
                {bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <BookingRow
                            key={booking.id}
                            booking={booking}
                            onViewDetails={() => {
                                setSelectedBooking(booking);
                                setIsOpenViewDetails(true);
                            }}
                            onConfirm={() => { }}
                            onCancel={() => { }}
                            onMarkCompleted={() => { }}
                            onReschedule={() => { }}
                            onViewUserProfile={() => { }}
                            onSendReminder={() => { }}
                        />
                    ))
                ) : (
                    <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-slate-500">No bookings found matching your criteria.</p>
                    </div>
                )}
            </div>

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
        </div>
    )
}

export default BookingManagementMain