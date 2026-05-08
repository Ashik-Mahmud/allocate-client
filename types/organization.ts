import { User } from ".";
import { PaymentProvider } from "./billings";
import { CreditTransaction } from "./credits";
import { Resources, ResourcesRule } from "./resources";

export interface OrgAddress {
  street?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface OrgNotificationPreference {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
}

export enum PlanType {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
  // Match these to your actual Prisma enum values
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}



export interface Subscription {
  id: string;
  org_id: string;
  // Relation field (Optional if you are not fetching it with 'include')
  organization?: any; 
  plan_name: PlanType;
  start_date: Date | string;
  end_date?: Date | string | null;
  payment_status?: PaymentStatus | null;
  is_active?: boolean | null;
  last_reminder_sent?: Date | string | null;
  provider?:PaymentProvider | null;
  last_transaction_id?: string | null;
  external_id?: string | null; // For storing Stripe subscription ID or similar
  // Metadata / Timestamps
  deletedAt?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string | null;
}
export interface OrgSettings {
  notificationPreference: OrgNotificationPreference;
}

export interface Organizations {
  id: string;
  name: string;
  slug: string | null;
  org_type: string | null;
  tagline: string | null;
  photo: string | null;
  plan_type: PlanType | null;
  credit_pool: number | null;
  frozen_credits: number | null;
  is_active: boolean | null;
  timezone: string;
  address: OrgAddress | string | null;
  business_email: string | null;
  needUpdateOrg: boolean | null;
  weeklyReportEnabled?: boolean | null;
  settings: OrgSettings | null;
  isVerified: boolean | null;
  deletedAt: Date | string | null;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;

  // Relations (Optional)
  users?: User[];
  resources?: Resources[];
  resourcesRules?: ResourcesRule[];
  subscription?: Subscription | null;
  creditTransactions?: CreditTransaction[];
  // Add other relation types as you define them:
  // subscriptions?: Subscription[];
  // notifications?: Notification[];
  // invitations?: Invitation[];
  // bookings?: Bookings[];
  // creditTransactions?: CreditTransaction[];
  _count?: {
    users: number;
    resources: number;
    // Add counts for other relations as needed
  };
}