import { Layers3, ShieldCheck, Sparkles } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import { PlanType } from '@/types/organization'
import { SUBSCRIPTION_PRICING } from '@/lib/constants/subscription';

export type FeatureKey = 'AI_INSIGHTS' | 'ADVANCED_RULES' | 'PRIORITY_SUPPORT'

export type FeatureMeta = {
  key: FeatureKey
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export type PlanMeta = {
  plan: PlanType
  price:{
    taka:{
        monthly: number,
        annually: number,
    },
    dollar:{
        monthly: number,
        annually: number,
    }
  },
  name: string
  subtitle: string
  accent: string
  surface: string
  border: string
  ctaLabel: string
  ctaHref: string
  featured?: boolean
}

export const FEATURE_CATALOG: FeatureMeta[] = [
  { key: 'AI_INSIGHTS', label: 'AI insights', icon: Sparkles },
  { key: 'ADVANCED_RULES', label: 'Advanced rules', icon: Layers3 },
  { key: 'PRIORITY_SUPPORT', label: 'Priority support', icon: ShieldCheck },
]

export const PLAN_CARDS: PlanMeta[] = [
  {
    plan: PlanType.FREE,
    name: 'Starter',
    subtitle: 'For small teams getting organized.',
    accent: 'from-slate-900 via-slate-800 to-slate-700',
    surface: 'bg-slate-50/90 dark:bg-slate-950/70',
    border: 'border-slate-200 dark:border-slate-800',
    ctaLabel: 'View pricing',
    ctaHref: ROUTES.pricing,
    price: SUBSCRIPTION_PRICING[PlanType.FREE],
  },
  {
    plan: PlanType.PRO,
    name: 'Pro',
    subtitle: 'The practical upgrade for growing teams.',
    accent: 'from-emerald-600 via-emerald-500 to-cyan-500',
    surface: 'bg-white dark:bg-slate-950/80',
    border: 'border-emerald-200/80 dark:border-emerald-500/20',
    ctaLabel: 'Upgrade to Pro',
    ctaHref: ROUTES.pricing,
    featured: true,
    price: SUBSCRIPTION_PRICING[PlanType.PRO],
  },
  {
    plan: PlanType.ENTERPRISE,
    name: 'Enterprise',
    subtitle: 'For large organizations with custom needs.',
    accent: 'from-amber-500 via-orange-500 to-rose-500',
    surface: 'bg-slate-50/90 dark:bg-slate-950/70',
    border: 'border-slate-200 dark:border-slate-800',
    ctaLabel: 'Talk to sales',
    ctaHref: ROUTES.pricing,
    price: SUBSCRIPTION_PRICING[PlanType.ENTERPRISE],
    },
]
