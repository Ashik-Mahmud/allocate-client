"use client"
import { useCurrentUser } from '@/features/auth';
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Calendar, ArrowRight, Info, BellRing, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTimeInTimeZone } from '@/lib/utils/timezone-date';

const NextBookingFloatingWidget = () => {
    const { user } = useCurrentUser();
    const [isExpanded, setIsExpanded] = useState(false);
    const [timeLeft, setTimeLeft] = useState<{ mins: number; secs: number } | null>(null);
    const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

    // Ref to define the boundaries where the widget can be dragged (the whole screen)
    const constraintsRef = useRef(null);

    const nextBooking = (user as any)?.nextBooking;

    // Simple toggle between Left and Right
    const [side, setSide] = useState<'left' | 'right'>('right');

    /**
     * EFFECT: Notification Permission Logic
     */
    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            const timer = setTimeout(() => setShowPermissionPrompt(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleRequestPermission = async () => {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            new Notification("Notifications Enabled!", {
                body: "We'll remind you 5 minutes before your session.",
                icon: "/file.svg"
            });
        }
        setShowPermissionPrompt(false);
    };

    /**
     * EFFECT: Countdown Timer Logic
     */
    useEffect(() => {
        if (!nextBooking?.start_time) return;

        const timer = setInterval(() => {
            const target = new Date(nextBooking.start_time).getTime();
            const now = new Date().getTime();
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft({ mins: 0, secs: 0 });
                clearInterval(timer);
            } else {
                setTimeLeft({
                    mins: Math.floor((diff / (1000 * 60))),
                    secs: Math.floor((diff % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [nextBooking?.start_time]);

    /**
     * EFFECT: Trigger browser notification
     */
    useEffect(() => {
        if (timeLeft?.mins === 5 && timeLeft?.secs === 0) {
            if (Notification.permission === "granted") {
                new Notification("Upcoming Booking!", {
                    body: `Your booking in ${nextBooking.resource.name} starts in 5 minutes.`,
                    icon: "/file.svg"
                });
                setIsExpanded(true); // Optionally expand the widget when the notification is shown
            }
        }
        else if (timeLeft?.mins === 0 && timeLeft?.secs === 0) {
            if (Notification.permission === "granted") {
                new Notification("Booking Started!", {
                    body: `Your booking in ${nextBooking.resource.name} has started.`,
                    icon: "/file.svg"
                });
                setIsExpanded(true); // Optionally expand the widget when the notification is shown
            }
        }
    }, [timeLeft, nextBooking?.resource?.name]);

    if (!nextBooking || !timeLeft) return null;

    const isUrgent = timeLeft.mins < 15;

    return (
        // Wrapper div that acts as the drag boundary (entire screen)
        <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-9999">

            {/* --- CUSTOM PERMISSION PROMPT --- */}
            <AnimatePresence>
                {showPermissionPrompt && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={
                            cn(
                                "fixed bottom-24 right-8 w-80 bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-2xl border border-blue-100 dark:border-slate-800 z-10002 pointer-events-auto",
                                side === 'left' ? 'right-auto left-8' : 'right-8'
                            )
                        }
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
                                <BellRing size={24} className="animate-pulse" />
                            </div>
                            <button onClick={() => setShowPermissionPrompt(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={18} />
                            </button>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Enable Alerts?</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                            Stay updated! Get a reminder 5 minutes before your session in {nextBooking.resource.name} begins.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleRequestPermission}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all active:scale-95"
                            >
                                Notify Me
                            </button>
                            <button
                                onClick={() => setShowPermissionPrompt(false)}
                                className="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-bold"
                            >
                                Later
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- Minimal Floating Badge (NOW DRAGGABLE) --- */}
            {!isExpanded && (
                <motion.div
                    layoutId="widget-bg"
                    drag
                    dragConstraints={constraintsRef}
                    dragElastic={0.1}
                    dragMomentum={false} // Setting this to false makes it stop exactly where you drop it
                    onClick={() => setIsExpanded(true)}
                    // Removing 'fixed bottom-8 right-8' and replacing with initial styles
                    style={{ position: 'fixed', bottom: 32, right: side === 'left' ? 'unset' : 32, left: side === 'left' ? 32 : 'unset', touchAction: 'none' }}
                    className={cn(
                        "z-9999 pointer-events-auto cursor-grab active:cursor-grabbing flex items-center gap-3 p-2 pr-4 rounded-full border shadow-lg backdrop-blur-xl opacity-80 hover:opacity-100",
                        // Removed 'transition-all' and 'opacity-60!' to prevent dragging jitter
                        isUrgent ? "bg-red-500 border-red-400 text-white" : "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white",

                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95, cursor: 'grabbing' }}
                >
                    <div className={cn("w-8 h-8 relative rounded-full flex items-center justify-center bg-current/10")}>
                        <span className={
                            cn("absolute inline-flex size-4 animate-ping duration-5000 rounded-full opacity-75",
                                isUrgent ? "bg-white/50 dark:bg-slate-400/50" : "bg-blue-500/50"
                            )
                        }></span>
                        <div className={cn("size-3 rounded-full", isUrgent ? "bg-white animate-pulse" : "bg-blue-500")} />
                    </div>

                    <span className="font-mono font-bold text-sm tracking-tight select-none">
                        {String(timeLeft.mins).padStart(2, '0')}:{String(timeLeft.secs).padStart(2, '0')}
                    </span>
                </motion.div>
            )}

            {/* --- Expanded View Card --- */}
            <AnimatePresence>
                {isExpanded && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsExpanded(false)}
                            className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-10000 pointer-events-auto"
                        />

                        <motion.div
                            layoutId="widget-bg"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className={
                                cn(
                                    "fixed bottom-8 right-8 w-95 bg-white dark:bg-slate-950 rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] z-10001 border border-slate-100 dark:border-slate-800 p-8 pointer-events-auto",
                                    side === 'left' ? 'right-auto left-8' : 'right-8'
                                )
                            }
                        >
                            <button onClick={() => setIsExpanded(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                                <X size={20} />
                            </button>

                            <div className="space-y-1 mb-8">
                                <div className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                    Upcoming Session
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{nextBooking.resource.name}</h2>
                            </div>

                            <div className="mb-10">
                                <h1 className="text-8xl font-black tracking-tighter text-slate-900 dark:text-white font-mono">
                                    {String(timeLeft.mins).padStart(2, '0')}<span className="text-slate-200 dark:text-slate-800">:</span>{String(timeLeft.secs).padStart(2, '0')}
                                </h1>
                                <p className="text-slate-400 font-medium ml-1">Remaining minutes to start</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                        <Calendar size={18} className="text-slate-300" />
                                        <span className="text-sm font-semibold">
                                            Starts at {
                                                // formatting with timezone
                                                formatTimeInTimeZone(nextBooking.start_time, user?.organization?.timezone)
                                            }
                                        </span>
                                    </div>
                                    <div className="relative group">
                                        <select
                                            value={side}
                                            onChange={(e) => setSide(e.target.value as 'left' | 'right')}
                                            className="appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-md px-2 py-0.5 text-[9px] font-bold text-slate-400 uppercase outline-none cursor-pointer pr-5"
                                        >
                                            <option value="right">Dock Right</option>
                                            <option value="left">Dock Left</option>
                                        </select>
                                        <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-2 pt-4 border-t border-slate-50 dark:border-slate-900">
                                    {Object.entries(nextBooking.resource.metadata || {}).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between py-1">
                                            <span className="text-xs text-slate-400 capitalize">{key.replace(/_/g, ' ')}</span>
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setIsExpanded(false)}
                                className="w-full mt-8 py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-full font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                                Get Started
                                <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default NextBookingFloatingWidget;