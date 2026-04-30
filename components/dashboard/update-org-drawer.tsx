"use client"
import React from 'react'
import AllocateDrawer from '../shared/allocate-drawer';
import UpdateOrganization from '@/components/dashboard/profile/update-org';
import { Organizations } from '@/types/organization';
import { useUpdateOrganization } from '@/features/organization';
import { toast } from 'sonner';
import { Loader, Save } from 'lucide-react';
import { useCurrentUser } from '@/features/auth';
import { set } from 'zod';
import { Role } from '@/types';

type Props = {
    organization?: Partial<Organizations> | null;
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
}

const UpdateOrganizationDrawer = ({ organization, isOpen , setIsOpen }: Props) => {
    const { user, isLoading } = useCurrentUser();
    const [open, setOpen] = React.useState(true);
    const formId = React.useId();
    const organizationFn = useUpdateOrganization();
    const handleUpdateOrg = async (data: Partial<Organizations>) => {
        // After successful update, you can close the drawer
        const result = await organizationFn.mutateAsync({ payload: data });
        if (result.success) {
            setOpen(false);
            setIsOpen && setIsOpen(false);
            toast.success("Organization updated successfully");
        }
    }

    if (((user?.organization?.needUpdateOrg === false || isLoading || !user?.organization || user?.role !== Role.ORG_ADMIN) ) && !isOpen  ) {
        return null;
    }
    return (
        <div>
            <AllocateDrawer open={open || isOpen || false} onOpenChange={()=>{
                setOpen(false);
                if(setIsOpen) {
                    setIsOpen(false);
                }
            }} title="Update Organization" description="Update your organization details" position="bottom" className="max-w-5xl" showHeader={false} showHandler={false}
                footer={
                    <div> {
                        organizationFn?.isError && (
                            <div className="mb-4 rounded-lg bg-red-50 p-4">
                                <p className=" text-sm text-red-700">{(organizationFn?.error as Error)?.message || "Something went wrong"}</p>
                            </div>
                        )
                    }
                        <div className="flex items-center justify-end ">

                            <button
                                form={formId}
                                type="submit"
                                className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary/80 cursor-pointer disabled:opacity-50 gap-1"
                                disabled={organizationFn.isPending}
                            >
                                {/* Add spinner here otherwise save icon from lucid icon */}
                                {
                                    organizationFn.isPending ? (
                                        <Loader className="animate-spin size-4" />
                                    ) : (
                                        <Save className="size-4" />
                                    )
                                }

                                {organizationFn.isPending ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                }
            >

                <UpdateOrganization
                    data={user?.organization ?? undefined}
                    onSubmit={handleUpdateOrg}
                    formId={formId}

                />
            </AllocateDrawer>
        </div>
    )
}

export default UpdateOrganizationDrawer