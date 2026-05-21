import BillingManagement from '@/components/dashboard/billing-management/BillingManagement';

type Props = {}

export const metadata = {
    title: "Billing Management",
    description: "Manage your billing information, view invoices, and update payment methods with our comprehensive billing management dashboard, designed to provide you with full control over your financial interactions.",
}

const BillingPage = (props: Props) => {
  return (
    <div>
      <BillingManagement />
    </div>
  )
}

export default BillingPage