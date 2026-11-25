"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Check,
  Compass,
  FileSpreadsheet,
  Workflow
} from "lucide-react";
import { WHATS_INSIDE_ITEMS, type WhatsInsideItem } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ACCENT_STYLES: Record<
  WhatsInsideItem["accent"],
  {
    iconBg: string;
    badgeText: string;
    borderHover: string;
    dot: string;
  }
> = {
  violet: {
    iconBg: "from-violet-500/25 to-indigo-500/10 border-violet-400/30 text-violet-300",
    badgeText: "text-violet-300",
    borderHover: "hover:border-violet-400/35",
    dot: "bg-violet-400"
  },
  cyan: {
    iconBg: "from-cyan-500/25 to-sky-500/10 border-cyan-400/30 text-cyan-300",
    badgeText: "text-cyan-300",
    borderHover: "hover:border-cyan-400/35",
    dot: "bg-cyan-400"
  },
  indigo: {
    iconBg: "from-indigo-500/25 to-violet-500/10 border-indigo-400/30 text-indigo-300",
    badgeText: "text-indigo-300",
    borderHover: "hover:border-indigo-400/35",
    dot: "bg-indigo-400"
  },
  emerald: {
    iconBg: "from-emerald-500/25 to-cyan-500/10 border-emerald-400/30 text-emerald-300",
    badgeText: "text-emerald-300",
    borderHover: "hover:border-emerald-400/35",
    dot: "bg-emerald-400"
  }
};

function CardIcon({ id }: { id: string }) {
  if (id === "ebook") return <BookOpen className="h-5 w-5" aria-hidden="true" />;
  if (id === "workbooks") return <FileSpreadsheet className="h-5 w-5" aria-hidden="true" />;
  if (id === "workflows") return <Workflow className="h-5 w-5" aria-hidden="true" />;
  return <Compass className="h-5 w-5" aria-hidden="true" />;
}

function CardMiniPreview({ id }: { id: string }) {
  if (id === "ebook") {
    return (
      <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#070b14] p-3 font-mono text-[11px] text-slate-400">
        <div className="flex items-center justify-between text-[10px] text-violet-300">
          <span>CHAPTER FLOW</span>
          <span>PDF</span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1.5 text-center text-[10px]">
          <div className="rounded bg-white/[0.04] px-2 py-1 text-slate-200">01. Offer</div>
          <div className="rounded bg-white/[0.04] px-2 py-1 text-slate-200">02. Price</div>
          <div className="rounded bg-white/[0.04] px-2 py-1 text-slate-200">03. Deliver</div>
        </div>
      </div>
    );
  }

  if (id === "workbooks") {
    return (
      <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#070b14] p-3 font-mono text-[11px] text-slate-400">
        <div className="flex items-center justify-between text-[10px] text-cyan-300">
          <span>TEMPLATE SHEETS</span>
          <span>EDITABLE</span>
        </div>
        <div className="mt-2 space-y-1.5 text-[10px] text-slate-300">
          <div className="flex items-center justify-between rounded bg-white/[0.04] px-2.5 py-1">
            <span>Niche_Offer_Builder</span>
            <span className="text-cyan-400">Included</span>
          </div>
          <div className="flex items-center justify-between rounded bg-white/[0.04] px-2.5 py-1">
            <span>Discovery_Call_SOP</span>
            <span className="text-cyan-400">Included</span>
          </div>
        </div>
      </div>
    );
  }

  if (id === "workflows") {
    return (
      <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#070b14] p-3 font-mono text-[11px]">
        <div className="flex items-center justify-between text-[10px] text-indigo-300">
          <span>N8N BLUEPRINTS</span>
          <span>10x .JSON</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-200">
          <span className="rounded border border-indigo-400/25 bg-indigo-500/10 px-2 py-1">
            Webhook
          </span>
          <span className="text-slate-500">→</span>
          <span className="rounded border border-cyan-400/25 bg-cyan-500/10 px-2 py-1">
            AI Node
          </span>
          <span className="text-slate-500">→</span>
          <span className="rounded border border-emerald-400/25 bg-emerald-500/10 px-2 py-1">
            Action
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#070b14] p-3 font-mono text-[11px]">
      <div className="flex items-center justify-between text-[10px] text-emerald-300">
        <span>FIRST CLIENT PLAYBOOK</span>
        <span>ACTION PLAN</span>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5 text-center text-[10px]">
        <div className="rounded bg-white/[0.04] px-1.5 py-1 text-slate-200">Prospect</div>
        <div className="rounded bg-white/[0.04] px-1.5 py-1 text-slate-200">Outreach</div>
        <div className="rounded bg-emerald-500/10 px-1.5 py-1 text-emerald-200">Close</div>
      </div>
    </div>
  );
}

export function WhatsInside() {
  return (
    <section id="whats-inside" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Inside the ZIP Bundle
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything You Need to Get Moving
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Four focused building blocks designed to eliminate blank-page paralysis and help
            you launch a practical AI automation service.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {WHATS_INSIDE_ITEMS.map((item, idx) => {
            const style = ACCENT_STYLES[item.accent];
            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className={cn(
                  "glass-panel group flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 sm:p-7",
                  style.borderHover
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        "inline-flex h-11 w-11 items-center justify-center rounded-xl border bg-gradient-to-br",
                        style.iconBg
                      )}
                    >
                      <CardIcon id={item.id} />
                    </span>
                    <span
                      className={cn(
                        "font-mono text-[11px] font-medium uppercase tracking-wider",
                        style.badgeText
                      )}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold tracking-tight text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                    {item.description}
                  </p>

                  <ul className="mt-5 space-y-2 border-t border-white/[0.06] pt-4">
                    {item.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-2.5 text-xs text-slate-300 sm:text-sm"
                      >
                        <Check
                          className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", style.badgeText)}
                          aria-hidden="true"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <CardMiniPreview id={item.id} />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
