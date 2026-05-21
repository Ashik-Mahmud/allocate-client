import StaffMain from "@/components/dashboard/staff/staffMain";


export const metadata = {
  title: "Staff Management",
  description: "Manage your staff effectively with our comprehensive staff management dashboard, designed to provide you with insights and control over your team's performance and availability.",
};

export default function StaffManagementPage() {
  return (
    <div className="space-y-3">
      <StaffMain />
    </div>
  );
}