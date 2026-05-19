"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { CheckCircle2, Globe2, Sparkles, Workflow } from "lucide-react";
import { MarketingLocaleNav } from "@/components/marketing/MarketingLocaleNav";
import { useLocale, useTranslations } from "next-intl";
import { LocaleSwitcher } from "../shared/LanguageToggler";

const featureIconMap = {
  workflow: Workflow,
  sparkles: Sparkles,
  checkCircle: CheckCircle2,
} as const;

const sectionFade: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function MarketingLanding() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <main
      lang={locale === "en" ? "en" : "bn"}
      dir="ltr"
      className="relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_25%_15%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_32%),radial-gradient(circle_at_85%_10%,color-mix(in_oklab,var(--color-brand-secondary)_22%,transparent),transparent_35%),linear-gradient(180deg,rgba(248,250,252,1)_0%,rgba(241,245,249,0.95)_42%,rgba(226,232,240,0.8)_100%)] dark:bg-[radial-gradient(circle_at_25%_15%,color-mix(in_oklab,var(--primary)_30%,transparent),transparent_35%),radial-gradient(circle_at_85%_10%,color-mix(in_oklab,var(--color-brand-secondary)_28%,transparent),transparent_35%),linear-gradient(180deg,rgba(2,6,23,1)_0%,rgba(15,23,42,0.97)_55%,rgba(3,7,18,1)_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-[repeating-linear-gradient(120deg,transparent,transparent_12px,rgba(15,23,42,0.035)_13px,rgba(15,23,42,0.035)_14px)] dark:bg-[repeating-linear-gradient(120deg,transparent,transparent_12px,rgba(148,163,184,0.06)_13px,rgba(148,163,184,0.06)_14px)]" />

      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <header className="mb-14 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 shadow-sm backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/55 dark:text-slate-200">
            <Globe2 className="size-3.5" aria-hidden="true" />
            {t("landing.badge")}
          </div>

          <MarketingLocaleNav
            pathSuffix=""
          />
         
        </header>

        <motion.section
          initial="hidden"
          animate="show"
          variants={sectionFade}
          className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
              {t("landing.languageLabel")}: {t("language.name")}
            </p>
            <h1 className="text-balance text-4xl font-black leading-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-slate-100">
              {t("landing.heroTitle")}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
              {t("landing.heroSubtitle")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/sign-up"
                className="rounded-full bg-linear-to-r from-primary via-primary to-brand-secondary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/35 transition hover:scale-[1.02]"
              >
                {t("landing.heroPrimary")}
              </Link>
              <Link
                href={`/${locale}/pricing`}
                className="rounded-full border border-primary/35 bg-white/75 px-6 py-3 text-sm font-semibold text-slate-900 backdrop-blur transition hover:border-primary dark:border-primary/50 dark:bg-slate-900/60 dark:text-slate-100"
              >
                {t("landing.heroSecondary")}
              </Link>
            </div>

            <div className="mt-9 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {t.raw("landing.stats").map((stat: any) => (
                <StatCard key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>

          <motion.figure
            initial={{ opacity: 0, x: 36, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
            className="group relative"
          >
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-linear-to-r from-primary/35 to-brand-secondary/35 blur-2xl transition group-hover:from-primary/45 group-hover:to-brand-secondary/45" />
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80"
              alt="Operations team planning schedules on a wall display"
              width={1400}
              height={933}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="h-117.5 w-full rounded-[2rem] border border-white/40 object-cover shadow-2xl shadow-slate-900/25 dark:border-slate-700/60"
              loading="lazy"
            />
          </motion.figure>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={sectionFade}
          className="mt-24"
        >
          <h2 className="text-pretty text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
            {t("landing.trustTitle")}
          </h2>
          <p className="mt-3 max-w-3xl text-slate-700 dark:text-slate-300">{t("landing.trustSubtitle")}</p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {t.raw("landing.brands").map((brand: string) => (
              <div
                key={brand}
                className="rounded-2xl border border-slate-300/70 bg-white/75 px-4 py-5 text-center text-sm font-semibold text-slate-700 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200"
              >
                {brand}
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionFade}
          className="mt-24"
        >
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">{t("landing.featureTitle")}</h2>
          <p className="mt-3 text-slate-700 dark:text-slate-300">{t("landing.featureSubtitle")}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {t.raw("landing.features").map((feature: any, idx: number) => {
              const Icon = featureIconMap[feature.icon as keyof typeof featureIconMap];
              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className="rounded-3xl border border-slate-300/70 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/65"
                >
                  <span className="inline-grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow shadow-primary/30">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{feature.description}</p>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={sectionFade}
          className="mt-24 grid gap-6 rounded-[2rem] border border-slate-300/70 bg-white/75 p-8 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 md:grid-cols-3"
        >
          <div className="md:col-span-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("landing.workflowTitle")}</h2>
            <p className="mt-2 text-slate-700 dark:text-slate-300">{t("landing.workflowSubtitle")}</p>
          </div>
          {t.raw("landing.workflow").map((step: any, idx: number) => (
            <div key={step.title} className="rounded-2xl border border-slate-300/70 bg-white/70 p-5 dark:border-slate-700 dark:bg-slate-950/40">
              <p className="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                {String(idx + 1).padStart(2, "0")}
              </p>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{step.description}</p>
            </div>
          ))}
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionFade}
          className="mt-24"
        >
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">{t("landing.testimonialTitle")}</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {t.raw("landing.testimonials").map((item: any) => (
              <blockquote
                key={item.name}
                className="rounded-3xl border border-slate-300/70 bg-white/80 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/65"
              >
                <p className="text-slate-800 dark:text-slate-200">&quot;{item.quote}&quot;</p>
                <footer className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-100">{item.name}</strong>
                  <br />
                  {item.role}
                </footer>
              </blockquote>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionFade}
          className="mt-24 rounded-[2rem] border border-primary/30 bg-linear-to-r from-primary to-brand-secondary p-8 text-white shadow-2xl shadow-primary/35 sm:p-10"
        >
          <h2 className="text-2xl font-black sm:text-3xl">{t("landing.ctaTitle")}</h2>
          <p className="mt-3 max-w-2xl text-white/90">{t("landing.ctaSubtitle")}</p>
          <Link
            href="/sign-up"
            className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            {t("landing.ctaButton")}
          </Link>
        </motion.section>

        <footer className="mt-12 border-t border-slate-300/70 py-8 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300">
          {t("landing.footerCopy")}
        </footer>
      </div>
    </main>
  );
}

type StatCardProps = {
  value: string;
  label: string;
};

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-300/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
      <p className="text-xl font-black text-slate-900 dark:text-slate-100">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-600 dark:text-slate-400">{label}</p>
    </div>
  );
}
