import { AlertTriangle } from 'lucide-react'
import React from 'react'

interface LowCreditAlert {
    id: string
    name: string
    email: string
    personalCredits: number
}

interface LowCreditAlertsProps {
    alerts: LowCreditAlert[]
    count: number
    onTopUp?: (userId: string) => void
}

export const LowCreditAlerts = ({ alerts, count, onTopUp }: LowCreditAlertsProps) => {
    return (
        <div className="bg-linear-to-br from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-lg bg-linear-to-br from-rose-200 to-rose-100 dark:from-rose-800/50 dark:to-rose-900/30">
                    <AlertTriangle size={20} className="text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">
                        Credit Alerts
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                        {count} member{count !== 1 ? 's' : ''} need{count !== 1 ? '' : 's'} attention
                    </p>
                </div>
            </div>

            {alerts.length > 0 ? (
                <div className="space-y-2.5">
                    {alerts.map((user, idx) => (
                        <div
                            key={user.id}
                            className="group p-3.5 rounded-lg bg-white/70 dark:bg-slate-900/50 border border-rose-100 dark:border-rose-900/30 hover:border-rose-300 dark:hover:border-rose-800 hover:bg-white dark:hover:bg-slate-800/70 transition-all animate-in fade-in slide-in-from-top-2"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                        <p className="text-xs md:text-sm font-bold text-slate-900 dark:text-white truncate">
                                            {user.name}
                                        </p>
                                    </div>
                                    <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400">{user.personalCredits}</p>
                                    <p className="text-[9px] text-slate-500">credits</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2.5">
                                <div
                                    className="h-full bg-linear-to-r from-rose-400 to-rose-600 transition-all duration-500"
                                    style={{ width: `${Math.min(100, (user.personalCredits / 10) * 100)}%` }}
                                />
                            </div>

                            <button
                                onClick={() => onTopUp?.(user.id)}
                                className="cursor-pointer w-full text-xs font-semibold px-3 py-1.5 rounded-lg bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white transition-all group-hover:shadow-md active:scale-95"
                            >
                                Top Up Credits
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">All set!</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">All team members have sufficient credits</p>
                </div>
            )}
        </div>
    )
}
