import React from 'react';
import { CalendarClock, Building2, ChevronRight, AlertCircle } from 'lucide-react';
import { ExpiringSubscription } from './types';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';



type Props = {
    subscriptions: ExpiringSubscription[];
};

const ExpiringSubscriptions: React.FC<Props> = ({ subscriptions = [] }) => {
    const router = useRouter();
    // Helper to calculate days remaining
    const getDaysLeft = (date: string) => {
        const diff = new Date(date).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 3600 * 24));
    };

    if (subscriptions?.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
                    <CalendarClock className="text-slate-400" size={24} />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">No subscriptions expiring soon.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {subscriptions?.map((sub) => {
                const daysLeft = getDaysLeft(sub?.endingAt);
                const isUrgent = daysLeft <= 3;

                return (
                    <div
                        key={sub.subscriptionId}
                        onClick={() => {
                            // Navigate to organization details page
                            router.push(ROUTES.dashboardAdmin.organizations);
                        }}
                        className="group cursor-pointer relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl transition-all hover:shadow-md hover:border-indigo-500/50 dark:hover:border-indigo-400/30"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 overflow-hidden">
                                {/* Icon/Avatar Placeholder */}
                                <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center 
                  ${isUrgent ? 'bg-orange-100 dark:bg-orange-500/10 text-orange-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                    <Building2 size={20} />
                                </div>

                                <div className="overflow-hidden">
                                    <h4 className="text-sm font-bold truncate dark:text-slate-100">
                                        {sub.organizationName}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                                            {sub.plan}
                                        </span>
                                        <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                            ID: <span className="font-mono">{sub?.organizationId.slice(-6)}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                {/* Status Section */}
                                <div className="flex flex-col items-end shrink-0">
                                    <div className={`flex items-center gap-1.5 text-xs font-bold mb-1 
                  ${isUrgent ? 'text-orange-500' : 'text-slate-500'}`}>
                                        {isUrgent && <AlertCircle size={14} className="animate-pulse" />}
                                        {daysLeft <= 0 ? 'Expired' : `${daysLeft}d left`}
                                    </div>
                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
                                        Ends {new Date(sub?.endingAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>

                                {/* Desktop Hover Action */}
                                <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 ml-2 transition-all">
                                    <ChevronRight size={18} className="text-slate-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ExpiringSubscriptions;