import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  FileArchive,
  BookOpen,
  Workflow,
  FileSpreadsheet,
  ArrowRight,
  ShieldAlert,
  Mail
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { verifyDownloadToken } from "@/lib/download-token";
import { getPublicEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Confirmed — Download Your Bundle",
  robots: {
    index: false,
    follow: false
  }
};

interface SuccessPageProps {
  searchParams?: {
    token?: string;
    order_id?: string;
    provider?: string;
  };
}

export default function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const token = searchParams?.token || "";
  const orderId = searchParams?.order_id || "Verified Order";
  const provider = searchParams?.provider === "gumroad" ? "Gumroad" : "Razorpay";
  const publicEnv = getPublicEnv();

  const verification = verifyDownloadToken(token);

  return (
    <div className="relative min-h-screen bg-[#06080f] text-slate-100">
      {/* Background glow and subtle grid */}
      <div
        aria-hidden="true"
        className="bg-grid-pattern pointer-events-none fixed inset-0 -z-20 opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-96 bg-glow-radial"
      />

      <header className="border-b border-white/[0.08] bg-[#06080f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="Vertex Digitals Home">
            <BrandMark showSublabel />
          </Link>
          <Link
            href="/"
            className="text-xs font-medium text-slate-400 hover:text-white"
          >
            ← Back to Storefront
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        {verification.valid ? (
          <div className="space-y-8">
            {/* Success Card */}
            <div className="featured-border-card rounded-3xl p-6 shadow-glass sm:p-10">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/15 text-emerald-300 shadow-[0_0_30px_-5px_rgba(52,211,153,0.5)]">
                  <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
                </div>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3.5 py-1 font-mono text-xs text-emerald-300">
                  <span>Payment Verified</span>
                  <span>•</span>
                  <span>{provider}</span>
                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  You’re In. Welcome to AI Agency Mastery.
                </h1>

                <p className="mt-2 text-sm text-slate-300 sm:text-base">
                  Your purchase was verified successfully. Your instant digital ZIP bundle is ready to download below.
                </p>

                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-xs text-slate-400">
                  Order ID: <span className="text-white font-semibold">{orderId}</span>
                </div>

                {/* Primary Download Button */}
                <div className="mt-8 w-full max-w-md">
                  <a
                    href={`/api/delivery/download?token=${encodeURIComponent(token)}`}
                    download="AI-Agency-Mastery-Vertex-Digitals.zip"
                    className="group flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-[0_0_36px_-6px_rgba(139,92,246,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_44px_-4px_rgba(34,211,238,0.75)]"
                  >
                    <Download className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5" aria-hidden="true" />
                    <span>Download ZIP Bundle (4.6 MB)</span>
                  </a>

                  <p className="mt-3 text-xs text-slate-400">
                    Your secure download token is active for 24 hours. Keep a safe local copy of the downloaded ZIP.
                  </p>
                </div>
              </div>

              {/* What's in the ZIP */}
              <div className="mt-10 border-t border-white/10 pt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                  Included in Your Download
                </h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3.5">
                    <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" aria-hidden="true" />
                    <div>
                      <div className="text-xs font-semibold text-white">12-Chapter Ebook (PDF)</div>
                      <div className="text-[11px] text-slate-400">Complete AI Agency operating manual</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3.5">
                    <Workflow className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                    <div>
                      <div className="text-xs font-semibold text-white">10 n8n Workflows (.json)</div>
                      <div className="text-[11px] text-slate-400">Production-ready importable blueprints</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3.5">
                    <FileSpreadsheet className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                    <div>
                      <div className="text-xs font-semibold text-white">Launch Workbook (.xlsx)</div>
                      <div className="text-[11px] text-slate-400">Offer matrix &amp; pricing calculators</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3.5">
                    <FileArchive className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                    <div>
                      <div className="text-xs font-semibold text-white">Client Acquisition Playbook</div>
                      <div className="text-[11px] text-slate-400">Outreach scripts &amp; proposal template</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick start instructions */}
              <div className="mt-8 rounded-2xl border border-white/10 bg-[#070b14] p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Quick Start in 3 Steps
                </h3>
                <ol className="mt-3 space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-cyan-400 font-semibold">1.</span>
                    <span>Extract <code className="rounded bg-white/10 px-1 py-0.5 font-mono">AI-Agency-Mastery-Vertex-Digitals.zip</code> on your computer.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-cyan-400 font-semibold">2.</span>
                    <span>In your n8n workspace, click <strong>Workflows → Import from File</strong> and pick any of the 10 JSON files in <code className="rounded bg-white/10 px-1 py-0.5 font-mono">06_workflows</code>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-cyan-400 font-semibold">3.</span>
                    <span>Open <code className="rounded bg-white/10 px-1 py-0.5 font-mono">01_Ebook</code> and start with Chapter 1 to define your niche and first productised offer.</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        ) : (
          /* Error / Unauthorized State */
          <div className="glass-panel rounded-3xl p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-400/30 bg-rose-500/15 text-rose-300">
              <ShieldAlert className="h-7 w-7" aria-hidden="true" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
              Unauthorized or Expired Access
            </h1>

            <p className="mt-3 text-sm text-slate-300">
              {verification.error || "A valid, verified purchase token is required to access the product bundle."}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/#pricing"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white"
              >
                <span>View Purchase Options</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={`mailto:${publicEnv.NEXT_PUBLIC_CONTACT_EMAIL}?subject=Order%20Help%20-${encodeURIComponent(orderId)}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-200 hover:bg-white/[0.08]"
              >
                <Mail className="h-4 w-4 text-cyan-300" aria-hidden="true" />
                <span>Contact Support</span>
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
