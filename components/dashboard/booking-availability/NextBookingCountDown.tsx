"use client"
import { useCurrentUser } from '@/features/auth';
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Calendar, ArrowRight, Info, BellRing } from 'lucide-react';
import { cn } from '@/lib/utils';

const NextBookingFloatingWidget = () => {
    const { user } = useCurrentUser();
    const [isExpanded, setIsExpanded] = useState(false);
    const [timeLeft, setTimeLeft] = useState<{ mins: number; secs: number } | null>(null);
    
    // UI State for custom permission prompt
    const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

    const nextBooking = (user as any)?.nextBooking;

    /**
     * EFFECT: Logic to show the custom notification prompt
     * Only shows if permission hasn't been requested yet ('default')
     */
    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            const timer = setTimeout(() => setShowPermissionPrompt(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    /**
     * HANDLER: Triggers the browser's native permission request
     */
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
     * EFFECT: Countdown Timer
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
     * EFFECT: Trigger browser notification at 5 minutes remaining
     */
    useEffect(() => {
        if (timeLeft?.mins === 5 && timeLeft?.secs === 0) {
            if (Notification.permission === "granted") {
                new Notification("Upcoming Booking!", {
                    body: `Your booking in ${nextBooking.resource.name} starts in 5 minutes.`,
                    icon: "/file.svg"
                });
            }
        }
    }, [timeLeft, nextBooking?.resource?.name]);

    if (!nextBooking || !timeLeft) return null;

    const isUrgent = timeLeft.mins < 15;

    return (
        <>
            <AnimatePresence>
                {showPermissionPrompt && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed bottom-24 right-8 w-80 bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-2xl border border-blue-100 dark:border-slate-800 z-10002"
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

            {/* --- Minimal Floating Badge --- */}
            {!isExpanded && (
                <motion.div
                    layoutId="widget-bg"
                    onClick={() => setIsExpanded(true)}
                    className={cn(
                        "fixed bottom-8 right-8 z-9999 cursor-pointer flex items-center gap-3 p-2 pr-4 rounded-full border shadow-lg backdrop-blur-xl transition-all opacity-60! hover:opacity-100! focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50",
                        isUrgent ? "bg-red-500 border-red-400 text-white" : "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    )}
                    whileHover={{
                        y: -4,
                        scale: 1.02,
                        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)"
                    }}
                >
                    <div className={cn("w-8 h-8 relative rounded-full flex items-center justify-center bg-current/10")}>
                        <span className={
                            cn("absolute inline-flex size-4 animate-ping duration-5000 rounded-full  opacity-75",
                                isUrgent ? "bg-white/50 dark:bg-slate-400/50" : "bg-blue-500/50"
                            )
                        }></span>
                        <div className={cn("size-3 rounded-full", isUrgent ? "bg-white animate-pulse" : "bg-blue-500")} />
                    </div>

                    <span className="font-mono font-bold text-sm tracking-tight">
                        {String(timeLeft.mins).padStart(2, '0')}:{String(timeLeft.secs).padStart(2, '0')}
                    </span>
                </motion.div>
            )}

            <AnimatePresence>
                {isExpanded && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsExpanded(false)}
                            className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-10000"
                        />

                        <motion.div
                            layoutId="widget-bg"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed bottom-8 right-8 w-95 bg-white dark:bg-slate-950 rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] z-10001 border border-slate-100 dark:border-slate-800 p-8"
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
                                <p className="text-slate-400 font-medium ml-1">Remaining to start</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                    <Calendar size={18} className="text-slate-300" />
                                    <span className="text-sm font-semibold">Starts at {new Date(nextBooking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>

                                {/* Metadata Mapper maintained exactly as requested */}
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
        </>
    )
}

export default NextBookingFloatingWidget;