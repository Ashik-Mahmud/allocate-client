"use client";

import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { DashboardPreviewSection } from "./DashboardPreviewSection";
import { FaqSection } from "./FaqSection";
import { FeatureGrid } from "./FeatureGrid";
import { FinalCtaSection } from "./FinalCtaSection";
import { HeroSection } from "./HeroSection";
import type { LandingContent } from "./landing-types";
import { OperationsSection } from "./OperationsSection";
import { StatStrip } from "./StatStrip";
import { WorkflowSection } from "./WorkflowSection";

const sectionFade: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export function MarketingLanding() {
  const locale = useLocale();
  const t = useTranslations();
  const content = t.raw("landing") as LandingContent;

  return (
    <main lang={locale} dir="ltr" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_10%,color-mix(in_oklab,var(--primary)_20%,transparent),transparent_30%),radial-gradient(circle_at_88%_0%,color-mix(in_oklab,var(--color-brand-secondary)_18%,transparent),transparent_28%),linear-gradient(180deg,rgba(248,250,252,1)_0%,rgba(241,245,249,0.94)_44%,rgba(226,232,240,0.8)_100%)] dark:bg-[radial-gradient(circle_at_12%_10%,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_32%),radial-gradient(circle_at_88%_0%,color-mix(in_oklab,var(--color-brand-secondary)_22%,transparent),transparent_30%),linear-gradient(180deg,rgba(2,6,23,1)_0%,rgba(15,23,42,0.97)_55%,rgba(3,7,18,1)_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-[repeating-linear-gradient(120deg,transparent,transparent_12px,rgba(15,23,42,0.035)_13px,rgba(15,23,42,0.035)_14px)] dark:bg-[repeating-linear-gradient(120deg,transparent,transparent_12px,rgba(148,163,184,0.06)_13px,rgba(148,163,184,0.06)_14px)]" />

      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <MarketingHeader badge={content.badge} activePath="/" ctaLabel={content.hero.primaryCta} ctaHref="/features" />

        <motion.div initial="hidden" animate="show" variants={sectionFade} className="space-y-20">
          <HeroSection locale={locale} content={content.hero} badge={content.badge} />
          <StatStrip stats={content.stats} />

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={sectionFade}>
            <FeatureGrid title={content.features.title} subtitle={content.features.subtitle} features={content.features.items} />
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={sectionFade}>
            <WorkflowSection title={content.workflow.title} subtitle={content.workflow.subtitle} steps={content.workflow.steps} />
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.22 }} variants={sectionFade}>
            <OperationsSection notifications={content.notifications} billing={content.billing} />
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={sectionFade}>
            <DashboardPreviewSection title={content.dashboard.title} subtitle={content.dashboard.subtitle} tabs={content.dashboard.tabs} />
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={sectionFade}>
            <FaqSection title={content.faq.title} items={content.faq.items} />
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={sectionFade}>
            <FinalCtaSection
              title={content.cta.title}
              subtitle={content.cta.subtitle}
              primaryCta={content.cta.primaryCta}
              secondaryCta={content.cta.secondaryCta}
            />
          </motion.div>

          <footer className="border-t border-slate-300/70 pt-8 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300">
            {content.footerCopy}
          </footer>
        </motion.div>
      </div>
    </main>
  );
}
