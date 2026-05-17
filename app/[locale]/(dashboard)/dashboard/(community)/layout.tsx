import { APP_ROLES } from "@/lib/constants/roles";
import { requireRoles } from "@/lib/auth/role-guard";
import { ArrowRight, Construction, Filter, Hammer, Search, ShieldCheck } from "lucide-react";
import CommunityHeader from "@/components/dashboard/community/CommunityHeader";
import CommunityRightStats from "@/components/dashboard/community/CommunityRightStats";

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
                        <CommunityRightStats />
                       

                    </div>
                </main>
            </div>
        </div>

    </>;
}
