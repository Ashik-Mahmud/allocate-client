import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { ROUTES } from "@/lib/constants/routes";
import { Toaster } from "@/components/ui/sonner";
import AllocateDrawer from "@/components/shared/allocate-drawer";
import UpdateProfile from "@/components/dashboard/profile/update-profile";
import UpdateOrganizationDrawer from "@/components/dashboard/update-org-drawer";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect(ROUTES.signIn);
  }



  return (
    <div className="h-dvh  bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {
        session?.user?.organization?.needUpdateOrg && (
          <UpdateOrganizationDrawer organization={session.user.organization} />
        )
      }


      <div className="grid h-full md:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
        <DashboardSidebar />


        <main className="min-w-0  border-l border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-full min-h-0 flex-col pt-20 md:pt-0">
            <div className="border-b border-slate-200 bg-white px-3 py-1 dark:border-slate-800 dark:bg-slate-950 md:px-5 md:py-1">
              <DashboardTopbar />
            </div>

            <div className="h-full flex-1   p-4">
              <div className="h-full relative overflow-auto border rounded-2xl border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="min-h-full w-full h-full md:absolute inset-0 p-4 md:p-6">
                  {children}
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}
