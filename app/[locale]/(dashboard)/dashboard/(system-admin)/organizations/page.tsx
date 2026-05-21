import OrganizationMain from '@/components/systemDashboard/organizations/OrganizationMain';

type Props = {}


export const metadata = {
    title: "Organizations",
    description: "Manage your organizations effectively with our comprehensive dashboard, designed to provide you with insights and control over your organizational structure, performance, and resources.",
}

const OrganizationPage = (props: Props) => {
  return (
    <div>

      <OrganizationMain />
    </div>
  )
}

export default OrganizationPage