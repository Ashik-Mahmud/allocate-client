import { auth } from '@/auth'
import SystemAdminOverView from '@/components/dashboard/AdminOverview/SystemAdminOverView';
import OrgDashboardOverview from '@/components/dashboard/OrgOverview/OrgOverview';
import StaffDashboardOverview from '@/components/dashboard/StaffOverview/StaffOverview';
import { Role } from '@/types';
import React from 'react'

type Props = {}

const SystemAdminOverviewPage = async (props: Props) => {
  // show overview based on role
  const session = await auth();

  switch (session?.user?.role) {
    case Role.ADMIN:
      return (
        <SystemAdminOverView />
      )
    case Role.ORG_ADMIN:
      return (
        <OrgDashboardOverview />
      )
    case Role.STAFF:
      return (
        <StaffDashboardOverview />
      )
    default:
      return (
        <div className="p-4 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 h-75 flex items-center justify-center">
          <p className="text-sm text-slate-500">Welcome to the dashboard overview, {session?.user?.name}! This is where you can find insights and quick links based on your role.</p>
        </div>
      )
  }
}

export default SystemAdminOverviewPage