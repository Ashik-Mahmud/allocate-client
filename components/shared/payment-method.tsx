import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Copy, Check } from 'lucide-react';
import { PaymentProvider } from '@/types/billings';

type ProviderType = PaymentProvider | string;

interface PaymentProviderBadgeProps {
    provider: ProviderType;
    showIcon?: boolean;
    transactionId?: string; // নতুন প্রপ
}

const PaymentProviderBadge = ({ provider, showIcon = true, transactionId }: PaymentProviderBadgeProps) => {
    const [copied, setCopied] = useState(false);

    const isStripe = provider?.toUpperCase() === PaymentProvider.STRIPE;
    const isSSL = provider?.toUpperCase() === PaymentProvider.SSLCOMMERZ;

    const handleCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // ২ সেকেন্ড পর আবার কপি আইকন ফিরে আসবে
    };

    return (
        <div className="flex flex-col gap-1.5">
            <div className="inline-flex items-center gap-2">
                {isStripe && (
                    <span className="flex items-center px-2 py-0.5 rounded bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20 text-[10px] font-bold tracking-wider">
                        {showIcon && <CreditCard className="size-3 mr-1" />}
                        STRIPE
                    </span>
                )}

                {isSSL && (
                    <span className="flex items-center px-2 py-0.5 rounded bg-[#005BA1]/10 text-[#005BA1] border border-[#005BA1]/20 text-[10px] font-bold tracking-wider">
                        {showIcon && <ShieldCheck className="size-3 mr-1" />}
                        SSLCOMMERZ
                    </span>
                )}

                {!isStripe && !isSSL && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-bold uppercase">
                        {provider || 'UNKNOWN'}
                    </span>
                )}
            </div>

            {/* Transaction ID Section */}
            {transactionId && (
                <div 
                    onClick={() => handleCopy(transactionId)}
                    className="group flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                    <span className="text-[11px] font-mono text-slate-400 group-hover:text-indigo-500 truncate max-w-30">
                        {transactionId}
                    </span>
                    {copied ? (
                        <Check className="size-3 text-emerald-500" />
                    ) : (
                        <Copy className="size-3 text-slate-300 group-hover:text-indigo-400" />
                    )}
                </div>
            )}
        </div>
    );
};

export default PaymentProviderBadge;