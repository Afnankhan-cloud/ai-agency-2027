"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { LaunchCountdown } from "@/components/launch-countdown";
import { trackCtaClick } from "@/lib/analytics";
import type { LiveOfferState } from "@/lib/pricing";

interface FinalCtaProps {
  offerState: LiveOfferState;
  onOpenCheckout?: () => void;
}

export function FinalCta({ offerState, onOpenCheckout }: FinalCtaProps) {
  const handleCtaClick = () => {
    trackCtaClick("final_cta");
    if (onOpenCheckout) {
      onOpenCheckout();
    }
  };

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="featured-border-card relative overflow-hidden rounded-3xl px-6 py-12 text-center shadow-[0_24px_80px_-20px_rgba(139,92,246,0.35)] sm:px-12 sm:py-16"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-violet-600/20 via-indigo-500/10 to-transparent blur-2xl"
          />

          <div className="relative mx-auto max-w-3xl">
            {/* Real countdown timer ending December 20, 2026 at 11:59:59 PM IST */}
            <div className="mb-6 flex justify-center">
              <LaunchCountdown
                launchEndAt={offerState.launchEndAt || "2026-12-20T23:59:59+05:30"}
                variant="block"
              />
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.6rem] lg:leading-[1.12]">
              Your AI agency does not start when you feel ready. It starts when you build
              the first system.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Get the roadmap, templates, 10 ready-to-use n8n workflows, and client-acquisition plan in one
              practical bundle—and make your first move today.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3">
              <a
                href="#pricing"
                onClick={handleCtaClick}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-[0_0_36px_-6px_rgba(139,92,246,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_44px_-4px_rgba(34,211,238,0.75)]"
              >
                <span>Get Instant Access — ₹999</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>

              <p className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                Instant ZIP Bundle Delivery • One-Time Payment
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
