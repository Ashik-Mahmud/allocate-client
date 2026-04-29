import { Notification, notificationFilters } from "@/types/notification";
import { apiRequest } from "./http";
import { PaginatedResponse } from "@/types";


export const getAllNotifications = async (filters: notificationFilters) => {
    const queryParams = new URLSearchParams();
    if (filters.limit) queryParams.append("limit", filters.limit.toString());
    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.is_read !== undefined) queryParams.append("is_read", filters.is_read.toString());
    if (filters.search) queryParams.append("search", filters.search);

    return apiRequest<PaginatedResponse<Notification>>(`/inbox/notifications?${queryParams.toString()}`, {
        method: "GET",
    });
};

export const markNotificationAsRead = async (notificationId: string) => {
    return apiRequest(`/inbox/notifications/${notificationId}/read`, {
        method: "PATCH",
    });
}

// read all notifications
export const markAllNotificationsAsRead = async () => {
    return apiRequest(`/inbox/notifications/read-all`, {
        method: "PATCH",
    });
}

// delete a notification
export const deleteNotification = async (notificationId: string) => {
    return apiRequest(`/inbox/notifications/${notificationId}/delete`, {
        method: "DELETE",
    });
}

// clear all notifications
export const clearAllNotifications = async () => {
    return apiRequest(`/inbox/notifications/clear`, {
        method: "DELETE",
    });
}

// get unread notifications count
export const getUnreadNotificationsCount = async () => {
    return apiRequest<{ count: number }>(`/inbox/notifications/unread-count`, {
        method: "GET",
    });
}