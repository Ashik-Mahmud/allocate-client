"use client"
import React from 'react'
import AllocateDrawer from '../shared/allocate-drawer';
import UpdateOrganization from './profile/update-org';
import { Organizations } from '@/types/organization';

type Props = {}

const UpdateOrganizationDrawer = (props: Props) => {
    const [open, setOpen] = React.useState(true);

    const handleUpdateOrg = (data: Partial<Organizations>) => {
        // Handle organization update logic here
        console.log("Updated Organization Data:", data);
        // After successful update, you can close the drawer
        setOpen(false);
    }
    return (
        <div>
            <AllocateDrawer open={open} onOpenChange={() => {
                setOpen(false);
            }} title="Update Organization" description="Update your organization details" position="bottom" 
            footer={
                <div />
            }
            >
                {/* This is where you can add content to the AllocateDrawer if needed */}
                <UpdateOrganization
                    data={{}}
                    onSubmit={handleUpdateOrg}
                    isLoading={false}
                />
            </AllocateDrawer>
        </div>
    )
}

export default UpdateOrganizationDrawer