"use client";

import type { MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform
} from "framer-motion";
import {
  Bot,
  CheckCircle2,
  Download,
  FileArchive,
  FileSpreadsheet,
  Webhook,
  Workflow
} from "lucide-react";

export function BundleMockup() {
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 140, damping: 20, mass: 0.5 };
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 8]), springConfig);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const xPct = (event.clientX - rect.left) / rect.width - 0.5;
    const yPct = (event.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="relative w-full">
      {/* Mobile lightweight static fallback */}
      <div className="space-y-3 md:hidden">
        <div className="featured-border-card relative overflow-hidden rounded-2xl p-5 shadow-glass">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">
                Vertex Digitals • Edition 2027
              </span>
              <h3 className="mt-1.5 text-2xl font-bold tracking-tight text-white">
                AI Agency 2027
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                Complete Ebook + Workbooks + 10 n8n Workflows + First Client Guide
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 font-mono text-[11px] font-medium text-cyan-200">
              <FileArchive className="h-3.5 w-3.5" aria-hidden="true" />
              ZIP
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
              <div className="flex items-center gap-2 text-xs font-medium text-violet-200">
                <FileSpreadsheet className="h-3.5 w-3.5 text-violet-400" aria-hidden="true" />
                Workbooks
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Offer, outreach &amp; call sheets
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
              <div className="flex items-center gap-2 text-xs font-medium text-cyan-200">
                <Workflow className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                10 Workflows
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Ready-to-import n8n JSON
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              AI-Agency-2027.zip
            </span>
            <span className="font-medium">Instant Delivery</span>
          </div>
        </div>
      </div>

      {/* Desktop 3D CSS perspective showcase */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="perspective-1400 relative hidden min-h-[450px] w-full items-center justify-center md:flex"
      >
        {/* Ambient violet-cyan radial glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-6 rounded-full bg-gradient-to-tr from-violet-600/25 via-indigo-500/15 to-cyan-400/25 blur-3xl"
        />

        <motion.div
          style={
            prefersReducedMotion
              ? { transform: "rotateX(6deg) rotateY(-10deg)" }
              : { rotateX, rotateY }
          }
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  y: [0, -7, 0]
                }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: 6.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
          }
          className="preserve-3d relative h-[410px] w-[420px] select-none"
        >
          {/* Back Layer: Layered Workbook Pages */}
          <div
            style={{ transform: "translateZ(-42px) translateX(62px) translateY(-22px) rotateZ(5deg)" }}
            className="absolute right-0 top-2 w-[260px] rounded-2xl border border-white/10 bg-[#0d1424]/95 p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-violet-300">
                Workbook • 02
              </span>
              <span className="h-2 w-2 rounded-full bg-violet-400/80" />
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-slate-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                Niche &amp; Offer Matrix
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-slate-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                Discovery Call Script
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-slate-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-violet-400" aria-hidden="true" />
                Delivery SOP Checklist
              </div>
            </div>
          </div>

          <div
            style={{ transform: "translateZ(-20px) translateX(38px) translateY(-8px) rotateZ(2.5deg)" }}
            className="absolute right-3 top-6 h-[290px] w-[250px] rounded-2xl border border-white/10 bg-gradient-to-b from-[#131b30] to-[#0a0f1d] shadow-xl"
          />

          {/* Primary Center Layer: Floating Ebook Cover */}
          <div
            style={{ transform: "translateZ(10px)" }}
            className="featured-border-card absolute left-5 top-8 flex h-[328px] w-[254px] flex-col justify-between overflow-hidden rounded-2xl p-6 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)]"
          >
            {/* Book spine accent */}
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-b from-violet-500 via-indigo-500 to-cyan-400"
            />
            {/* Top specular sheen */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-cyan-400/20 to-violet-500/5 blur-2xl"
            />

            <div className="pl-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Vertex Digitals
                </span>
                <span className="rounded border border-white/15 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[9px] text-slate-300">
                  EBOOK
                </span>
              </div>

              <div className="mt-7">
                <span className="inline-block rounded-full border border-violet-400/30 bg-violet-500/15 px-2.5 py-0.5 font-mono text-[10px] text-violet-200">
                  2027 Edition
                </span>
                <h3 className="mt-3 text-[28px] font-bold leading-[1.06] tracking-tight text-white">
                  AI Agency
                  <span className="block bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                    2027
                  </span>
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-300">
                  Everything You Need to Start an AI Automation Agency
                </p>
              </div>
            </div>

            {/* Subtle architectural SVG grid inside cover */}
            <div className="pl-2">
              <div className="mb-3 h-px w-full bg-gradient-to-r from-violet-500/40 via-cyan-400/30 to-transparent" />
              <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                <span>OFFER • SYSTEMS • CLIENTS</span>
                <span className="text-cyan-300">PDF + ZIP</span>
              </div>
            </div>
          </div>

          {/* Front Layer 1: n8n-style Workflow Node Card */}
          <div
            style={{ transform: "translateZ(46px)" }}
            className="glass-panel absolute bottom-5 right-0 w-[290px] rounded-2xl p-3.5 shadow-[0_24px_50px_-10px_rgba(0,0,0,0.85)]"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-cyan-300">
                <Workflow className="h-3.5 w-3.5" aria-hidden="true" />
                n8n Workflow Pack (10x)
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[9px] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                JSON Ready
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-1.5">
              <div className="flex flex-col items-center rounded-xl border border-white/10 bg-[#0b1222] px-2.5 py-2 text-center">
                <Webhook className="h-4 w-4 text-violet-400" aria-hidden="true" />
                <span className="mt-1 font-mono text-[9px] text-slate-200">Trigger</span>
              </div>

              <svg
                width="26"
                height="12"
                viewBox="0 0 26 12"
                fill="none"
                aria-hidden="true"
                className="shrink-0"
              >
                <path
                  d="M1 6H23M23 6L18.5 2M23 6L18.5 10"
                  stroke="url(#nodeLine1)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="nodeLine1" x1="1" y1="6" x2="23" y2="6">
                    <stop stopColor="#8B5CF6" />
                    <stop offset="1" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="flex flex-col items-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-2 text-center">
                <Bot className="h-4 w-4 text-cyan-300" aria-hidden="true" />
                <span className="mt-1 font-mono text-[9px] text-cyan-100">AI Agent</span>
              </div>

              <svg
                width="26"
                height="12"
                viewBox="0 0 26 12"
                fill="none"
                aria-hidden="true"
                className="shrink-0"
              >
                <path
                  d="M1 6H23M23 6L18.5 2M23 6L18.5 10"
                  stroke="url(#nodeLine2)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="nodeLine2" x1="1" y1="6" x2="23" y2="6">
                    <stop stopColor="#22D3EE" />
                    <stop offset="1" stopColor="#34D399" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="flex flex-col items-center rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-2 text-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                <span className="mt-1 font-mono text-[9px] text-emerald-100">CRM Sync</span>
              </div>
            </div>
          </div>

          {/* Front Layer 2: Floating ZIP / Instant Download Badge */}
          <div
            style={{ transform: "translateZ(68px)" }}
            className="glass-panel absolute -left-2 top-0 flex items-center gap-2.5 rounded-full border border-cyan-400/30 px-3.5 py-2 shadow-[0_14px_32px_-8px_rgba(34,211,238,0.3)]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-[#06080f]">
              <Download className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <div className="font-mono text-[11px] font-semibold text-white">
                AI-Agency-2027.zip
              </div>
              <div className="text-[10px] text-cyan-300">Instant Digital Bundle</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
