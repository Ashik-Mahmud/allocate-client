import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { getTranslations } from "next-intl/server";
import Image from "next/image";


export default async function AboutUsPage() {
  const t = await getTranslations("about");
  const values = t.raw("values");


  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_10%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_32%),radial-gradient(circle_at_80%_15%,color-mix(in_oklab,var(--color-brand-secondary)_18%,transparent),transparent_38%)]" />

      <section className="mx-auto w-full max-w-7xl px-6 py-10">
        <MarketingHeader badge="About" activePath="/about-us" ctaLabel="Try app" ctaHref="/sign-up" />

        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl dark:text-slate-100">{t("title")}</h1>
        </div>

        <p className="max-w-3xl text-lg leading-relaxed text-slate-700 dark:text-slate-300">{t("subtitle")}</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <Image
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80"
            alt="Team collaboration inside Allocate company"
            width={1400}
            height={933}
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="h-full min-h-80 w-full rounded-3xl border border-primary/25 object-cover shadow-xl shadow-primary/20"
          />

          <article className="rounded-3xl border border-primary/20 bg-white/75 p-6 shadow-sm backdrop-blur dark:bg-slate-900/70">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("storyTitle")}</h2>
            <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">{t("storyBody")}</p>

            <h3 className="mt-8 text-xl font-bold text-slate-900 dark:text-slate-100">{t("valuesTitle")}</h3>
            <ul className="mt-3 space-y-2 text-slate-700 dark:text-slate-300">
              {values?.map((item: string) => (
                <li key={item} className="rounded-xl border border-primary/15 bg-white/70 px-4 py-3 dark:bg-slate-950/40">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>

        <section className="mt-10 rounded-3xl border border-primary/25 bg-linear-to-r from-primary to-brand-secondary p-7 text-white shadow-xl shadow-primary/30">
          <h2 className="text-2xl font-black">{t("missionTitle")}</h2>
          <p className="mt-3 max-w-3xl text-white/90">{t("missionBody")}</p>
        </section>
      </section>
    </main>
  );
}
