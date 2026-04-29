import { deleteNotification, getAllNotifications, getUnreadNotificationsCount, markAllNotificationsAsRead, markNotificationAsRead } from "@/lib/services/notification";
import { notificationFilters } from "@/types/notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const notificationsKeys = {
    all: ["notifications"] as const,
    lists: (filters: notificationFilters) => [...notificationsKeys.all, "list", filters] as const,
    list: (id: string) => [...notificationsKeys.lists({}), id] as const,
}
export const useGetNotification = (filters: notificationFilters) => {
    return useQuery({
        queryKey: notificationsKeys.lists(filters),
        queryFn: () => getAllNotifications(filters),
    })
}


export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ notificationId }: { notificationId: string }) => markNotificationAsRead(notificationId),
        onSuccess: async () => {
            // Invalidate and refetch notifications after marking as read
            await queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
        }
    })
}

export const useMarkAllNotificationsAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => markAllNotificationsAsRead(),
        onSuccess: async () => {
            // Invalidate and refetch notifications after marking all as read
            await queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
        }
    })
}

export const useDeleteNotification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ notificationId }: { notificationId: string }) => deleteNotification(notificationId),
        onSuccess: async () => {
            // Invalidate and refetch notifications after deletion
            await queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
        }
    })
}


export const useClearAllNotifications = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => markAllNotificationsAsRead(),
        onSuccess: async () => {
            // Invalidate and refetch notifications after clearing all
            await queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
        }
    })
}

export const useGetUnreadNotificationsCount = () => {
    return useQuery({
        queryKey: ["notifications", "unread-count"],
        queryFn: () => getUnreadNotificationsCount(),
    })
}