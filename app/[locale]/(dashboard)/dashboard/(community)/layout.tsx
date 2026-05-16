import { APP_ROLES } from "@/lib/constants/roles";
import { requireRoles } from "@/lib/auth/role-guard";
import { ArrowRight, Construction, Filter, Hammer, Search, ShieldCheck } from "lucide-react";
import CommunityHeader from "@/components/dashboard/community/CommunityHeader";

export default async function CommunityLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    await requireRoles([APP_ROLES.ADMIN, APP_ROLES.ORG_ADMIN, APP_ROLES.STAFF]);

    return <>
        <div>
            <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-4 md:p-8 text-slate-900 dark:text-slate-100">

                <main className="mx-auto space-y-6">
                    {/* Header */}
                    <CommunityHeader />

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Active Tickets Column */}
                        <div className="lg:col-span-2 space-y-4">
                            {children}
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Hammer className="w-5 h-5 opacity-80" />
                                    <h3 className="font-bold">System Status</h3>
                                </div>
                                <p className="text-sm text-blue-100 mb-6">
                                    Most services are operational, but "Manager Direct Messaging" is undergoing maintenance.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <span>API Response</span>
                                        <span className="font-mono">99.2%</span>
                                    </div>
                                    <div className="w-full bg-blue-400/30 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-white h-full w-[90%]" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                                <h3 className="font-bold mb-4">Top Support Admins</h3>
                                <div className="space-y-4">
                                    {[
                                        { name: 'Sarah Miller', role: 'System Admin', online: true },
                                        { name: 'Kevin Zhang', role: 'Org Manager', online: false },
                                    ].map((admin, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                                                {admin.online && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{admin.name}</p>
                                                <p className="text-xs text-slate-500">{admin.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>

    </>;
}
