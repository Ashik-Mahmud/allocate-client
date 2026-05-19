import { requireAdminRole } from "@/lib/auth/role-guard";

export default async function SystemAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAdminRole();

  return <>{children}</>;
}