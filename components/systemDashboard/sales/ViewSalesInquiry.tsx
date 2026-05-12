"use client"

import React, { useEffect, useMemo, useState } from "react"
import { 
  User, Mail, Phone, MapPin, Users, 
  Building2, Calendar, Clock, MessageSquare, 
  ChevronRight, ArrowUpRight
} from "lucide-react"
import { format } from "date-fns"

import DialogPopup from "@/components/shared/dialog-popup"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SaleInquiryStatus, SalesInquiry } from "@/types/sales"
import { STATUS_META, STATUS_OPTIONS } from "./Sales.constant"
import { cn } from "@/lib/utils/cn";

type ViewSalesInquiryProps = {
  open: boolean
  inquiry: SalesInquiry | null | undefined
  isLoading?: boolean
  isUpdating?: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStatus: (status: SaleInquiryStatus) => void
}

const StatCard = ({ icon: Icon, label, value, className }: any) => (
  <div className={cn("p-4 rounded-2xl bg-slate-50/50 border border-slate-100 flex items-start gap-3", className)}>
    <div className="p-2 bg-white rounded-xl border border-slate-100 text-slate-400 shadow-sm">
      <Icon size={16} />
    </div>
    <div className="space-y-0.5 overflow-hidden">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-slate-700 truncate">{value || "-"}</p>
    </div>
  </div>
)

const ViewSalesInquiry = ({
  open,
  inquiry,
  isLoading = false,
  isUpdating = false,
  onOpenChange,
  onUpdateStatus,
}: ViewSalesInquiryProps) => {
  const [draftStatus, setDraftStatus] = useState<SaleInquiryStatus>(SaleInquiryStatus.PENDING)

  useEffect(() => {
    if (inquiry?.status) {
      setDraftStatus(inquiry.status)
    }
  }, [inquiry?.status, inquiry?.id])

  const footer = useMemo(() => {
    if (!inquiry) return null
    return (
      <div className="flex w-full items-center justify-between gap-4">
        <p className="text-[10px] text-muted-foreground italic hidden sm:block">
          Last updated: {inquiry.updatedAt ? format(new Date(inquiry.updatedAt), 'PPp') : 'N/A'}
        </p>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="ghost" className="flex-1 sm:flex-none" onClick={() => onOpenChange(false)}>
            Discard
          </Button>
          <Button
            className="flex-1 sm:flex-none bg-slate-900"
            onClick={() => onUpdateStatus(draftStatus)}
            disabled={isUpdating || draftStatus === inquiry.status}
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    )
  }, [draftStatus, inquiry, isUpdating, onOpenChange, onUpdateStatus])

  return (
    <DialogPopup
      open={open}
      onOpenChange={onOpenChange}
      title={inquiry?.name ?? "Inquiry Details"}
      description={inquiry?.business_email ?? "Lead information and request details."}
      footer={inquiry ? footer : undefined}
      size="lg"
      className="max-h-[95vh] overflow-hidden flex flex-col"
    >
      <div className="space-y-6 py-2 overflow-y-auto pr-2 custom-scrollbar">
        {/* Quick Header Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard icon={User} label="Full Name" value={inquiry?.name} />
          <StatCard icon={Mail} label="Work Email" value={inquiry?.business_email} />
          <StatCard icon={Phone} label="Contact" value={inquiry?.phone} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Company & Context Section */}
          <div className="space-y-4 ">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Building2 size={14} /> Business Context
            </h3>
            <div className="space-y-3 p-4 rounded-3xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-slate-500 font-medium">Organization</span>
                <span className="text-sm font-bold text-slate-700">{inquiry?.organization?.name || inquiry?.org_id || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-t border-slate-200/50">
                <span className="text-xs text-slate-500 font-medium">Team Size</span>
                <span className="text-sm font-bold text-slate-700">{inquiry?.team_size || "Personal"}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-t border-slate-200/50">
                <span className="text-xs text-slate-500 font-medium">Location</span>
                <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
                   {inquiry?.country} <ArrowUpRight size={12} className="text-slate-400" />
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-t border-slate-200/50">
                <span className="text-xs text-slate-500 font-medium">Submitted</span>
                <span className="text-sm font-bold text-slate-700">{inquiry?.createdAt ? format(new Date(inquiry.createdAt), 'MMM dd, yyyy') : "-"}</span>
              </div>
            </div>
          </div>

          {/* Action Center - Status Update */}
          <div className="space-y-4 ">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} /> Management
            </h3>
            <div className={cn(
              "p-6 rounded-3xl border-2 transition-all duration-300",
              draftStatus === inquiry?.status ? "bg-white border-slate-100 shadow-sm" : "bg-blue-50/30 border-blue-200 shadow-md"
            )}>
              <Label className="text-[10px] font-bold text-slate-400 uppercase mb-3 block">Update Pipeline Status</Label>
              <Select value={draftStatus} onValueChange={(value) => setDraftStatus(value as SaleInquiryStatus)}>
                <SelectTrigger className="w-full bg-white h-12 rounded-xl border-slate-200 font-bold text-slate-700 shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status} className="font-medium">
                      {STATUS_META[status]?.label ?? status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-3 text-[11px] text-slate-400 leading-tight">
                Changing this status will update the lead's position in your sales funnel.
              </p>
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={14} /> Inquiry Message
            </h3>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">
               {inquiry?.message?.length || 0} characters
            </span>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-slate-900/5 rounded-2xl scale-[0.98] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Textarea 
              value={inquiry?.message} 
              readOnly 
              className="relative min-h-40 rounded-2xl bg-white border-slate-200 text-slate-600 leading-relaxed focus-visible:ring-0 resize-none p-4 shadow-sm italic"
            />
          </div>
        </div>
      </div>
    </DialogPopup>
  )
}

export default ViewSalesInquiry