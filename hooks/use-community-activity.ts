"use client"
import { useCommunityOverviewQuery } from '@/features/community';
import React from 'react'

type Props = {}

const useCommunityActivity = () => {
    const { data, isLoading } = useCommunityOverviewQuery();


    return {
        isTrialExpired: data?.data?.isExpired,
        isOnFreePlan: data?.data?.isFree,
        isLoading: isLoading,
        trialEndDate: data?.data?.trialEndDate
    }
}

export default useCommunityActivity