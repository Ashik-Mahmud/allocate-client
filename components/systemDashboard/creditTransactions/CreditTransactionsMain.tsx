"use client"

import React, { useState } from "react"
import { format } from "date-fns"
import {
  Plus,
  Search,
  CreditCard,
  Eye,
  ArrowRightLeft,
  Wallet,
  ArrowUpRight,
  RefreshCcw,
  Minus,
  TrendingUp,
  ArrowDownLeft,
  Icon,
  History,
  Building2
} from "lucide-react"

import { useFetchTransactionList } from "@/features/system/hooks"

import { SearchableSelect } from "@/components/shared/searchable-select"

import { Card, CardContent } from "@/components/ui/card"
import { TransactionListFilters } from "@/types/systemGlobal";
import { CreditTransaction, TransactionType } from "@/types/credits";
import { Button } from "@/components/ui/button";
import { DatePickerField } from "@/components/shared/datePickerField";
import { cn } from "@/lib/utils/cn";
import Build from "next/dist/build";
import { fetchOrganizations } from "@/lib/services/system";
import DialogPopup from "@/components/shared/dialog-popup";
import ViewCreditDetail from "./ViewCreditDetail";
import AllocateDrawer from "@/components/shared/allocate-drawer";
import ManualTopUp from "./ManualTopUp";

