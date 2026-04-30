// components/credit/CreditHistoryTable.tsx
import Loader from "@/components/shared/loader";
import { cn } from "@/lib/utils";
import { TRANSACTION_CONFIG } from "@/lib/utils/global";
import { CreditTransaction, TransactionType } from "@/types/credits";
import { format } from "date-fns";
import { ArrowUpCircle, ArrowDownCircle, Info, Coins } from "lucide-react";
import { TransactionBadge } from "./TransactionBadge";

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
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                    <tr>
                        <th className="px-4 py-3">Staff Member</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 text-right">Balance</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {items?.map((item) => (
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
                                        <p className="text-sm font-medium">{item?.user?.name}</p>
                                        <p className="text-[10px] text-slate-500 truncate max-w-30">{item?.user?.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <TransactionBadge type={item.type as TransactionType} />
                            </td>
                            <td className="px-4 py-3 font-mono text-sm">
                                {item.type === TransactionType.ALLOCATE ? '+' : '-'}{item.amount}
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-500">
                                {format(new Date(item.createdAt), 'MMM dd, HH:mm')}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-sm">
                                {item.currentBalance}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

