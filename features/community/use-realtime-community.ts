import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { REALTIME_EVENTS, REALTIME_NAMESPACE, useRealtimeManager } from '@/features/realtime';
import { CommunityKeys } from '@/features/community';
import { CommunityHub, CommunityHubStatus } from '@/types/community';

export const useCommunityRealtime = () => {
    const queryClient = useQueryClient();
    const { getNamespaceSocket, connected } = useRealtimeManager();

    useEffect(() => {
        if (!connected) return;

        const socket = getNamespaceSocket(REALTIME_NAMESPACE.COMMUNITY);
        if (!socket) return;


        const handleNewOrUpdatedPost = (newData: CommunityHub) => {
            // console.log("Realtime community post event received:", newData);
            queryClient.setQueriesData({ queryKey: CommunityKeys.overview() }, (oldData: any) => {

                if (!oldData || !oldData.data || !Array.isArray(oldData.data)) {
                    return oldData;
                }

                const existingIndex = oldData.data.findIndex((post: CommunityHub) => post.id === newData.id);

                let updatedList = [...oldData.data];
                let totalCountAdjustment = 0;

                if (existingIndex !== -1) {
                    if (
                        newData?.status !== CommunityHubStatus.PUBLISHED
                    ) {
                        updatedList.splice(existingIndex, 1);
                        totalCountAdjustment = -1;
                    } else {
                        updatedList[existingIndex] = newData;
                    }
                } else {
                    updatedList = [newData, ...updatedList];
                    totalCountAdjustment = 1;
                }

                return {
                    ...oldData,
                    data: updatedList,
                    pagination: {
                        ...oldData?.pagination,
                        total: oldData?.pagination?.total
                            ? oldData.pagination.total + totalCountAdjustment
                            : updatedList.length,
                    }
                };
            });
        };

        socket.on(REALTIME_EVENTS.COMMUNITY_POST_NEW, handleNewOrUpdatedPost);

        return () => {
            socket.off(REALTIME_EVENTS.COMMUNITY_POST_NEW, handleNewOrUpdatedPost);
        };
    }, [connected, getNamespaceSocket, queryClient]);
};