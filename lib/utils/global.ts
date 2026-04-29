import { NotificationType } from '@/types/notification';
import { 
  CalendarClock, CheckCircle2, XCircle, BellRing, 
  Coins, AlertCircle, UserPlus, CreditCard, ShieldAlert 
} from 'lucide-react';

export const NotificationConfig: Record<NotificationType, { icon: any, color: string, bgColor: string }> = {
  [NotificationType.BOOKING_REQUESTED]: { icon: CalendarClock, color: 'text-blue-500', bgColor: 'bg-blue-50' },
  [NotificationType.BOOKING_CONFIRMED]: { icon: CheckCircle2, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
  [NotificationType.BOOKING_REJECTED]: { icon: XCircle, color: 'text-rose-500', bgColor: 'bg-rose-50' },
  [NotificationType.BOOKING_REMINDER]: { icon: BellRing, color: 'text-amber-500', bgColor: 'bg-amber-50' },
  [NotificationType.BOOKING_CANCELLED]: { icon: XCircle, color: 'text-slate-500', bgColor: 'bg-slate-50' },
  
  [NotificationType.CREDIT_RECEIVED]: { icon: Coins, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  [NotificationType.CREDIT_REVOKED]: { icon: AlertCircle, color: 'text-rose-600', bgColor: 'bg-rose-100' },
  [NotificationType.LOW_CREDIT_WARNING]: { icon: ShieldAlert, color: 'text-amber-600', bgColor: 'bg-amber-100' },

  [NotificationType.INVITATION_RECEIVED]: { icon: UserPlus, color: 'text-indigo-500', bgColor: 'bg-indigo-50' },
  [NotificationType.STAFF_JOINED]: { icon: CheckCircle2, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },

  [NotificationType.SUBSCRIPTION_EXPIRING]: { icon: CreditCard, color: 'text-orange-500', bgColor: 'bg-orange-50' },
  [NotificationType.SUBSCRIPTION_EXPIRED]: { icon: CreditCard, color: 'text-red-600', bgColor: 'bg-red-50' },

  [NotificationType.SYSTEM_ALERT]: { icon: ShieldAlert, color: 'text-red-500', bgColor: 'bg-red-50' },
  [NotificationType.MAINTENANCE_NOTICE]: { icon: AlertCircle, color: 'text-slate-600', bgColor: 'bg-slate-100' },
};