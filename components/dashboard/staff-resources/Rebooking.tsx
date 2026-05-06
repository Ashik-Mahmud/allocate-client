"use client"
import DialogPopup from '@/components/shared/dialog-popup';
import React, { useEffect, useState } from 'react'
import ShowAvailableSlots from '../staff-resources/showAvailableSlots';
import CreateBooking from '../staff-resources/CreateBooking';
import { Resource } from '@/types/resources';
import { useCreateBooking } from '@/features/bookings';
import { Booking, CreateBookingPayload } from '@/types/booking';
import { toast } from 'sonner';
import { ROUTES } from '@/lib/constants/routes';
import { useRouter } from 'next/navigation';
import { getTodayCalendarKey } from '@/lib/utils/timezone-date';
import useTimezone from '@/hooks/use-timezone';

type Props = {
    dialogResource: Resource | null;
    setDialogResource: React.Dispatch<React.SetStateAction<Partial<Resource> | null>>;
    isOpenBookingDialog: boolean;
    setIsOpenBookingDialog: React.Dispatch<React.SetStateAction<boolean>>;
    booking?: Partial<Booking>;

}

const RebookingResource = ({
    dialogResource,
    setDialogResource,
    isOpenBookingDialog,
    setIsOpenBookingDialog,
    booking
}: Props) => {
    const router = useRouter();
    const [slotsDialogOpen, setSlotsDialogOpen] = React.useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);
    const bookingMutation = useCreateBooking();
    const { timeZone } = useTimezone();
    const [dialogDate, setDialogDate] = useState<string>(getTodayCalendarKey(timeZone) || "");

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

    useEffect(() => {
        if (booking) {
            setSelectedSlot({
                start: booking?.start_time ? new Date(booking.start_time).toISOString() : "",
                end: booking?.end_time ? new Date(booking.end_time).toISOString() : ""
            });
        }
    }, [booking]);

    return (
        <div>
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

export default RebookingResource