import { auth } from "@/auth";
import MaintenanceAlert from "@/components/shared/MaintenanceAlert";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ROUTES } from "@/lib/constants/routes";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (session?.user?.email) {
    redirect(ROUTES.dashboardCommon.overview);
  }
  return (
    <main className="relative min-h-screen overflow-hidden ">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_12%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_28%),radial-gradient(circle_at_82%_18%,color-mix(in_oklab,var(--color-brand-secondary)_10%,transparent),transparent_26%),linear-gradient(180deg,rgba(248,250,252,1)_0%,rgba(241,245,249,0.96)_44%,rgba(226,232,240,0.88)_100%)] dark:bg-[radial-gradient(circle_at_18%_12%,color-mix(in_oklab,var(--primary)_20%,transparent),transparent_28%),radial-gradient(circle_at_82%_18%,color-mix(in_oklab,var(--color-brand-secondary)_16%,transparent),transparent_26%),linear-gradient(180deg,rgba(2,6,23,1)_0%,rgba(15,23,42,0.98)_52%,rgba(3,7,18,1)_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b from-white/70 to-transparent dark:from-slate-950/50" />

      <div className="absolute right-5 top-5 z-20 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl items-center justify-center">
        <section className="w-full">
          <MaintenanceAlert view="alert" className="mb-4" />
          {children}
        </section>
      </div>
    </main>
  );
}
