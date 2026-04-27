import { auth } from "@/auth";
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
    redirect(ROUTES.dashboard);
  }
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
       <ThemeToggle />
      <section className="w-full max-w-md rounded-2xl border border-slate-200/70 bg-white/85 p-6 shadow-xl shadow-slate-900/10 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/70 dark:shadow-black/35">
        {children}
      </section>
    </main>
  );
}
