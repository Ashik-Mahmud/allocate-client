import type { Locale } from "@/lib/i18n";
import marketingLocaleContent from "@/data/marketing/marketing-locale-content.json";

type IconKey = "workflow" | "sparkles" | "checkCircle";

export type MarketingLocaleContent = {
  language: {
    code: string;
    name: string;
    switchToEnglishAria: string;
    switchToBanglaAria: string;
    switcherEnglish: string;
    switcherBangla: string;
  };
  nav: {
    pricing: string;
    about: string;
    docs: string;
    signIn: string;
  };
  homeMetadata: {
    title: string;
    description: string;
    jsonLdDescription: string;
  };
  landing: {
    badge: string;
    languageLabel: string;
    heroTitle: string;
    heroSubtitle: string;
    heroPrimary: string;
    heroSecondary: string;
    stats: Array<{ label: string; value: string }>;
    trustTitle: string;
    trustSubtitle: string;
    brands: string[];
    featureTitle: string;
    featureSubtitle: string;
    features: Array<{
      title: string;
      description: string;
      icon: IconKey;
    }>;
    workflowTitle: string;
    workflowSubtitle: string;
    workflow: Array<{
      title: string;
      description: string;
    }>;
    testimonialTitle: string;
    testimonials: Array<{
      name: string;
      role: string;
      quote: string;
    }>;
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButton: string;
    footerCopy: string;
  };
  about: {
    metadataTitle: string;
    metadataDescription: string;
    title: string;
    subtitle: string;
    storyTitle: string;
    storyBody: string;
    valuesTitle: string;
    values: string[];
    missionTitle: string;
    missionBody: string;
  };
};

const locales = marketingLocaleContent.locales as Record<Locale, MarketingLocaleContent>;

export function getMarketingLocaleContent(locale: Locale): MarketingLocaleContent {
  return locales[locale];
}
