import { AnalyticsTracker } from "@/components/analytics-tracker";
import { Audience } from "@/components/audience";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Opportunity } from "@/components/opportunity";
import { Pricing } from "@/components/pricing";
import { SiteHeader } from "@/components/site-header";
import { Testimonials } from "@/components/testimonials";
import { WhatsInside } from "@/components/whats-inside";
import type { MarketType } from "@/lib/analytics";
import { BRAND } from "@/lib/constants";
import { getPublicEnv } from "@/lib/env";
import { getLiveOfferState } from "@/lib/pricing";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams?: {
    checkout?: string;
    market?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const offerState = await getLiveOfferState();
  const publicEnv = getPublicEnv();
  const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

  const initialPendingMarket: MarketType | undefined =
    searchParams?.checkout === "pending" &&
    (searchParams.market === "india" || searchParams.market === "international")
      ? searchParams.market
      : undefined;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: BRAND.productFullTitle,
    description:
      "Instantly delivered ZIP bundle containing a complete AI automation agency ebook, practical workbooks and templates, 10 ready-to-use n8n automation workflows, and a step-by-step first client guide.",
    brand: {
      "@type": "Brand",
      name: BRAND.name
    },
    category: "Digital Education & Automation Templates",
    offers: [
      {
        "@type": "Offer",
        name: "India Launch Access",
        price: offerState.india.activePrice,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/#pricing`
      },
      {
        "@type": "Offer",
        name: "International Launch Access",
        price: offerState.international.activePrice,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/#pricing`
      }
    ]
  };

  return (
    <div className="relative min-h-screen bg-[#06080f]">
      {/* Subtle grid + noise backdrop */}
      <div
        aria-hidden="true"
        className="bg-grid-pattern pointer-events-none fixed inset-0 -z-20 opacity-65"
      />
      <div
        aria-hidden="true"
        className="bg-noise-overlay pointer-events-none fixed inset-0 -z-10"
      />

      <AnalyticsTracker />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <SiteHeader />

      <main>
        <Hero />
        <WhatsInside />
        <Opportunity />
        <Audience />
        <Testimonials />
        <Pricing
          offerState={offerState}
          initialPendingMarket={initialPendingMarket}
        />
        <Faq />
        <FinalCta offerState={offerState} />
      </main>

      <Footer contactEmail={publicEnv.NEXT_PUBLIC_CONTACT_EMAIL} />
    </div>
  );
}
