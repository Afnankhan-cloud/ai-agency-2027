import {
  getServerEnv,
  isConfiguredCheckoutUrl
} from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { MarketType } from "@/lib/analytics";

export type PricingTier = "launch" | "standard";

export interface MarketPricing {
  market: MarketType;
  provider: "razorpay" | "gumroad";
  currency: "INR" | "USD";
  launchPrice: number;
  regularPrice: number;
  activePrice: number;
  launchFormatted: string;
  regularFormatted: string;
  activeFormatted: string;
  title: string;
  subtitle: string;
  checkoutConfigured: boolean;
}

export interface LiveOfferState {
  paidOrdersCount: number;
  launchBuyerLimit: number;
  spotsRemaining: number;
  isLaunchActive: boolean;
  activeTier: PricingTier;
  launchEndAt: string | null;
  hasEndedByTime: boolean;
  hasEndedByVolume: boolean;
  isDatabaseConnected: boolean;
  india: MarketPricing;
  international: MarketPricing;
}

export const PRICING_CATALOG = {
  india: {
    market: "india" as const,
    provider: "razorpay" as const,
    currency: "INR" as const,
    launchPrice: 999,
    regularPrice: 1499,
    launchFormatted: "₹999",
    regularFormatted: "₹1,499",
    title: "India Launch Access",
    subtitle: "For buyers in India"
  },
  international: {
    market: "international" as const,
    provider: "gumroad" as const,
    currency: "USD" as const,
    launchPrice: 49,
    regularPrice: 79,
    launchFormatted: "$49",
    regularFormatted: "$79",
    title: "International Launch Access",
    subtitle: "For buyers worldwide"
  }
} as const;

async function fetchVerifiedPaidOrdersCount(): Promise<{
  count: number;
  connected: boolean;
}> {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return { count: 0, connected: false };
  }

  try {
    const { count, error } = await admin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("payment_status", "paid");

    if (error) {
      console.warn("Unable to read verified paid order count:", error.message);
      return { count: 0, connected: false };
    }

    return { count: count ?? 0, connected: true };
  } catch (err) {
    console.warn("Failed to query verified paid order count:", err);
    return { count: 0, connected: false };
  }
}

export async function getLiveOfferState(): Promise<LiveOfferState> {
  const serverEnv = getServerEnv();
  const launchBuyerLimit = serverEnv.LAUNCH_BUYER_LIMIT;
  const { count: paidOrdersCount, connected } = await fetchVerifiedPaidOrdersCount();

  let launchEndAt: string | null = null;
  let hasEndedByTime = false;

  if (serverEnv.LAUNCH_END_AT) {
    const parsedMs = Date.parse(serverEnv.LAUNCH_END_AT);
    if (!Number.isNaN(parsedMs)) {
      launchEndAt = new Date(parsedMs).toISOString();
      hasEndedByTime = Date.now() >= parsedMs;
    }
  }

  const hasEndedByVolume = paidOrdersCount >= launchBuyerLimit;
  const isLaunchActive = !hasEndedByVolume && !hasEndedByTime;
  const activeTier: PricingTier = isLaunchActive ? "launch" : "standard";
  const spotsRemaining = Math.max(0, launchBuyerLimit - paidOrdersCount);

  const indiaUrl = isLaunchActive
    ? serverEnv.RAZORPAY_LAUNCH_CHECKOUT_URL
    : serverEnv.RAZORPAY_STANDARD_CHECKOUT_URL;
  const intlUrl = isLaunchActive
    ? serverEnv.GUMROAD_LAUNCH_CHECKOUT_URL
    : serverEnv.GUMROAD_STANDARD_CHECKOUT_URL;

  return {
    paidOrdersCount,
    launchBuyerLimit,
    spotsRemaining,
    isLaunchActive,
    activeTier,
    launchEndAt,
    hasEndedByTime,
    hasEndedByVolume,
    isDatabaseConnected: connected,
    india: {
      ...PRICING_CATALOG.india,
      activePrice: isLaunchActive
        ? PRICING_CATALOG.india.launchPrice
        : PRICING_CATALOG.india.regularPrice,
      activeFormatted: isLaunchActive
        ? PRICING_CATALOG.india.launchFormatted
        : PRICING_CATALOG.india.regularFormatted,
      checkoutConfigured: isConfiguredCheckoutUrl(indiaUrl)
    },
    international: {
      ...PRICING_CATALOG.international,
      activePrice: isLaunchActive
        ? PRICING_CATALOG.international.launchPrice
        : PRICING_CATALOG.international.regularPrice,
      activeFormatted: isLaunchActive
        ? PRICING_CATALOG.international.launchFormatted
        : PRICING_CATALOG.international.regularFormatted,
      checkoutConfigured: isConfiguredCheckoutUrl(intlUrl)
    }
  };
}

export interface CheckoutResolution {
  configured: boolean;
  url: string | null;
  market: MarketType;
  provider: "razorpay" | "gumroad";
  tier: PricingTier;
  amount: number;
  currency: "INR" | "USD";
  priceFormatted: string;
}

export async function resolveCheckoutDestination(
  market: MarketType
): Promise<CheckoutResolution> {
  const serverEnv = getServerEnv();
  const offerState = await getLiveOfferState();
  const isLaunch = offerState.isLaunchActive;

  if (market === "india") {
    const url = isLaunch
      ? serverEnv.RAZORPAY_LAUNCH_CHECKOUT_URL
      : serverEnv.RAZORPAY_STANDARD_CHECKOUT_URL;

    return {
      configured: isConfiguredCheckoutUrl(url),
      url: isConfiguredCheckoutUrl(url) ? url : null,
      market: "india",
      provider: "razorpay",
      tier: offerState.activeTier,
      amount: offerState.india.activePrice,
      currency: "INR",
      priceFormatted: offerState.india.activeFormatted
    };
  }

  const url = isLaunch
    ? serverEnv.GUMROAD_LAUNCH_CHECKOUT_URL
    : serverEnv.GUMROAD_STANDARD_CHECKOUT_URL;

  return {
    configured: isConfiguredCheckoutUrl(url),
    url: isConfiguredCheckoutUrl(url) ? url : null,
    market: "international",
    provider: "gumroad",
    tier: offerState.activeTier,
    amount: offerState.international.activePrice,
    currency: "USD",
    priceFormatted: offerState.international.activeFormatted
  };
}
