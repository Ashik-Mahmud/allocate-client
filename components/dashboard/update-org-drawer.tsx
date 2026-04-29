"use client"
import React from 'react'
import AllocateDrawer from '../shared/allocate-drawer';
import UpdateOrganization from '@/components/dashboard/profile/update-org';
import { Organizations } from '@/types/organization';
import { Loader2, Save } from 'lucide-react';

type Props = {
    organization?: Partial<Organizations> | null;
}

const UpdateOrganizationDrawer = ({ organization }: Props) => {
    const [open, setOpen] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const handleUpdateOrg = (data: Partial<Organizations>) => {
        // Handle organization update logic here
        console.log("Updated Organization Data:", data);
        // After successful update, you can close the drawer
        setOpen(false);
    }
    return (
        <div>
            <AllocateDrawer open={open} onOpenChange={setOpen} title="Update Organization" description="Update your organization details" position="bottom" className="max-w-5xl" showHeader={false} showHandler={false}
            footer={
                <div className="flex items-center justify-end ">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary/80 cursor-pointer disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                    Save organization settings
                </button>
            </div>
            }
            >
                <UpdateOrganization
                    data={organization ?? undefined}
                    onSubmit={handleUpdateOrg}
                    isLoading={false}
                />
            </AllocateDrawer>
        </div>
    )
}

export default UpdateOrganizationDrawer