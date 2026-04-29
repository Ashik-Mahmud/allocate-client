"use client";

import { format } from "date-fns";
import {
    BadgeCheck,
    CalendarDays,
    CreditCard,
    Globe2,
    Building2,
    Mail,
    Shield,
    Sparkles,
    Link,
    MoreHorizontal,
    MoreVertical,
    InfoIcon,
    Edit2,
    Edit,
} from "lucide-react";

import { APP_ROLES } from "@/lib/constants/roles";
import { cn } from "@/lib/utils";
import type { User } from "@/types";
import { ROUTES } from "@/lib/constants/routes";
import AllocateDropdown from "@/components/shared/dropdown";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { is } from "zod/v4/locales";

type Props = {
    user: User;
};

function formatDate(value?: string | Date | null) {
    if (!value) {
        return "N/A";
    }

    return format(new Date(value), "dd MMM yyyy, p");
}

function formatAddress(address: unknown) {
    if (!address) {
        return "N/A";
    }

    if (typeof address === "string") {
        return address;
    }

    if (typeof address === "object") {
        const parts = Object.values(address as Record<string, unknown>)
            .filter((value) => typeof value === "string" && value.trim().length > 0)
            .map((value) => value as string);

        return parts.length > 0 ? parts.join(", ") : "N/A";
    }

    return String(address);
}

function formatNotificationPreferences(settings: unknown) {
    if (!settings || typeof settings !== "object") {
        return "Default preferences";
    }

    const notificationPreference = (settings as { notificationPreference?: Record<string, boolean> }).notificationPreference;

    if (!notificationPreference) {
        return "Default preferences";
    }

    const preferenceLabels: Record<string, string> = {
        email: "Email",
        sms: "SMS",
        push: "Push",
        inApp: "In-app",
    };

    const enabled = Object.entries(notificationPreference)
        .filter(([, value]) => Boolean(value))
        .map(([key]) => preferenceLabels[key] ?? key);

    return enabled.length > 0 ? enabled.join(", ") : "All notifications off";
}

function getRoleLabel(role?: string | null) {
    if (role === APP_ROLES.ADMIN) return "System Admin";
    if (role === APP_ROLES.ORG_ADMIN) return "Organization Admin";
    if (role === APP_ROLES.STAFF) return "Staff";
    return "Profile";
}

function StatCard({ label, value, helper, icon }: { label: string; value: string; helper: string; icon: React.ReactNode }) {
    return (
        <article className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                {icon}
                {label}
            </div>
            <p className="mt-3 text-2xl font-semibold">{value}</p>
            <p className="mt-1 text-xs text-white/70">{helper}</p>
        </article>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 py-3 last:border-b-0 dark:border-slate-800">
            <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
            <span className="text-right text-sm font-medium text-slate-900 dark:text-slate-100">{value}</span>
        </div>
    );
}

function SectionCard({
    title,
    subtitle,
    children,
    className,
}: {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section className={
            cn(
                "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60",
                className
            )
        }>
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            </div>
            {children}
        </section>
    );
}

function LabelValue({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">{value}</p>
        </div>
    );
}

