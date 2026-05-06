import { ROUTES } from '@/lib/constants/routes';
import { ArrowRight, BarChart3, Bell, BrainCircuit, CreditCard, History, Lightbulb, PieChart, Sparkles, Users2, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

type Props = {
    orgName: string
}

const UpgradeProOverview = ({ orgName }: Props) => {
    const router = useRouter();

    const handleRedirection = () => {
        router.push(ROUTES.dashboardOrgAdmin.billing)
    }
    return (
        <div className="mt-10 overflow-hidden rounded-[2.5rem] border border-indigo-100 bg-indigo-50/30 p-6 dark:border-indigo-900/30 dark:bg-indigo-950/10 sm:p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">

                {/* Left Side: The Pitch (More Compact) */}
                <div className="flex-1 text-center lg:text-left">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                        <Sparkles className="size-3" />
                        Unlock Intelligence
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
                        Upgrade to <span className="text-indigo-600 dark:text-indigo-400">{orgName || "Your Organization"} Pro</span>
                    </h2>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400 mx-auto lg:mx-0">
                        Stop guessing. Use AI-driven analytics to track credits, predict needs, and monitor efficiency in real-time.
                    </p>
                    <button
                        className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 cursor-pointer"
                        onClick={handleRedirection}
                    >
                        Upgrade Now
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                {/* Right Side: Feature Grid (Strictly 6 Features, Compact) */}
                <div className="grid flex-[1.2] grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                        { icon: <BarChart3 />, title: "Resource Analytics", desc: "Optimize room & asset usage.", color: "blue" },
                        { icon: <Wallet />, title: "Financial Overview", desc: "Credit burn-rate & spending.", color: "emerald" },
                        { icon: <Users2 />, title: "Staff Engagement", desc: "Identify top team power users.", color: "purple" },
                        { icon: <PieChart />, title: "Status Breakdown", desc: "Track success vs. cancellations.", color: "amber" },
                        { icon: <Lightbulb />, title: "Admin Advice", desc: "Data-driven management tips.", color: "rose" },
                        { icon: <BrainCircuit />, title: "AI-Powered Summary", desc: "30-sec weekly executive briefs.", color: "indigo", special: true },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className={`group flex items-start gap-3 rounded-2xl border p-3 transition-all hover:shadow-sm ${item.special
                                    ? 'border-indigo-200 bg-indigo-100/50 dark:border-indigo-800 dark:bg-indigo-900/20'
                                    : 'border-white bg-white/50 dark:border-slate-800 dark:bg-slate-900/50'
                                }`}
                        >
                            <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${item.special
                                    ? 'bg-indigo-600 text-white'
                                    : `bg-${item.color}-100 text-${item.color}-600 dark:bg-${item.color}-900/30 dark:text-${item.color}-400`
                                }`}>
                                {/* Clone icon to set size */}
                                {React.cloneElement(item.icon, { className: "size-4" })}
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {item.title}
                                </h4>
                                <p className="mt-0.5 text-[10px] leading-snug text-slate-500 dark:text-slate-400 line-clamp-2">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}



export default UpgradeProOverview