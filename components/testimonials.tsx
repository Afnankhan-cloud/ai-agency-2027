"use client";

/**
 * PLACEHOLDER TESTIMONIALS SECTION
 * ----------------------------------------------------------------------------
 * These cards render clearly labeled placeholder slots from `PLACEHOLDER_TESTIMONIALS`
 * in `lib/constants.ts`. Do not add fabricated customer names, reviews, or income claims.
 * Replace the entries in `lib/constants.ts` once verified buyer feedback is collected.
 */

import { motion } from "framer-motion";
import { MessageSquareQuote, ShieldAlert } from "lucide-react";
import { PLACEHOLDER_TESTIMONIALS } from "@/lib/constants";

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
              Verified Review Slots
            </span>
            <h2
              id="testimonials-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Early Builder Feedback
            </h2>
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              Reserved slots for verified founding-cohort reviews. Placeholder content is
              marked below until real customer feedback is published.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-amber-400/25 bg-amber-500/10 px-3.5 py-1.5 font-mono text-[11px] text-amber-200 sm:self-auto">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
            <span>Placeholder Slots • Pre-Launch</span>
          </div>
        </motion.div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PLACEHOLDER_TESTIMONIALS.map((slot, idx) => (
            <motion.article
              key={slot.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="glass-panel flex flex-col justify-between rounded-2xl border border-dashed border-white/15 p-6"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-cyan-300">
                    <MessageSquareQuote className="h-3.5 w-3.5" aria-hidden="true" />
                    {slot.slotLabel}
                  </span>
                  <span className="rounded-full border border-amber-400/25 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10px] text-amber-200">
                    Placeholder
                  </span>
                </div>

                <h3 className="mt-4 text-base font-semibold text-white">
                  {slot.placeholderHeadline}
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                  “{slot.placeholderBody}”
                </p>
              </div>

              <div className="mt-6 border-t border-white/[0.06] pt-4">
                <div className="text-xs font-medium text-slate-200">
                  {slot.audienceSegment}
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-slate-500">
                  {slot.statusNote}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
