import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { ROUTES } from "@/lib/constants/routes";
import { normalizeRole } from "@/lib/constants/roles";
import { useCurrentUser } from "@/features/auth";

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
    <div className="h-dvh overflow-hidden bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="grid h-full md:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
        <DashboardSidebar  />

        <main className="min-w-0 overflow-hidden border-l border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-full min-h-0 flex-col pt-20 md:pt-0">
            <div className="border-b border-slate-200 bg-white px-3 py-1 dark:border-slate-800 dark:bg-slate-950 md:px-5 md:py-1">
              <DashboardTopbar />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3 [scrollbar-width:none] md:p-3 [&::-webkit-scrollbar]:hidden">
              <div className="min-h-full rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 md:p-8">
                {children}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
