"use client"
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Clock, Coins, Info, StickyNote, User, Building2, Save, X, FileWarning } from 'lucide-react'
import { format } from 'date-fns'
import { Booking } from '@/types/booking'

interface Props {
    isOpen: boolean;
    onClose: () => void;
    booking: Booking;
    onUpdateNotes: (id: string, notes: string) => void;
}

const BookingDetailsDialog = ({ isOpen, onClose, booking, onUpdateNotes }: Props) => {
    const [notes, setNotes] = useState(booking.notes || "");
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveNotes = async () => {
        setIsSaving(true);
        await onUpdateNotes(booking.id, notes);
        setIsSaving(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md rounded-2xl border-none p-0 overflow-hidden bg-white dark:bg-slate-950">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-1">Booking Reference</p>
                        <DialogTitle className="text-xl font-black">{booking.resource?.name || 'Booking'} • #{booking.id.slice(-8).toUpperCase()}</DialogTitle>
                        <div className="flex items-center gap-4 mt-3">
                            <div className="text-[11px] text-slate-500">{booking.status}</div>
                            <div className="text-[11px] text-slate-500">{booking.total_cost} credits</div>
                        </div>
                    </div>
                    <div>
                        <Button variant="ghost" size="icon" className="text-slate-400" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Metadata Section */}
                    {booking.cancellation_reason && <div className="relative">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                                <FileWarning className="w-3 h-3" /> Cancellation Reason
                            </label>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                {booking.cancellation_reason || "N/A"}
                            </p>
                        </div>

                    </div>}

                    {/* Editable Notes Section */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                            <StickyNote className="w-3 h-3" /> Internal Notes
                        </label>
                        <div className="relative group">
                            <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add notes about this session..."
                                className="min-h-30 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus-visible:ring-1 focus-visible:ring-slate-200 resize-none p-4 pb-12"
                            />
                            <Button
                                size="sm"
                                onClick={handleSaveNotes}
                                disabled={isSaving || notes === booking.notes}
                                className="absolute bottom-2 right-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 h-8 gap-2"
                            >
                                <Save className="w-3 h-3" />
                                {isSaving ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="w-full rounded-2xl text-slate-400 font-bold text-xs uppercase tracking-widest"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default BookingDetailsDialog;