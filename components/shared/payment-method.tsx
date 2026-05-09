import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Copy, Check, ChevronDown, Globe, Hash, Banknote, Calendar } from 'lucide-react';
import { PaymentProvider } from '@/types/billings';
import AllocatePopover from './allocate-popover';
import { span } from 'framer-motion/m';

type ProviderType = PaymentProvider | string;

interface PaymentProviderBadgeProps {
    provider: ProviderType;
    showIcon?: boolean;
    transactionId?: string;
    showMetadata?: boolean;
    metadata?: Record<string, any>;
}

const PaymentProviderBadge = ({ provider, showIcon = true, transactionId, showMetadata, metadata }: PaymentProviderBadgeProps) => {
    const [copied, setCopied] = useState(false);

    const isStripe = provider?.toUpperCase() === PaymentProvider.STRIPE;
    const isSSL = provider?.toUpperCase() === PaymentProvider.SSLCOMMERZ;

    const handleCopy = async (id: string) => {
        if (!id || !navigator?.clipboard) {
            console.warn("Clipboard API not available");
            return;
        }

        try {
            await navigator.clipboard.writeText(id);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy!", err);
        }

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
                    showMetadata ? (
                        <AllocatePopover trigger={<span className="flex items-center px-2 py-0.5 cursor-pointer rounded bg-[#005BA1]/10 text-[#005BA1] border border-[#005BA1]/20 text-[10px] font-bold tracking-wider">
                            {showIcon && <ShieldCheck className="size-3 mr-1" />}
                            SSLCOMMERZ<ChevronDown className="size-3 ml-1" />
                        </span>}
                            className="bg-white dark:bg-white"
                        >
                            <MetadataDetails metadata={metadata || {}} />
                        </AllocatePopover>
                    ) : (
                        <span className="flex items-center px-2 py-0.5 rounded bg-[#005BA1]/10 text-[#005BA1] border border-[#005BA1]/20 text-[10px] font-bold tracking-wider">
                            {showIcon && <ShieldCheck className="size-3 mr-1" />}
                            SSLCOMMERZ
                        </span>
                    )

                )}

                {!isStripe && !isSSL && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-bold uppercase">
                        {provider || 'UNKNOWN'}
                    </span>
                )}
            </div>

            {/* Transaction ID Section */}
            {
                transactionId && (
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
                )
            }
        </div >
    );
};

export default PaymentProviderBadge;

const MetadataDetails = ({ metadata }: { metadata: Record<string, any> }) => {
    return (<div className="  rounded-lg ">
        <div className="flex items-center justify-between mb-3 border-b pb-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-tight">Payment Details</h4>
            <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-medium">Success</span>
        </div>

        <div className="space-y-2.5">
            {/* Plan & Duration */}
            <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-500">
                    <Calendar className="size-3.5 mr-2" />
                    <span className="text-xs font-medium">Plan ({metadata?.planType})</span>
                </div>
                <span className="text-xs font-semibold text-slate-800">{metadata?.months} Months</span>
            </div>

            {/* Amount Taka */}
            <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-500">
                    <Banknote className="size-3.5 mr-2" />
                    <span className="text-xs font-medium">Amount (BDT)</span>
                </div>
                <span className="text-xs font-bold text-[#005BA1]">৳{metadata?.amountInTaka} (${metadata?.amountInDollars})</span>
            </div>

            {/* Card Info */}
            <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-500">
                    <CreditCard className="size-3.5 mr-2" />
                    <span className="text-xs font-medium">Card Info</span>
                </div>
                <div className="text-right">
                    <p className="text-[11px] font-semibold text-slate-800 uppercase leading-none">{metadata?.card_brand}</p>
                    <p className="text-[9px] text-slate-400 font-mono tracking-tighter">{metadata?.card_no}</p>
                </div>
            </div>

            {/* Transaction ID */}
            <div className="flex flex-col gap-1 pt-2 border-t mt-2">
                <div className="flex items-center text-slate-400">
                    <Hash className="size-3 mr-1.5" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Bank Transaction ID</span>
                </div>
                <code className="text-[10px] bg-slate-50 p-1.5 rounded text-slate-600 break-all border border-slate-100">
                    {metadata?.bank_tran_id}
                </code>
            </div>

            {/* Issuer & Currency */}
            <div className="flex items-center justify-between pt-1">
                <div className="flex items-center text-slate-400">
                    <Globe className="size-3 mr-1.5" />
                    <span className="text-[10px]">{metadata?.card_issuer}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">{metadata?.currency}</span>
            </div>
        </div>
    </div>
    )
}