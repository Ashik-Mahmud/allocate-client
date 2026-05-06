"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useChangeBookingStatus } from '@/features/bookings';
import { useRefineNote } from '@/hooks/use-refine-note';
import useSubscription from '@/hooks/use-subscription';
import { Booking, BookingStatus } from '@/types/booking';
import { Loader2, Lock, Sparkles } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

type Props = {
    isOpenCancelDialog: boolean;
    setIsOpenCancelDialog: (open: boolean) => void;
    bookingToCancel: Booking | null;
    setBookingToCancel: (booking: Booking | null) => void;
    error?: string | null;
}

const CancelBookingAlert = ({ isOpenCancelDialog, setIsOpenCancelDialog, bookingToCancel, setBookingToCancel, error }: Props) => {

    const [cancelReason, setCancelReason] = React.useState("");
    const { isPaid } = useSubscription()
    const { refineNote, isLoading: isGeneratingReason } = useRefineNote(isPaid);

    const statusMutation = useChangeBookingStatus()

    // handle generate cancellation reason with AI - call refineNote with booking details and set the generated reason to cancelReason state
    const handleGenerateCancelReason = async (booking: Booking) => {
        const aiReason = await refineNote(`Generate a professional reason for cancelling this booking for the resource ${booking.resource?.name} scheduled on ${booking.start_time}. Keep it concise and relevant to the booking context. Respond in 1-2 sentences.`);
        if (aiReason) setCancelReason(aiReason);
    };

    const handleCancelBooking = async () => {
        if (bookingToCancel) {
            console.log(`Cancelling booking ${bookingToCancel.id} with reason: ${cancelReason}`);
            // TODO: Call API to cancel booking with reason
            const result = await statusMutation.mutateAsync({
                bookingId: bookingToCancel.id,
                payload: {
                    status: BookingStatus.CANCELLED,
                    ...(cancelReason ? { cancellation_reason: cancelReason } : {})
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
        <AlertDialog open={isOpenCancelDialog} onOpenChange={setIsOpenCancelDialog} >
            <AlertDialogContent className="max-w-150! rounded-2xl border-none p-6 shadow-xl">
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
                    <div className="space-y-2 relative">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Cancellation Reason
                            </label>
                            <button
                                type="button"
                                onClick={async () => {
                                    handleGenerateCancelReason(bookingToCancel as Booking);
                                }}
                                disabled={!isPaid || isGeneratingReason}
                                className={`flex cursor-pointer items-center gap-1 text-[11px] font-medium transition-all ${!isPaid
                                    ? "text-slate-300 cursor-not-allowed"
                                    : "text-orange-400 hover:text-orange-600"
                                    }`}
                            >
                                {!isPaid ? <Lock className="w-2.5 h-2.5" /> : <Sparkles className="w-3 h-3" />}
                                {isGeneratingReason ? "Generating..." : "Generate with AI"}
                            </button>
                        </div>

                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Why are you cancelling?"
                            className="w-full resize-none rounded-xl border-none bg-slate-50 p-3 text-sm transition-all focus:ring-1 focus:ring-slate-200 dark:bg-slate-900 dark:focus:ring-slate-800"
                            rows={4}
                        />
                        {
                            !isPaid && (
                                <div className="absolute -bottom-2 right-3">
                                    <span className="text-[9px] text-slate-400 italic">AI Generated Reason is a Pro feature</span>
                                </div>
                            )}

                    </div>

                    {/* Action Buttons */}
                    {
                        error || statusMutation?.isError && (
                            <div className="rounded-md bg-red-50 p-3">
                                <p className="text-sm text-red-700">{error || statusMutation?.error?.message}</p>
                            </div>
                        )
                    }
                    <div className="flex gap-3 pt-2">
                        <AlertDialogCancel className="flex-1 rounded-xl border-none bg-slate-100 py-6 text-sm font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400">
                            Keep Booking
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancelBooking}
                            disabled={!cancelReason.trim() || statusMutation.isPending}
                            className="flex-1 rounded-xl bg-red-500 py-6 text-sm font-medium text-white shadow-lg shadow-red-500/20 hover:bg-red-600 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
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

    )
}

export default CancelBookingAlert