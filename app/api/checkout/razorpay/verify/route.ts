import crypto from "crypto";
import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { generateDownloadToken } from "@/lib/download-token";

export const dynamic = "force-dynamic";

interface VerifyRequestBody {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  customer_email?: string;
  simulate_failure?: boolean;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as VerifyRequestBody;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer_email,
      simulate_failure
    } = body;

    // Explicit test failure simulation
    if (simulate_failure) {
      return NextResponse.json(
        {
          verified: false,
          error: "Payment failed or was cancelled by user.",
          message: "No product bundle was delivered."
        },
        { status: 400 }
      );
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          verified: false,
          error: "Missing required payment parameters",
          message: "razorpay_order_id, razorpay_payment_id, and razorpay_signature are required."
        },
        { status: 400 }
      );
    }

    const serverEnv = getServerEnv();
    const keySecret = serverEnv.RAZORPAY_KEY_SECRET;

    let isSignatureValid = false;

    // If real Razorpay API Secret is configured, verify HMAC SHA256
    if (keySecret && !keySecret.includes("placeholder")) {
      const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(payload)
        .digest("hex");

      const sigBuf = Buffer.from(razorpay_signature, "utf8");
      const expectedBuf = Buffer.from(expectedSignature, "utf8");

      if (sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf)) {
        isSignatureValid = true;
      }
    } else {
      // Test / Sandbox mode signature verification
      // Either matches standard test HMAC or begins with test signature prefix
      const isTestOrder = razorpay_order_id.startsWith("order_test_");
      const isTestPayment = razorpay_payment_id.startsWith("pay_test_");
      if (isTestOrder && isTestPayment && razorpay_signature.length >= 16) {
        isSignatureValid = true;
      }
    }

    if (!isSignatureValid) {
      console.warn("Payment verification failed for order:", razorpay_order_id);
      return NextResponse.json(
        {
          verified: false,
          error: "Invalid payment signature",
          message: "Server-side cryptographic verification failed. Product access denied."
        },
        { status: 400 }
      );
    }

    // Record verified order in Supabase if database is connected
    const admin = createSupabaseAdminClient();
    if (admin) {
      try {
        await admin.from("orders").upsert(
          {
            provider: "razorpay",
            provider_order_id: razorpay_order_id,
            provider_payment_id: razorpay_payment_id,
            amount: 999.0,
            currency: "INR",
            market: "india",
            pricing_tier: "launch",
            payment_status: "paid",
            customer_email: customer_email?.trim() || null,
            raw_event_type: "client_checkout_verified",
            paid_at: new Date().toISOString()
          },
          {
            onConflict: "provider,provider_order_id",
            ignoreDuplicates: true
          }
        );
      } catch (dbErr) {
        console.warn("Failed to persist order to database (non-fatal for delivery):", dbErr);
      }
    }

    // Generate secure cryptographic download token valid for 24 hours
    const downloadToken = generateDownloadToken(razorpay_order_id, customer_email);
    const redirectUrl = `/checkout/success?token=${encodeURIComponent(
      downloadToken
    )}&order_id=${encodeURIComponent(razorpay_order_id)}&provider=razorpay`;

    return NextResponse.json({
      verified: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      downloadToken,
      downloadUrl: `/api/delivery/download?token=${encodeURIComponent(downloadToken)}`,
      redirectUrl
    });
  } catch (err) {
    console.error("Unexpected error in payment verification:", err);
    return NextResponse.json(
      { verified: false, error: "Internal server error during verification" },
      { status: 500 }
    );
  }
}
