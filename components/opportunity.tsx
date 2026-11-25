"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, Briefcase, Layers } from "lucide-react";

const PIPELINE_STEPS = [
  {
    step: "01",
    label: "Business problem",
    detail: "Slow lead replies, manual data entry, missed follow-ups",
    icon: Briefcase,
    accent: "border-amber-400/25 bg-amber-500/10 text-amber-300"
  },
  {
    step: "02",
    label: "AI automation",
    detail: "Repeatable n8n workflow connecting inbox, AI, and CRM",
    icon: Bot,
    accent: "border-violet-400/30 bg-violet-500/15 text-violet-300"
  },
  {
    step: "03",
    label: "Agency offer",
    detail: "Clear setup + monthly maintenance service clients pay for",
    icon: Layers,
    accent: "border-cyan-400/30 bg-cyan-500/15 text-cyan-300"
  }
] as const;

export function Opportunity() {
  return (
    <section id="why-2027" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="glass-panel relative overflow-hidden rounded-3xl p-7 sm:p-10 lg:p-12"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-600/15 blur-3xl"
          />

          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                Market Opportunity
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Why 2027 Is Your Window
              </h2>

              <p className="mt-5 text-base leading-relaxed text-slate-200">
                Businesses do not need more AI advice. They need systems that save time,
                capture leads, and remove repetitive work. That is where a focused AI
                automation agency wins.
              </p>

              <p className="mt-4 text-base leading-relaxed text-slate-300">
                You do not need to invent the technology. You need a useful offer, a
                reliable delivery process, and the confidence to start conversations. This
                bundle gives you a practical starting point for all three.
              </p>
            </div>

            {/* Compact visual: Business problem -> AI automation -> Agency offer */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-white/[0.08] bg-[#070b14]/90 p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                    The Value Chain
                  </span>
                  <span className="font-mono text-[11px] text-cyan-300">
                    Business problem → AI automation → Agency offer
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {PIPELINE_STEPS.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.step} className="relative">
                        <div className="flex items-start gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${item.accent}`}
                          >
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="text-sm font-semibold text-white sm:text-base">
                                {item.label}
                              </h3>
                              <span className="font-mono text-[10px] text-slate-500">
                                STEP {item.step}
                              </span>
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-slate-400 sm:text-sm">
                              {item.detail}
                            </p>
                          </div>
                        </div>

                        {index < PIPELINE_STEPS.length - 1 ? (
                          <div className="my-1 flex justify-center" aria-hidden="true">
                            <ArrowRight className="h-4 w-4 rotate-90 text-cyan-400/70" />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
