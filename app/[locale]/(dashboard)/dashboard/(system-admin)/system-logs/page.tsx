import SystemLogsMain from '@/components/systemDashboard/systemLogs/SystemLogsMain';

type Props = {}

export const metadata = {
    title: "System Logs",
    description: "Monitor and analyze your system logs with our comprehensive dashboard, designed to provide you with insights into your system's performance, security, and operational health for effective management and troubleshooting.",
}

const SystemLogs = (props: Props) => {
  return (
    <div>
        <SystemLogsMain />
    </div>
  )
}

export default SystemLogs