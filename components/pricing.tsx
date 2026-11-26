"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Globe,
  IndianRupee,
  Loader2,
  ShieldCheck,
  X
} from "lucide-react";
import { CheckoutModal } from "@/components/checkout-modal";
import { trackCheckoutStart, type MarketType } from "@/lib/analytics";
import type { LiveOfferState } from "@/lib/pricing";

interface PricingProps {
  offerState: LiveOfferState;
  initialPendingMarket?: MarketType;
}

const INCLUDED_FEATURES = [
  "Complete AI Agency Mastery Ebook (PDF)",
  "Practical Offer, Outreach & Discovery Workbooks",
  "10 Ready-to-Use n8n Automation Workflows (.json)",
  "Step-by-Step First Client Acquisition Guide",
  "Instant Digital ZIP Delivery (4.6 MB)"
] as const;

export function Pricing({ initialPendingMarket }: PricingProps) {
  const [loadingMarket, setLoadingMarket] = useState<MarketType | null>(null);
  const [pendingNoticeMarket, setPendingNoticeMarket] = useState<MarketType | null>(
    initialPendingMarket ?? null
  );
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);

  const handleIndiaCheckout = () => {
    trackCheckoutStart("india", "pricing_india");
    setIsRazorpayModalOpen(true);
  };

  const handleInternationalCheckout = async () => {
    setCheckoutError(null);
    setPendingNoticeMarket(null);
    setLoadingMarket("international");

    trackCheckoutStart("international", "pricing_international");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ market: "international" })
      });

      const data = (await response.json()) as {
        configured?: boolean;
        url?: string | null;
        error?: string;
      };

      if (!response.ok) {
        setCheckoutError(data.error ?? "Unable to initialize checkout. Please try again.");
        setLoadingMarket(null);
        return;
      }

      if (data.configured && data.url) {
        window.location.assign(data.url);
        return;
      }

      setPendingNoticeMarket("international");
      setLoadingMarket(null);
    } catch {
      setCheckoutError("Network error while preparing checkout. Please try again.");
      setLoadingMarket(null);
    }
  };

  return (
    <section id="pricing" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Pricing &amp; Instant Access
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            One-Time Investment. Complete Starter Kit.
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Instant digital access to the complete ebook, practical templates, and 10 ready-to-use n8n workflows.
          </p>
        </motion.div>

        {pendingNoticeMarket ? (
          <div
            role="status"
            className="mx-auto mt-8 flex max-w-3xl items-start justify-between gap-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-100"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
              <div>
                <p className="font-semibold text-white">
                  Gumroad international checkout link is not configured yet.
                </p>
                <p className="mt-1 text-xs leading-relaxed text-amber-200/90">
                  Set <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono">GUMROAD_LAUNCH_CHECKOUT_URL</code> in your environment variables to activate international USD checkout redirects.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPendingNoticeMarket(null)}
              aria-label="Dismiss notice"
              className="rounded-lg p-1 text-amber-200 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : null}

        {checkoutError ? (
          <div
            role="alert"
            className="mx-auto mt-6 max-w-3xl rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-center text-sm text-rose-200"
          >
            {checkoutError}
          </div>
        ) : null}

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:gap-8">
          {/* Featured Card: India Launch Access */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="featured-border-card relative flex flex-col justify-between rounded-3xl p-7 shadow-[0_20px_60px_-15px_rgba(139,92,246,0.28)] sm:p-9"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-violet-500/20 blur-3xl"
            />

            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-cyan-300">
                  <IndianRupee className="h-4 w-4" aria-hidden="true" />
                  Razorpay Checkout
                </span>
                <span className="rounded-full bg-gradient-to-r from-violet-500/30 to-cyan-500/30 px-3 py-1 font-mono text-[11px] font-semibold text-white ring-1 ring-white/20">
                  India Featured
                </span>
              </div>

              <h3 className="mt-5 text-2xl font-bold text-white">
                India Launch Access
              </h3>
              <p className="mt-1 text-sm text-slate-300">For buyers in India (UPI, Cards &amp; NetBanking)</p>

              {/* Price Display */}
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  ₹999
                </span>
                <span className="text-xl text-slate-400 line-through">
                  ₹1,499
                </span>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-medium text-emerald-300">
                  Save ₹500
                </span>
              </div>

              <ul className="mt-7 space-y-3 border-t border-white/10 pt-6">
                {INCLUDED_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-200">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400"
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              {/* Requirement 4: Scarcity message displayed exactly once immediately above main button */}
              <div className="mb-2.5 flex items-center justify-center gap-1.5 font-mono text-xs font-semibold text-amber-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
                <span>Only 50 spots available</span>
              </div>

              <button
                type="button"
                onClick={handleIndiaCheckout}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_-6px_rgba(139,92,246,0.85)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_36px_-4px_rgba(34,211,238,0.65)]"
              >
                <span>Get Instant Access — ₹999</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                UPI, Cards, NetBanking via Razorpay
              </p>
            </div>
          </motion.div>

          {/* International Access Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="glass-panel flex flex-col justify-between rounded-3xl p-7 shadow-glass sm:p-9"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-violet-300">
                  <Globe className="h-4 w-4" aria-hidden="true" />
                  Gumroad Checkout
                </span>
                <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 font-mono text-[11px] text-slate-300">
                  Global USD
                </span>
              </div>

              <h3 className="mt-5 text-2xl font-bold text-white">
                International Launch Access
              </h3>
              <p className="mt-1 text-sm text-slate-300">
                For buyers worldwide (Cards, Apple Pay, PayPal)
              </p>

              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  $80
                </span>
                <span className="text-sm font-medium text-slate-400">USD</span>
              </div>

              <ul className="mt-7 space-y-3 border-t border-white/10 pt-6">
                {INCLUDED_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-200">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-violet-400"
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <button
                type="button"
                disabled={loadingMarket !== null}
                onClick={handleInternationalCheckout}
                className="group flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/50 hover:bg-white/[0.13] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loadingMarket === "international" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Preparing Gumroad Checkout...</span>
                  </>
                ) : (
                  <>
                    <span>Get Instant Access — $80</span>
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-violet-400" aria-hidden="true" />
                Cards, Apple Pay, PayPal via Gumroad
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Razorpay Interactive Checkout Modal */}
      <CheckoutModal
        isOpen={isRazorpayModalOpen}
        onClose={() => setIsRazorpayModalOpen(false)}
        productTitle="AI Agency Mastery"
      />
    </section>
  );
}
