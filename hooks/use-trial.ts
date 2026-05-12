import { useCurrentUser } from '@/features/auth';
import React from 'react'

type Props = {}

const useTrialAvailable = () => {
    const { user, isLoading } = useCurrentUser();
    const organization = user?.organization;
    const isTrialAllowed = organization?.isTrialAllowed;
    const hasUsedTrial = organization?.hasUsedTrial;
    const trialStartAt = organization?.trialStartAt;
    const trialEndAt = organization?.trialEndsAt;
    return {
        organization,
        isTrialAllowed,
        hasUsedTrial,
        trialStartAt,
        trialEndAt,
        isTrialAvailable: isTrialAllowed && !hasUsedTrial,
        isLoading
    }
}

export default useTrialAvailable