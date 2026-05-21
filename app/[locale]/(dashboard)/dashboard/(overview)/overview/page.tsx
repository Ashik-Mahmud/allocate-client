import { auth } from '@/auth';
import OrgDashboardMain from '@/components/dashboard/OrgOverview/OrgDashboardMain';
import StaffDashboardOverview from '@/components/dashboard/StaffOverview/StaffOverview';
import SystemAdminOverView from '@/components/systemDashboard/AdminOverview/SystemAdminOverView';
import { Role } from '@/types';

type Props = {}

export const metadata = {
    title: "Dashboard Overview",
    description: "Welcome to your dashboard overview, where you can quickly access insights and key features tailored to your role. Stay informed and manage your activities efficiently from this central hub.",
}

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
        <OrgDashboardMain />
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