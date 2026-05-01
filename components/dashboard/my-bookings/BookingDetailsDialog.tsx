"use client"
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Clock, Coins, Info, StickyNote, User, Building2, Save } from 'lucide-react'
import { format } from 'date-fns'

interface Props {
    isOpen: boolean;
    onClose: () => void;
    booking: any;
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
            <DialogContent className="max-w-md rounded-[2.5rem] border-none p-0 overflow-hidden bg-white dark:bg-slate-950">
                <div className="bg-slate-900 p-8 text-white relative">
                    <div className="absolute top-4 right-4 opacity-10">
                        <Info className="w-24 h-24" />
                    </div>
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-1">Booking Reference</p>
                    <DialogTitle className="text-2xl font-black mb-4">#{booking.id.slice(-8).toUpperCase()}</DialogTitle>

                    <div className="flex gap-6 mt-6">
                        <div className="flex flex-col">
                            <span className="text-[9px] uppercase font-bold opacity-50">Usage</span>
                            <span className="text-sm font-bold flex items-center gap-1.5 mt-1">
                                <Coins className="w-3.5 h-3.5 text-amber-400" /> {booking.total_cost} Credits
                            </span>
                        </div>
                        <div className="flex flex-col border-l border-white/10 pl-6">
                            <span className="text-[9px] uppercase font-bold opacity-50">Status</span>
                            <span className="text-sm font-bold text-emerald-400 mt-1">{booking.status}</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    {/* Metadata Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                                <Building2 className="w-3 h-3" /> Dept
                            </label>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                {booking.metadata?.dept || "N/A"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                                <User className="w-3 h-3" /> Purpose
                            </label>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                {booking.metadata?.purpose || "General Use"}
                            </p>
                        </div>
                    </div>

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
                            Close Details
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default BookingDetailsDialog;