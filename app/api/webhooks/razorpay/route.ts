import crypto from "crypto";
import { NextResponse } from "next/server";
import { getServerEnv, isConfiguredSecret } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface RazorpayPaymentEntity {
  id?: string;
  order_id?: string | null;
  amount?: number;
  currency?: string;
  status?: string;
  email?: string;
  created_at?: number;
  notes?: Record<string, string>;
}

interface RazorpayOrderEntity {
  id?: string;
  amount?: number;
  amount_paid?: number;
  currency?: string;
  status?: string;
  created_at?: number;
  notes?: Record<string, string>;
}

interface RazorpayPaymentLinkEntity {
  id?: string;
  amount?: number;
  amount_paid?: number;
  currency?: string;
  status?: string;
  customer?: { email?: string };
  updated_at?: number;
  notes?: Record<string, string>;
}

interface RazorpayWebhookPayload {
  event?: string;
  payload?: {
    payment?: { entity?: RazorpayPaymentEntity };
    order?: { entity?: RazorpayOrderEntity };
    payment_link?: { entity?: RazorpayPaymentLinkEntity };
  };
}

function timingSafeHexCompare(expectedHex: string, actualHex: string): boolean {
  const expected = Buffer.from(expectedHex.trim(), "utf8");
  const actual = Buffer.from(actualHex.trim(), "utf8");
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

export async function POST(request: Request) {
  const serverEnv = getServerEnv();
  const webhookSecret = serverEnv.RAZORPAY_WEBHOOK_SECRET;

  if (!isConfiguredSecret(webhookSecret)) {
    return NextResponse.json(
      { error: "Razorpay webhook secret is not configured" },
      { status: 503 }
    );
  }

  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing x-razorpay-signature header" },
      { status: 401 }
    );
  }

  const rawBody = await request.text();
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (!timingSafeHexCompare(expectedSignature, signature)) {
    return NextResponse.json(
      { error: "Invalid Razorpay webhook signature" },
      { status: 401 }
    );
  }

  let body: RazorpayWebhookPayload;
  try {
    body = JSON.parse(rawBody) as RazorpayWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const eventType = body.event ?? "";
  const paymentEntity = body.payload?.payment?.entity;
  const orderEntity = body.payload?.order?.entity;
  const linkEntity = body.payload?.payment_link?.entity;

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Supabase admin client is not configured" },
      { status: 503 }
    );
  }

  // Handle refund status updates so refunded payments are excluded from revenue
  if (eventType === "payment.refunded" || eventType === "refund.processed") {
    const orderId = orderEntity?.id ?? paymentEntity?.order_id ?? null;
    const paymentId = paymentEntity?.id ?? null;

    if (orderId) {
      await admin
        .from("orders")
        .update({ payment_status: "refunded", raw_event_type: eventType })
        .eq("provider", "razorpay")
        .eq("provider_order_id", orderId);
    } else if (paymentId) {
      await admin
        .from("orders")
        .update({ payment_status: "refunded", raw_event_type: eventType })
        .eq("provider", "razorpay")
        .eq("provider_payment_id", paymentId);
    }

    return NextResponse.json({ received: true, status: "refund_processed" });
  }

  const isConfirmedPaidEvent =
    (eventType === "payment.captured" && paymentEntity?.status === "captured") ||
    (eventType === "order.paid" &&
      (orderEntity?.status === "paid" || paymentEntity?.status === "captured")) ||
    (eventType === "payment_link.paid" &&
      (linkEntity?.status === "paid" || paymentEntity?.status === "captured"));

  if (!isConfirmedPaidEvent) {
    return NextResponse.json({
      received: true,
      ignored: true,
      reason: `Event '${eventType}' is not a confirmed paid status`
    });
  }

  const providerOrderId =
    orderEntity?.id ||
    paymentEntity?.order_id ||
    linkEntity?.id ||
    paymentEntity?.id;

  if (!providerOrderId) {
    return NextResponse.json(
      { error: "Missing Razorpay order or payment identifier" },
      { status: 400 }
    );
  }

  const providerPaymentId = paymentEntity?.id ?? null;
  const rawMinorAmount =
    paymentEntity?.amount ??
    orderEntity?.amount_paid ??
    orderEntity?.amount ??
    linkEntity?.amount_paid ??
    linkEntity?.amount ??
    0;
  const majorAmount = Number((Number(rawMinorAmount) / 100).toFixed(2));
  const currency = (
    paymentEntity?.currency ||
    orderEntity?.currency ||
    linkEntity?.currency ||
    "INR"
  ).toUpperCase();

  const notesTier =
    paymentEntity?.notes?.pricing_tier ??
    orderEntity?.notes?.pricing_tier ??
    linkEntity?.notes?.pricing_tier;

  const pricingTier: "launch" | "standard" =
    notesTier === "standard"
      ? "standard"
      : notesTier === "launch"
        ? "launch"
        : majorAmount > 999
          ? "standard"
          : "launch";

  const customerEmail =
    paymentEntity?.email?.trim() || linkEntity?.customer?.email?.trim() || null;

  const timestampSec = paymentEntity?.created_at ?? orderEntity?.created_at;
  const paidAt = timestampSec
    ? new Date(timestampSec * 1000).toISOString()
    : new Date().toISOString();

  // Secondary check if payment ID already recorded under a different order ID
  if (providerPaymentId) {
    const { data: existingByPayment } = await admin
      .from("orders")
      .select("id")
      .eq("provider", "razorpay")
      .eq("provider_payment_id", providerPaymentId)
      .maybeSingle();

    if (existingByPayment) {
      return NextResponse.json({
        received: true,
        deduplicated: true,
        provider_order_id: providerOrderId
      });
    }
  }

  const { error } = await admin.from("orders").upsert(
    {
      provider: "razorpay",
      provider_order_id: providerOrderId,
      provider_payment_id: providerPaymentId,
      amount: majorAmount,
      currency,
      market: "india",
      pricing_tier: pricingTier,
      payment_status: "paid",
      customer_email: customerEmail,
      raw_event_type: eventType,
      paid_at: paidAt
    },
    {
      onConflict: "provider,provider_order_id",
      ignoreDuplicates: true
    }
  );

  if (error) {
    console.error("Failed to upsert Razorpay order:", error.message);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({
    received: true,
    recorded: true,
    provider_order_id: providerOrderId
  });
}
