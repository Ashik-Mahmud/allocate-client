"use client"
import { useCurrentUser } from '@/features/auth'
import { SUBSCRIPTION_LIMITS } from '@/lib/constants/subscription'
import React from 'react'

type Props = {}

const PlanLimitExceed = (props: Props) => {
    const {MAX_RESOURCES, MAX_USERS} = SUBSCRIPTION_LIMITS.FREE;
    const {user} = useCurrentUser();
    console.log(user?.organization?.plan_type)
    
    return (
        <div>PlanLimitExceed</div>
    )
}

export default PlanLimitExceed