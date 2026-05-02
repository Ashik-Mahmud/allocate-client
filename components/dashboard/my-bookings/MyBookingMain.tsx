"use client"
import React from 'react'
import { useFetchMyBookings, useChangeBookingStatus } from '@/features/bookings'
import BookingCard from './BookingCard'
import { Input } from '@/components/ui/input'
import { Search, ChevronLeft, ChevronRight, Loader2, CalendarDays, SlidersHorizontal } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { BookingStatus, Booking } from '@/types/booking'
import { useDebounce } from '@/hooks'
import { Button } from '@/components/ui/button'

const MyBookingMain = () => {
    const [statusFilter, setStatusFilter] = React.useState<string>("");
    const [searchTerm, setSearchTerm] = React.useState<string>("");
    const [limit, setLimit] = React.useState<number>(10);
    const [page, setPage] = React.useState<number>(1);

    const debouncedSearch = useDebounce(searchTerm, 500);
    const changeBookingStatus = useChangeBookingStatus();

    const { data: apiData, isLoading, isFetching } = useFetchMyBookings({
        page,
        limit,
        status: statusFilter ? (statusFilter as BookingStatus) : undefined,
        search: debouncedSearch || undefined,
    });

    const bookings = apiData?.data || [] as Booking[] | any[];
    const pagination = apiData?.pagination;
    const totalPages = pagination?.totalPages ?? 1;
    const currentPage = pagination?.page ?? page;
    const total = pagination?.total ?? 0;

    const handleCancel = async (id: string) => {
        try {
            await changeBookingStatus.mutateAsync({
                bookingId: id,
                payload: { status: BookingStatus.CANCELLED }
            });
        } catch (error) {
            console.error("Failed to cancel booking:", error);
        }
    };

    return (
        <div className="mx-auto px-4 py-8 antialiased space-y-6">
            {/* Header (title moved into combined header with filters) */}

            {/* Title + Filters Popover */}
            <div className="flex items-center gap-4">
                <div className="flex-1" />
            </div>
            <div className="relative">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-widest">
                            <CalendarDays className="w-4 h-4" />
                            Staff Portal
                        </div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                                My Bookings
                            </h1>

                        </div>
                        <p className="text-slate-500 text-sm">Manage your reserved slots and credit consumption.</p>
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 rounded-xl cursor-pointer border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900">
                                <SlidersHorizontal className="w-4 h-4" />
                                <span className="ml-2 text-sm">Filters</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4 -left-12!" >
                            <div className="space-y-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        placeholder="Search by resource name..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setPage(1);
                                        }}
                                        className="pl-10 h-10 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-xl"
                                    />
                                </div>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-sm font-medium dark:text-slate-100"
                                >
                                    <option value="">All statuses</option>
                                    <option value={BookingStatus.PENDING}>Pending</option>
                                    <option value={BookingStatus.CONFIRMED}>Confirmed</option>
                                    <option value={BookingStatus.COMPLETED}>Completed</option>
                                    <option value={BookingStatus.CANCELLED}>Cancelled</option>
                                    <option value={BookingStatus.REJECTED}>Rejected</option>
                                </select>

                                <select
                                    value={limit}
                                    onChange={(e) => {
                                        setLimit(Number(e.target.value));
                                        setPage(1);
                                    }}
                                    className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-sm font-medium dark:text-slate-100"
                                >
                                    <option value={5}>5 per page</option>
                                    <option value={10}>10 per page</option>
                                    <option value={25}>25 per page</option>
                                    <option value={50}>50 per page</option>
                                </select>

                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-slate-600 dark:text-slate-400">{total} total</div>
                                    <Button size="sm" variant="ghost" onClick={() => { setSearchTerm(""); setStatusFilter(""); setLimit(10); setPage(1); }}>
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Bookings Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 rounded-3xl bg-slate-50 dark:bg-slate-900 animate-pulse" />
                    ))}
                </div>
            ) : bookings.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {
                            bookings.map((booking: Booking) => (
                                <BookingCard
                                    key={booking?.id}
                                    booking={booking!}
                                    onCancel={handleCancel}
                                    onUpdateNotes={() => { }}

                                />
                            ))
                        }
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                Page {currentPage} of {totalPages} • Showing {bookings.length} of {total} bookings
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === 1 || isFetching}
                                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage >= totalPages || isFetching}
                                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem]">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full mb-4">
                        <CalendarDays className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No bookings found</h3>
                    <p className="text-sm text-slate-400">Try adjusting your filters or make a new reservation.</p>
                </div>
            )}
        </div>
    )
}

export default MyBookingMain;