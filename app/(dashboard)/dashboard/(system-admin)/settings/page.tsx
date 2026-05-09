import SystemSettings from '@/components/systemDashboard/SystemSettings';
import React from 'react'

type Props = {}
export const metadata = {
  title: 'Settings',
  description: 'Manage system settings and configurations.',
}
const SettingsPage = (props: Props) => {
  return (
    <div>
      <SystemSettings />
    </div>
  )
}

export default SettingsPage