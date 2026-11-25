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
  Sparkles,
  X
} from "lucide-react";
import { LaunchCountdown } from "@/components/launch-countdown";
import { trackCheckoutStart, type MarketType } from "@/lib/analytics";
import type { LiveOfferState } from "@/lib/pricing";

interface PricingProps {
  offerState: LiveOfferState;
  initialPendingMarket?: MarketType;
}

const INCLUDED_FEATURES = [
  "Complete AI Agency 2027 Ebook (PDF)",
  "Practical Offer, Outreach & Discovery Workbooks",
  "10 Ready-to-Use n8n Automation Workflows (.json)",
  "Step-by-Step First Client Acquisition Guide",
  "Instant Digital ZIP Delivery"
] as const;

export function Pricing({ offerState, initialPendingMarket }: PricingProps) {
  const [loadingMarket, setLoadingMarket] = useState<MarketType | null>(null);
  const [pendingNoticeMarket, setPendingNoticeMarket] = useState<MarketType | null>(
    initialPendingMarket ?? null
  );
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async (market: MarketType) => {
    setCheckoutError(null);
    setPendingNoticeMarket(null);
    setLoadingMarket(market);

    trackCheckoutStart(market, `pricing_${market}`);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ market })
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

      setPendingNoticeMarket(market);
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
            One-Time Payment. Complete Starter Bundle.
          </h2>
          <p className="mt-4 text-base text-slate-300">
            Founding launch pricing is limited to the first{" "}
            {offerState.launchBuyerLimit} buyers.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {offerState.isLaunchActive ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3.5 py-1.5 font-mono text-xs text-violet-200">
                <Sparkles className="h-3.5 w-3.5 text-violet-300" aria-hidden="true" />
                {offerState.isDatabaseConnected
                  ? `${offerState.spotsRemaining} of ${offerState.launchBuyerLimit} founding spots remaining`
                  : `Founding Tier Active (First ${offerState.launchBuyerLimit} Buyers)`}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 font-mono text-xs text-slate-300">
                Standard pricing active
              </span>
            )}

            <LaunchCountdown launchEndAt={offerState.launchEndAt} />
          </div>
        </motion.div>

        {/* Clean notice if checkout URLs are still placeholders */}
        {pendingNoticeMarket ? (
          <div
            role="status"
            className="mx-auto mt-8 flex max-w-3xl items-start justify-between gap-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-100"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
              <div>
                <p className="font-semibold text-white">
                  {pendingNoticeMarket === "india" ? "Razorpay" : "Gumroad"} checkout link
                  is not configured yet.
                </p>
                <p className="mt-1 text-xs leading-relaxed text-amber-200/90">
                  Set{" "}
                  <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono">
                    {pendingNoticeMarket === "india"
                      ? offerState.isLaunchActive
                        ? "RAZORPAY_LAUNCH_CHECKOUT_URL"
                        : "RAZORPAY_STANDARD_CHECKOUT_URL"
                      : offerState.isLaunchActive
                        ? "GUMROAD_LAUNCH_CHECKOUT_URL"
                        : "GUMROAD_STANDARD_CHECKOUT_URL"}
                  </code>{" "}
                  in your server environment variables to activate live checkout redirects.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPendingNoticeMarket(null)}
              aria-label="Dismiss checkout configuration notice"
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
                {offerState.india.title}
              </h3>
              <p className="mt-1 text-sm text-slate-300">{offerState.india.subtitle}</p>

              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  {offerState.india.activeFormatted}
                </span>
                {offerState.isLaunchActive ? (
                  <>
                    <span className="text-lg text-slate-400 line-through">
                      {offerState.india.regularFormatted}
                    </span>
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] text-emerald-300">
                      Launch price • First {offerState.launchBuyerLimit} buyers
                    </span>
                  </>
                ) : (
                  <span className="font-mono text-xs text-slate-400">Regular price</span>
                )}
              </div>

              <p className="mt-2 font-mono text-xs text-slate-400">
                {offerState.isLaunchActive
                  ? `Regular price: ${offerState.india.regularFormatted} after first ${offerState.launchBuyerLimit} buyers`
                  : `Launch tier (${offerState.india.launchFormatted}) ended`}
              </p>

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
              <button
                type="button"
                disabled={loadingMarket !== null}
                onClick={() => void handleCheckout("india")}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_-6px_rgba(139,92,246,0.85)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_36px_-4px_rgba(34,211,238,0.65)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loadingMarket === "india" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Preparing Razorpay Checkout...</span>
                  </>
                ) : (
                  <>
                    <span>Get Instant Access</span>
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                UPI, Cards, NetBanking via Razorpay
              </p>
            </div>
          </motion.div>

          {/* International Launch Access */}
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
                {offerState.international.title}
              </h3>
              <p className="mt-1 text-sm text-slate-300">
                {offerState.international.subtitle}
              </p>

              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  {offerState.international.activeFormatted}
                </span>
                {offerState.isLaunchActive ? (
                  <>
                    <span className="text-lg text-slate-400 line-through">
                      {offerState.international.regularFormatted}
                    </span>
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] text-emerald-300">
                      Launch price • First {offerState.launchBuyerLimit} buyers
                    </span>
                  </>
                ) : (
                  <span className="font-mono text-xs text-slate-400">Regular price</span>
                )}
              </div>

              <p className="mt-2 font-mono text-xs text-slate-400">
                {offerState.isLaunchActive
                  ? `Regular price: ${offerState.international.regularFormatted} after first ${offerState.launchBuyerLimit} buyers`
                  : `Launch tier (${offerState.international.launchFormatted}) ended`}
              </p>

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
                onClick={() => void handleCheckout("international")}
                className="group flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/50 hover:bg-white/[0.13] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loadingMarket === "international" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Preparing Gumroad Checkout...</span>
                  </>
                ) : (
                  <>
                    <span>Get Instant Access</span>
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
    </section>
  );
}
