"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { notificationsKeys } from "./hooks";
import { useNamespaceSocket, useRealtimeEvent, useRealtimeManager, useRealtimeSocket } from "@/features/realtime";

export function NotificationRealtimeSync() {
    const queryClient = useQueryClient();

    const {  getNamespaceSocket,  connected } = useRealtimeManager()
    const { socket } = useNamespaceSocket('notifications')

    useEffect(() => {
        if (!connected) return;
        getNamespaceSocket('notifications')?.on('notification:new', (data) => {
            queryClient.setQueriesData({ queryKey: notificationsKeys.all }, (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    data: [data, ...oldData?.data],
                    metadata: {
                        ...oldData?.metadata,
                        unreadCount: oldData?.metadata?.unreadCount ? oldData.metadata.unreadCount + 1 : 1,
                    }
                }
            })
            socket?.emit('notification:acknowledge', { message: 'Notification acknowledged', notificationId: data.id });
        })
        return () => {
            getNamespaceSocket('notifications')?.off('notification:new');
        }
    }, [connected])
    return null;
}
