"use client"
import AllocateDrawer from '@/components/shared/allocate-drawer'
import React from 'react'

type Props = {}

const UpdateProfile = (props: Props) => {

    const [open, setOpen] = React.useState(true);
    return (
        <div>
            <AllocateDrawer open={open} onOpenChange={() => { 
                setOpen(false);
            }} title="Allocate" description="Allocate resources to your projects" position="bottom" >
                {/* This is where you can add content to the AllocateDrawer if needed */}
                <span>Allocate Drawer Content</span>
            </AllocateDrawer>
        </div>
    )
}

export default UpdateProfile