"use client"
import { auth } from "@/auth";
import { ResourcesPanel } from "@/components/dashboard/resources";
import ResourcesMain from "@/components/dashboard/resources/resources-main";
import VerifyLoggedInUser from "@/components/shared/verify-user";
import { useCurrentUserContext } from "@/features/auth";

export default  function ResourcesManagementPage() {
  return <ResourcesMain />;
}