"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCurrentUser, useSignOut } from "@/features/auth";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

import SidebarContent from "./sidebarContent";

export function DashboardSidebar() {
  const { user } = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();
  const signOut = useSignOut();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const sidebarTitle = useMemo(() => {
    if (user?.name?.trim()) {
      return user.name.trim();
    }

    return user?.email?.trim() ?? "Dashboard";
  }, [user]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  const handleSignOut = async () => {
    setMobileOpen(false);
    setSigningOut(true);

    try {
      await signOut();
      router.replace(ROUTES.signIn);
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 border-b border-white/70 bg-white/85 px-4 py-3 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/85 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50 text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Open dashboard menu"
          >
            <Menu className="size-5" />
          </button>

          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{sidebarTitle}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Dashboard workspace</p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleSignOut}
            disabled={signingOut}
            aria-label="Sign out"
            className="rounded-2xl border border-slate-200/80 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>

      <aside className="hidden md:block md:sticky md:h-[calc(100dvh)] md:self-start">
        <SidebarContent
          user={user}
          pathname={pathname}
          onNavigate={undefined}
          onSignOut={handleSignOut}
          signingOut={signingOut}
        />
      </aside>

      <div className={cn("fixed inset-0 z-50 md:hidden", mobileOpen ? "pointer-events-auto" : "pointer-events-none")}>
        <button
          type="button"
          aria-label="Close dashboard menu"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "absolute inset-0 bg-slate-950/45 backdrop-blur-[2px] transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
        />

        <aside
          className={cn(
            "absolute left-0 top-0 h-full w-[min(88vw,22rem)] transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col gap-4 bg-transparent p-4">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/95 px-4 py-3 shadow-xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/95">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Dashboard</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Navigation menu</p>
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50 text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-label="Close dashboard menu"
              >
                <X className="size-4" />
              </button>
            </div>

            <SidebarContent
              user={user}
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
              onSignOut={handleSignOut}
              signingOut={signingOut}
              compact
            />
          </div>
        </aside>
      </div>
    </>
  );
}
