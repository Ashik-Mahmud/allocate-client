import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils/cn";
import { useLocale, useTranslations } from "next-intl";
import { LocaleSwitcher } from "../shared/LanguageToggler";

type MarketingLocaleNavProps = {
  activePath?: "/" | "/pricing" | "/about-us" | "/features" | "/case-study" | "/docs";
  ctaLabel?: string;
  ctaHref?: string;
};

const menuItems = [
  { href: "/pricing", labelKey: "nav.pricing" },
  { href: "/about-us", labelKey: "nav.about" },
  { href: "/features", labelKey: "nav.features" },
  { href: "/case-study", labelKey: "nav.caseStudy" },
  { href: "/docs", labelKey: "nav.docs", hiddenOnMobile: true },
] as const;

export function MarketingLocaleNav({ activePath, ctaLabel = "Try app", ctaHref = "/sign-up" }: MarketingLocaleNavProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <nav className="flex flex-wrap items-center gap-2 sm:gap-3">
      <ThemeToggle floating={false} />

      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium shadow-sm backdrop-blur transition",
            item.hiddenOnMobile && "hidden sm:inline-block",
            activePath === item.href
              ? "border-primary bg-primary text-primary-foreground shadow-primary/20"
              : "border-primary/25 bg-white/75 text-slate-800 hover:border-primary dark:border-primary/35 dark:bg-slate-900/70 dark:text-slate-200"
          )}
        >
          {t(item.labelKey)}
        </Link>
      ))}

      <Link
        href={ctaHref}
        className="rounded-full bg-linear-to-r from-primary to-brand-secondary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:opacity-90"
      >
        {ctaLabel}
      </Link>

      <Link
        href="/sign-in"
        className="rounded-full border border-primary/25 bg-white/75 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm backdrop-blur transition hover:border-primary dark:border-primary/35 dark:bg-slate-900/70 dark:text-slate-200"
      >
        {t("nav.signIn")}
      </Link>

      <LocaleSwitcher variant="pill-toggle" />
    </nav>
  );
}
