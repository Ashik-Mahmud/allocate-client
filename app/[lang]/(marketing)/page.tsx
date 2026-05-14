import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { MarketingLanding } from "@/components/marketing/MarketingLanding";
import { isLocale } from "@/lib/i18n";
import { getMarketingLocaleContent } from "@/lib/marketing-content";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;

  if (!isLocale(lang)) return {};

  const current = getMarketingLocaleContent(lang).homeMetadata;

  return {
    title: current.title,
    description: current.description,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        "en-US": "/en",
        "bn-BD": "/bn",
      },
    },
    openGraph: {
      title: current.title,
      description: current.description,
      url: `/${lang}`,
      siteName: "Allocate",
      type: "website",
      images: [
        {
          url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
          width: 1400,
          height: 933,
          alt: "Operations planning team using Allocate",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: current.title,
      description: current.description,
      images: [
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
      ],
    },
  };
}

export default async function LocalizedMarketingPage({
  params,
}: PageProps<"/[lang]">) {
  const { lang } = await params;

  if (!isLocale(lang)) notFound();

  const content = getMarketingLocaleContent(lang);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Allocate",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: content.homeMetadata.jsonLdDescription,
    inLanguage: ["en", "bn"],
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: "0",
      category: "Free Trial",
    },
  };

  return (
    <>
      <Script
        id={`marketing-jsonld-${lang}`}
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c")}
      </Script>
      <MarketingLanding locale={lang} />
    </>
  );
}
