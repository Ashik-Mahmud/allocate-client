import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ChartNoAxesCombined, CircleCheckBig, GalleryVerticalEnd, LucideQuote, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

const caseStudyFeatureVisuals = {
  Auth: {
    src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    alt: "Security and access control product preview",
  },
  Resources: {
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    alt: "Resource management product preview",
  },
  Rules: {
    src: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=1200&q=80",
    alt: "Availability rules product preview",
  },
  Credits: {
    src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    alt: "Credits and billing product preview",
  },
} as const;

export async function CaseStudyPage() {
  const t = await getTranslations("caseStudy");
  const content = t.raw("page");

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_12%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_30%),radial-gradient(circle_at_86%_2%,color-mix(in_oklab,var(--color-brand-secondary)_12%,transparent),transparent_28%),linear-gradient(180deg,rgba(250,250,250,1)_0%,rgba(241,245,249,0.95)_42%,rgba(228,232,240,0.82)_100%)] dark:bg-[radial-gradient(circle_at_18%_12%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_32%),radial-gradient(circle_at_86%_2%,color-mix(in_oklab,var(--color-brand-secondary)_18%,transparent),transparent_30%),linear-gradient(180deg,rgba(2,6,23,1)_0%,rgba(15,23,42,0.97)_55%,rgba(3,7,18,1)_100%)]" />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <MarketingHeader badge={content.eyebrow} activePath="/case-study" ctaLabel="Try app" ctaHref="/sign-up" />

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{content.eyebrow}</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl">{content.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-700 dark:text-slate-300">{content.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-300/70 bg-white/75 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">Multi-tenant</span>
              <span className="rounded-full border border-slate-300/70 bg-white/75 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">Credits</span>
              <span className="rounded-full border border-slate-300/70 bg-white/75 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">Notifications</span>
              <span className="rounded-full border border-slate-300/70 bg-white/75 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">Role-based visibility</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/features" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:opacity-90">
                View feature overview
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/features" className="inline-flex items-center gap-2 rounded-full border border-slate-300/70 bg-white/75 px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:border-primary dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200">
                Try app
              </Link>
            </div>
          </div>

          <Card className="overflow-hidden border-slate-200/80 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-700 dark:bg-slate-950/60">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Try the app</p>
                  <CardTitle className="pt-2 text-2xl font-black text-slate-950 dark:text-slate-50">Dashboard screenshot slot</CardTitle>
                </div>
                <span className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Share your screen</span>
              </div>
              <CardDescription className="text-slate-700 dark:text-slate-300">Replace this image with your dashboard screenshot when you want to share the product story with a recruiter.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-slate-50 shadow-inner dark:border-slate-800 dark:bg-slate-950">
                <div className="relative aspect-16/10">
                  <Image
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80"
                    alt="Sample dashboard preview for Allocate"
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-tr from-slate-950/75 via-slate-950/20 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                    Placeholder dashboard image
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 grid gap-3 sm:grid-cols-3">
                    {[
                      ["Bookings", "32 active"],
                      ["Credits", "84% remaining"],
                      ["Alerts", "6 unread"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/75 p-3 text-white backdrop-blur">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{label}</p>
                        <p className="mt-1 text-sm font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {content.metrics.map((metric: any) => (
                  <div key={metric.label} className="rounded-2xl border border-slate-200/80 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                    <p className="text-lg font-black text-slate-950 dark:text-slate-50">{metric.value}</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{metric.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          {content.metrics.map((item: any) => (
            <Card key={item.label} className="border-slate-200/80 bg-white/80 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/60">
              <CardContent className="p-5">
                <p className="text-4xl font-black text-slate-950 dark:text-slate-50">{item.value}</p>
                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">{item.label}</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{item.detail}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-12 grid gap-4 xl:grid-cols-[1fr_1fr]">
          <Card className="border-slate-200/80 bg-white/80 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/60">
            <CardHeader>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                <Sparkles className="size-4" />
                {content.problem.eyebrow}
              </div>
              <CardTitle className="pt-2 text-2xl font-black text-slate-950 dark:text-slate-50">{content.problem.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700 dark:text-slate-300">
              {content.problem.paragraphs.map((paragraph: string) => (
                <p key={paragraph} className="leading-relaxed">{paragraph}</p>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white/80 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/60">
            <CardHeader>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                <CircleCheckBig className="size-4" />
                {content.solution.eyebrow}
              </div>
              <CardTitle className="pt-2 text-2xl font-black text-slate-950 dark:text-slate-50">{content.solution.title}</CardTitle>
              <CardDescription className="text-slate-700 dark:text-slate-300">{content.solution.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {content.solution.points.map((item: string) => (
                <div key={item} className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="mt-12 rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/60 sm:p-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{content.features.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50">{content.features.title}</h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">{content.features.subtitle}</p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {content.features.items.map((item: any) => (
              <div key={item.title} className="overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="relative aspect-16/10 overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
                  <Image
                    src={caseStudyFeatureVisuals[item.tag as keyof typeof caseStudyFeatureVisuals]?.src ?? caseStudyFeatureVisuals.Auth.src}
                    alt={caseStudyFeatureVisuals[item.tag as keyof typeof caseStudyFeatureVisuals]?.alt ?? item.title}
                    fill
                    sizes="(min-width: 1280px) 24vw, (min-width: 768px) 42vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-tr from-slate-950/70 via-slate-950/10 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                    {item.tag}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-slate-950 dark:text-slate-50">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/60 sm:p-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Feature overview</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50">Why this platform feels easy to understand</h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">The product is organized around the same core objects a recruiter would expect to see in a real team workflow: organizations, resources, bookings, credits, notifications, and dashboards.</p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["Organizations", "Scoped workspaces with isolated data and plans."],
              ["Resources", "Rooms, desks, and assets with clear availability."],
              ["Bookings", "Approval-friendly scheduling with status tracking."],
              ["Credits", "Usage and top-ups that are easy to explain."],
              ["Notifications", "Real-time reminders and operational alerts."],
              ["Dashboards", "Admin and staff views with the right level of detail."],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                <p className="text-sm font-bold text-slate-950 dark:text-slate-50">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="border-slate-200/80 bg-white/80 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/60">
            <CardHeader>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                <GalleryVerticalEnd className="size-4" />
                {content.flow.eyebrow}
              </div>
              <CardTitle className="pt-2 text-2xl font-black text-slate-950 dark:text-slate-50">{content.flow.title}</CardTitle>
              <CardDescription className="text-slate-700 dark:text-slate-300">{content.flow.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.flow.steps.map((item: any, index: number) => (
                <div key={item.title} className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{String(index + 1).padStart(2, "0")}</p>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.metric}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-slate-950 dark:text-slate-50">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-slate-200/80 bg-white/80 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/60">
              <CardHeader>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  <ChartNoAxesCombined className="size-4" />
                  {content.outcomes.eyebrow}
                </div>
                <CardTitle className="pt-2 text-2xl font-black text-slate-950 dark:text-slate-50">{content.outcomes.title}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                {content.outcomes.metrics.map((item: any) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                    <p className="text-2xl font-black text-slate-950 dark:text-slate-50">{item.value}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 bg-white/80 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/60">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start gap-3">
                  <LucideQuote className="mt-1 size-5 text-primary" />
                  <blockquote className="text-lg font-medium leading-relaxed text-slate-900 dark:text-slate-100">{content.outcomes.quote}</blockquote>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{content.outcomes.quoteAttribution}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/60 sm:p-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{content.notes.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50">{content.notes.title}</h2>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {content.notes.points.map((item: string) => (
              <div key={item} className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-primary/20 bg-linear-to-r from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-2xl shadow-slate-950/30 sm:p-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">{content.cta.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{content.cta.title}</h2>
            <p className="mt-4 text-white/78">{content.cta.subtitle}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                {content.cta.primary}
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/features" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                {content.cta.secondary}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
