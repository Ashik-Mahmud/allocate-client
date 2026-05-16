import { acknowledgeCommunityPost, addCommentToCommunityPost, deleteCommentFromCommunityPost, deleteCommunityPost, fetchCommunityOverview, fetchCommunityPostById, fetchMyCommunityPosts, postCommunityPost, restoreCommunityPost, updateCommunityPost } from "@/lib/services/community";
import { CommunityPostFilter, PostCommunityFormData } from "@/types/community";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const CommunityKeys = {
    all: ["communities"] as const,
    overview: () => [...CommunityKeys.all, "overview"] as const,
    myPosts: () => [...CommunityKeys.all, "my-posts"] as const,
};


// Hook to post a new community post
export const usePostCommunityMutation = () => {
    // Implement the mutation logic here
    const client = useQueryClient();
    return useMutation({
        mutationFn: async (data: PostCommunityFormData) => postCommunityPost(data),
        onSuccess: () => {
            // Invalidate and refetch community overview data
            void client.invalidateQueries({ queryKey: CommunityKeys.all });
        },
    });
}

// Hook to update an existing community post
export const useUpdateCommunityMutation = () => {
    // Implement the mutation logic here
    const client = useQueryClient();
    return useMutation({
        mutationFn: async ({ postId, data }: { postId: string, data: PostCommunityFormData }) => updateCommunityPost(postId, data),
        onSuccess: () => {
            // Invalidate and refetch community overview data
            void client.invalidateQueries({ queryKey: CommunityKeys.all });
        },
    });
}

// Hook to fetch community posts
export const useCommunityPostsQuery = (filter: CommunityPostFilter) => {
    // Implement the query logic here
    return useQuery({
        queryKey: [...CommunityKeys.overview(), filter],
        queryFn: async () => fetchCommunityOverview(filter),
    });
}

// Hook to fetch a single community post by ID
export const useCommunityPostQuery = (postId: string) => {
    return useQuery({
        queryKey: [...CommunityKeys.all, postId],
        queryFn: async () => fetchCommunityPostById(postId),
        enabled: Boolean(postId),
    });
}

// Hook to delete a community post 
export const useDeleteCommunityMutation = () => {
    const client = useQueryClient();
    return useMutation({
        mutationFn: async (postId: string) => deleteCommunityPost(postId),
        onSuccess: async () => {
            // Invalidate and refetch community overview data
            await Promise.all([
                void client.invalidateQueries({ queryKey: CommunityKeys.all }),
                void client.invalidateQueries({ queryKey: CommunityKeys.overview() }),
            ]);
        }
    });
}

// Hook to restore a deleted community post 
export const useRestoreCommunityMutation = () => {
    const client = useQueryClient();
    return useMutation({
        mutationFn: async (postId: string) => restoreCommunityPost(postId),
        onSuccess: () => {
            // Invalidate and refetch community overview data
            void client.invalidateQueries({ queryKey: CommunityKeys.all });
        }
    });
}

// Hook to my community posts
export const useMyCommunityPostsQuery = (filter: CommunityPostFilter) => {
    return useQuery({
        queryKey: [...CommunityKeys.myPosts(), filter],
        queryFn: async () => fetchMyCommunityPosts(filter),
    });
}

// Hook to leave a comment on a community post
export const useAddCommentToCommunityPostMutation = (postId: string) => {
    // Implement the mutation logic here
    const client = useQueryClient();
    return useMutation({
        mutationFn: async (commentText: string) => addCommentToCommunityPost(postId, commentText),
        onSuccess: () => {
            // Invalidate and refetch the specific community post data to show the new comment
            void client.invalidateQueries({ queryKey: [...CommunityKeys.all, postId] });
        }
    });
}

// Hook to acknowledge a community post
export const useAcknowledgeCommunityPostMutation = () => {
    // Implement the mutation logic here
    const client = useQueryClient();
    return useMutation({
        mutationFn: async (postId: string) => acknowledgeCommunityPost(postId),
        onSuccess: async () => {
            await Promise.all([
                // Invalidate and refetch the specific community post data to reflect the acknowledgment
                void client.invalidateQueries({ queryKey: [...CommunityKeys.all] }),
                void client.invalidateQueries({ queryKey: [...CommunityKeys.overview()] }),
            ]);
        }
    });
}

// Hook to delete a comment from a community post
export const useDeleteCommentFromCommunityPostMutation = ( ) => {
    // Implement the mutation logic here
    const client = useQueryClient();
    return useMutation({
        mutationFn: async (commentId: string) => deleteCommentFromCommunityPost(commentId),
        onSuccess: () => {
            // Invalidate and refetch the specific community post data to reflect the deleted comment
            void client.invalidateQueries({ queryKey: [...CommunityKeys.all] });
        }
    });
}