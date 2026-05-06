import { Building2, ArrowUpRight } from 'lucide-react'
import React from 'react'

interface OrgHeaderProps {
    organizationName: string
    onManageCredits?: () => void
}

export const OrgHeader = ({ organizationName, onManageCredits }: OrgHeaderProps) => {
    return (
        <div className="mb-6 md:mb-8 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10 rounded-2xl" />
            
            <div className="relative p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-3 md:gap-4 flex-1">
                    <div className="p-3 rounded-xl bg-linear-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-900/20 shrink-0">
                        <Building2 size={24} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-linear-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                                {organizationName}
                            </h1>
                        </div>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Organization Dashboard & Insights
                        </p>
                    </div>
                </div>

                <button
                    onClick={onManageCredits}
                    className="w-full md:w-auto px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base flex items-center justify-center gap-2 bg-linear-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 hover:shadow-lg hover:shadow-slate-900/20 dark:hover:shadow-white/10 transition-all duration-300 group active:scale-95 cursor-pointer"
                >
                    <span>Manage Credits</span>
                    <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
            </div>
        </div>
    )
}
