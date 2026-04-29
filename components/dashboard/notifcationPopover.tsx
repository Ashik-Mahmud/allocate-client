"use client";

import React from "react";
import Link from "next/link";
import { Bell, Check, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useGetNotification, useMarkAllNotificationsAsRead, useMarkNotificationAsRead } from "@/features/notifications";
import { NotificationConfig } from "@/lib/utils/global";
import { NotificationType } from "@/types/notification";

const NotificationPopover = () => {
    const { data } = useGetNotification({ limit: 5, page: 1 });
    const markAllAsReadMutation = useMarkAllNotificationsAsRead();
    const markAsReadMutation = useMarkNotificationAsRead();

    const unreadCount = data?.data.filter((item) => !item.is_read).length || 0;
    const items = data?.data || [];

    const markAllAsRead = async () => {
        await markAllAsReadMutation.mutateAsync();
    };

    const markAsRead = async (id: string) => {
        await markAsReadMutation.mutateAsync({ notificationId: id });
    };
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "relative h-10 w-10 cursor-pointer border border-slate-200/80 rounded-full bg-white/35 text-slate-700 shadow-sm backdrop-blur-md transition-all duration-200 grid place-items-center hover:bg-white/50 dark:border-slate-700/70 dark:bg-slate-700/35 dark:text-slate-100",
                        unreadCount > 0 && "ring-2 ring-rose-500/10"
                    )}
                    aria-label="Open notifications"
                >
                    <Bell className={cn("size-4", unreadCount > 0 && "animate-tada")} />
                    {unreadCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                sideOffset={12}
                className="w-96 rounded-2xl border border-slate-200/90 bg-white p-0 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800/60">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Activity</h3>
                        <p className="text-[11px] text-slate-500">
                            {unreadCount > 0 ? `You have ${unreadCount} unread updates` : "No new notifications"}
                        </p>
                    </div>
                    <button
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
                        className="text-[11px] font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 cursor-pointer
                        disabled:cursor-not-allowed disabled:text-slate-400 dark:disabled:text-slate-600">
                        {markAllAsReadMutation.isPending ? "Marking..." : "Mark all as read"}
                    </button>
                </div>

                {/* List Area */}
                <div className="max-h-100 overflow-y-auto p-2 scrollbar-hide">
                    {items.length > 0 ? (
                        <div className="flex flex-col gap-1">
                            {items.map((item) => {
                                const config = NotificationConfig[item.type as NotificationType] || NotificationConfig[NotificationType.SYSTEM_ALERT];
                                const Icon = config.icon;

                                return (
                                    <div
                                        key={item.id}
                                        className={cn(
                                            "group relative flex gap-3 rounded-xl p-3 transition-colors cursor-pointer",
                                            item.is_read
                                                ? "hover:bg-slate-50 dark:hover:bg-zinc-900/50"
                                                : "bg-indigo-50/30 dark:bg-indigo-500/5 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10"
                                        )}
                                        onClick={() => {
                                            if (!item.is_read) {
                                                markAsRead(item.id);
                                            }
                                        }}
                                    >
                                        {/* Icon Section */}
                                        <div className={cn(
                                            "flex size-9 shrink-0 items-center justify-center rounded-lg border dark:border-none",
                                            config.bgColor,
                                            config.color
                                        )}>
                                            <Icon className="size-4" />
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="truncate text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                                                    {item.title}
                                                </p>
                                                <span className="shrink-0 text-[10px] text-slate-400">
                                                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, includeSeconds: true }).replace('about ', '')}
                                                </span>
                                            </div>
                                            <p className="line-clamp-2 text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">
                                                {item.message}
                                            </p>
                                        </div>

                                        {/* Unread Dot Indicator */}
                                        {!item.is_read && (
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                <div className="size-1.5 rounded-full bg-indigo-500" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="flex size-12 items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-900">
                                <Check className="size-6 text-slate-300" />
                            </div>
                            <p className="mt-2 text-sm font-medium text-slate-500">All caught up!</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 bg-slate-50/50 p-2 dark:border-slate-800/60 dark:bg-zinc-900/20">
                    <Link
                        href={ROUTES.dashboardCommon.notifications} // Or a dedicated /notifications page
                        className="flex w-full items-center justify-center rounded-lg py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-zinc-800 dark:hover:text-slate-100"
                    >
                        View all activity
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationPopover;