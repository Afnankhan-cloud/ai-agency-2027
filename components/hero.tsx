"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Check } from "lucide-react";
import { BundleMockup } from "@/components/bundle-mockup";
import { trackCtaClick } from "@/lib/analytics";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-16 lg:pb-28 lg:pt-20">
      {/* Background atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-glow-radial"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="lg:col-span-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-violet-200">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
              VERTEX DIGITALS • 2027 AGENCY STARTER BUNDLE
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.06]">
              Start Your AI Agency in{" "}
              <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                2027.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              A practical ZIP bundle that takes you from ‘I want to build an AI agency’ to
              a clear offer, working automations, and a plan to win your first client.
            </p>

            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <a
                href="#pricing"
                onClick={() => trackCtaClick("hero_primary")}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_32px_-8px_rgba(139,92,246,0.85)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_40px_-4px_rgba(34,211,238,0.65)]"
              >
                <span>Get Instant Access</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>

              <a
                href="#whats-inside"
                onClick={() => trackCtaClick("hero_secondary")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-slate-200 transition-colors hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
              >
                <span>See What’s Inside</span>
                <ArrowDown className="h-4 w-4 text-cyan-300" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-400 sm:text-sm">
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <Check className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                Instant digital delivery
              </span>
              <span aria-hidden="true" className="text-slate-600">
                •
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <Check className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                One-time payment
              </span>
              <span aria-hidden="true" className="text-slate-600">
                •
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <Check className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                Built for beginners
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-6"
          >
            <BundleMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
