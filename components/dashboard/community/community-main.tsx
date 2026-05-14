import React from 'react'
import {
    Wrench,
    Plus,
    Search,
    Filter,
    History,
    ShieldCheck,
    ArrowRight,
    Hammer,
    Construction
} from 'lucide-react';
import { useTranslations } from 'next-intl';
type Props = {}

const CommunityMain = (props: Props) => {
    const t = useTranslations("dashboard.community");
    return (
        <div>
            <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-4 md:p-8 text-slate-900 dark:text-slate-100">

                {/* Maintenance Banner */}
                <div className=" mx-auto mb-6">
                    <div className="flex items-center justify-between gap-4 p-3 px-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                                <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">{t("title")}</p>
                                <p className="text-xs text-amber-700 dark:text-amber-400">{t("description")}</p>
                            </div>
                        </div>
                        <button className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 hover:underline">
                            {t("cta")}
                        </button>
                    </div>
                </div>

                <main className="mx-auto space-y-6">
                    {/* Header section */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Support Queue</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">
                                Connect with organization admins for hardware, software, or access requests.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                                <History className="w-4 h-4" />
                                Past Requests
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all shadow-blue-500/20">
                                <Plus className="w-4 h-4" />
                                New Ticket
                            </button>
                        </div>
                    </header>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Active Tickets Column */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="font-semibold flex items-center gap-2">
                                    Active Requests
                                    <span className="text-xs bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500">2</span>
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Search className="w-4 h-4 text-slate-400" />
                                    <Filter className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>

                            {/* Ticket Card 1 */}
                            <div className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl hover:border-blue-500/50 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-slate-500">#TK-8829</span>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">Processing</span>
                                        </div>
                                        <h3 className="font-bold text-lg leading-tight">Requesting Adobe CC License Renewal</h3>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                        <ShieldCheck className="w-5 h-5 text-blue-500" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex -space-x-2">
                                        <div className="w-7 h-7 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] text-white">AM</div>
                                        <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px]">JD</div>
                                    </div>
                                    <span className="text-slate-400 flex items-center gap-1">
                                        Updated 14m ago <ArrowRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </div>

                            {/* Feature Placeholder / Maintenance Message */}
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-3 opacity-60">
                                <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full">
                                    <Construction className="w-8 h-8 text-slate-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Feature Coming Soon</h4>
                                    <p className="text-sm text-slate-500 max-w-xs">The "Bulk Request" and "Drafts" system is currently under development.</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Hammer className="w-5 h-5 opacity-80" />
                                    <h3 className="font-bold">System Status</h3>
                                </div>
                                <p className="text-sm text-blue-100 mb-6">
                                    Most services are operational, but "Manager Direct Messaging" is undergoing maintenance.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <span>API Response</span>
                                        <span className="font-mono">99.2%</span>
                                    </div>
                                    <div className="w-full bg-blue-400/30 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-white h-full w-[90%]" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                                <h3 className="font-bold mb-4">Top Support Admins</h3>
                                <div className="space-y-4">
                                    {[
                                        { name: 'Sarah Miller', role: 'System Admin', online: true },
                                        { name: 'Kevin Zhang', role: 'Org Manager', online: false },
                                    ].map((admin, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                                                {admin.online && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{admin.name}</p>
                                                <p className="text-xs text-slate-500">{admin.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    )
}

export default CommunityMain