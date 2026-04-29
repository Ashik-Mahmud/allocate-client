import { User } from ".";
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
  is_active: boolean | null;
  timezone: string;
  address: OrgAddress | string | null;
  business_email: string | null;
  needUpdateOrg: boolean | null;
  settings: OrgSettings | null;
  isVerified: boolean | null;
  deletedAt: Date | string | null;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;

  // Relations (Optional)
  users?: User[];
  resources?: Resources[];
  resourcesRules?: ResourcesRule[];
  // Add other relation types as you define them:
  // subscriptions?: Subscription[];
  // notifications?: Notification[];
  // invitations?: Invitation[];
  // bookings?: Bookings[];
  // creditTransactions?: CreditTransaction[];
}