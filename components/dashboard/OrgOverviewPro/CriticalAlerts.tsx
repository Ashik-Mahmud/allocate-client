import { AlertTriangle, AlertCircle } from 'lucide-react'
import React, { useState } from 'react'

interface CriticalAlert {
    id: string
    name: string
    email: string
    personalCredits: number
    reason: string
}

interface CriticalAlertsProps {
    alerts: CriticalAlert[]
    onTopUp?: (userId: string) => void
}

export const CriticalAlerts = ({ alerts, onTopUp }: CriticalAlertsProps) => {
    const [expandedId, setExpandedId] = useState<string | null>(null)

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-linear-to-br from-rose-200 to-rose-100 dark:from-rose-800/50 dark:to-rose-900/30">
                    <AlertTriangle size={24} className="text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">
                        Critical Alerts
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {alerts.length} staff member{alerts.length !== 1 ? 's' : ''} require immediate action
                    </p>
                </div>
            </div>

            <div className="space-y-2.5">
                {alerts.map((alert, idx) => (
                    <div
                        key={alert.id}
                        onClick={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
                        className="group p-4 rounded-lg border border-rose-200 dark:border-rose-900/30 bg-linear-to-r from-rose-50/50 to-rose-50/25 dark:from-rose-950/30 dark:to-rose-950/10 hover:border-rose-300 dark:hover:border-rose-800 hover:shadow-md transition-all cursor-pointer animate-in fade-in slide-in-from-top-2"
                        style={{ animationDelay: `${idx * 50}ms` }}
                    >
                        <div className="flex items-start gap-3 mb-3">
                            <div className="mt-1">
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                            {alert.name}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{alert.email}</p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{alert.personalCredits}</p>
                                        <p className="text-[9px] text-slate-500">credits</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                            <div
                                className="h-full bg-linear-to-r from-rose-400 to-rose-600 transition-all duration-500"
                                style={{ width: `${Math.min(100, (alert.personalCredits / 10) * 100)}%` }}
                            />
                        </div>

                        {/* Reason and Action Button */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 flex items-center gap-2">
                                <AlertCircle size={16} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-rose-700 dark:text-rose-300 line-clamp-1">{alert.reason}</p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onTopUp?.(alert.id)
                                }}
                                className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white transition-all group-hover:shadow-md active:scale-95 whitespace-nowrap"
                            >
                                Top Up
                            </button>
                        </div>

                        {/* Expanded Details */}
                        {expandedId === alert.id && (
                            <div className="mt-4 pt-4 border-t border-rose-200 dark:border-rose-900/30 animate-in fade-in duration-200">
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <div className="w-1 h-1 rounded-full bg-rose-600 mt-2 shrink-0" />
                                        <div>
                                            <p className="text-xs font-semibold text-slate-900 dark:text-white">Account Status</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">Out of credits - booking operations at risk</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-1 h-1 rounded-full bg-rose-600 mt-2 shrink-0" />
                                        <div>
                                            <p className="text-xs font-semibold text-slate-900 dark:text-white">Recommended Action</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">Allocate minimum 10-15 credits immediately</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
