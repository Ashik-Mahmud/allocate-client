"use client"

import React from 'react'
import { Check, Trash2, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { NotificationConfig } from '@/lib/utils/global'
import { Notification, NotificationType } from '@/types/notification'
// The mapping we built

type ItemProps = {
    notification: Notification;
    onMarkRead: (id: string) => void;
    onDelete: (id: string) => void;
}

const NotificationItem = ({ notification, onMarkRead, onDelete }: ItemProps) => {
    const config = NotificationConfig[notification.type as NotificationType] || NotificationConfig[NotificationType.SYSTEM_ALERT];
    const Icon = config.icon;

    return (
        <div className={cn(
            "group relative flex gap-4 rounded-2xl border p-4 transition-all duration-200",
            notification.is_read
                ? "border-slate-100 bg-slate-50/50 dark:border-zinc-800/50 dark:bg-zinc-950/50 opacity-75"
                : "border-indigo-100 bg-indigo-50/50 dark:border-indigo-500/20 dark:bg-indigo-500/5 shadow-sm"
        )}>
            {/* Category Icon */}
            <div className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-xl border dark:border-none",
                config.bgColor,
                config.color
            )}>
                <Icon className="size-6" />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-start justify-between gap-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {notification.title}
                    </h4>
                    <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400 whitespace-nowrap">
                        <Clock className="size-3" />
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {notification.message}
                </p>

                {/* Inline Actions */}
                <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notification.is_read && (
                        <button
                            onClick={() => onMarkRead(notification.id)}
                            className="cursor-pointer flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-emerald-600 shadow-sm ring-1 ring-slate-200 hover:bg-emerald-50 dark:bg-zinc-900 dark:ring-zinc-800"
                        >
                            <Check className="size-3.5" /> Mark as read
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(notification.id)}
                        className="cursor-pointer flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-rose-600 shadow-sm ring-1 ring-slate-200 hover:bg-rose-50 dark:bg-zinc-900 dark:ring-zinc-800"
                    >
                        <Trash2 className="size-3.5" /> Delete
                    </button>
                </div>
            </div>

            {/* Unread Indicator */}
            {!notification.is_read && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2"
                    title='Unread'
                >
                    <span className="relative flex size-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex size-3 rounded-full bg-indigo-500"></span>
                    </span>
                </div>
            )}
        </div>
    )
}

export default NotificationItem;