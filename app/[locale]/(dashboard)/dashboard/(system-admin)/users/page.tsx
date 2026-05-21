import UsersManagementMain from '@/components/systemDashboard/users/UsersManagementMain';

type Props = {}

export const metadata = {
    title: "Users Management",
    description: "Manage your users effectively with our comprehensive dashboard, designed to provide you with insights and control over your user base, roles, and permissions for optimal system administration.",
}

const UsersPage = (props: Props) => {
  return (
    <div>
      <UsersManagementMain />
    </div>
  )
}

export default UsersPage