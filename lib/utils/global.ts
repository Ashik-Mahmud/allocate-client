import { NotificationType } from '@/types/notification';
import {
  CalendarClock, CheckCircle2, XCircle, BellRing,
  Coins, AlertCircle, UserPlus, CreditCard, ShieldAlert
} from 'lucide-react';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCcw,
  PlusCircle,
  MinusCircle,
  Zap,
  HelpCircle
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



import { TransactionType } from '@/types/credits';

export const TRANSACTION_CONFIG: Record<TransactionType, {
  label: string;
  color: string;
  icon: React.ElementType
}> = {
  [TransactionType.ALLOCATE]: {
    label: "Allocated",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    icon: ArrowUpCircle,
  },
  [TransactionType.FREE_ALLOCATION]: {
    label: "Free Gift",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    icon: Zap,
  },
  [TransactionType.REVOKE]: {
    label: "Revoked",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    icon: ArrowDownCircle,
  },
  [TransactionType.SPEND]: {
    label: "Spent",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
    icon: MinusCircle,
  },
  [TransactionType.REFUND]: {
    label: "Refunded",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
    icon: RefreshCcw,
  },
  [TransactionType.TOP_UP]: {
    label: "Top Up",
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400",
    icon: PlusCircle,
  },
  [TransactionType.DEDUCT]: {
    label: "Deducted",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400",
    icon: MinusCircle,
  },
  [TransactionType.ADJUSTMENT]: {
    label: "Adjustment",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
    icon: HelpCircle,
  },
};