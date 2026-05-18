"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { notificationsKeys } from "./hooks";
import { REALTIME_EVENTS, REALTIME_NAMESPACE, useNamespaceSocket, useRealtimeEvent, useRealtimeManager, useRealtimeSocket } from "@/features/realtime";
import { useSession } from "next-auth/react";


export function NotificationRealtimeSync() {
    const { data: user } = useSession();
    const queryClient = useQueryClient();

    const { getNamespaceSocket, connected } = useRealtimeManager()
    const { socket } = useNamespaceSocket(REALTIME_NAMESPACE.NOTIFICATIONS)

    useEffect(() => {
        if (!connected) return;
        getNamespaceSocket(REALTIME_NAMESPACE.NOTIFICATIONS)?.on(REALTIME_EVENTS.NOTIFICATION_NEW, (data) => {
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
            socket?.emit(REALTIME_EVENTS.NOTIFICATION_ACKNOWLEDGE, { message: 'Notification acknowledged', notificationId: data.id });
        })

        getNamespaceSocket(REALTIME_NAMESPACE.COMMUNITY)?.on(REALTIME_EVENTS.NOTIFICATION_NEW, (data) => {
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
            getNamespaceSocket(REALTIME_NAMESPACE.NOTIFICATIONS)?.off(REALTIME_EVENTS.NOTIFICATION_NEW);
            getNamespaceSocket(REALTIME_NAMESPACE.COMMUNITY)?.off(REALTIME_EVENTS.NOTIFICATION_NEW);
        }
    }, [connected])
    return null;
}
