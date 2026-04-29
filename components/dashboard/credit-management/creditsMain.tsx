"use client"
import React from 'react'
import AssignCredits from './assignCredits'
import { useCurrentUser } from '@/features/auth'

type Props = {}

const CreditManagementMain = (props: Props) => {
    const {user} = useCurrentUser();
    const [assignOpen, setAssignOpen] = React.useState(false);
    const onSubmit = (data: any) => {
        console.log("Form Data: ", data);
        // Here you would call your mutation to assign credits
    }
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold m">Credit Management</h1>
                <p >Manage your organization's credits, view credit usage, and allocate credits to your team members.</p>
            </div>
            <button
                onClick={() => setAssignOpen(true)}
                className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary/80 cursor-pointer disabled:opacity-50 gap-1">
                Allocate Credits
            </button>
            <AssignCredits
                open={assignOpen}
                onOpenChange={setAssignOpen}
                selectedStaffIds={[]} // You can pass selected staff IDs here based on your implementation
                onSubmit={onSubmit}
                isLoading={false}
                orgCreditPool={user?.organization?.credit_pool || 0}
            />
        </div>
    )
}

export default CreditManagementMain