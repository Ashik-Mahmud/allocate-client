import React from 'react'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_ROLES } from "@/lib/constants/roles";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import { ArrowRight, BriefcaseBusiness, CalendarCheck, LogOut, PanelLeftOpen, ShieldCheck, Sparkles, UserCog, Users } from 'lucide-react';
import type { User } from '@/types';

type Props = {
    user: User | null;
    pathname: string;
    onNavigate?: () => void;
    onSignOut: () => void;
    signingOut: boolean;
    compact?: boolean;
}

type NavItem = {
    label: string;
    description: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
};

const navigation: NavItem[] = [
    // {
    //     label: "Workspace",
    //     description: "Open your dashboard overview",
    //     href: ROUTES.dashboard,
    //     icon: LayoutDashboard,
    // },

    // {
    //     label: "Public site",
    //     description: "Jump back to the landing page",
    //     href: ROUTES.home,
    //     icon: Globe,
    // },
    // {
    //     label: "Pricing",
    //     description: "Review plans and limits",
    //     href: ROUTES.pricing,
    //     icon: Sparkles,
    // },
];

const adminNavigation: NavItem[] = [
    {
        label: "Admin overview",
        description: "Monitor the full platform state",
        href: ROUTES.dashboardAdmin.overview,
        icon: ShieldCheck,
    },
    {
        label: "Organizations",
        description: "Manage all tenant organizations",
        href: ROUTES.dashboardAdmin.organizations,
        icon: BriefcaseBusiness,
    },
    {
        label: "Users",
        description: "Inspect global user accounts",
        href: ROUTES.dashboardAdmin.users,
        icon: Users,
    },
    {
        label: "Subscriptions",
        description: "Review active subscription plans",
        href: ROUTES.dashboardAdmin.subscriptions,
        icon: Sparkles,
    },
    {
        label: "Settings",
        description: "Control platform-wide settings",
        href: ROUTES.dashboardAdmin.settings,
        icon: UserCog,
    },
];

const orgAdminNavigation: NavItem[] = [
    {
        label: "Resources",
        description: "Manage company resources",
        href: ROUTES.dashboardOrgAdmin.resourcesManagement,
        icon: UserCog,
    },
    {
        label: "Staff management",
        description: "Manage staff assignments",
        href: ROUTES.dashboardOrgAdmin.staffManagement,
        icon: Users,
    },
    {
        label: "Booking management",
        description: "Control booking operations",
        href: ROUTES.dashboardOrgAdmin.bookingManagement,
        icon: BriefcaseBusiness,
    },
    {
        label: "Booking stats",
        description: "Track organization booking metrics",
        href: ROUTES.dashboardOrgAdmin.bookingStats,
        icon: CalendarCheck,
    },

];

const staffNavigation: NavItem[] = [
    {
        label: "Work queue",
        description: "See your assigned work",
        href: ROUTES.dashboardStaff.workQueue,
        icon: BriefcaseBusiness,
    },
    {
        label: "Daily plan",
        description: "Check your day schedule",
        href: ROUTES.dashboardStaff.dailyPlan,
        icon: CalendarCheck,
    },
];

const commonNavigation: NavItem[] = [
    {
        label: "Availability",
        description: "Check available booking slots",
        href: ROUTES.dashboardCommon.bookingAvailability,
        icon: CalendarCheck,
    },
    {
        label: "Bookings",
        description: "Review all booking entries",
        href: ROUTES.dashboardCommon.bookings,
        icon: CalendarCheck,
    },
    {
        label: "My bookings",
        description: "See your personal bookings",
        href: ROUTES.dashboardCommon.myBookings,
        icon: CalendarCheck,
    },
    {
        label: "Resources",
        description: "Browse shared resources",
        href: ROUTES.dashboardCommon.resources,
        icon: BriefcaseBusiness,
    },
    // {
    //     label: "Profile",
    //     description: "Manage your profile details",
    //     href: ROUTES.dashboardCommon.profile,
    //     icon: UserCog,
    // },
];

