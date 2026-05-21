import NotificationMain from '@/components/dashboard/notifications/NotificationMain';

type Props = {}

export const metadata = {
    title: "Notifications",
    description: "Stay informed with our comprehensive notifications dashboard, designed to keep you updated on important events, updates, and alerts in real-time.",
}

const NotificationPage = (props: Props) => {
    return (
        <NotificationMain />
    )
}

export default NotificationPage