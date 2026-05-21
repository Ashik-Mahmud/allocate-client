"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

type AuthShellProps = {
  badge: string;
  title: string;
  description: string;
  highlights: string[];
  image: {
    src: string;
    alt: string;
  };
  children: ReactNode;
};

export function AuthShell({ badge, title, description, highlights, image, children }: AuthShellProps) {
  return (
    <div className="overflow-hidden  rounded-[2rem] border  border-slate-200/80 bg-white/85 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative isolate overflow-hidden border-b border-slate-200/80 bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 text-white lg:border-b-0 lg:border-r lg:min-h-168">
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover opacity-35 mix-blend-screen" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.16),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.34)_0%,rgba(2,6,23,0.82)_100%)]" />

          <div className="relative flex h-full flex-col justify-between p-8 sm:p-10 lg:p-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85 backdrop-blur">
                <span className="size-2 rounded-full bg-emerald-400" />
                {badge}
              </div>

              <div className="max-w-xl space-y-4">
                <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-[2.75rem]">{title}</h2>
                <p className="max-w-lg text-sm leading-7 text-white/76 sm:text-base">{description}</p>
              </div>
            </div>

            <div className="space-y-4 pt-10">
              <div className="grid gap-3 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div key={item} className="rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur">
                    <div className="flex items-start gap-3">
                      <Check className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                      <p className="text-sm leading-6 text-white/82">{item}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Workflows", "Bookings and credits"],
                  ["Visibility", "Role-aware access"],
                  ["Signals", "Realtime alerts"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-3xl border border-white/10 bg-black/18 p-4 backdrop-blur">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">{label}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br grid place-items-center from-white via-white to-slate-50 p-6 sm:p-8 lg:p-12 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
          {children}
        </div>
      </div>
    </div>
  );
}