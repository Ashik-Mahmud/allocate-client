"use client";

import { format } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, Clock3 } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type StaffCreditTransaction = {
  id: string;
  occurredAt: string | Date;
  source: string;
  note?: string;
  amount: number;
  balanceAfter: number;
  status: "completed" | "pending" | "reversed";
  type: "credit" | "debit";
};

type Props = {
  transactions: StaffCreditTransaction[];
  className?: string;
};

function getStatusClasses(status: StaffCreditTransaction["status"]) {
  if (status === "completed") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300";
  }

  if (status === "pending") {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300";
  }

  return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300";
}

export default function StaffCreditTransactionsTable({ transactions, className }: Props) {
  return (
    <section className={cn("rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Credit transactions</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Demo ledger showing how staff credits move over time.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <Clock3 className="size-3.5" />
          Updated live in demo mode
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          No transactions available.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Credits</TableHead>
              <TableHead className="text-right">Balance after</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                  {format(new Date(transaction.occurredAt), "dd MMM yyyy")}
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{transaction.id}</span>
                </TableCell>
                <TableCell>
                  <div className="max-w-60">
                    <p className="truncate text-sm text-slate-700 dark:text-slate-300">{transaction.source}</p>
                    {transaction.note ? (
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">{transaction.note}</p>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
                      transaction.type === "credit"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                        : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
                    )}
                  >
                    {transaction.type === "credit" ? <ArrowUpRight className="size-3.5" /> : <ArrowDownLeft className="size-3.5" />}
                    {transaction.type === "credit" ? "Credit" : "Debit"}
                  </span>
                </TableCell>
                <TableCell className="text-right font-semibold text-slate-900 dark:text-slate-100">
                  {transaction.type === "credit" ? "+" : "-"}
                  {transaction.amount.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-slate-700 dark:text-slate-300">
                  {transaction.balanceAfter.toLocaleString()}
                </TableCell>
                <TableCell>
                  <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-medium", getStatusClasses(transaction.status))}>
                    {transaction.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}