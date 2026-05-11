"use client"
import { useCurrentUser } from '@/features/auth';
import useGlobalSettings from '@/hooks/use-global-settings';
import { AlertOctagon, CheckCircle2, Info } from 'lucide-react';
import React from 'react'

type Props = {}

const GlobalAlertMessage = (props: Props) => {
    const { isMaintenanceMode, global_alert_message } = useGlobalSettings();

    if (isMaintenanceMode) return null
    if (!global_alert_message?.show) return null;
    return (
        <div className="px-4 pt-4">
            {/* Alert Preview */}
            <div >

                <div className={`p-4 rounded-2xl border flex items-start justify-between gap-4 transition-colors ${global_alert_message?.type === 'error' ? 'bg-red-50 border-red-200 text-red-900' :
                    global_alert_message?.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                        global_alert_message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                            'bg-blue-50 border-blue-200 text-blue-900'
                    }`}>
                    <div className="flex items-start gap-4 flex-1">
                        {global_alert_message.type === 'error' ? <AlertOctagon size={20} className="shrink-0 mt-0.5" /> :
                            global_alert_message.type === 'success' ? <CheckCircle2 size={20} className="shrink-0 mt-0.5" /> : <Info size={20} className="shrink-0 mt-0.5" />}
                        <div className="flex-1">
                            <p className="font-bold text-sm">{global_alert_message.title || "No Title Provided"}</p>
                            <p className="text-xs opacity-80">{global_alert_message.body || "No message content."}</p>
                        </div>
                    </div>
                    {global_alert_message.buttonText && (
                        <a
                            href={global_alert_message.buttonLink || '#'}
                            className={`px-4 py-2 rounded-lg font-semibold text-xs whitespace-nowrap shrink-0 transition-all ${global_alert_message.type === 'error' ? 'bg-red-600 text-white hover:bg-red-700' :
                                global_alert_message.type === 'warning' ? 'bg-amber-600 text-white hover:bg-amber-700' :
                                    global_alert_message.type === 'success' ? 'bg-emerald-600 text-white hover:bg-emerald-700' :
                                        'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {global_alert_message.buttonText}
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}

export default GlobalAlertMessage