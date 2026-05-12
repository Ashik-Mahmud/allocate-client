"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { format } from 'date-fns';
import { RefreshCw, User, Building2 } from 'lucide-react';
import { ActivityLog } from '@/types/systemGlobal';
import DialogPopup from '@/components/shared/dialog-popup';
import { useState } from 'react';
import ViewActivityLogs from './ViewActivityLogs';


interface ActivityLogsTableProps {
    logs: ActivityLog[];
    isLoading: boolean;
    isError: boolean;
    onRefresh: () => void;
}

export const ActivityLogsTable = ({
    logs,
    isLoading,
    isError,
    onRefresh,
}: ActivityLogsTableProps) => {
    const [open, setOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
    return (
        <Card className="border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-950">
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="h-6 w-6 animate-spin text-slate-400" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">Loading activity logs...</p>
                    </div>
                </div>
            ) : isError ? (
                <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <p className="text-sm font-medium text-red-600 dark:text-red-400">Error loading logs</p>
                        <Button onClick={onRefresh} size="sm" variant="outline" className="mt-2">
                            Retry
                        </Button>
                    </div>
                </div>
            ) : logs.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                    <p className="text-sm text-slate-600 dark:text-slate-400">No activity logs found</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                                <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">User</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Organization</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Action</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">User Agent</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Date & Time</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">IP Address</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log, index) => (
                                <tr
                                    key={log.id}
                                    className={cn(
                                        "border-b transition-colors hover:bg-slate-50 dark:hover:bg-slate-900",
                                        "border-slate-200 dark:border-slate-800",
                                        index % 2 === 0 ? "bg-white dark:bg-slate-950" : "bg-slate-50/50 dark:bg-slate-900/50"
                                    )}
                                >
                                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                                <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                            </div>
                                            <div className="truncate min-w-0">
                                                <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{log?.user?.name || log?.user_id}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{log.user_id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-slate-400 dark:text-slate-600 shrink-0" />
                                            <span className="text-slate-700 dark:text-slate-300 truncate">{log?.organization?.name || log?.org_id || 'System Admin'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={cn(
                                            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
                                            getActionColor(log.action)
                                        )}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 truncate" title={log?.userAgent}>{log?.userAgent?.slice(0, 40) || '-'}</td>
                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap">
                                        {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs font-mono">{log.ipAddress || '-'}</td>
                                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                        <Button
                                            onClick={() => {
                                                setSelectedLog(log);
                                                setOpen(true);
                                            }}
                                            size="sm" variant="outline" className="h-8 px-3">
                                            View Details
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <DialogPopup
                open={open}
                onOpenChange={setOpen}
               size="lg"
            >
                <ViewActivityLogs log={selectedLog as ActivityLog} onClose={() => setOpen(false)} />
            </DialogPopup>
        </Card>
    );
};

// Helper function to get action color
const getActionColor = (action: string): string => {
    const actionLower = action.toLowerCase();

    if (actionLower.includes('create') || actionLower.includes('added')) {
        return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
    }
    if (actionLower.includes('delete') || actionLower.includes('removed')) {
        return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
    }
    if (actionLower.includes('update') || actionLower.includes('modified')) {
        return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
    }
    if (actionLower.includes('login') || actionLower.includes('logout')) {
        return 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400';
    }

    return 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400';
};
