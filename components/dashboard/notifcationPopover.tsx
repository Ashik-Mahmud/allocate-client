"use client";

import React from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type Props = {
    unreadCount: number;
    notifications: Array<{
        id?: string;
        title?: string;
        message?: string;
        read?: boolean;
    }>;
};

const NotificationPopover = ({ unreadCount, notifications }: Props) => {
    const items = notifications.slice(0, 6);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "h-10 w-10 cursor-pointer border-slate-200/80 rounded-full bg-white/35 text-slate-700 shadow-sm shadow-slate-900/10 backdrop-blur-md transition-all duration-200 grid place-items-center hover:shadow-slate-900/15 dark:border-slate-700/70 dark:bg-slate-700/35 dark:text-slate-100 dark:shadow-black/30",
                        "rounded-full! opacity-100",

                    )}
                    aria-label="Open notifications"
                >
                    <Bell className="size-4" />
                    {unreadCount > 0 ? (
                        <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    ) : null}
                </button>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                sideOffset={10}
                className="w-88 rounded-2xl border border-slate-200/90 bg-white p-0 text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.16)] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            >
                <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                    <p className="text-sm font-semibold">Notifications</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {unreadCount > 0
                            ? `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}`
                            : "You're all caught up"}
                    </p>
                </div>

                <div className="max-h-80 overflow-y-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {items.length > 0 ? (
                        <div className="space-y-2">
                            {items.map((item, index) => (
                                <div
                                    key={item.id ?? `${item.title ?? "notification"}-${index}`}
                                    className={cn(
                                        "rounded-xl border px-3 py-2",
                                        item.read
                                            ? "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
                                            : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
                                    )}
                                >
                                    <p className="truncate text-sm font-medium">
                                        {item.title ?? "Notification"}
                                    </p>
                                    {item.message ? (
                                        <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                                            {item.message}
                                        </p>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
                            No notifications yet.
                        </div>
                    )}
                </div>

                <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
                    <Link
                        href={ROUTES.dashboard}
                        className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline dark:text-slate-100"
                    >
                        Go to dashboard home
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationPopover;