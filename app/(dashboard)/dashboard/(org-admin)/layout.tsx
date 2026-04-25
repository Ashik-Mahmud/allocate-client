import { requireOrgAdminRole } from "@/lib/auth/role-guard";

export default async function OrganizationAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireOrgAdminRole();

  return <>{children}</>;
}