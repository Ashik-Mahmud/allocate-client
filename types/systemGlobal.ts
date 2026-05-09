export type AlertType = 'info' | 'warning' | 'error' | 'success';

export interface GlobalAlert {
  title: string;
  body: string;
  type: AlertType;
  show: boolean;
  createdAt: Date;
  updatedAt: Date;
  buttonText?: string;
  buttonLink?: string;
}

export interface FeatureFlags {
  can_export_logs: boolean;
  ui_dark_mode: boolean;
}

export interface SystemSettingsData {
  id: string;
  support_email: string;
  maintenance_mode: boolean;
  global_alert_message: GlobalAlert;
  features_flags: FeatureFlags;
}