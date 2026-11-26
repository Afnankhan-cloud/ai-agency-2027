"use client";

import { useEffect, useState } from "react";
import {
  X,
  ShieldCheck,
  Loader2,
  AlertCircle,
  IndianRupee,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { trackCheckoutStart } from "@/lib/analytics";

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error?: {
    description?: string;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (response: RazorpayFailureResponse) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle?: string;
}

export function CheckoutModal({
  isOpen,
  onClose,
  productTitle = "AI Agency Mastery"
}: CheckoutModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testOrderData, setTestOrderData] = useState<{
    orderId: string;
    keyId: string;
    amount: number;
    currency: string;
    isTestMode?: boolean;
  } | null>(null);

  // Load Razorpay checkout.js script asynchronously
  useEffect(() => {
    if (!document.getElementById("razorpay-checkout-script")) {
      const script = document.createElement("script");
      script.id = "razorpay-checkout-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (!isOpen) return null;

  const handleStartRazorpay = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    trackCheckoutStart("india", "modal_checkout");

    try {
      // 1. Create order on server
      const res = await fetch("/api/checkout/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 999,
          currency: "INR",
          customerEmail: email,
          customerName: name
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create checkout order");
      }

      const orderData = await res.json();
      setTestOrderData(orderData);

      // If Razorpay SDK is available and we have a valid key (not test placeholder), open official modal
      const hasRealKey =
        orderData.keyId &&
        !orderData.keyId.includes("placeholder") &&
        window.Razorpay;

      if (hasRealKey) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Vertex Digital",
          description: `${productTitle} — Instant Delivery`,
          order_id: orderData.orderId,
          prefill: {
            name,
            email
          },
          theme: {
            color: "#8B5CF6"
          },
          handler: async function (response: RazorpaySuccessResponse) {
            await verifyAndDeliver({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customer_email: email
            });
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            }
          }
        };

        if (!window.Razorpay) {
          throw new Error("Razorpay SDK is not loaded yet. Please try again in a moment.");
        }
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response: RazorpayFailureResponse) {
          setError(
            response.error?.description || "Payment failed or was cancelled."
          );
          setLoading(false);
        });
        rzp.open();
      } else {
        // Test / Sandbox mode UI
        setLoading(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to initiate payment. Please try again.";
      setError(msg);
      setLoading(false);
    }
  };

  const verifyAndDeliver = async (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    customer_email?: string;
    simulate_failure?: boolean;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.verified) {
        throw new Error(data.message || data.error || "Payment verification failed.");
      }

      // Redirect to secure success & download delivery page
      window.location.assign(data.redirectUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to verify payment with server.";
      setError(msg);
      setLoading(false);
    }
  };

  const handleSimulateSuccess = () => {
    if (!testOrderData) return;
    const testPaymentId = `pay_test_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const testSignature = `sig_test_valid_${Math.random().toString(36).slice(2, 10)}${Date.now()}`;
    verifyAndDeliver({
      razorpay_order_id: testOrderData.orderId,
      razorpay_payment_id: testPaymentId,
      razorpay_signature: testSignature,
      customer_email: email || "customer@example.com"
    });
  };

  const handleSimulateFailure = () => {
    if (!testOrderData) return;
    verifyAndDeliver({
      razorpay_order_id: testOrderData.orderId,
      razorpay_payment_id: "pay_test_failed",
      razorpay_signature: "sig_invalid",
      simulate_failure: true
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="featured-border-card relative w-full max-w-md rounded-3xl p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close checkout"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/15 text-violet-300">
            <IndianRupee className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-white sm:text-xl">
              Razorpay Checkout
            </h2>
            <p className="text-xs text-slate-400">
              India Launch Access • UPI, Cards, NetBanking
            </p>
          </div>
        </div>

        {/* Price & Scarcity Reminder */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-300">Total Investment</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-white">₹999</span>
              <span className="ml-2 text-xs text-slate-400 line-through">₹1,499</span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 border-t border-white/[0.06] pt-2 text-[11px] text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Instant delivery of complete 4.6 MB ZIP bundle upon payment</span>
          </div>
        </div>

        {error ? (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-xs leading-relaxed text-rose-200"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" aria-hidden="true" />
            <span>{error}</span>
          </div>
        ) : null}

        {/* Test / Sandbox Simulator view if credentials are in test mode */}
        {testOrderData?.isTestMode ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-xs text-amber-200">
              <p className="font-semibold text-white">Razorpay Sandbox / Test Mode Active</p>
              <p className="mt-1 text-[11px] text-amber-200/90">
                Order <code className="rounded bg-black/40 px-1 py-0.5 font-mono">{testOrderData.orderId}</code> created. Choose an action to test end-to-end payment verification and ZIP delivery:
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                disabled={loading}
                onClick={handleSimulateSuccess}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    <span>Test Payment Success (Deliver ZIP)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleSimulateFailure}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-5 py-2.5 text-xs font-semibold text-rose-200 transition-colors hover:bg-rose-500/20 disabled:opacity-60"
              >
                <span>Test Payment Failure (Reject &amp; Block Download)</span>
              </button>
            </div>

            <p className="text-center font-mono text-[10px] text-slate-500">
              To connect real live Razorpay checkout, add RAZORPAY_KEY_ID &amp; RAZORPAY_KEY_SECRET to .env.local
            </p>
          </div>
        ) : (
          /* Standard Customer Details Form */
          <form onSubmit={handleStartRazorpay} className="mt-5 space-y-3.5">
            <div>
              <label
                htmlFor="checkout-email"
                className="block font-mono text-[11px] uppercase tracking-wider text-slate-300"
              >
                Email Address (For ZIP Bundle Receipt)
              </label>
              <input
                id="checkout-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#070b14] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="checkout-name"
                className="block font-mono text-[11px] uppercase tracking-wider text-slate-300"
              >
                Your Name
              </label>
              <input
                id="checkout-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First and last name"
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#070b14] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Connecting to Razorpay...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Pay ₹999</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
              <span>100% Encrypted • Instant Digital Delivery</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
