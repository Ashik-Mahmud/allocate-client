import { ApiResponse, PaginatedResponse } from "@/types";
import { apiRequest } from "./http";
import { CommunityHub, CommunityPostFilter, PostCommunityFormData } from "@/types/community";


// Service to post a new community post
export const postCommunityPost = async (data: PostCommunityFormData) => {
    return apiRequest<ApiResponse<CommunityHub>>(`/community/post`, {
        method: "POST",
        body: JSON.stringify(data),
    });
}


// Service to update an existing community post
export const updateCommunityPost = async (postId: string, data: PostCommunityFormData) => {
    return apiRequest<ApiResponse<CommunityHub>>(`/community/post/${postId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

// Service to fetch all community posts for the overview page
export const fetchCommunityPostsOverview = async (filter: CommunityPostFilter) => {
    const query = new URLSearchParams();
    if (filter.postType) query.append("postType", filter.postType);
    if (filter.status) query.append("status", filter.status);
    if (filter.authorId) query.append("authorId", filter.authorId);
    if (filter.isPrivate !== null) query.append("isPrivate", String(filter.isPrivate));
    if (filter.search) query.append("search", filter.search);
    if (filter.page) query.append("page", String(filter.page));
    if (filter.limit) query.append("limit", String(filter.limit));

    return apiRequest<PaginatedResponse<CommunityHub>>(`/community/posts?${query.toString()}`, {
        method: "GET",
    });
}

// Service to fetch a single community post by ID
export const fetchCommunityPostById = async (postId: string) => {
    return apiRequest<ApiResponse<CommunityHub>>(`/community/post/${postId}`, {
        method: "GET",
    });
}

// Service to fetch my community posts
export const fetchMyCommunityPosts = async (filter: CommunityPostFilter) => {
    const query = new URLSearchParams();
    if (filter.postType) query.append("postType", filter.postType);
    if (filter.status) query.append("status", filter.status);
    if (filter.isPrivate !== null) query.append("isPrivate", String(filter.isPrivate));
    if (filter.search) query.append("search", filter.search);
    if (filter.page) query.append("page", String(filter.page));
    if (filter.limit) query.append("limit", String(filter.limit));

    return apiRequest<PaginatedResponse<CommunityHub>>(`/community/my-posts?${query.toString()}`, {
        method: "GET",
    });
}

// Service to delete a community post
export const deleteCommunityPost = async (postId: string, isPermanent?: boolean) => {
    return apiRequest<ApiResponse<{ success: boolean }>>(`/community/post/${postId}/delete?isPermanent=${isPermanent || false}`, {
        method: "DELETE",
    });
}

// Service to restore a deleted community post
export const restoreCommunityPost = async (postId: string) => {
    return apiRequest<ApiResponse<{ success: boolean }>>(`/community/post/${postId}/restore`, {
        method: "PATCH",
    });
}

// Service to acknowledge a community post
export const acknowledgeCommunityPost = async (postId: string) => {
    return apiRequest<ApiResponse<{ success: boolean }>>(`/community/post/${postId}/acknowledge`, {
        method: "POST",
    });
}

// Service to add a comment to a community post
export const addCommentToCommunityPost = async (postId: string, commentText: string) => {
    return apiRequest<ApiResponse<{ success: boolean }>>(`/community/post/${postId}/comment`, {
        method: "POST",
        body: JSON.stringify({ content: commentText }),
    });
}

// Service to delete a comment from a community post
export const deleteCommentFromCommunityPost = async (commentId: string) => {
    return apiRequest<ApiResponse<{ success: boolean }>>(`/community/comment/${commentId}/delete`, {
        method: "DELETE",
    });
}

// Service to get community overview data for the dashboard
export const fetchCommunityOverview = async () => {
    return apiRequest<ApiResponse<{authors: any, acknowledgedPosts: any, isExpired: boolean, isFree: boolean,trialEndDate: string}>>(`/community/community-activities`, {
        method: "GET",
    });
}