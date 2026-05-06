import { useCurrentUser } from '@/features/auth';
import React from 'react'

type Props = {}

const useTimezone = () => {

  const userData = useCurrentUser();
  const timeZone = userData?.user?.organization?.timezone || 'UTC';
  const localComputerTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return { timeZone, localComputerTimeZone };
}

export default useTimezone