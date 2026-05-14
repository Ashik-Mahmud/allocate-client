import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import type { Locale } from "@/lib/i18n";

type MarketingLocaleNavProps = {
  locale: Locale;
  pathSuffix: "" | "/pricing" | "/about-us";
  labels: {
    pricing: string;
    about: string;
    docs: string;
    signIn: string;
  };
  language: {
    switchToEnglishAria: string;
    switchToBanglaAria: string;
    switcherEnglish: string;
    switcherBangla: string;
  };
};

export function MarketingLocaleNav({
  locale,
  pathSuffix,
  labels,
  language,
}: MarketingLocaleNavProps) {
  return (
    <nav className="flex flex-wrap items-center gap-2 sm:gap-3">
      <div className="rounded-full border border-primary/25 bg-white/75 p-1 text-xs shadow-sm backdrop-blur dark:border-primary/35 dark:bg-slate-900/70">
        <Link
          href={`/en${pathSuffix}`}
          aria-label={language.switchToEnglishAria}
          className={`inline-block rounded-full px-3 py-1.5 font-semibold transition ${
            locale === "en"
              ? "bg-primary text-primary-foreground"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          }`}
        >
          {language.switcherEnglish}
        </Link>
        <Link
          href={`/bn${pathSuffix}`}
          aria-label={language.switchToBanglaAria}
          className={`inline-block rounded-full px-3 py-1.5 font-semibold transition ${
            locale === "bn"
              ? "bg-primary text-primary-foreground"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          }`}
        >
          {language.switcherBangla}
        </Link>
      </div>

      <ThemeToggle floating={false} className="h-9 w-9" />

      <Link
        href={`/${locale}/pricing`}
        className="rounded-full border border-primary/25 bg-white/75 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm backdrop-blur transition hover:border-primary dark:border-primary/35 dark:bg-slate-900/70 dark:text-slate-200"
      >
        {labels.pricing}
      </Link>

      <Link
        href={`/${locale}/about-us`}
        className="rounded-full border border-primary/25 bg-white/75 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm backdrop-blur transition hover:border-primary dark:border-primary/35 dark:bg-slate-900/70 dark:text-slate-200"
      >
        {labels.about}
      </Link>

      <Link
        href="/docs"
        className="hidden rounded-full border border-primary/25 bg-white/75 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm backdrop-blur transition hover:border-primary dark:border-primary/35 dark:bg-slate-900/70 dark:text-slate-200 sm:inline-block"
      >
        {labels.docs}
      </Link>

      <Link
        href="/sign-in"
        className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:opacity-90"
      >
        {labels.signIn}
      </Link>
    </nav>
  );
}
