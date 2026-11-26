import { NextResponse } from "next/server";
import { getServerEnv, getPublicEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      amount?: number;
      currency?: string;
      customerEmail?: string;
      customerName?: string;
    };

    const serverEnv = getServerEnv();
    const publicEnv = getPublicEnv();

    const amountInr = 999;
    const amountPaise = amountInr * 100; // 99900 paise = ₹999

    const keyId = serverEnv.RAZORPAY_KEY_ID || publicEnv.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = serverEnv.RAZORPAY_KEY_SECRET;

    // If live or sandbox Razorpay API credentials are configured, call Razorpay Orders API
    if (keyId && keySecret && !keyId.includes("placeholder") && !keySecret.includes("placeholder")) {
      const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

      const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: amountPaise,
          currency: "INR",
          receipt: `rcpt_${Date.now().toString().slice(-8)}`,
          notes: {
            product: "AI Agency Mastery",
            tier: "launch_50_spots",
            email: body.customerEmail || ""
          }
        })
      });

      if (!rzpResponse.ok) {
        const errText = await rzpResponse.text();
        console.error("Razorpay API order creation failed:", errText);
        return NextResponse.json(
          {
            error: "Failed to initialize Razorpay order with provider",
            details: errText
          },
          { status: 502 }
        );
      }

      const orderData = (await rzpResponse.json()) as { id: string };
      return NextResponse.json({
        ok: true,
        orderId: orderData.id,
        amount: amountPaise,
        currency: "INR",
        keyId,
        isTestMode: keyId.startsWith("rzp_test_")
      });
    }

    // Fallback: If live Razorpay API keys are not yet added to .env.local,
    // generate a safe test/sandbox order so end-to-end testing of verification,
    // failure handling, and ZIP delivery can be performed and validated.
    const testOrderId = `order_test_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    return NextResponse.json({
      ok: true,
      orderId: testOrderId,
      amount: amountPaise,
      currency: "INR",
      keyId: keyId || "rzp_test_placeholder",
      isTestMode: true,
      message: "Generated test/sandbox order. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local for live Razorpay checkout."
    });
  } catch (err) {
    console.error("Unexpected error in Razorpay create-order:", err);
    return NextResponse.json(
      { error: "Internal server error creating checkout order" },
      { status: 500 }
    );
  }
}