// Helper to style transaction types
const TRANSACTION_CONFIG: Record<TransactionType, { icon: any, color: string, label: string }> = {
  [TransactionType.TOP_UP]: { icon: Plus, color: "text-green-600 bg-green-50", label: "Top Up" },
  [TransactionType.FREE_ALLOCATION]: { icon: Plus, color: "text-blue-600 bg-blue-50", label: "Free" },
  [TransactionType.SPEND]: { icon: ArrowUpRight, color: "text-orange-600 bg-orange-50", label: "Spend" },
  [TransactionType.REFUND]: { icon: RefreshCcw, color: "text-emerald-600 bg-emerald-50", label: "Refund" },
  [TransactionType.REVOKE]: { icon: Minus, color: "text-red-600 bg-red-50", label: "Revoke" },
  [TransactionType.ALLOCATE]: { icon: Plus, color: "text-indigo-600 bg-indigo-50", label: "Allocate" },
  [TransactionType.DEDUCT]: { icon: Minus, color: "text-rose-600 bg-rose-50", label: "Deduct" },
  [TransactionType.ADJUSTMENT]: { icon: History, color: "text-slate-600 bg-slate-50", label: "Adjustment" },
}
const CreditTransactionsMain = () => {
  const [filters, setFilters] = useState<TransactionListFilters>({
    page: 1,
    limit: 10,
    organizationId: undefined,
    type: TransactionType.TOP_UP,
    startDate: undefined,
    endDate: undefined,
  })

  const { data, isLoading, isFetching, refetch } = useFetchTransactionList(filters)
  const items = (data?.data as CreditTransaction[]) || []
  const totalRevenue = data?.metadata?.totalRevenue || 0;
  const [searchedOrgs, setSearchedOrgs] = useState<{ value: string; label: string }[]>([]);
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState<CreditTransaction | null>(null);
  const [isOpenManualTopup, setIsOpenManualTopup] = useState(false);
  // Update filters handler
  const updateFilter = (newFilters: Partial<TransactionListFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }

  const onSearchChange = async (search: string) => {
    // Implement search logic for organizations if needed
    try {
      const result = await fetchOrganizations({
        name: search,
        limit: 10,
        showDeletedOrg: false
      })
      const proccessedOrgs = result?.data?.map((org: any) => ({
        value: org.id,
        label: `${org?.name} (${org?._count?.users || 0} users)`
      }));
      setSearchedOrgs(proccessedOrgs || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }

  }
  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Credit Ledger</h1>
          <p className="text-sm font-medium text-slate-500">Monitor billing, allocations, and revenue</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
            onClick={() => refetch()}
          >
            {
              isFetching ? (
                <RefreshCcw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )
            }
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            onClick={() => {
              setIsOpenManualTopup(true);
            }}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 px-6 shadow-lg shadow-slate-200 transition-all active:scale-95"
          >
            <Plus className="mr-2 h-4 w-4 stroke-3" />
            Manual Top-up
          </Button>

        </div>
      </div>

      {/* Filter Bar - Bento Style */}
      <Card className="border-none shadow-sm bg-white rounded-[2rem] p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
          <SearchableSelect
            label="Organization"
            placeholder="All Organizations"
            options={searchedOrgs}
            value={filters.organizationId}
            onChange={(val) => updateFilter({ organizationId: val })}
            onSearchChange={onSearchChange}
          />

          <SearchableSelect
            label="Type"
            placeholder="All Types"
            options={Object.values(TransactionType).map((t: any) => ({ label: t?.replace('_', ' '), value: t })) || []}
            value={filters.type}
            onChange={(val) => updateFilter({ type: val })}
          />

          <DatePickerField
            label="Start Date"
            value={filters.startDate ? new Date(filters.startDate) : undefined}
            onChange={(date) => updateFilter({ startDate: date?.toISOString() })}
          />

          <DatePickerField
            label="End Date"
            value={filters.endDate ? new Date(filters.endDate) : undefined}
            onChange={(date) => updateFilter({ endDate: date?.toISOString() })}
          />
          <Button
            onClick={() => updateFilter({ organizationId: undefined, type: undefined, startDate: undefined, endDate: undefined })}
            variant="outline"
            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          label="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={TrendingUp}
          // trend="+12% from last month"
          color="text-blue-600"
        />
        <StatCard
          label="Total Transactions"
          value={data?.pagination?.total || 0}
          icon={CreditCard}
          color="text-slate-600"
        />

      </div>

      {/* Main Table */}
      <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/30">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Payer / Method</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Organization</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction ID</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Paid Price</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Credits</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map((item) => {
                  const config = TRANSACTION_CONFIG[item.type]
                  const Icon = config.icon

                  return (

                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                      {/* Payer & Method */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                            <CreditCard size={16} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700">{item.user?.name || "System"}</span>
                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
                              {item.payment_gateway || "Internal"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Organization */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="size-6 text-slate-400 inline-block mr-1" />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">{item.organization?.name || "N/A"}</span>
                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
                              {item?.organization?.org_type || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Transaction ID */}
                      <td className="px-6 py-4">
                        <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                          {item.transaction_id || item.id.slice(0, 10)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn("rounded-lg border-none font-bold text-[10px] px-2 py-1 flex w-fit items-center gap-1.5", config.color)}>
                          <Icon size={10} strokeWidth={3} />
                          {config.label}
                        </div>
                      </td>
                      {/* Money (Price Paid) */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900">
                            {item.price_paid ? `$${item.price_paid}` : "--"}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{item.currency || 'USD'}</span>
                        </div>
                      </td>

                      {/* Credits Allocation */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Wallet size={14} className="text-blue-500" />
                          <span className="text-sm font-bold text-blue-600">
                            {item.amount > 0 ? `+${item.amount}` : item.amount}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className={cn(
                          "rounded-lg border-none px-2 py-1 text-[10px] font-black uppercase",
                          item.status === 'COMPLETED' ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                        )}>
                          {item.status || 'Success'}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-500 font-mono">
                          {format(new Date(item?.createdAt), 'dd MMM yyyy, HH:mm')}
                        </span>
                      </td>

                      {/* Action Button */}
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"

                          className="rounded-full cursor-pointer hover:bg-white hover:shadow-md transition-all h-8 w-8 text-slate-400 hover:text-blue-600"
                          onClick={() => {
                            setSelectedCredit(item);
                            setViewDetailsModal(true);
                          }}
                        >
                          <Eye size={16} />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* View Transaction Details */}
      <DialogPopup
        // title="View Transaction Details"
        open={viewDetailsModal}
        onOpenChange={setViewDetailsModal}
        size="lg"
      >
        <ViewCreditDetail credit={selectedCredit as CreditTransaction} onClose={() => setViewDetailsModal(false)} />
      </DialogPopup>
      <AllocateDrawer
        open={isOpenManualTopup}
        onOpenChange={setIsOpenManualTopup}
        title="Top up Credits"
        position="bottom"
        showHeader={false}
        className="h-[70dvh]!"

      >
        <ManualTopUp

          onSuccess={() => {
            setIsOpenManualTopup(false);
            refetch();
          }} />
      </AllocateDrawer>
    </div>
  )
}

const StatCard = ({ label, value, icon: Icon, trend, color }: any) => (
  <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
    <CardContent className="p-0 flex items-center gap-4">
      <div className={cn("p-3 rounded-2xl bg-slate-50", color)}>
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-slate-900">{value}</h3>
          {trend && <span className="text-[10px] font-bold text-green-500">{trend}</span>}
        </div>
      </div>
    </CardContent>
  </Card>
)

export default CreditTransactionsMain