"use client"

import VerifyLoggedInUser from '@/components/shared/verify-user';
import { useCurrentUserContext } from '@/features/auth';
import React from 'react'
import { ResourcesPanel } from './resources-panel';
import Loader from '@/components/shared/loader';
import { Skeleton } from 'boneyard-js/react'
import AllocateDrawer from '@/components/shared/allocate-drawer';

type Props = {}

const ResourcesMain = (props: Props) => {
    const { user, isFetching, isLoading } = useCurrentUserContext();

    if (isLoading || isFetching) {
        return (
            <Loader type="component" />
        );
    }

    if (!user?.is_verified) {
        return (
            <VerifyLoggedInUser className="mx-auto w-full" pageName="Resources Management" type="page" />
        );
    }

    return (
        <div className="relative">
           
            <Skeleton name="resources-main" loading={isLoading}>
                <div className="space-y-4">
                    <div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                                Resources Management
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Manage organization resources, availability, and booking rules.
                            </p>
                        </div>

                    </div>
                    <ResourcesPanel />
                </div>
            </Skeleton>
        </div>
    );
}

export default ResourcesMain