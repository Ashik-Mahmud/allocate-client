export type LandingStat = {
  value: string;
  label: string;
  detail: string;
};

export type LandingFeature = {
  title: string;
  description: string;
  icon: "workflow" | "sparkles" | "checkCircle" | "shield" | "inbox" | "wallet" | "users";
  tag: string;
};

export type LandingWorkflowStep = {
  title: string;
  description: string;
  metric: string;
};

export type LandingTrust = {
  title: string;
  subtitle: string;
  partners: string[];
};

export type LandingNotification = {
  title: string;
  description: string;
  state: string;
};

export type LandingBillingCard = {
  title: string;
  description: string;
  meta: string;
};

export type LandingDashboardMetric = {
  label: string;
  value: string;
};

export type LandingDashboardCard = {
  title: string;
  description: string;
};

export type LandingDashboardBar = {
  label: string;
  value: number;
  tone: "primary" | "secondary" | "muted";
};

export type LandingDashboardTab = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  metrics: LandingDashboardMetric[];
  cards: LandingDashboardCard[];
  bars: LandingDashboardBar[];
};

export type LandingFaqItem = {
  question: string;
  answer: string;
};

export type LandingContent = {
  badge: string;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    note: string;
  };
  stats: LandingStat[];
  trust: LandingTrust;
  features: {
    title: string;
    subtitle: string;
    items: LandingFeature[];
  };
  workflow: {
    title: string;
    subtitle: string;
    steps: LandingWorkflowStep[];
  };
  notifications: {
    title: string;
    subtitle: string;
    inboxTitle: string;
    summary: string;
    highlights: string[];
    items: LandingNotification[];
  };
  billing: {
    title: string;
    subtitle: string;
    cards: LandingBillingCard[];
    bullets: string[];
  };
  dashboard: {
    title: string;
    subtitle: string;
    tabs: LandingDashboardTab[];
  };
  faq: {
    title: string;
    items: LandingFaqItem[];
  };
  cta: {
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
  };
  footerCopy: string;
};
