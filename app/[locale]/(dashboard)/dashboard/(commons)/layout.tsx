import { requireCommonRole } from "@/lib/auth/role-guard";

export default async function CommonDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireCommonRole();

  return <>{children}</>;
}