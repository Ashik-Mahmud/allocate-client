export const LOCALES = ["en", "bn"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";



export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function resolveLocaleFromAcceptLanguage(
  acceptLanguage?: string | null
): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const lower = acceptLanguage.toLowerCase();
  if (lower.includes("bn")) return "bn";

  return DEFAULT_LOCALE;
}

export function getOtherLocale(locale: Locale): Locale {
  return locale === "en" ? "bn" : "en";
}
