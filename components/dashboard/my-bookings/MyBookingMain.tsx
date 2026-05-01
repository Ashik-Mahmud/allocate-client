"use client"
import React from 'react'
import { useFetchMyBookings } from '@/features/bookings'
import BookingCard from './BookingCard'
import { Input } from '@/components/ui/input'
import { Search, Filter, CalendarDays } from 'lucide-react'

const MyBookingMain = () => {
    const { data: apiData, isLoading } = useFetchMyBookings({
        page: 1,
        limit: 10,
    });
    const bookings = apiData?.data || [];

    const handleCancel = (id: string) => {
        // Logic to trigger cancellation API
        console.log("Cancelling booking:", id);
    };

    console.log(bookings, 'bookings')

    return (
        <div className=" mx-auto px-4 py-8 antialiased">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-widest">
                        <CalendarDays className="w-4 h-4" />
                        Staff Portal
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        My Bookings
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Manage your reserved slots and credit consumption.
                    </p>
                </div>

                {/* Quick Filters */}
                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search resources..."
                            className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-slate-200"
                        />
                    </div>
                    <button className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 transition-colors">
                        <Filter className="w-5 h-5 text-slate-600" />
                    </button>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking: any) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            onCancel={handleCancel}
                            onUpdateNotes={() => { }}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem]">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full mb-4">
                        <CalendarDays className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No active bookings</h3>
                    <p className="text-sm text-slate-400">You haven't reserved any resources yet.</p>
                </div>
            )}
        </div>
    )
}

export default MyBookingMain;