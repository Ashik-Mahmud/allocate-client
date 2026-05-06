"use client"
import { Booking, BookingStatus } from '@/types/booking'
import { Calendar, Clock, User, ShieldCheck, CreditCard, Activity, Globe, Calendar1, CalendarCheck } from 'lucide-react'
import BookingStatusBadge from '../my-bookings/BookingStatus'
import { format } from 'date-fns'
import { ConstantData } from '@/lib/constants/constant'

type Props = {
    booking: Booking
}

const ViewBookingDetails = ({ booking }: Props) => {
    const totalDuration = Math.ceil((new Date(booking.end_time).getTime() - new Date(booking.start_time).getTime()) / (1000 * 60))

    // Metadata parsing logic 
    const metadata = booking?.resource?.metadata as Record<string, any> | undefined;

    return (
        <div className="flex flex-col  rounded-3xl bg-white/85 p-0 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60 relative ">

            {/* 1. Header Section - Sticky with proper z-index */}
            <header className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white/90 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            Booking #{booking.id.slice(-6).toUpperCase()}
                        </h2>
                        <BookingStatusBadge status={booking.status as BookingStatus} />
                    </div>
                    <p className="text-sm text-slate-500">
                        Placed on {format(new Date(booking.createdAt), 'PPP')}
                    </p>
                </div>
            </header>

            <div className="grid gap-8 lg:grid-cols-1 p-6 pt-2">

                {/* 2. Reservation Details */}
                <div className="space-y-6">
                    <SectionTitle icon={<Calendar className="size-4" />} title="Reservation Details" />

                    <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/30">
                        <div className="flex gap-4">
                            <div className="h-20 w-20 grid place-items-center bg-slate-200 dark:bg-slate-800 shrink-0 overflow-hidden rounded-2xl border border-white shadow-sm dark:border-slate-700">
                               {
                                booking?.resource?.photo ? (
                                    <img
                                        src={booking?.resource?.photo}
                                        className="h-full w-full object-cover"
                                        alt={booking?.resource?.name}
                                    />
                                ) : (
                                     <Calendar className="m-auto size-6 text-slate-400" />
                                )
                               } 
                            </div>
                            <div className="space-y-1 flex-1 flex justify-between">
                                <div className="flex flex-col gap-1 items-start">
                                    <h4 className="font-bold text-slate-900 dark:text-slate-100">{booking?.resource?.name}</h4>
                                    {/* Minimalist Price Badge */}
                                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                        <Clock className="size-3.5" />
                                        <span>{format(new Date(booking.start_time), 'p')} - {format(new Date(booking.end_time), 'p')}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 capitalize">{booking?.resource?.type?.replace('_', ' ')}</p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Cost</p>
                                    <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">CR{booking?.total_cost || '0.00'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-x-12 gap-y-4 px-1">
                        <DetailItem label="Total Duration" value={`${totalDuration} minutes`} />
                        <div className="md:col-span-2 h-px bg-slate-100 dark:bg-slate-800 my-2" />
                        <DetailItem label="Purpose/Note" value={booking?.notes || "No special instructions."} isLongText />
                        <div className="md:col-span-2 h-px bg-slate-100 dark:bg-slate-800 my-2" />
                        {booking.status === BookingStatus?.CANCELLED && (
                            <DetailItem label="Cancellation Note" value={booking?.cancellation_reason || "N/A"} isLongText />
                        )}
                    </div>
                </div>

                {/* 3. Payment & Metadata (Minimalist Horizontal Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <div className="space-y-4">
                        <SectionTitle icon={<Activity className="size-4" />} title="Session Metadata" />
                        <div className="rounded-[2rem] border border-slate-100 p-5 dark:border-slate-800 space-y-3">
                            <DetailItem label="IP Address" value={metadata?.ip || '192.168.1.1'} />
                            <DetailItem label="Device/OS" value={`${metadata?.os || 'Windows'} - ${metadata?.browser || 'Chrome'}`} />
                            {
                                Object.entries(metadata || {}).map(([key, value]) => (
                                    <DetailItem key={key} label={key.replace(/_/g, ' ')} value={String(value)} />
                                ))
                            }
                        </div>
                    </div>
                    <div className="space-y-4">
                        <SectionTitle icon={<CreditCard className="size-4" />} title="Others Info" />
                        <div className="rounded-[2rem] border border-slate-100 p-5 dark:border-slate-800 space-y-3">
                            <DetailItem label="Hourly Rate" value={booking?.resource?.hourly_rate ? `CR${Number(booking?.resource.hourly_rate)?.toFixed(2)}` : 'N/A'} />
                            <DetailItem label="Confirm Type" value={booking?.resource?.isAutoConfirm ? 'Auto Confirm' : 'Manual Confirm'} />
                        </div>
                    </div>


                </div>

                {/* 4. Entity Cards */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {booking?.user && (
                        <div className="space-y-4 rounded">
                            <SectionTitle icon={<User className="size-4" />} title="Customer" />
                            <EntityCard
                                name={booking?.user?.name || "Anonymous User"}
                                email={booking?.user?.email}
                                role="Staff"
                                avatar={booking?.user?.photo ?? ConstantData?.avatarUrl}
                            />
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default ViewBookingDetails

// --- Helper Components ---

const EntityCard = ({ name, email, role, avatar }: { name: string, email: string, role: string, avatar?: string }) => (
    <div className="flex items-center gap-4 rounded-[2.5rem] border border-slate-100 p-4 dark:border-slate-800 bg-white/50 dark:bg-slate-900/20">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-white shadow-sm dark:border-slate-700 overflow-hidden">
            {avatar ? <img src={avatar} className="h-full w-full object-cover" alt={name} /> : <User className="size-5 text-slate-400" />}
        </div>
        <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{name}</h4>
            <p className="truncate text-xs text-slate-500">{email}</p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
            <span className="text-[9px] font-black uppercase tracking-tighter text-slate-500 dark:text-slate-400">{role}</span>
        </div>
    </div>
);

const DetailItem = ({ label, value, isLongText }: { label: string, value: string, isLongText?: boolean }) => (
    <div className={`flex ${isLongText ? 'flex-col gap-1' : 'items-center justify-between'} py-0.5`}>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
        <span className={`text-sm ${isLongText ? 'text-slate-600 dark:text-slate-400 leading-relaxed' : 'font-semibold text-slate-800 dark:text-slate-200'}`}>
            {value}
        </span>
    </div>
);

const SectionTitle = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <div className="flex items-center gap-2 text-slate-400 px-1">
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900">
            {icon}
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">{title}</h3>
    </div>
);