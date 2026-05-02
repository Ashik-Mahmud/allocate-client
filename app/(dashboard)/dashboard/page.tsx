import { auth } from "@/auth";
import { APP_ROLES } from "@/lib/constants/roles";
import { redirect } from "next/navigation";



export default async function DashboardHomePage() {
  const session = await auth();

  // If you want to ensure they are logged in before redirecting
  if (!session) {
    redirect("/login");
  }

  // Redirect to the overview page
  redirect("/dashboard/overview");

  // This part will never be reached, but kept for structural reference
  return null;
}
