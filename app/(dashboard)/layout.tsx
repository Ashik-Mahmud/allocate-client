import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { ROUTES } from "@/lib/constants/routes";
import { normalizeRole } from "@/lib/constants/roles";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect(ROUTES.signIn);
  }

  const dashboardUser = {
    id: (session.user as { id?: string | null })?.id ?? undefined,
    name: session.user?.name,
    email: session.user?.email,
    role: normalizeRole((session.user as { role?: string | null })?.role),
    credits: (session.user as { credits?: number | null })?.credits ?? null,
    unreadNotifications:
      (session.user as { unreadNotifications?: number | null })?.unreadNotifications ?? null,
    notifications:
      (session.user as {
        notifications?: Array<{
          id?: string;
          title?: string;
          message?: string;
          read?: boolean;
        }>;
      })?.notifications ?? [],
  };

  return (
    <div className="relative h-dvh overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.18),transparent_46%),linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.94))] dark:bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.12),transparent_46%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.92))]" />

      <div className="grid h-full md:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
        <DashboardSidebar user={dashboardUser} />

        <main className="min-w-0 overflow-hidden border-l border-slate-200/70 bg-white/55 dark:border-slate-800/70 dark:bg-slate-900/40">
          <div className="flex h-full min-h-0 flex-col pt-20 md:pt-0">
            <div className="">
              <DashboardTopbar user={dashboardUser} />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none]  md:pb-5 [&::-webkit-scrollbar]:hidden">
              <div className="min-h-full border border-white/70 bg-white/80 p-4 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/75 md:p-8">
                {children}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
