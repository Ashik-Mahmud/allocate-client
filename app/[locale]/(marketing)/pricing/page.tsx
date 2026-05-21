import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { PricingSection } from "@/components/marketing/Pricing";



export default async function LocalizedPricingPage() {

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_12%,color-mix(in_oklab,var(--primary)_15%,transparent),transparent_35%),radial-gradient(circle_at_82%_8%,color-mix(in_oklab,var(--color-brand-secondary)_15%,transparent),transparent_35%)]" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-10">
        <MarketingHeader badge="Pricing" activePath="/pricing" ctaLabel="Try app" ctaHref="/sign-up" />

        <div className="mb-2">
          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl dark:text-slate-100">
            Pricing Designed For Predictable Growth
          </h1>
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
