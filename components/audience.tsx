"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Laptop, Rocket } from "lucide-react";
import { AUDIENCE_PROFILES } from "@/lib/constants";

const PROFILE_ICONS = [GraduationCap, Laptop, Briefcase, Rocket];

export function Audience() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Who This Is For
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Built for People Ready to Start
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Designed for ambitious builders in India and worldwide who prefer structured
            execution over passive watching.
          </p>
        </motion.div>

        <div className="mt-10 divide-y divide-white/[0.08] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0f1c]/70">
          {AUDIENCE_PROFILES.map((profile, idx) => {
            const Icon = PROFILE_ICONS[idx % PROFILE_ICONS.length];
            return (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="group flex flex-col gap-4 p-6 transition-colors hover:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6"
              >
                <div className="flex items-start gap-4 sm:items-center">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-violet-500/20 to-cyan-500/10 text-cyan-300 transition-transform duration-200 group-hover:scale-105">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-violet-300">
                      {profile.label}
                    </span>
                    <h3 className="mt-0.5 text-base font-semibold text-white sm:text-lg">
                      {profile.title}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-slate-400">
                      {profile.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
