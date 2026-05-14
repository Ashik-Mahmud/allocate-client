import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useLocale, useTranslations } from "next-intl";
import { LocaleSwitcher } from "../shared/LanguageToggler";
import { Link } from "@/lib/navigation";

type MarketingLocaleNavProps = {
  pathSuffix?: "" | "/pricing" | "/about-us";
};

export function MarketingLocaleNav({ pathSuffix = "" }: MarketingLocaleNavProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <nav className="flex flex-wrap items-center gap-2 sm:gap-3">

     
      <ThemeToggle floating={false} />

      <Link
        href={`/pricing`}
        className="rounded-full border border-primary/25 bg-white/75 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm backdrop-blur transition hover:border-primary dark:border-primary/35 dark:bg-slate-900/70 dark:text-slate-200"
      >
        {t("nav.pricing")}
      </Link>

      <Link
        href={`/about-us`}
        className="rounded-full border border-primary/25 bg-white/75 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm backdrop-blur transition hover:border-primary dark:border-primary/35 dark:bg-slate-900/70 dark:text-slate-200"
      >
        {t("nav.about")}
      </Link>

      <Link
        href="/docs"
        className="hidden rounded-full border border-primary/25 bg-white/75 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm backdrop-blur transition hover:border-primary dark:border-primary/35 dark:bg-slate-900/70 dark:text-slate-200 sm:inline-block"
      >
        {t("nav.docs")}
      </Link>

      <Link
        href="/sign-in"
        className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:opacity-90"
      >
        {t("nav.signIn")}
      </Link>
       <LocaleSwitcher variant="pill-toggle" />
    </nav>
  );
}
