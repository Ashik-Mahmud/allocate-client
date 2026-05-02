import Loader from '@/components/shared/loader'
import React from 'react'

type Props = {}

const DashboardLoader = (props: Props) => {
  return (
    <div>
        <Loader type="component" />
    </div>
  )
}

export default DashboardLoader