import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { APP_ROLES, isAllowedRole, normalizeRole, type AppRole } from "@/lib/constants/roles";
import { ROUTES } from "@/lib/constants/routes";

export async function requireRoles(allowedRoles: AppRole[]) {
  const session = await auth();
  const role = normalizeRole((session?.user as { role?: unknown } | undefined)?.role);

  if (!session?.user?.email || !isAllowedRole(role, allowedRoles)) {
    redirect(ROUTES.dashboardCommon.overview);
  }

  return {
    session,
    role,
  };
}

export async function requireAdminRole() {
  return requireRoles([APP_ROLES.ADMIN]);
}

export async function requireOrgAdminRole() {
  return requireRoles([APP_ROLES.ORG_ADMIN]);
}

export async function requireStaffRole() {
  return requireRoles([APP_ROLES.STAFF]);
}

export async function requireCommonRole() {
  return requireRoles([APP_ROLES.ORG_ADMIN, APP_ROLES.STAFF]);
}