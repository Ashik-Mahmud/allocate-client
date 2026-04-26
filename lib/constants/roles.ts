export const APP_ROLES = {
  ADMIN: "ADMIN",
  ORG_ADMIN: "ORG_ADMIN",
  STAFF: "STAFF",
} ;

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES];

export function normalizeRole(role: unknown): AppRole | null {
  if (typeof role !== "string") {
    return null;
  }

  const normalized = role.trim().toUpperCase();

  if (normalized === APP_ROLES.ADMIN) {
    return APP_ROLES.ADMIN;
  }

  if (normalized === APP_ROLES.ORG_ADMIN) {
    return APP_ROLES.ORG_ADMIN;
  }

  if (normalized === APP_ROLES.STAFF) {
    return APP_ROLES.STAFF;
  }

  return null;
}

export function isAllowedRole(role: AppRole | null, allowedRoles: AppRole[]) {
  if (!role) {
    return false;
  }

  return allowedRoles.includes(role);
}