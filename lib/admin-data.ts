import {
  getServerEnv,
  isConfiguredCheckoutUrl,
  isConfiguredSecret,
  isSupabaseAdminConfigured
} from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export interface DailyVisitorPoint {
  date: string;
  label: string;
  visitors: number;
}

export interface DailySalesPoint {
  date: string;
  label: string;
  indiaOrders: number;
  internationalOrders: number;
  totalOrders: number;
  inrRevenue: number;
  usdRevenue: number;
  estimatedUsdTotal: number;
}

export interface FunnelStep {
  stage: string;
  count: number;
  percentageOfVisitors: number;
}

export interface OrderRecord {
  id: string;
  provider: "razorpay" | "gumroad";
  provider_order_id: string;
  provider_payment_id: string | null;
  amount: number;
  currency: string;
  market: "india" | "international";
  pricing_tier: "launch" | "standard";
  payment_status: "paid" | "pending" | "failed" | "refunded";
  customer_email: string | null;
  paid_at: string;
}

export interface ConfigReadiness {
  supabaseAdmin: boolean;
  adminEmailConfigured: boolean;
  razorpayLaunchUrl: boolean;
  razorpayStandardUrl: boolean;
  razorpayWebhookSecret: boolean;
  gumroadLaunchUrl: boolean;
  gumroadStandardUrl: boolean;
  gumroadWebhookSecret: boolean;
  launchEndAt: string | null;
}

export interface AdminDashboardData {
  status: "ready" | "unconfigured" | "error";
  errorMessage?: string;
  adminEmail: string;
  usdToInrRate: number;
  launchBuyerLimit: number;
  metrics: {
    inrRevenue: number;
    usdRevenue: number;
    estimatedTotalUsd: number;
    estimatedTotalInr: number;
    paidOrdersCount: number;
    indiaOrdersCount: number;
    internationalOrdersCount: number;
    uniqueVisitors: number;
    conversionRate: number;
    ctaClicks: number;
    checkoutStarts: number;
  };
  dailyVisitors: DailyVisitorPoint[];
  dailySales: DailySalesPoint[];
  marketBreakdown: Array<{
    market: string;
    orders: number;
    nativeRevenueLabel: string;
    estimatedUsd: number;
    sharePercent: number;
  }>;
  funnel: FunnelStep[];
  recentOrders: OrderRecord[];
  readiness: ConfigReadiness;
  fetchedAt: string;
}

function getLastNDaysKeys(days: number): Array<{ date: string; label: string }> {
  const result: Array<{ date: string; label: string }> = [];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - offset);
    const isoDate = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC"
    });
    result.push({ date: isoDate, label });
  }

  return result;
}

function getReadiness(): ConfigReadiness {
  const serverEnv = getServerEnv();
  return {
    supabaseAdmin: isSupabaseAdminConfigured(),
    adminEmailConfigured: Boolean(serverEnv.ADMIN_EMAIL),
    razorpayLaunchUrl: isConfiguredCheckoutUrl(serverEnv.RAZORPAY_LAUNCH_CHECKOUT_URL),
    razorpayStandardUrl: isConfiguredCheckoutUrl(serverEnv.RAZORPAY_STANDARD_CHECKOUT_URL),
    razorpayWebhookSecret: isConfiguredSecret(serverEnv.RAZORPAY_WEBHOOK_SECRET),
    gumroadLaunchUrl: isConfiguredCheckoutUrl(serverEnv.GUMROAD_LAUNCH_CHECKOUT_URL),
    gumroadStandardUrl: isConfiguredCheckoutUrl(serverEnv.GUMROAD_STANDARD_CHECKOUT_URL),
    gumroadWebhookSecret: isConfiguredSecret(serverEnv.GUMROAD_WEBHOOK_SECRET),
    launchEndAt: serverEnv.LAUNCH_END_AT ?? null
  };
}

