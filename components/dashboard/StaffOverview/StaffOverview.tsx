"use client"
import { useDashboardOverview } from '@/features/dashboard/hooks'
import React from 'react'

type Props = {}

const StaffDashboardOverview = (props: Props) => {
    const { data } = useDashboardOverview()
    console.log(data?.data)
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Staff Overview</h1>
            <p className="text-sm text-slate-500">This is where you can find insights and quick links based on your role.</p>
        </div>
    )
}

export default StaffDashboardOverview