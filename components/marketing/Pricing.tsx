"use client";

import pricingContent from "@/data/marketing/pricing-content.json";
import { SUBSCRIPTION_LIMITS } from "@/lib/constants/subscription";
import { PlanType } from "@/types/organization";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type BillingCycle = "monthly" | "yearly";

type Plan = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  cta: string;
  popular: boolean;
  highlights: string[];
};

type CompareItem = {
  label: string;
  starter: boolean;
  pro: boolean;
  enterprise: boolean;
};

const plans = pricingContent.plans as Plan[];
const compareItems = pricingContent.compare.items as CompareItem[];

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const displayPlans = useMemo(
    () =>
      plans.map((plan) => ({
        ...plan,
        displayPrice:
          billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice,
      })),
    [billingCycle]
  );

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-white/70 px-5 py-8 shadow-xl shadow-primary/10 backdrop-blur dark:bg-slate-900/60 sm:px-8 sm:py-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_30%),radial-gradient(circle_at_85%_10%,color-mix(in_oklab,var(--color-brand-secondary)_14%,transparent),transparent_35%)]" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {pricingContent.hero.eyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl dark:text-slate-100">
              {pricingContent.hero.title}
            </h2>
            <p className="mt-3 max-w-2xl text-slate-700 dark:text-slate-300">
              {pricingContent.hero.subtitle}
            </p>
          </div>

          <div className="rounded-full border border-primary/25 bg-white/80 p-1 dark:bg-slate-950/60">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${billingCycle === "monthly"
                ? "bg-primary text-primary-foreground"
                : "text-slate-600 dark:text-slate-300"
                }`}
            >
              {pricingContent.billing.monthly}
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${billingCycle === "yearly"
                ? "bg-primary text-primary-foreground"
                : "text-slate-600 dark:text-slate-300"
                }`}
            >
              {pricingContent.billing.yearly}
            </button>
          </div>
        </div>

        {billingCycle === "yearly" ? (
          <p className="mb-6 inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-primary">
            {pricingContent.billing.yearlyBadge}
          </p>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-3">
          {displayPlans.map((plan) => (
            <article
              key={plan.id}
              className={`relative rounded-3xl border bg-white/90 p-6 shadow-sm transition hover:-translate-y-0.5 dark:bg-slate-950/65 ${plan.popular
                ? "border-primary/45 shadow-lg shadow-primary/20"
                : "border-slate-300/70 dark:border-slate-700"
                }`}
            >
              {plan.popular ? (
                <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.13em] text-primary-foreground">
                  Popular
                </span>
              ) : null}

              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{plan.name}</h3>
              <p className="mt-2 min-h-12 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {plan.description}
              </p>


              <div className="mt-5 flex items-baseline gap-1">
                <p className="text-4xl font-black text-slate-900 dark:text-slate-100">
                  {plan.id === PlanType.ENTERPRISE ? "Custom" : `$${plan.displayPrice.toFixed(2)}`}
                </p>
                {
                  plan?.id !== PlanType.ENTERPRISE &&
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    /{billingCycle === "monthly" ? "mo" : "yr"}
                  </p>}
              </div>

              <Link
                href={plan.id === "enterprise" ? "/en/about-us" : "/sign-up"}
                className={`mt-5 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition ${plan.popular
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-90"
                  : "border border-primary/35 text-primary hover:bg-primary/10"
                  }`}
              >
                {plan.cta}
              </Link>

              <ul className="mt-5 space-y-2.5 text-sm">
                {plan.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}

              </ul>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-primary/20 bg-white/85 p-5 dark:bg-slate-950/60">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {pricingContent.compare.title}
          </h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-160 border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-300/70 dark:border-slate-700">
                  <th className="py-3 pr-4 font-semibold text-slate-700 dark:text-slate-300">Feature</th>
                  <th className="px-3 py-3 font-semibold text-slate-700 dark:text-slate-300">Starter</th>
                  <th className="px-3 py-3 font-semibold text-slate-700 dark:text-slate-300">Pro</th>
                  <th className="px-3 py-3 font-semibold text-slate-700 dark:text-slate-300">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {/* Map over the keys of the FEATURES object */}
                {Object.keys(SUBSCRIPTION_LIMITS[PlanType.FREE].FEATURES as Record<string, boolean>).map((featureKey: string) => (
                  <tr key={featureKey} className="border-b border-slate-200/70 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    {/* 1. Feature Name: Convert SNAKE_CASE to Title Case */}
                    <td className="py-3 pr-4 text-slate-800 dark:text-slate-200 font-medium capitalize">
                      {featureKey.toLowerCase().replace(/_/g, " ")}
                    </td>

                    {/* 2. Free Plan Column */}
                    <td className="px-3 py-3 text-center">
                      {(SUBSCRIPTION_LIMITS as any)[PlanType.FREE]?.FEATURES[featureKey] ? <CheckMark /> : <CrossMark />}
                    </td>

                    {/* 3. Pro Plan Column */}
                    <td className="px-3 py-3 text-center">
                      {(SUBSCRIPTION_LIMITS as any)[PlanType.PRO]?.FEATURES[featureKey] ? <CheckMark /> : <CrossMark />}
                    </td>

                    {/* 4. Enterprise Plan Column */}
                    <td className="px-3 py-3 text-center">
                      {(SUBSCRIPTION_LIMITS as any)[PlanType.ENTERPRISE]?.FEATURES[featureKey] ? <CheckMark /> : <CrossMark />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {pricingContent.faq.title}
          </h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {pricingContent.faq.items.map((item) => (
              <article
                key={item.question}
                className="rounded-2xl border border-slate-300/70 bg-white/90 p-4 dark:border-slate-700 dark:bg-slate-950/55"
              >
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">{item.question}</h4>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckMark() {
  return <Check className="size-4 text-primary" aria-label="Included" />;
}

function CrossMark() {
  return <X className="size-4 text-slate-400" aria-label="Not included" />;
}