import StaffDashboardOverview from '@/components/dashboard/StaffOverview/StaffOverview';

type Props = {}

export const metadata = {
    title: "Staff Overview",
    description: "Get a comprehensive overview of your staff with our intuitive dashboard, designed to help you manage and optimize your workforce effectively.",
}

const StaffOverviewPage = (props: Props) => {
    return (
        <div>
            <StaffDashboardOverview />
        </div>
    )
}

export default StaffOverviewPage