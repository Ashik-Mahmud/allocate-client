import { useCurrentUser } from '@/features/auth';
import { PlanType } from '@/types/organization';
import React from 'react'

type Props = {}

const useSubscription = () => {
    const { user, isLoading, } = useCurrentUser()
    return {
        planType: user?.organization?.plan_type,
        isPaid: user?.organization?.plan_type !== PlanType.FREE,
        isLoading,
        credit_pool: user?.organization?.credit_pool || 0,
    }
}

export default useSubscription