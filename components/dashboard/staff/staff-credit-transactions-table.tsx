"use client";

import { format } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, Clock3, Info } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CreditTransaction, TransactionType } from "@/types/credits";

// Updated type to match your actual API response


type Props = {
  transactions: CreditTransaction[];
  className?: string;
};

export default function StaffCreditTransactionsTable({ transactions, className }: Props) {
  return (
    <section className={cn("rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Credit Transactions</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Ledger showing credit movements for this staff member.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <Clock3 className="size-3.5" />
          Real-time History
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          No transactions found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-30">Date</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="w-12.5"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => {
                // Logic to determine if it's an "Incoming" or "Outgoing" movement
                const isPositive = transaction.type === "ALLOCATE" || transaction.type === "REFUND";

                return (
                  <TableRow key={transaction.id} className="group transition-colors">
                    <TableCell className="whitespace-nowrap py-4">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {format(new Date(transaction.createdAt), "dd MMM yyyy")}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {format(new Date(transaction.createdAt), "HH:mm")}
                      </p>
                    </TableCell>

                    <TableCell>
                      <div className="max-w-75">
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug line-clamp-2">
                          {transaction.description}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          isPositive
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400"
                        )}
                      >
                        {isPositive ? <ArrowUpRight className="size-3" /> : <ArrowDownLeft className="size-3" />}
                        {transaction.type}
                      </span>
                    </TableCell>

                    <TableCell className={cn(
                      "text-right font-bold py-4",
                      isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    )}>
                      {isPositive ? "+" : "-"}{transaction.amount.toLocaleString()}
                    </TableCell>

                    <TableCell className="text-right py-4">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">
                          {transaction.currentBalance.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono italic">
                          Prev: {transaction.previousBalance}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="size-4 text-slate-300 cursor-help hover:text-slate-500 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent side="left" className="bg-slate-900 text-white border-slate-800">
                            <p className="text-xs font-mono">TX-ID: {transaction.id}</p>
                            {transaction.referenceId && (
                              <p className="text-xs font-mono mt-1 text-slate-400">Ref: {transaction.referenceId}</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}