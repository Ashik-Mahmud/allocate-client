import { requireStaffRole } from "@/lib/auth/role-guard";

export default async function StaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireStaffRole();

  return <>{children}</>;
}