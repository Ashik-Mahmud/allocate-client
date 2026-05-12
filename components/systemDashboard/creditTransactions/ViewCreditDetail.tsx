"use client"

import React from "react"
import { format } from "date-fns"
import { 
  X, 
  CreditCard, 
  User, 
  Building2, 
  Database, 
  Globe, 
  History,
  ShieldCheck,
  Smartphone,
  Calendar
} from "lucide-react"

import { CreditTransaction } from "@/types/credits"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/cn";


type Props = {
  credit: CreditTransaction
  onClose?: () => void
}

const ViewCreditDetail = ({ credit, onClose }: Props) => {
  const meta = credit.metadata || {}

  return (
    <div className="flex flex-col gap-6 p-1">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
            <CreditCard size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Transaction Detail</h2>
              <div className="bg-green-100 text-green-700 hover:bg-green-100 border-none rounded-md text-[10px] font-black uppercase">
                {credit.status}
              </div>
            </div>
            <p className="text-xs font-mono font-medium text-slate-400 mt-0.5">{credit.id}</p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X size={20} className="text-slate-400" />
          </Button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        
        {/* Financial Summary Card */}
        <div className="space-y-4">
          <SectionHeader icon={ShieldCheck} title="Financial Summary" />
          <div className="rounded-[2rem] bg-slate-50 border border-slate-100 p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <DataBlock label="Paid Price" value={`${credit.price_paid} ${credit.currency || "USD"}`} highlight />
              <DataBlock label="Credits Allocated" value={`+${credit.amount}`} color="text-blue-600" />
            </div>
            
            <div className="pt-4 border-t border-slate-200/60 grid grid-cols-2 gap-4">
              <DataBlock label="Previous Credit Balance" value={credit.previousBalance} />
              <DataBlock label="Current Credit Balance" value={credit.currentBalance} isBold />
            </div>

            <div className="pt-4 border-t border-slate-200/60">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Description</p>
              <p className="text-sm font-medium text-slate-700 italic">"{credit.description}"</p>
            </div>
          </div>
        </div>

        {/* Payment & Gateway Details */}
        <div className="space-y-4">
          <SectionHeader icon={Globe} title="Payment Metadata" />
          <div className="rounded-[2rem] border border-slate-100 p-2 space-y-1">
            <MetaRow label="Gateway" value={credit.payment_gateway} />
            {
                Object.entries(meta).map(([key, value]) => (
                  <MetaRow key={key} label={key.replace("_", " ")} value={value} />
                ))
            }
            {/* 
            <MetaRow label="Bank Trans ID" value={meta.bank_tran_id} isMono />
            <MetaRow label="Method" value={meta.card_type} />
            <MetaRow label="Card Brand" value={meta.card_brand} />
            <MetaRow label="Local Amount" value={`${meta.amountInTaka} BDT`} />
            <MetaRow label="Issuer" value={meta.card_issuer} /> */}
          </div>
        </div>

        {/* User & Organization Context */}
        <div className="space-y-4">
          <SectionHeader icon={Building2} title="Entity Context" />
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <User size={18} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Performed By</p>
                <p className="text-sm font-bold text-slate-800">{credit.user?.name}</p>
                <p className="text-xs text-slate-500">{credit.user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100">
              <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                <Building2 size={18} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Organization</p>
                <p className="text-sm font-bold text-slate-800">{credit.organization?.name}</p>
                <div className="text-[10px] rounded-md h-5 px-1.5 border-slate-200 text-slate-500">
                  {credit.organization?.org_type || 'Tech'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Timestamps */}
        <div className="space-y-4">
          <SectionHeader icon={History} title="System Audit" />
          <div className="rounded-[2rem] border border-slate-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar size={14} />
                <span className="text-xs font-medium uppercase tracking-tighter">Created At</span>
              </div>
              <span className="text-xs font-bold text-slate-700">
                {format(new Date(credit.createdAt), "PPP p")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <Smartphone size={14} />
                <span className="text-xs font-medium uppercase tracking-tighter">Gateway ID</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {credit.transaction_id}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

// Internal Helper Components
const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className="flex items-center gap-2 ml-1">
    <Icon size={16} className="text-slate-400" />
    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{title}</h3>
  </div>
)

const DataBlock = ({ label, value, highlight, color, isBold }: any) => (
  <div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
    <p className={cn(
      "text-lg tracking-tight",
      highlight ? "text-2xl font-black text-slate-900" : "font-bold text-slate-700",
      color,
      isBold && "font-black"
    )}>
      {value}
    </p>
  </div>
)

const MetaRow = ({ label, value, isMono }: any) => (
  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <span className={cn(
      "text-xs font-bold text-slate-800",
      isMono && "font-mono text-[11px] text-slate-500"
    )}>
      {value || "---"}
    </span>
  </div>
)

export default ViewCreditDetail