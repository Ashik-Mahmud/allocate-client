import { useGetSystemSettings } from '@/features/system/hooks';
import { GlobalAlert } from '@/types/systemGlobal';

type Props = {}

type GlobalSettings = {
    isThemeMode: boolean;
    can_export_logs: boolean;
    isMaintenanceMode: boolean;
    global_alert_message: GlobalAlert;
    supportEmail: string;
    functionalities: any;
    isLoading: boolean;
    createdAt: string;
    updatedAt: string;
    refetch: () => void;
}

const useGlobalSettings = () => {
  const { data, isLoading, refetch } = useGetSystemSettings();
  return {
    isThemeMode: data?.data?.features_flags?.ui_dark_mode || false,
    can_export_logs: data?.data?.features_flags?.can_export_logs || false,
    isMaintenanceMode: data?.data?.maintenance_mode || false,
    global_alert_message: data?.data?.global_alert_message || '',
    supportEmail: data?.data?.support_email || '',
    functionalities: data?.data,
    createdAt: data?.data?.createdAt || '',
    updatedAt: data?.data?.updatedAt || '',
    isLoading,
    refetch,
  } as GlobalSettings
}

export default useGlobalSettings