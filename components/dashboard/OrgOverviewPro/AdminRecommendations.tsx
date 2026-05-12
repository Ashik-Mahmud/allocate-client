import { ROUTES } from '@/lib/constants/routes';
import { Lightbulb, CheckCircle2, Zap, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React from 'react'

interface AdminRecommendationsProps {
    recommendations: string[]
}

const getRecommendationIcon = (index: number) => {
    const icons = [
        <Zap key="zap" size={20} className="text-rose-600 dark:text-rose-400" />,
        <TrendingUp key="trend" size={20} className="text-blue-600 dark:text-blue-400" />,
        <CheckCircle2 key="check" size={20} className="text-green-600 dark:text-green-400" />,
    ]
    return icons[index % icons.length]
}

const getRecommendationColor = (index: number) => {
    const colors = [
        'from-rose-50 to-rose-50/50 dark:from-rose-900/20 dark:to-rose-900/10 border-rose-200 dark:border-rose-900/30',
        'from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-900/30',
        'from-green-50 to-green-50/50 dark:from-green-900/20 dark:to-green-900/10 border-green-200 dark:border-green-900/30',
    ]
    return colors[index % colors.length]
}

export const AdminRecommendations = ({ recommendations }: AdminRecommendationsProps) => {
    const router = useRouter();
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-linear-to-br from-orange-200 to-orange-100 dark:from-orange-800/50 dark:to-orange-900/30">
                    <Lightbulb size={24} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">
                        Admin Recommendations
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Actionable insights for optimization</p>
                </div>
            </div>

            <div className="space-y-3">
                {recommendations?.map((rec, idx) => (
                    <div
                        key={idx}
                        className={`p-4 rounded-lg border bg-linear-to-r ${getRecommendationColor(idx)} hover:shadow-md transition-all animate-in fade-in slide-in-from-left-2`}
                        style={{ animationDelay: `${idx * 50}ms` }}
                    >
                        <div className="flex items-start gap-3">
                            <div className="shrink-0 mt-0.5">
                                {getRecommendationIcon(idx)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                        {idx === 0 ? '🔴 Urgent' : idx === 1 ? '🔵 Efficiency' : '🟢 Growth'}
                                    </p>
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {rec}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 p-4 rounded-lg bg-linear-to-r from-slate-50 to-slate-50/50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/50">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">Quick Actions</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <button 
                    onClick={() => router.push(ROUTES.dashboardOrgAdmin.creditManagement)}
                    className="cursor-pointer px-3 py-2 rounded-lg text-xs font-semibold bg-linear-to-r from-rose-600 to-rose-500 text-white hover:from-rose-700 hover:to-rose-600 transition-all active:scale-95">
                        Allocate Credits
                    </button>
                    <button
                        onClick={() => router.push(ROUTES.dashboardOrgAdmin.bookingManagement)}  
                     className="cursor-pointer px-3 py-2 rounded-lg text-xs font-semibold bg-linear-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all active:scale-95">
                        Review Bookings
                    </button>
                    <button
                        onClick={() => router.push(ROUTES.dashboardOrgAdmin.billing)}
                     className="cursor-pointer px-3 py-2 rounded-lg text-xs font-semibold bg-linear-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 transition-all active:scale-95">
                        Expand Pool
                    </button>
                </div>
            </div>
        </div>
    )
}
