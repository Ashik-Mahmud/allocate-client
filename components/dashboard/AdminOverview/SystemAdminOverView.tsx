import { auth } from '@/auth';
import { APP_ROLES } from '@/lib/constants/roles';
import React from 'react'

type Props = {}

function formatRole(role: string | null | undefined) {
    if (role === APP_ROLES.ADMIN) {
        return "Admin";
    }

    if (role === APP_ROLES.ORG_ADMIN) {
        return "Org Admin";
    }

    if (role === APP_ROLES.STAFF) {
        return "Staff";
    }

    return "Unknown";
}

const SystemAdminOverView = async (props: Props) => {
    const session = await auth();
    const role = session?.user?.role ?? null;

    return (
        <main className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Workspace</h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Keep app-only product pages under app/(dashboard).
                </p>
            </div>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Current role</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{formatRole(role)}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">This controls what navigation and pages you can access.</p>
                </article>

                <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Credits</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                        {typeof session?.user?.personal_credits === "number" ? session.user.personal_credits.toLocaleString() : "-"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Your available balance for this account.</p>
                </article>

                <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Notifications</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{10}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Unread updates that need your attention.</p>
                </article>
            </section>
        </main>
    );
}

export default SystemAdminOverView