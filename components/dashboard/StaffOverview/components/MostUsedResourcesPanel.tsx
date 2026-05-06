"use client"
import { Landmark, Plus, Zap } from 'lucide-react'
import { Panel, EmptyInline } from './SharedComponents'
import { StaffDashboardData } from '@/types/dashboard'
import BookingStatusBadge from '../../my-bookings/BookingStatus';
import { BookingStatus } from '@/types/booking';
import { useEffect, useState } from 'react';
import RescheduleBooking from '../../booking-management/RescheduleBooking';
import { Resource } from '@/types/resources';
import { useResourceByIdQuery } from '@/features/resources';

type MostUsedResourcesPanelProps = {
    resources: StaffDashboardData['mostUsedResources']
}

export function MostUsedResourcesPanel({ resources }: MostUsedResourcesPanelProps) {

    const [openQuickBookModal, setIsOpenQuickBookModal] = useState(false);
    const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);

    // handle quick book
    const handleQuickBook = (resource: StaffDashboardData['mostUsedResources'][number]) => {
        // Open the quick book modal and pass the selected resource
        setIsOpenQuickBookModal(true);
        setSelectedResourceId(resource.id);
        // You can also set the selected resource in state if needed for the modal
    }

    const resource = useResourceByIdQuery(selectedResourceId!);



    return (
        <Panel title="Most used resources" description="Your top 5 most repeated resources.">
            <div className="space-y-3">
                {resources?.length > 0 ? (
                    resources?.map((resource) => (
                        <div
                            key={resource.id}
                            className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-2.5 transition-all hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-800/50"
                        >
                            {/* 1. Image */}
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                                {resource?.image ? (
                                    <img src={resource?.image} alt={resource?.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                                        <Landmark className="size-5" />
                                    </div>
                                )}
                            </div>

                            {/* 2. Content */}
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
                                    {resource?.name}
                                </p>
                                <div className="flex items-center gap-2">
                                    <p className="truncate text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        {resource?.usageCount} uses
                                    </p>
                                    {resource?.isOccupied && <span className="h-1 w-1 rounded-full bg-orange-500" />}
                                </div>
                            </div>

                            {/* 3. Minimal Action Section */}
                            <div className="flex items-center gap-2">
                                {resource?.isOccupied ? <BookingStatusBadge status={BookingStatus.CHECKED_IN} /> : <button
                                    onClick={() => handleQuickBook(resource)}
                                    disabled={resource?.isOccupied}
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all
                ${resource?.isOccupied
                                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
                                            : 'bg-primary text-white hover:bg-primary active:scale-95 dark:bg-primary cursor-pointer'
                                        }`}
                                >
                                    <Plus className="size-3.5" />
                                    <span>Book</span>
                                </button>}
                            </div>
                        </div>
                    ))
                ) : (
                    <EmptyInline text="No frequently used resources yet." />
                )}
            </div>
            {(
                <RescheduleBooking
                    isOpenBookingDialog={openQuickBookModal}
                    setIsOpenBookingDialog={setIsOpenQuickBookModal}
                    setDialogResource={() => { }}
                    dialogResource={resource?.data?.data as Resource}
                    type="rebook"
                />
            )}
        </Panel>
    )
}
