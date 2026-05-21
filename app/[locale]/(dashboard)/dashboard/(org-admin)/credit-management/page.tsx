import CreditManagementMain from '@/components/dashboard/credit-management/creditsMain';

type Props = {}

export const metadata = {
    title: "Credit Management",
    description: "Manage your credits effectively with our comprehensive credit management dashboard, designed to provide you with insights and control over your credit usage and balance.",
}

const CreditManagement = (props: Props) => {
    return (
        <div>
            <CreditManagementMain />
        </div>
    )
}

export default CreditManagement