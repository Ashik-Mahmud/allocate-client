import CreditTransactionsMain from '@/components/systemDashboard/creditTransactions/CreditTransactionsMain';

type Props = {}

export const metadata = {
    title: "Credit Transactions",
    description: "Explore your credit transactions with our detailed dashboard, designed to provide you with insights into your credit usage, history, and trends for better financial management.",
}
const CreditTransactions = (props: Props) => {
  return (
  
        <CreditTransactionsMain />
    
  )
}

export default CreditTransactions