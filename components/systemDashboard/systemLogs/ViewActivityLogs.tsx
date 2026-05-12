"use client"

import React from "react"
import { format } from "date-fns"
import { ActivityLog } from "@/types/systemGlobal"
import { X, Activity, Globe, Monitor, Info, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  log: ActivityLog
  onClose: () => void
}

const ViewActivityLogs = ({ log, onClose }: Props) => {
  // Helper to safely parse and display metadata
  const metadataEntries = log.metadata ? Object.entries(log.metadata) : []

  return (
    <div className="flex flex-col gap-6 ">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Activity size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Log Details</h2>
            <p className="text-xs font-medium text-slate-400">Transaction ID: {log.id}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="rounded-full hover:bg-slate-100 text-slate-400"
        >
          <X size={18} />
        </Button>
      </div>

      {/* Primary Action & Status */}
      <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Action Performed</p>
            <div className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-1 px-3">
              {log.action.replace(/_/g, " ")}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Timestamp</p>
            <p className="text-sm font-semibold text-slate-700">
              {format(new Date(log.createdAt), "PPP p")}
            </p>
          </div>
        </div>
        {log.details && (
          <div className="mt-4 pt-4 border-t border-slate-200/60">
            <p className="text-sm text-slate-600 leading-relaxed italic">
              &ldquo;{log.details}&rdquo;
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dynamic Metadata Section */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Info size={16} className="text-blue-500" />
            Metadata
          </h3>
          <div className="rounded-2xl border border-slate-100 p-1">
            {metadataEntries.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {metadataEntries.map(([key, value]) => (
                  <div key={key} className="flex flex-col p-3 hover:bg-slate-50/50 transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-sm font-medium text-slate-700 break-all">
                      {typeof value === 'string' ? value : JSON.stringify(value)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">No metadata available</div>
            )}
          </div>
        </div>

        {/* Network & Device Info */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Globe size={16} className="text-blue-500" />
            Network Info
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-white border border-slate-100 p-3">
              <span className="text-xs font-medium text-slate-500">IP Address</span>
              <span className="text-xs font-mono font-bold text-slate-700">{log.ipAddress}</span>
            </div>
            <div className="flex flex-col gap-2 rounded-xl bg-white border border-slate-100 p-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Monitor size={14} />
                User Agent
              </div>
              <span className="text-[11px] text-slate-600 leading-normal wrap-break-word bg-slate-50 p-2 rounded-lg">
                {log.userAgent || "Unknown Device"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Actor Info */}
      <div className="mt-2 flex items-center gap-3 rounded-2xl bg-slate-900 p-4 text-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
          {log.user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Performed By</p>
          <p className="text-sm font-semibold truncate">{log.user?.name}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Role</p>
          <div className="text-[10px] border-slate-700 text-slate-300">
            {log.user?.role}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewActivityLogs