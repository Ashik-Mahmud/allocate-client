import { auth } from "@/auth";
import { ResourcesPanel } from "@/components/dashboard/resources";
import VerifyLoggedInUser from "@/components/shared/verify-user";

export default async function ResourcesManagementPage() {
  const session = await auth();
  const isVerified = Boolean(session?.user?.is_verified);

  if (!isVerified) {
    return (
       <VerifyLoggedInUser className="mx-auto w-full" pageName="Resources Management" type="page"/>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Resources Management
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Manage organization resources, availability, and booking rules.
        </p>
      </div>
      <ResourcesPanel />
    </div>
  );
}