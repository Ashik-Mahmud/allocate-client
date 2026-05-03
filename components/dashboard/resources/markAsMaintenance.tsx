"use client"
import React from 'react'
import Image from 'next/image'
import { AlertTriangle, Info, CalendarX, RefreshCcw, Loader2 } from 'lucide-react'
import { useResourceByIdQuery } from '@/features/resources'

type Props = {
    resourceId?: string;
    onSuccess: () => void;
}

const MarkAsUnderMaintenace = ({ resourceId, onSuccess }: Props) => {
    const { data, isLoading } = useResourceByIdQuery(resourceId);

    if (isLoading) return (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
    );

    if (!data) return null;

    const confirmedBookings = data?.data?.bookings?.filter((b: any) => b.status === "CONFIRMED") || [];
    const pendingBookings = data?.data?.bookings?.filter((b: any) => b.status === "PENDING") || [];

    return (
        <div className="max-w-2xl mx-auto border-0 border-amber-200 bg-white dark:bg-slate-950 rounded-none overflow-hidden shadow-none">
            {/* Warning Header */}
            {
                data?.data?.is_maintenance ? (
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 border-b border-emerald-200 flex items-start gap-3">
                        <Info className="w-5 h-5 text-emerald-600 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">
                                Resource Under Maintenance
                            </h3>
                            <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-1">
                                This resource is currently marked as under maintenance. It is unavailable for new bookings.
                            </p>
                        </div>
                    </div>
                ) : (<div className="bg-amber-50 dark:bg-amber-950/30 p-4 border-b border-amber-200 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide">
                            Maintenance Mode Activation
                        </h3>
                        <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">
                            Activating this will make the resource unavailable for new bookings and cancel existing ones.
                        </p>
                    </div>
                </div>)

            }



            <div className="p-6 space-y-6">
                {/* Resource Summary */}
                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden border border-slate-200">
                        <img
                            src={data?.data?.photo}
                            alt={data?.data?.name}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100">{data?.data?.name}</h4>
                        <p className="text-xs text-slate-500">{data?.data?.type} •  {
                            Object.entries(data?.data?.metadata || {}).map(([key, value]) => (
                                <span key={key} className="text-[10px] text-slate-400">
                                    {`${key}: ${value}`}
                                </span>
                            )).reduce((prev, curr) => [prev, " • ", curr] as any)
                        }</p>
                    </div>
                </div>

                {/* Impact Analysis */}
                <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Info className="w-4 h-4" /> Impact on Current Bookings
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Confirmed - Refund track */}
                        <div className="p-4 border border-rose-100 bg-rose-50/30 dark:bg-rose-950/10 rounded-lg">
                            <div className="flex justify-between items-start">
                                <span className="text-2xl font-bold text-rose-600">{confirmedBookings.length}</span>
                                <RefreshCcw className="w-4 h-4 text-rose-500" />
                            </div>
                            <p className="text-xs font-medium text-rose-800 mt-1">Confirmed Bookings</p>
                            <p className="text-[10px] text-rose-600 mt-2 leading-relaxed">
                                Users will be notified and **refunded automatically**.
                            </p>
                        </div>

                        {/* Pending - Reject track */}
                        <div className="p-4 border border-slate-200 bg-slate-50/50 dark:bg-slate-900 rounded-lg">
                            <div className="flex justify-between items-start">
                                <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">{pendingBookings.length}</span>
                                <CalendarX className="w-4 h-4 text-slate-500" />
                            </div>
                            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-1">Pending Requests</p>
                            <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                                Requests will be **rejected automatically** with a maintenance notice.
                            </p>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default MarkAsUnderMaintenace