export default function ProfileView({ user }: Props) {
    const role = user.role ?? null;
    const roleLabel = getRoleLabel(role);
    const organization = user.organization;
    const isOrgAdmin = role === APP_ROLES.ORG_ADMIN;
    const isStaff = role === APP_ROLES.STAFF;
    const isAdmin = role === APP_ROLES.ADMIN;
    const initials = (user.name ?? user.email ?? "PR").slice(0, 2).toUpperCase();
    const supportEmail = organization?.business_email ?? "support@organization.com";
    const orgTagline = organization?.tagline ?? "No tagline available yet.";
    const orgName = organization?.name ?? "No organization linked";
    const orgStatus = organization?.is_active ? "Active" : organization ? "Inactive" : "Not linked";
    const currentCredits = typeof user.personal_credits === "number" ? user.personal_credits : 0;
    const router = useRouter();

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/50">
                <div className={cn(
                    "px-6 py-6 text-white",
                    isOrgAdmin
                        ? "bg-linear-to-r from-slate-950 via-slate-900 to-slate-700"
                        : "bg-linear-to-r from-slate-900 via-slate-800 to-slate-700"
                )}>
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl border border-white/15 bg-white/10 text-xl font-bold">
                                {user.photo ? <img src={user.photo} alt={user.name ?? user.email} className="h-full w-full object-cover" /> : initials}
                            </div>

                            <div className="max-w-2xl">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-3xl font-semibold tracking-tight">{user.name ?? user.email}</h1>
                                    <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80">
                                        {roleLabel}
                                    </span>
                                    {user.is_verified ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-200">
                                            <BadgeCheck className="size-3.5" />
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-200">
                                            <Shield className="size-3.5" />
                                            Unverified
                                        </span>
                                    )}
                                </div>

                                <p className="mt-2 text-sm text-white/65">
                                    {isOrgAdmin
                                        ? "A focused control center for organization health, balances, and support details."
                                        : "A minimal account overview with your linked organization details."}
                                </p>

                                {!isOrgAdmin && !isAdmin && (
                                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/75">
                                        <Mail className="size-3.5" />
                                        {supportEmail}
                                    </div>
                                )}
                            </div>
                        </div>

                        {isOrgAdmin ? (
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 lg:min-w-3xl">
                                <div className="rounded-3xl border relative border-white/10 bg-white/10 p-5 backdrop-blur sm:col-span-2 xl:col-span-2">

                                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">Credit pool</p>
                                    <div className="mt-4 flex items-end gap-3">
                                        <span className="text-5xl font-semibold leading-none tracking-tight text-white sm:text-6xl">
                                            {(organization?.credit_pool ?? 0).toLocaleString()}
                                        </span>
                                        <span className="pb-2 text-sm font-medium text-white/70">CR</span>
                                    </div>
                                    <p className="mt-3 text-sm text-white/65">Available organization credits ready for allocation and use.</p>

                                    <AllocateDropdown dropdownOptions={[
                                        {
                                            label: "Allocate credits",
                                            onClick: () => {
                                                router.push(ROUTES.dashboardOrgAdmin.creditManagement)
                                            }
                                        },
                                        {
                                            label: "View credit history",
                                            onClick: () => {
                                                router.push(ROUTES.dashboardOrgAdmin.creditHistory)
                                            }
                                        },
                                        {
                                            label: "Manage Billing",
                                            onClick: () => {
                                                router.push(ROUTES.dashboardOrgAdmin.billing)
                                            }
                                        }
                                    ]} >
                                        <button className="mt-5 inline-flex absolute right-5 top-0 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/75">
                                            <MoreVertical className="size-3.5" />

                                        </button>
                                    </AllocateDropdown>
                                </div>

                                <StatCard
                                    label="Account credits"
                                    value={`${currentCredits.toLocaleString()} CR`}
                                    helper="Your personal balance"
                                    icon={<CreditCard className="size-3.5" />}
                                />
                                <StatCard
                                    label="Plan type"
                                    value={user?.organization?.plan_type || "FREE"}
                                    helper={"Your current plan type"}
                                    icon={<BadgeCheck className="size-3.5" />}
                                />
                            </div>
                        ) : !isAdmin && <StatCard
                            label="Account credits"
                            value={`${currentCredits.toLocaleString()} CR`}
                            helper="Your personal balance"
                            icon={<CreditCard className="size-3.5" />}
                        />}
                    </div>
                </div>

                <div className={
                    cn(
                        "grid gap-4 px-6 py-6 lg:grid-cols-2",
                        isAdmin ? " lg:grid-cols-1" : ''
                    )
                }>
                    {isOrgAdmin ? (
                        <SectionCard className="border shadow-sm relative" title="Organization overview" subtitle="All important organization details in one view.">

                            {
                                isOrgAdmin && (<button className="flex items-center absolute right-7 top-7 rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 gap-2 cursor-pointer" >
                                    <Edit className="size-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200" />
                                    Edit
                                </button>)
                            }


                            {organization ? (
                                <div className="space-y-4 rounded-2xl border-0 border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{orgName}</h3>

                                        <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                            {orgStatus}
                                        </span>
                                        {organization?.isVerified ? (
                                            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-800">
                                                <BadgeCheck className="size-3.5" />
                                                Verified
                                            </span>
                                        ) : (
                                            null
                                        )}
                                        {
                                            !organization?.isVerified && (
                                                <>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <span className="ml-2 cursor-pointer hover:bg-rose-500/20 inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-800">
                                                                <Shield className="size-3.5" />
                                                                Unverified
                                                            </span>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="dark:bg-slate-700">
                                                            <p className="text-xs font-sans text-slate-600 dark:text-slate-400">
                                                                This organization is currently <b>unverified</b>. Please  {" "}
                                                                <a href="/contact-support" className="text-blue-500 hover:underline">
                                                                    contact support</a> to complete the verification process and get monthly organization free extra credits.
                                                            </p>
                                                        </PopoverContent>
                                                    </Popover>
                                                </>

                                            )
                                        }
                                    </div>

                                    <p className="text-sm text-slate-600 dark:text-slate-400">{orgTagline}</p>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <LabelValue label="Support email" value={supportEmail} />
                                        <LabelValue label="Organization type" value={organization.org_type ?? "N/A"} />
                                        <LabelValue label="Timezone" value={organization.timezone || "N/A"} />
                                        <LabelValue label="Address" value={formatAddress(organization.address)} />
                                        <LabelValue label="Notifications" value={formatNotificationPreferences(organization.settings)} />
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                    No organization is linked to this account yet.
                                </div>
                            )}
                        </SectionCard>
                    ) : (
                        !isAdmin && <SectionCard className="border-0 shadow-none border-r rounded-none" title="Linked organization" subtitle="Only the most relevant organization details are shown here.">

                            {organization ? (
                                <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{orgName}</h3>
                                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{orgTagline}</p>
                                        </div>
                                        <div >{/* className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400" */}
                                            {/* {organization.plan_type ?? "PLAN N/A"} */}
                                            {organization?.isVerified ? (
                                                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-200">
                                                    <BadgeCheck className="size-3.5" />
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-800">
                                                    <Shield className="size-3.5" />
                                                    Unverified
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <LabelValue label="Support email" value={supportEmail} />
                                        <LabelValue label="Timezone" value={organization.timezone || "N/A"} />
                                        <LabelValue label="Notifications" value={formatNotificationPreferences(organization.settings)} />
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                    No organization is linked to this account yet.
                                </div>
                            )}
                        </SectionCard>
                    )}

                    <SectionCard className={cn(
                        "relative",
                        isOrgAdmin ? "border shadow-sm" : "border-0 shadow-none  rounded-none",
                        isAdmin ? "w-full" : ''
                    )} title="Account details" subtitle="Identity and profile metadata for the current user." >
                        <button className="flex items-center absolute right-7 top-7 rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 gap-2 cursor-pointer" >
                            <Edit className="size-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200" />
                            Edit
                        </button>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <DetailRow label="Email" value={user.email} />
                            <DetailRow label="User ID" value={user.id ?? "N/A"} />
                            <DetailRow label="Joined" value={formatDate(user.createdAt)} />
                            <DetailRow label="Updated" value={formatDate(user.updatedAt)} />
                            <DetailRow label="Last activity" value={user.last_login ? formatDate(user.last_login) : "Never"} />
                            <DetailRow label="Account state" value={user.deletedAt ? "Deleted" : "Active"} />
                        </div>
                    </SectionCard>
                </div>
            </section>

            {isOrgAdmin ? (
                <section className="grid gap-4 lg:grid-cols-3">
                    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 lg:col-span-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                            <Sparkles className="size-4 text-amber-500" />
                            Organization highlights
                        </div>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Primary focus</p>
                                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                                    Manage the organization profile, monitor the credit pool, and keep the support channel visible for your team.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Support channel</p>
                                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{organization?.business_email ?? supportEmail}</p>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Use this for org-related requests and follow-ups.</p>
                            </div>
                        </div>
                    </article>

                    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                            <Globe2 className="size-4 text-sky-500" />
                            Quick notes
                        </div>

                        <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                            <p>• {organization?.timezone ? `Timezone: ${organization.timezone}` : "Timezone not configured."}</p>
                            <p>• {organization ? `Credit pool: ${(organization.credit_pool ?? 0).toLocaleString()} CR` : "No credit pool available."}</p>
                            <p>• {organization ? `Plan: ${organization.plan_type ?? "N/A"}` : "No organization data available."}</p>
                        </div>
                    </article>
                </section>
            ) : null}
        </div>
    );
}