export async function getAdminDashboardData(adminEmail: string): Promise<AdminDashboardData> {
  const serverEnv = getServerEnv();
  const readiness = getReadiness();
  const dayWindow = getLastNDaysKeys(14);
  const usdToInrRate = serverEnv.USD_TO_INR_RATE;

  const emptyBase: AdminDashboardData = {
    status: "unconfigured",
    adminEmail,
    usdToInrRate,
    launchBuyerLimit: serverEnv.LAUNCH_BUYER_LIMIT,
    metrics: {
      inrRevenue: 0,
      usdRevenue: 0,
      estimatedTotalUsd: 0,
      estimatedTotalInr: 0,
      paidOrdersCount: 0,
      indiaOrdersCount: 0,
      internationalOrdersCount: 0,
      uniqueVisitors: 0,
      conversionRate: 0,
      ctaClicks: 0,
      checkoutStarts: 0
    },
    dailyVisitors: dayWindow.map((d) => ({ ...d, visitors: 0 })),
    dailySales: dayWindow.map((d) => ({
      ...d,
      indiaOrders: 0,
      internationalOrders: 0,
      totalOrders: 0,
      inrRevenue: 0,
      usdRevenue: 0,
      estimatedUsdTotal: 0
    })),
    marketBreakdown: [
      {
        market: "India (Razorpay)",
        orders: 0,
        nativeRevenueLabel: "₹0",
        estimatedUsd: 0,
        sharePercent: 0
      },
      {
        market: "International (Gumroad)",
        orders: 0,
        nativeRevenueLabel: "$0",
        estimatedUsd: 0,
        sharePercent: 0
      }
    ],
    funnel: [
      { stage: "Visitors", count: 0, percentageOfVisitors: 0 },
      { stage: "CTA Clicks", count: 0, percentageOfVisitors: 0 },
      { stage: "Checkout Starts", count: 0, percentageOfVisitors: 0 },
      { stage: "Verified Purchases", count: 0, percentageOfVisitors: 0 }
    ],
    recentOrders: [],
    readiness,
    fetchedAt: new Date().toISOString()
  };

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return {
      ...emptyBase,
      status: "unconfigured",
      errorMessage:
        "Supabase admin credentials (SUPABASE_SERVICE_ROLE_KEY) are not configured yet."
    };
  }

  try {
    const [ordersRes, eventsRes] = await Promise.all([
      adminClient
        .from("orders")
        .select(
          "id, provider, provider_order_id, provider_payment_id, amount, currency, market, pricing_tier, payment_status, customer_email, paid_at"
        )
        .eq("payment_status", "paid")
        .order("paid_at", { ascending: false })
        .limit(2000),
      adminClient
        .from("analytics_events")
        .select("event_name, session_id, created_at")
        .order("created_at", { ascending: false })
        .limit(10000)
    ]);

    if (ordersRes.error) {
      return {
        ...emptyBase,
        status: "error",
        errorMessage: `Failed to query orders table: ${ordersRes.error.message}`
      };
    }

    if (eventsRes.error) {
      return {
        ...emptyBase,
        status: "error",
        errorMessage: `Failed to query analytics_events table: ${eventsRes.error.message}`
      };
    }

    const paidOrders = (ordersRes.data ?? []) as Array<{
      id: string;
      provider: "razorpay" | "gumroad";
      provider_order_id: string;
      provider_payment_id: string | null;
      amount: number | string;
      currency: string;
      market: "india" | "international";
      pricing_tier: "launch" | "standard";
      payment_status: "paid" | "pending" | "failed" | "refunded";
      customer_email: string | null;
      paid_at: string;
    }>;

    const events = (eventsRes.data ?? []) as Array<{
      event_name: "page_view" | "cta_click" | "checkout_start";
      session_id: string;
      created_at: string;
    }>;

    // Aggregate revenue and orders
    let inrRevenue = 0;
    let usdRevenue = 0;
    let indiaOrdersCount = 0;
    let internationalOrdersCount = 0;

    const salesByDay = new Map<string, DailySalesPoint>();
    for (const day of dayWindow) {
      salesByDay.set(day.date, {
        ...day,
        indiaOrders: 0,
        internationalOrders: 0,
        totalOrders: 0,
        inrRevenue: 0,
        usdRevenue: 0,
        estimatedUsdTotal: 0
      });
    }

    const normalizedOrders: OrderRecord[] = paidOrders.map((order) => {
      const numericAmount = Number(order.amount) || 0;
      const currencyUpper = (order.currency || "USD").toUpperCase();

      if (currencyUpper === "INR") {
        inrRevenue += numericAmount;
      } else {
        usdRevenue += numericAmount;
      }

      if (order.market === "india") {
        indiaOrdersCount += 1;
      } else {
        internationalOrdersCount += 1;
      }

      const dayKey = new Date(order.paid_at).toISOString().slice(0, 10);
      const dayBucket = salesByDay.get(dayKey);
      if (dayBucket) {
        dayBucket.totalOrders += 1;
        if (order.market === "india") {
          dayBucket.indiaOrders += 1;
        } else {
          dayBucket.internationalOrders += 1;
        }
        if (currencyUpper === "INR") {
          dayBucket.inrRevenue += numericAmount;
        } else {
          dayBucket.usdRevenue += numericAmount;
        }
        dayBucket.estimatedUsdTotal = Number(
          (dayBucket.usdRevenue + dayBucket.inrRevenue / usdToInrRate).toFixed(2)
        );
      }

      return {
        ...order,
        amount: numericAmount,
        currency: currencyUpper
      };
    });

    const indiaEstimatedUsd = inrRevenue / usdToInrRate;
    const estimatedTotalUsd = Number((usdRevenue + indiaEstimatedUsd).toFixed(2));
    const estimatedTotalInr = Math.round(inrRevenue + usdRevenue * usdToInrRate);

    // Aggregate analytics events
    const visitorSessions = new Set<string>();
    const visitorsByDay = new Map<string, Set<string>>();
    for (const day of dayWindow) {
      visitorsByDay.set(day.date, new Set<string>());
    }

    let ctaClicks = 0;
    let checkoutStarts = 0;

    for (const ev of events) {
      if (ev.event_name === "page_view") {
        visitorSessions.add(ev.session_id);
        const dayKey = new Date(ev.created_at).toISOString().slice(0, 10);
        const daySet = visitorsByDay.get(dayKey);
        if (daySet) {
          daySet.add(ev.session_id);
        }
      } else if (ev.event_name === "cta_click") {
        ctaClicks += 1;
      } else if (ev.event_name === "checkout_start") {
        checkoutStarts += 1;
      }
    }

    const uniqueVisitors = visitorSessions.size;
    const paidOrdersCount = normalizedOrders.length;
    const conversionRate =
      uniqueVisitors > 0 ? Number(((paidOrdersCount / uniqueVisitors) * 100).toFixed(2)) : 0;

    const dailyVisitors: DailyVisitorPoint[] = dayWindow.map((day) => ({
      ...day,
      visitors: visitorsByDay.get(day.date)?.size ?? 0
    }));

    const dailySales = Array.from(salesByDay.values());

    const indiaShare =
      estimatedTotalUsd > 0
        ? Number(((indiaEstimatedUsd / estimatedTotalUsd) * 100).toFixed(1))
        : 0;
    const intlShare =
      estimatedTotalUsd > 0
        ? Number(((usdRevenue / estimatedTotalUsd) * 100).toFixed(1))
        : 0;

    const pct = (count: number) =>
      uniqueVisitors > 0 ? Number(((count / uniqueVisitors) * 100).toFixed(1)) : 0;

    return {
      status: "ready",
      adminEmail,
      usdToInrRate,
      launchBuyerLimit: serverEnv.LAUNCH_BUYER_LIMIT,
      metrics: {
        inrRevenue,
        usdRevenue,
        estimatedTotalUsd,
        estimatedTotalInr,
        paidOrdersCount,
        indiaOrdersCount,
        internationalOrdersCount,
        uniqueVisitors,
        conversionRate,
        ctaClicks,
        checkoutStarts
      },
      dailyVisitors,
      dailySales,
      marketBreakdown: [
        {
          market: "India (Razorpay)",
          orders: indiaOrdersCount,
          nativeRevenueLabel: new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
          }).format(inrRevenue),
          estimatedUsd: Number(indiaEstimatedUsd.toFixed(2)),
          sharePercent: indiaShare
        },
        {
          market: "International (Gumroad)",
          orders: internationalOrdersCount,
          nativeRevenueLabel: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
          }).format(usdRevenue),
          estimatedUsd: Number(usdRevenue.toFixed(2)),
          sharePercent: intlShare
        }
      ],
      funnel: [
        { stage: "Visitors", count: uniqueVisitors, percentageOfVisitors: uniqueVisitors > 0 ? 100 : 0 },
        { stage: "CTA Clicks", count: ctaClicks, percentageOfVisitors: pct(ctaClicks) },
        { stage: "Checkout Starts", count: checkoutStarts, percentageOfVisitors: pct(checkoutStarts) },
        { stage: "Verified Purchases", count: paidOrdersCount, percentageOfVisitors: pct(paidOrdersCount) }
      ],
      recentOrders: normalizedOrders.slice(0, 20),
      readiness,
      fetchedAt: new Date().toISOString()
    };
  } catch (err) {
    return {
      ...emptyBase,
      status: "error",
      errorMessage: err instanceof Error ? err.message : "Unexpected database query error."
    };
  }
}
