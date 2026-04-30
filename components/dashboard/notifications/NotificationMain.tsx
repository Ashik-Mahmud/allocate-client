"use client"

import React, { useState, useMemo } from 'react'
import { CheckCheck, Trash2, BellOff, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    useClearAllNotifications,
    useDeleteNotification,
    useGetNotification,
    useMarkAllNotificationsAsRead,
    useMarkNotificationAsRead
} from '@/features/notifications'
import NotificationItem from './NotificationItem'
import ConfirmationAlert from '@/components/shared/confirmationAlert'
import AllocateConfirmationAlert from '@/components/shared/TriggerConfirmation'

// Define the filter type
export type NotificationFilters = {
    limit?: number;
    page?: number;
    is_read?: boolean;
    search?: string;
}

const NotificationMain = () => {
    // 1. Local State for Filters
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null); // For single notification deletion

    // 2. API Hooks
    // Passing filters directly to the hook ensures re-fetching on change
    const { data: notifications, isLoading, isFetching } = useGetNotification({
        limit: 10,
        page: page,
        is_read: activeTab === 'unread' ? false : undefined,
        search: searchTerm || undefined
    });

    const markAllRead = useMarkAllNotificationsAsRead();
    const markAsRead = useMarkNotificationAsRead();
    const clearAll = useClearAllNotifications();
    const clearNotification = useDeleteNotification();



    // 3. Handlers
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleTabChange = (tab: 'all' | 'unread') => {
        setActiveTab(tab);
        setPage(1); // Reset to first page when changing filters
    };


    // 4. get unread count for header
    const unreadCount = useMemo(() => {
        return notifications?.metadata?.unreadCount || 0;
    }, [notifications]);

    return (
        <div className="mx-auto  space-y-6 p-6">

            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">Notifications</h1>
                    <p className="text-sm text-slate-500">Manage your alerts, booking updates, and credit history.</p>
                </div>

                <div className="flex items-center gap-2">
                    <ConfirmationAlert
                        title="Mark all notifications as read?"
                        description="This action will mark all your notifications as read. Are you sure you want to proceed?"
                        confirmText="Yes, mark all as read"
                        cancelText="No, keep them unread"
                        type='warning'
                        onConfirm={() => markAllRead.mutate()}
                    >
                        <button

                            disabled={markAllRead.isPending || unreadCount === 0}
                            className="cursor-pointer flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-200 dark:bg-zinc-900 dark:text-slate-400 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:pointer-events-none"

                        >
                            {markAllRead.isPending ? <Loader2 className="size-4 animate-spin" /> : <CheckCheck className="size-4" />}
                            Mark all read
                        </button>
                    </ConfirmationAlert>

                    <ConfirmationAlert
                        title="Clear all notifications?"
                        description="This action will permanently delete all your notifications. This cannot be undone. Are you sure you want to proceed?"
                        confirmText="Yes, clear all"
                        cancelText="No, keep my notifications"
                        type='danger'
                        onConfirm={() => clearAll.mutate()}
                    >

                        <button
                            disabled={clearAll.isPending || notifications?.data?.length === 0}
                            className="cursor-pointer flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 transition-all hover:bg-rose-100 dark:bg-rose-500/10 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {clearAll.isPending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                            Clear all
                        </button>
                    </ConfirmationAlert>
                </div>
            </div>

            {/* Filter Bar: Tabs & Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1.5 w-full sm:w-fit dark:bg-zinc-900">
                    <button
                        onClick={() => handleTabChange('all')}
                        className={cn(
                            "flex-1 sm:flex-none rounded-xl px-6 py-2 text-xs font-bold transition-all cursor-pointer",
                            activeTab === 'all' ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-800 dark:text-slate-50" : "text-slate-500"
                        )}
                    >
                        All
                    </button>
                    <button
                        onClick={() => handleTabChange('unread')}
                        className={cn(
                            "flex-1 sm:flex-none rounded-xl px-6 py-2 text-xs font-bold transition-all cursor-pointer",
                            activeTab === 'unread' ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-800 dark:text-slate-50" : "text-slate-500"
                        )}
                    >
                        Unread {unreadCount > 0 && (
                            <span className="ml-2 inline-flex size-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-600  text-[10px] font-medium ">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </button>
                </div>

                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1); // Reset page on search
                        }}
                        className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                    />
                </div>
            </div>

            {/* List Body */}
            <div className={cn("space-y-3 transition-opacity", isFetching && "opacity-60")}>
                {notifications?.data?.length ? (
                    notifications.data.map((n) => (
                        <NotificationItem
                            key={n.id}
                            notification={n}
                            onMarkRead={async (id) => {
                                await markAsRead.mutateAsync({ notificationId: id });
                            }}
                            onDelete={(id) => {
                                setDeleteTargetId(id);
                            }}
                        />
                    ))
                ) : !isLoading ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 py-24 dark:border-zinc-800">
                        <div className="flex size-16 items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-900/50">
                            <BellOff className="size-8 text-slate-300 dark:text-zinc-700" />
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">No notifications found</h3>
                        <p className="text-sm text-slate-500">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-300" /></div>
                )}
            </div>

            {/* Pagination Controller */}
            {notifications?.pagination && notifications.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-6 dark:border-zinc-800">
                    <p className="text-xs font-medium text-slate-500">
                        Showing page <span className="text-slate-900 dark:text-slate-100">{page}</span> of {notifications.pagination.totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1 || isFetching}
                            className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950"
                        >
                            <ChevronLeft className="size-4" />
                        </button>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= notifications.pagination.totalPages || isFetching}
                            className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950"
                        >
                            <ChevronRight className="size-4" />
                        </button>
                    </div>
                </div>
            )}

            <AllocateConfirmationAlert

                title="Clear this notification?"
                description="This action will permanently delete this notification. This cannot be undone. Are you sure you want to proceed?"
                confirmText="Yes, delete it"
                onConfirm={() => {
                    if (deleteTargetId) {
                        clearNotification.mutate({ notificationId: deleteTargetId });
                    }
                }}
                open={!!deleteTargetId}
                onOpenChange={() => setDeleteTargetId(null)}
            />
        </div>
    )
}

export default NotificationMain