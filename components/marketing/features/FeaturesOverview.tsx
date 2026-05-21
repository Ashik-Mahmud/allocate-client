"use client";

import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeCheck, Building2, CalendarDays, CreditCard, Inbox, LockKeyhole, Megaphone, Network, ShieldCheck, Table2, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const iconMap = {
  auth: LockKeyhole,
  organization: Building2,
  resources: Network,
  rules: ShieldCheck,
  bookings: CalendarDays,
  billing: CreditCard,
  notifications: Inbox,
  dashboard: Table2,
  community: Megaphone,
  admin: Users,
} as const;

const featureVisuals = {
  auth: {
    src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    alt: "Security and access control dashboard view",
  },
  organization: {
    src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    alt: "Organization workspace dashboard view",
  },
  resources: {
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    alt: "Resource planning workspace dashboard view",
  },
  rules: {
    src: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=1200&q=80",
    alt: "Scheduling rules and calendar dashboard view",
  },
  bookings: {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    alt: "Booking operations dashboard view",
  },
  billing: {
    src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    alt: "Billing and revenue dashboard view",
  },
  notifications: {
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    alt: "Notifications and alerts dashboard view",
  },
  dashboard: {
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    alt: "Analytics dashboard view",
  },
  community: {
    src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
    alt: "Community collaboration dashboard view",
  },
  admin: {
    src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
    alt: "Admin operations dashboard view",
  },
} as const;

export function FeaturesOverview() {
  const t = useTranslations("features");
  const [view, setView] = useState("admin");
  const content = t.raw("page");

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_10%_10%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_28%),radial-gradient(circle_at_88%_0%,color-mix(in_oklab,var(--color-brand-secondary)_16%,transparent),transparent_30%),linear-gradient(180deg,rgba(248,250,252,1)_0%,rgba(241,245,249,0.96)_42%,rgba(226,232,240,0.82)_100%)] dark:bg-[radial-gradient(circle_at_10%_10%,color-mix(in_oklab,var(--primary)_24%,transparent),transparent_30%),radial-gradient(circle_at_88%_0%,color-mix(in_oklab,var(--color-brand-secondary)_20%,transparent),transparent_32%),linear-gradient(180deg,rgba(2,6,23,1)_0%,rgba(15,23,42,0.97)_55%,rgba(3,7,18,1)_100%)]" />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <MarketingHeader badge={content.eyebrow} activePath="/features" ctaLabel="Try app" ctaHref="/sign-up" />

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{content.eyebrow}</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl">{content.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-700 dark:text-slate-300">{content.subtitle}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {content.categories.slice(0, 4).map((item: any) => (
                <span key={item.title} className="rounded-full border border-slate-300/70 bg-white/75 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                  {item.tag}
                </span>
              ))}
            </div>
          </div>

          <Card className="overflow-hidden border-slate-200/80 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-700 dark:bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-slate-950 dark:text-slate-50">Feature map</CardTitle>
              <CardDescription className="text-slate-700 dark:text-slate-300">A minimal product surface preview aligned to the Allocate feature set.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {[
                ["Access", "Auth + role control"],
                ["Resources", "Rooms, desks, assets"],
                ["Rules", "Availability checks"],
                ["Billing", "Credits + subscriptions"],
              ].map(([label, desc]) => (
                <div key={label} className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{label}</p>
                  <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">{desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {content.categories.map((item: any) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const visual = featureVisuals[item.icon as keyof typeof featureVisuals] ?? featureVisuals.dashboard;
            return (
              <Card key={item.title} className="overflow-hidden border-slate-200/80 bg-white/80 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/60">
                <div className="relative aspect-16/10 overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
                  <Image src={visual.src} alt={visual.alt} fill sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw" className="object-cover" />
                  <div className="absolute inset-0 bg-linear-to-tr from-slate-950/70 via-slate-950/10 to-transparent" />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                    <Icon className="size-3.5" aria-hidden="true" />
                    {item.tag}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="max-w-56 text-lg font-black leading-tight text-white drop-shadow">{item.title}</p>
                  </div>
                </div>
                <CardHeader className="space-y-3">
                  <CardDescription className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </section>

        <section className="mt-12 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-slate-200/80 bg-white/80 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-slate-950 dark:text-slate-50">{content.roleTitle}</CardTitle>
              <CardDescription className="text-slate-700 dark:text-slate-300">{content.roleSubtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={view} onValueChange={setView} className="gap-4">
                <TabsList className="w-full justify-start rounded-full border border-slate-200/80 bg-slate-100/80 p-1 dark:border-slate-800 dark:bg-slate-900/70">
                  {content.roles.map((role: any) => (
                    <TabsTrigger key={role.id} value={role.id} className="rounded-full px-4 py-2 text-sm">
                      {role.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {content.roles.map((role: any) => (
                  <TabsContent key={role.id} value={role.id}>
                    <div className="mt-4 rounded-3xl border border-slate-200/80 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{role.eyebrow}</p>
                      <h3 className="mt-2 text-xl font-bold text-slate-950 dark:text-slate-50">{role.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{role.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {role.support.map((support: string) => (
                          <span key={support} className="rounded-full border border-slate-300/70 bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                            {support}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white/80 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/60">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-slate-950 dark:text-slate-50">{content.foundationTitle}</CardTitle>
              <CardDescription className="text-slate-700 dark:text-slate-300">{content.foundationSubtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {content.foundation.map((item: any) => (
                <div key={item.title} className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="flex items-start gap-3">
                    <BadgeCheck className="mt-0.5 size-4 text-primary" />
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-slate-50">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="mt-12 rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/60 sm:p-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{content.supportTitle}</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50">{content.supportSubtitle}</h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">{content.supportBody}</p>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 dark:bg-slate-900/60">
                  <TableHead className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-300">Capability</TableHead>
                  <TableHead className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-300">Admin</TableHead>
                  <TableHead className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-300">Org admin</TableHead>
                  <TableHead className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-300">Staff</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {content.supportRows.map((row: any) => (
                  <TableRow key={row.label}>
                    <TableCell className="px-4 py-4 font-medium text-slate-950 dark:text-slate-50">{row.label}</TableCell>
                    <TableCell className="px-4 py-4 text-slate-700 dark:text-slate-300">{row.admin}</TableCell>
                    <TableCell className="px-4 py-4 text-slate-700 dark:text-slate-300">{row.orgAdmin}</TableCell>
                    <TableCell className="px-4 py-4 text-slate-700 dark:text-slate-300">{row.staff}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-primary/20 bg-linear-to-r from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-2xl shadow-slate-950/30 sm:p-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">{content.ctaEyebrow}</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{content.ctaTitle}</h2>
            <p className="mt-4 text-white/78">{content.ctaSubtitle}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/sign-up" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                {content.ctaPrimary}
              </Link>
              <Link href="/case-study" className="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                {content.ctaSecondary}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
