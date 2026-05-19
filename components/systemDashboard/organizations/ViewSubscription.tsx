import { Organizations } from '@/types/organization';
import React from 'react';
import { Calendar, CreditCard, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils/cn';
import { useFetchOrganizationById } from '@/features/system/hooks';
import PaymentProviderBadge from '@/components/shared/payment-method';


type Props = {
    id: string;
};

const ViewSubscription = ({ id }: Props) => {
    const { data, isLoading, isError } = useFetchOrganizationById(id);
    const org: Organizations | undefined = data?.data;
    const sub = org?.subscription;

    if (!sub) {
        return (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-2xl bg-slate-50/50">
                <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm text-slate-500 font-medium">No active subscription found</p>
            </div>
        );
    }

    const isActive = sub.is_active && new Date(sub?.end_date!) > new Date();

    return (
        <div className="space-y-6">
            {/* Plan Header Card */}
            <div className="relative overflow-hidden p-6 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200 dark:shadow-none">
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Current Plan</p>
                        <h2 className="text-3xl font-black flex items-center gap-2">
                            {sub.plan_name}
                            <Zap className="fill-yellow-400 text-yellow-400 w-5 h-5" />
                        </h2>
                    </div>
                    <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter",
                        isActive ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    )}>
                        {isActive ? '● Active' : '● Expired'}
                    </div>
                </div>

                {/* Visual Background Element */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            </div>

            {/* Subscription Timeline */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <Calendar size={14} />
                        <span className="text-[11px] font-bold uppercase tracking-wider">Start Date</span>
                    </div>
                    <p className="text-sm font-semibold  dark:text-slate-300">{format(new Date(sub?.start_date), 'PPP')}</p>
                </div>
                <div className="p-4 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <Calendar size={14} />
                        <span className="text-[11px] font-bold uppercase tracking-wider">Expiry Date</span>
                    </div>
                    <p className="text-sm font-semibold  dark:text-slate-300">{format(new Date(sub?.end_date!), 'PPP')}</p>
                </div>
            </div>

            {/* Payment & Provider Details */}
            <div className="rounded-xl border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden text-sm">
                <div className="p-4 border-b bg-white dark:border-b-slate-800 dark:bg-slate-900 flex justify-between items-center">
                    <span className="font-medium text-slate-500 text-xs">Payment Provider</span>
                    <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
                        
                        <PaymentProviderBadge provider={sub?.provider!} transactionId={sub?.last_transaction_id!} />
                    </div>
                </div>
                <div className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-xs">Transaction ID</span>
                        <code className="text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400 uppercase">
                            {sub.last_transaction_id || 'N/A'}
                        </code>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-xs">External ID</span>
                        <span className="text-[11px] font-mono text-slate-400 truncate max-w-45">
                            {sub.external_id}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-xs">Payment Status</span>
                        <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs italic">
                            <CheckCircle2 size={12} />
                            {sub.payment_status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Help text */}
            <p className="text-center text-[10px] text-slate-400 italic">
                Subscription data is synced from {sub.provider} servers.
            </p>
        </div>
    );
};

export default ViewSubscription;