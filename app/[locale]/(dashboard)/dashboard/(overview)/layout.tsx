import { APP_ROLES } from "@/lib/constants/roles";
import { requireRoles } from "@/lib/auth/role-guard";

export default async function DashboardOverviewLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    await requireRoles([APP_ROLES.ADMIN, APP_ROLES.ORG_ADMIN, APP_ROLES.STAFF]);

    return <>{children}</>;
}