const SidebarContent = ({
    user,
    pathname,
    onNavigate,
    onSignOut,
    signingOut,
    compact,
}: Props) => {
    const initials = getInitials(user);
    const role = user?.role ?? null;

    const roleNavigation =
        role === APP_ROLES.ADMIN
            ? adminNavigation
            : role === APP_ROLES.ORG_ADMIN
                ? orgAdminNavigation
                : role === APP_ROLES.STAFF
                    ? staffNavigation
                    : [];

    const shouldShowCommonNav = role === APP_ROLES.ORG_ADMIN || role === APP_ROLES.STAFF;
    return (
        <div className="flex h-full min-h-0 flex-col border rounded-2xl md:rounded-none border-slate-200/80 bg-white/90 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80 dark:shadow-black/25">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 pb-4 dark:border-slate-800/70">
                <Link
                    href={ROUTES.dashboard}
                    onClick={onNavigate}
                    className="group flex items-center gap-3"
                >
                    <span className="flex h-11 w-11 items-center justify-center bg-linear-to-br from-primary via-primary to-primary/80 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-transform duration-200 group-hover:-translate-y-0.5 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 dark:text-slate-900 rounded-lg">
                        A
                    </span>
                    <span className="min-w-0">
                        <span className="block text-sm font-semibold tracking-[0.18em] text-slate-900 uppercase dark:text-slate-100">
                            Allocate
                        </span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400">
                            Product workspace
                        </span>
                    </span>
                </Link>

                {!compact ? (
                    <span className="inline-flex rounded-2xl items-center gap-2 border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Live
                    </span>
                ) : null}
            </div>
            <div className="min-h-0 flex-1 overflow-hidden pt-4">
                <nav className="h-full space-y-2 overflow-y-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <p className="sticky top-0 z-10 bg-white/90 px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 backdrop-blur-sm dark:bg-slate-950/80 dark:text-slate-400">
                        Navigation
                    </p>
                    {[...roleNavigation, ...navigation].map((item) => {
                        const Icon = item.icon;
                        const active = isActiveRoute(pathname, item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onNavigate}
                                className={cn(
                                    "group flex items-center gap-3 border px-3 py-3 transition-all duration-200 rounded-lg",
                                    active
                                        ? "border-primary bg-primary text-white shadow-lg shadow-slate-900/15 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                                        : "border-transparent bg-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-800 dark:hover:bg-slate-900/60 dark:hover:text-slate-100"
                                )}
                            >
                                <span
                                    className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-2xl transition-colors",
                                        active
                                            ? "bg-white/10 text-white dark:bg-slate-900 dark:text-slate-100"
                                            : "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
                                    )}
                                >
                                    <Icon className="size-4" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block text-sm font-medium">{item.label}</span>
                                    <span
                                        className={cn(
                                            "block truncate text-xs transition-colors",
                                            active ? "text-white/75 dark:text-slate-600" : "text-slate-500 dark:text-slate-400"
                                        )}
                                    >
                                        {item.description}
                                    </span>
                                </span>
                                <ArrowRight className={cn("size-4 transition-transform group-hover:translate-x-0.5", active ? "text-white/80 dark:text-slate-600" : "text-slate-400")} />
                            </Link>
                        );
                    })}

                    {shouldShowCommonNav ? (
                        <>
                            <p className="px-2 pt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                Common
                            </p>
                            {commonNavigation.map((item) => {
                                const Icon = item.icon;
                                const active = isActiveRoute(pathname, item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onNavigate}
                                        className={cn(
                                            "group flex items-center gap-3 border px-3 py-3 transition-all duration-200 rounded-lg ",
                                            active
                                                ? "border-primary bg-primary text-white shadow-lg shadow-slate-900/15 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                                                : "border-transparent bg-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-800 dark:hover:bg-slate-900/60 dark:hover:text-slate-100"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "flex h-10 w-10 items-center justify-center rounded-2xl transition-colors",
                                                active
                                                    ? "bg-white/10 text-white dark:bg-slate-900 dark:text-slate-100"
                                                    : "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
                                            )}
                                        >
                                            <Icon className="size-4" />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-medium">{item.label}</span>
                                            <span
                                                className={cn(
                                                    "block truncate text-xs transition-colors",
                                                    active ? "text-white/75 dark:text-slate-600" : "text-slate-500 dark:text-slate-400"
                                                )}
                                            >
                                                {item.description}
                                            </span>
                                        </span>
                                        <ArrowRight className={cn("size-4 transition-transform group-hover:translate-x-0.5", active ? "text-white/80 dark:text-slate-600" : "text-slate-400")} />
                                    </Link>
                                );
                            })}
                        </>
                    ) : null}
                </nav>
            </div>

            <div className="space-y-3 border-t border-slate-200/70 pt-4 dark:border-slate-800/70">
                <Link href={ROUTES.dashboardCommon.profile} className="border border-slate-200/70 bg-slate-50/80 px-3 py-3 dark:border-slate-800/70 dark:bg-slate-900/50 rounded-lg inline-block w-full">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center bg-linear-to-br from-primary to-primary/80 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 dark:from-slate-100 dark:to-slate-300 dark:text-slate-900 rounded-lg">
                            {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {user?.name?.trim() || "Workspace user"}
                            </p>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                {user?.email ?? "Signed in session"}
                            </p>
                        </div>
                    </div>
                </Link>

                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={onSignOut}
                    disabled={signingOut}
                    className="w-full justify-between border-slate-200/80 bg-white px-4 text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800/80 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:bg-slate-900/80"
                >
                    <span className="flex items-center gap-2">
                        <LogOut className="size-4" />
                        {signingOut ? "Signing out..." : "Sign out"}
                    </span>
                    <PanelLeftOpen className="size-4 opacity-60" />
                </Button>

                <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Need public pages? Jump back to the marketing site from the quick links above.
                </p>
            </div>
        </div>
    );
}

function getInitials(user: User | null) {
    const source = user?.name?.trim() || user?.email?.trim() || "A";
    const parts = source.split(/\s+/).filter(Boolean);

    if (parts.length >= 2) {
        return `${parts[0]?.[0] ?? "A"}${parts[1]?.[0] ?? ""}`.toUpperCase();
    }

    return source.slice(0, 2).toUpperCase();
}

function isActiveRoute(pathname: string, href: string) {
    if (href === ROUTES.home) {
        return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

export default SidebarContent