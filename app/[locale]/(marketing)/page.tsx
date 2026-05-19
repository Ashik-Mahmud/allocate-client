import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { MarketingLanding } from "@/components/marketing/MarketingLanding";



export default async function LocalizedMarketingPage() {

  return (
    <>   
     <MarketingLanding />
    </>
  );
}
