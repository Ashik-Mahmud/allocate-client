import { MarketingHeader } from "@/components/marketing/MarketingHeader";

type LandingHeaderProps = {
  badge: string;
};

export function LandingHeader({ badge }: LandingHeaderProps) {
  return <MarketingHeader badge={badge} activePath="/" ctaLabel="Explore features" ctaHref="/features" />;
}