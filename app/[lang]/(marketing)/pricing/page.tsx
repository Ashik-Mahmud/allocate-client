import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PricingSection } from "@/components/marketing/Pricing";
import { MarketingLocaleNav } from "@/components/marketing/MarketingLocaleNav";
import { isLocale } from "@/lib/i18n";
import { getMarketingLocaleContent } from "@/lib/marketing-content";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/pricing">): Promise<Metadata> {
  const { lang } = await params;

  if (!isLocale(lang)) return {};

  return {
    title: "Pricing | Allocate",
    description: "Choose the Allocate plan that fits your organization.",
    alternates: {
      canonical: "/en/pricing",
      languages: {
        "en-US": "/en/pricing",
      },
    },
  };
}

export default async function LocalizedPricingPage({
  params,
}: PageProps<"/[lang]/pricing">) {
  const { lang } = await params;

  if (!isLocale(lang)) notFound();

  if (lang === "bn") {
    redirect("/en/pricing");
  }

  const content = getMarketingLocaleContent("en");

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_12%,color-mix(in_oklab,var(--primary)_15%,transparent),transparent_35%),radial-gradient(circle_at_82%_8%,color-mix(in_oklab,var(--color-brand-secondary)_15%,transparent),transparent_35%)]" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-10">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl dark:text-slate-100">
            Pricing Designed For Predictable Growth
          </h1>
        <MarketingLocaleNav
          locale="en"
          pathSuffix="/pricing"
          labels={{
            pricing: content.nav.pricing,
            about: content.nav.about,
            docs: content.nav.docs,
            signIn: content.nav.signIn,
          }}
          language={content.language}
        />
      </div>
        <p className="max-w-3xl text-slate-700 dark:text-slate-300">
          Compare plans, choose your billing cycle, and scale your operations stack without re-platforming later.
        </p>

        <PricingSection />

        <div className="rounded-2xl border border-primary/20 bg-white/70 p-5 text-sm text-slate-700 shadow-sm dark:bg-slate-900/55 dark:text-slate-300">
          Need custom procurement or enterprise legal review? Reach our sales team and get a tailored rollout plan.
        </div>
      </section>
    </main>
  );
}
