import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { REALTIME_EVENTS, REALTIME_NAMESPACE, useRealtimeManager } from '@/features/realtime';
import { CommunityKeys } from '@/features/community';
import { CommunityHub, CommunityHubStatus } from '@/types/community';

export const useCommunityCommentingRealTime = (postId: string) => {
    const queryClient = useQueryClient();
    const { getNamespaceSocket, connected } = useRealtimeManager();

    useEffect(() => {
        if (!connected || !postId) return;

        const socket = getNamespaceSocket(REALTIME_NAMESPACE.COMMUNITY);
        if (!socket) return;

        socket.emit(REALTIME_EVENTS.JOIN_POST_ROOM, postId);
        const handleNewOrUpdateComment = (newComment: any) => {
            // console.log("Single post new comment received:", newComment);
            queryClient.setQueriesData({ queryKey: CommunityKeys.post(postId) }, (oldData: any) => {
                if (!oldData) return oldData;

                const postDetails = oldData.data;
                const currentComments = postDetails.comments || [];

                if (newComment?.isDeleted) {
                    return {
                        ...oldData,
                        data: {
                            ...postDetails,
                            comments: currentComments.filter((comment: any) => comment.id !== newComment.id)
                        }
                    };
                }

                const existingCommentIndex = currentComments.findIndex(
                    (comment: any) => comment.id === newComment.id
                );

                let updatedComments = [...currentComments];

                if (existingCommentIndex !== -1) {
                    updatedComments[existingCommentIndex] = {
                        ...updatedComments[existingCommentIndex],
                        ...newComment
                    };
                } else {
                    updatedComments = [...updatedComments, newComment];
                }


                return {
                    ...oldData,
                    data: {
                        ...postDetails,
                        comments: updatedComments,
                        updatedAt: new Date().toISOString()
                    }
                };
            });
        };

        socket.on(REALTIME_EVENTS.COMMUNITY_COMMENT_NEW, handleNewOrUpdateComment);

        return () => {
            socket.emit(REALTIME_EVENTS.LEAVE_POST_ROOM, postId);
            socket.off(REALTIME_EVENTS.COMMUNITY_COMMENT_NEW, handleNewOrUpdateComment);
        };
    }, [connected, getNamespaceSocket, queryClient, postId]);
};