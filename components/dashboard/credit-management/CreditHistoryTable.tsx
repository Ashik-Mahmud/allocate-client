// components/credit/CreditHistoryTable.tsx
import Loader from "@/components/shared/loader";
import { CreditTransaction, TransactionType } from "@/types/credits";
import { format } from "date-fns";
import { Info, Coins } from "lucide-react";
import { TransactionBadge } from "./TransactionBadge";
import AllocateTooltip from "@/components/shared/tooltip";
import { PaymentProvider } from "@/types/billings";
import { BsStripe } from "react-icons/bs";
import PaymentProviderBadge from "@/components/shared/payment-method";

type CreditHistoryTableProps = {
    items: CreditTransaction[] | undefined;
    isLoading?: boolean;
}
export const CreditHistoryTable = ({ items, isLoading }: CreditHistoryTableProps) => {



    if (isLoading) return <Loader type="component" />;

    if (!items || items.length === 0) {
        return (
            <div className="w-full overflow-x-auto">
                <div className="w-full text-center py-10 text-slate-500">
                    <Coins className="size-10 mx-auto mb-4 text-slate-300" />
                    <p className="text-base">No credit transactions found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="block md:hidden space-y-2 p-3">
                {items?.map((item) => {
                    const isPositive = [TransactionType.ALLOCATE, TransactionType.TOP_UP, TransactionType.REFUND, TransactionType.FREE_ALLOCATION].includes(item.type);

                    return (
                        <div key={item.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-3 bg-white dark:bg-slate-950">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-3 min-w-0">
                                    {item?.user?.photo ? (
                                        <img src={item.user.photo} className="size-8 rounded-full border border-slate-200" alt="" />
                                    ) : (
                                        <div className="size-8 rounded-full border border-slate-200 bg-slate-200 flex items-center justify-center">
                                            {item?.user?.name ? item.user.name.charAt(0).toUpperCase() : <Info className="size-4 text-slate-500" />}
                                        </div>
                                    )}

                                    <div className="min-w-0 ">
                                        <p className="text-sm font-semibold truncate" title={item?.user?.name || "Unknown"}>{item?.user?.name || "Unknown"}</p>
                                        <p className="text-[10px] text-slate-500 truncate" title={item?.user?.email || "No email"}>
                                            {item?.user?.email || "No email"}
                                        </p>
                                    </div>
                                </div>
                                <TransactionBadge type={item.type as TransactionType} />
                            </div>

                            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                                <div>
                                    <p className="text-slate-500">Amount</p>
                                    <p className="font-mono font-bold">
                                        {isPositive ? '+' : '-'}{item.amount}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Balance</p>
                                    <p className="font-semibold">{item.currentBalance}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Date</p>
                                    <p className="font-medium">{format(new Date(item.createdAt), 'MMM dd')}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                        <tr>
                            <th className="px-4 py-3">Staff Member</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Credits Amount</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Price Amout</th>
                            <th className="px-4 py-3">Method</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Credits Balance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {items?.map((item) => {
                            const isPositive = [TransactionType.ALLOCATE, TransactionType.TOP_UP, TransactionType.REFUND, TransactionType.FREE_ALLOCATION].includes(item.type);

                            return (
                                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {
                                                item?.user?.photo ? (
                                                    <img src={item.user.photo} className="size-7 rounded-full border border-slate-200" alt="" />
                                                ) : (
                                                    <div className="size-7 rounded-full border border-slate-200 bg-slate-200 flex items-center justify-center">
                                                        {item?.user?.name ? item.user.name.charAt(0).toUpperCase() : <Info className="size-4 text-slate-500" />}
                                                    </div>
                                                )
                                            }

                                            <div>
                                                <p className="text-sm font-medium" title={item?.user?.name || "Unknown"}>
                                                    {item?.user?.name || "Unknown"}
                                                </p>
                                                <p className="text-[10px] text-slate-500 truncate max-w-30" title={item?.user?.email || "No email"}>
                                                    {item?.user?.email || "No email"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <TransactionBadge type={item.type as TransactionType} />
                                    </td>
                                    <td className="px-4 py-3 font-mono text-sm">
                                        {isPositive ? '+' : '-'}{item.amount}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-500">
                                        {format(new Date(item.createdAt), 'MMM dd, HH:mm')}
                                    </td>
                                    <td className="px-4 py-4 text-sm align-middle">
                                        <div className="font-medium text-slate-900 dark:text-slate-100">
                                            {item?.price_paid
                                                ? `${item?.currency ?? '$'}${' '+ item.price_paid.toFixed(2)}`
                                                : <span className="text-slate-400">—</span>
                                            }
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 text-sm align-middle">
                                        <PaymentProviderBadge
                                            provider={item?.payment_gateway || 'unknown'}
                                            showIcon={true}
                                            transactionId={item?.transaction_id || ''}
                                            showMetadata={true}
                                            metadata={item?.metadata as Record<string, any> | undefined}
                                        />
                                    </td>

                                    <td className="px-4 py-4 text-sm align-middle">
                                        {

                                            item?.status ? <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${item?.status === 'COMPLETED'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                                    }`}>
                                                    <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${item?.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-500'
                                                        }`}></span>
                                                    {item?.status}
                                                </span>

                                                {item?.description && (
                                                    <AllocateTooltip content={<p className="max-w-xs">{item.description}</p>}>
                                                        <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                                                            <Info className="size-3.5" />
                                                        </button>
                                                    </AllocateTooltip>
                                                )}
                                            </div> : <span className="text-slate-400">—</span>
                                        }

                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-sm">
                                        {item?.currentBalance}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

