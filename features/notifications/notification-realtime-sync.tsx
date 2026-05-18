"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { notificationsKeys } from "./hooks";
import { useNamespaceSocket, useRealtimeEvent, useRealtimeManager, useRealtimeSocket } from "@/features/realtime";
import { useSession } from "next-auth/react";

export function NotificationRealtimeSync() {
    const { data: user } = useSession();
    const queryClient = useQueryClient();

    const { getNamespaceSocket, connected } = useRealtimeManager()
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

        getNamespaceSocket("community")?.on('notification:new', (data) => {
            const myIdMapping = data.idMap.find((idMap: any) => idMap.userId === user?.user?.id);
            queryClient.setQueriesData({ queryKey: notificationsKeys.all }, (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    data: [{
                        id: myIdMapping?.id || data.id,
                        ...data,
                    }, ...oldData?.data],
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
            getNamespaceSocket("community")?.off('notification:new');
        }
    }, [connected])
    return null;
}
