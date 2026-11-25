import crypto from "crypto";
import { NextResponse } from "next/server";
import { getServerEnv, isConfiguredSecret } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function parseGumroadPayload(
  rawBody: string,
  contentType: string
): Record<string, string> {
  if (contentType.includes("application/json")) {
    const parsed = JSON.parse(rawBody) as Record<string, unknown>;
    const normalized: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (v !== undefined && v !== null) {
        normalized[k] = String(v);
      }
    }
    return normalized;
  }

  const params = new URLSearchParams(rawBody);
  const normalized: Record<string, string> = {};
  params.forEach((value, key) => {
    normalized[key] = value;
  });
  return normalized;
}

export async function POST(request: Request) {
  const serverEnv = getServerEnv();
  const webhookSecret = serverEnv.GUMROAD_WEBHOOK_SECRET;

  if (!isConfiguredSecret(webhookSecret)) {
    return NextResponse.json(
      { error: "Gumroad webhook secret is not configured" },
      { status: 503 }
    );
  }

  const rawBody = await request.text();
  const url = new URL(request.url);
  const querySecret =
    url.searchParams.get("secret") ?? url.searchParams.get("token");
  const headerSecret =
    request.headers.get("x-gumroad-secret") ??
    request.headers.get("x-webhook-secret");
  const hmacHeader = request.headers.get("x-gumroad-signature");

  let authorized = false;

  if (hmacHeader) {
    const expectedHex = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");
    if (timingSafeStringEqual(expectedHex, hmacHeader.trim())) {
      authorized = true;
    }
  }

  if (!authorized && headerSecret && timingSafeStringEqual(webhookSecret, headerSecret.trim())) {
    authorized = true;
  }

  if (!authorized && querySecret && timingSafeStringEqual(webhookSecret, querySecret.trim())) {
    authorized = true;
  }

  if (!authorized) {
    return NextResponse.json(
      { error: "Unauthorized Gumroad webhook request" },
      { status: 401 }
    );
  }

  let payload: Record<string, string>;
  try {
    payload = parseGumroadPayload(
      rawBody,
      request.headers.get("content-type") ?? ""
    );
  } catch {
    return NextResponse.json({ error: "Invalid Gumroad payload" }, { status: 400 });
  }

  // Optional seller_id enforcement if configured
  if (serverEnv.GUMROAD_SELLER_ID) {
    if (
      !payload.seller_id ||
      !timingSafeStringEqual(serverEnv.GUMROAD_SELLER_ID, payload.seller_id.trim())
    ) {
      return NextResponse.json({ error: "Seller ID mismatch" }, { status: 401 });
    }
  }

  // Ignore test pings unless explicitly allowed in non-production testing
  if (payload.test === "true" && serverEnv.ALLOW_TEST_WEBHOOKS !== "true") {
    return NextResponse.json({
      received: true,
      ignored: true,
      reason: "Test Gumroad ping ignored"
    });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Supabase admin client is not configured" },
      { status: 503 }
    );
  }

  const saleId = payload.sale_id || payload.order_number;
  if (!saleId) {
    return NextResponse.json(
      { error: "Missing Gumroad sale_id or order_number" },
      { status: 400 }
    );
  }

  const isRefundedOrDisputed =
    payload.refunded === "true" ||
    payload.chargebacked === "true" ||
    payload.disputed === "true";

  if (isRefundedOrDisputed) {
    await admin
      .from("orders")
      .update({
        payment_status: "refunded",
        raw_event_type: "gumroad_refunded_or_disputed"
      })
      .eq("provider", "gumroad")
      .eq("provider_order_id", saleId);

    return NextResponse.json({ received: true, status: "refund_recorded" });
  }

  // Gumroad sends `price` in smallest currency unit (cents)
  const rawPriceCents = Number(payload.price ?? 0);
  if (!Number.isFinite(rawPriceCents) || rawPriceCents <= 0) {
    return NextResponse.json({
      received: true,
      ignored: true,
      reason: "Non-positive or invalid Gumroad price"
    });
  }

  const majorAmount = Number((rawPriceCents / 100).toFixed(2));
  const currency = (payload.currency || "USD").toUpperCase();
  const customerEmail = payload.email?.trim() || null;

  const parsedTimestamp = payload.sale_timestamp
    ? Date.parse(payload.sale_timestamp)
    : Number.NaN;
  const paidAt = Number.isNaN(parsedTimestamp)
    ? new Date().toISOString()
    : new Date(parsedTimestamp).toISOString();

  const pricingTier: "launch" | "standard" =
    majorAmount <= 49 ? "launch" : "standard";

  const { error } = await admin.from("orders").upsert(
    {
      provider: "gumroad",
      provider_order_id: saleId,
      provider_payment_id: payload.order_number || saleId,
      amount: majorAmount,
      currency,
      market: "international",
      pricing_tier: pricingTier,
      payment_status: "paid",
      customer_email: customerEmail,
      raw_event_type: "gumroad_sale",
      paid_at: paidAt
    },
    {
      onConflict: "provider,provider_order_id",
      ignoreDuplicates: true
    }
  );

  if (error) {
    console.error("Failed to upsert Gumroad order:", error.message);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({
    received: true,
    recorded: true,
    provider_order_id: saleId
  });
}
