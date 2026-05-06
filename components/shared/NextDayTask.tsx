import React from 'react';
import {
    BarChart3,
    Wallet,
    BellRing,
    ShieldCheck,
    LayoutDashboard,
    Sparkles
} from 'lucide-react';

const NextDayRoadmap = () => {
    const tasks = [
        {
            id: 1,
            title: "Booking Stats",
            desc: "Implement data aggregation for daily, weekly, and monthly trends. Prepare charts for Admin view.",
            icon: <BarChart3 className="size-6" />,
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
            tag: "Analytics",
            tagColor: "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
        },
        {
            id: 2,
            title: "Billing Management",
            desc: "Secure credit revoke/add logic. Implement transaction history logs and automated invoice generation.",
            icon: <Wallet className="size-6" />,
            color: "text-emerald-600",
            bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
            tag: "Finance",
            tagColor: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
        },
        {
            id: 3,
            title: "Socket.io for Notification",
            desc: "Setup real-time push notifications for low credits and instant booking status updates.",
            icon: <BellRing className="size-6" />,
            color: "text-amber-600",
            bgColor: "bg-amber-100 dark:bg-amber-900/30",
            tag: "Real-time",
            tagColor: "text-amber-500 bg-amber-50 dark:bg-amber-900/20"
        },
        {
            id: 4,
            title: "Code Review",
            desc: "Audit logic for credit safety, refactor Prisma queries, and optimize API response times.",
            icon: <ShieldCheck className="size-6" />,
            color: "text-rose-600",
            bgColor: "bg-rose-100 dark:bg-rose-900/30",
            tag: "Quality",
            tagColor: "text-rose-500 bg-rose-50 dark:bg-rose-900/20"
        }
    ];

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-950 rounded-[3rem] mt-10">
            {/* Header */}
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-indigo-600 mb-2 font-bold tracking-widest text-xs uppercase">
                        <Sparkles className="size-4" />
                        Preparation Phase
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Next Day <span className="text-indigo-600">Roadmap</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        Strategic tasks to elevate system performance and user experience.
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm self-start md:self-end">
                    <span className="text-slate-400 text-xs font-bold block uppercase">Deadline</span>
                    <span className="text-slate-900 dark:text-white font-black text-lg font-mono">2026-05-08</span>
                </div>
            </div>

            {/* Grid for Task 1-4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="group relative bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className={`p-4 ${task.bgColor} ${task.color} rounded-2xl transition-transform group-hover:scale-110 duration-300`}>
                                {task.icon}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${task.tagColor} px-3 py-1.5 rounded-xl`}>
                                {task.tag}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                            {task.id}. {task.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            {task.desc}
                        </p>
                    </div>
                ))}
            </div>

            {/* Hero Card for Task 5: System Admin */}
            <div className="mt-8 relative overflow-hidden group bg-indigo-600 p-8 md:p-12 rounded-[3rem] text-white shadow-2xl shadow-indigo-500/30">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <LayoutDashboard size={180} />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                            Critical Milestone
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black leading-tight">
                            5. System Admin Dashboard
                        </h3>
                        <p className="text-indigo-100 text-lg mt-4 font-medium opacity-90">
                            Centralized control hub for Organization management, global health metrics, and infrastructure-wide configuration.
                        </p>
                    </div>

                    <button className="bg-white text-indigo-600 hover:bg-indigo-50 px-10 py-5 rounded-2xl font-black text-sm transition-all hover:shadow-lg active:scale-95 whitespace-nowrap">
                        Launch Development
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NextDayRoadmap;