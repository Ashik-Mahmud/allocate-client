import { redirect } from "next/navigation";

import { auth } from "@/auth";
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
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex w-full  flex-col gap-6 px-4 pb-6 pt-20 md:grid md:grid-cols-[320px_minmax(0,1fr)] md:px-6 md:pt-6">
        <DashboardSidebar user={dashboardUser} />
        <main className="min-w-0 rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/75 md:p-8">
          {children}
        </main>
      </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.18),transparent_46%),linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.94))] dark:bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.12),transparent_46%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.92))]" />
    </div>
  );
}
