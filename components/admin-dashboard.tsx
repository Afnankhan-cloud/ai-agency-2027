"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Info,
  LogOut,
  MousePointerClick,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Users,
  XCircle
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { BrandMark } from "@/components/brand-mark";
import type { AdminDashboardData } from "@/lib/admin-data";
import type { LiveOfferState } from "@/lib/pricing";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn, formatCurrency, formatINR, formatPercent, formatUSD } from "@/lib/utils";

interface AdminDashboardProps {
  data: AdminDashboardData;
  offerState: LiveOfferState;
}

export function AdminDashboard({ data, offerState }: AdminDashboardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    router.refresh();
    window.setTimeout(() => setRefreshing(false), 600);
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    const supabase = createSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
    router.refresh();
  };

  const { metrics } = data;

  return (
    <div className="relative min-h-screen bg-[#06080f] text-slate-100">
      <div
        aria-hidden="true"
        className="bg-grid-pattern pointer-events-none fixed inset-0 -z-20 opacity-40"
      />

      {/* Top Admin Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#06080f]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <BrandMark showSublabel />
            <span className="hidden rounded-full border border-cyan-400/25 bg-cyan-500/10 px-2.5 py-0.5 font-mono text-[11px] text-cyan-200 sm:inline-flex">
              Admin Dashboard
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="hidden font-mono text-xs text-slate-400 md:inline">
              {data.adminEmail}
            </span>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <span>Storefront</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", refreshing && "animate-spin")}
                aria-hidden="true"
              />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              disabled={signingOut}
              onClick={() => void handleSignOut()}
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/25 bg-rose-500/10 px-3.5 py-1.5 text-xs font-medium text-rose-200 transition-colors hover:bg-rose-500/20 disabled:opacity-60"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{signingOut ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Status / Error Banner */}
        {data.status !== "ready" ? (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-100"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
            <div>
              <p className="font-semibold text-white">
                {data.status === "unconfigured"
                  ? "Database connection pending configuration"
                  : "Error loading analytics and order records"}
              </p>
              <p className="mt-1 text-xs text-amber-200/90">
                {data.errorMessage ??
                  "Verify your Supabase URL, service role key, and schema.sql execution."}
              </p>
            </div>
          </div>
        ) : null}

        {/* Offer & Readiness Summary Strip */}
        <section className="glass-panel rounded-2xl p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-lg font-bold text-white sm:text-xl">
                  AI Agency 2027 — Revenue &amp; Funnel Overview
                </h1>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium",
                    offerState.isLaunchActive
                      ? "border border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                      : "border border-slate-400/30 bg-slate-500/10 text-slate-300"
                  )}
                >
                  {offerState.isLaunchActive ? "Launch Offer Active" : "Standard Pricing Active"}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Founding launch quota: {offerState.paidOrdersCount} /{" "}
                {offerState.launchBuyerLimit} verified paid buyers • Last synced{" "}
                {new Date(data.fetchedAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusPill
                ok={data.readiness.razorpayLaunchUrl && data.readiness.razorpayWebhookSecret}
                label="Razorpay"
              />
              <StatusPill
                ok={data.readiness.gumroadLaunchUrl && data.readiness.gumroadWebhookSecret}
                label="Gumroad"
              />
              <StatusPill ok={data.readiness.supabaseAdmin} label="Supabase Admin" />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-slate-300">
                <Info className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
                {data.readiness.launchEndAt
                  ? `LAUNCH_END_AT: ${new Date(data.readiness.launchEndAt).toISOString().slice(0, 10)}`
                  : "Countdown off (buyer-limit mode)"}
              </span>
            </div>
          </div>
        </section>

        {/* Primary KPI Cards */}
        <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <KpiCard
            icon={<DollarSign className="h-4 w-4 text-emerald-300" aria-hidden="true" />}
            label="Total Revenue"
            value={`${formatINR(metrics.inrRevenue)} + ${formatUSD(metrics.usdRevenue)}`}
            sublabel={`Est. ${formatUSD(metrics.estimatedTotalUsd)} (@ ₹${data.usdToInrRate}/USD)`}
            accent="emerald"
          />
          <KpiCard
            icon={<CreditCard className="h-4 w-4 text-violet-300" aria-hidden="true" />}
            label="Paid Orders"
            value={String(metrics.paidOrdersCount)}
            sublabel={`${metrics.indiaOrdersCount} India • ${metrics.internationalOrdersCount} Intl`}
            accent="violet"
          />
          <KpiCard
            icon={<Users className="h-4 w-4 text-cyan-300" aria-hidden="true" />}
            label="Unique Visitors"
            value={metrics.uniqueVisitors.toLocaleString("en-US")}
            sublabel="1st-party session views"
            accent="cyan"
          />
          <KpiCard
            icon={<TrendingUp className="h-4 w-4 text-indigo-300" aria-hidden="true" />}
            label="Conversion Rate"
            value={formatPercent(metrics.conversionRate)}
            sublabel="Paid orders / visitors"
            accent="indigo"
          />
          <KpiCard
            icon={<MousePointerClick className="h-4 w-4 text-amber-300" aria-hidden="true" />}
            label="CTA Clicks"
            value={metrics.ctaClicks.toLocaleString("en-US")}
            sublabel="Header, hero & final CTA"
            accent="amber"
          />
          <KpiCard
            icon={<ShoppingCart className="h-4 w-4 text-cyan-300" aria-hidden="true" />}
            label="Checkout Starts"
            value={metrics.checkoutStarts.toLocaleString("en-US")}
            sublabel="Pricing card clicks"
            accent="cyan"
          />
        </section>

        {/* Charts Row: Daily Visitors & Daily Sales */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Daily Visitors Chart */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Daily Unique Visitors (14 Days)
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Anonymous session-scoped page views
                </p>
              </div>
              <Activity className="h-4 w-4 text-cyan-300" aria-hidden="true" />
            </div>

            <div className="mt-6 h-64 w-full">
              {!mounted ? (
                <div className="h-full w-full animate-pulse rounded-xl bg-white/[0.03]" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data.dailyVisitors}
                    margin={{ top: 10, right: 12, left: -18, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="visitorsAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      dataKey="label"
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0b1120",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: "#F8FAFC"
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      name="Unique Visitors"
                      stroke="#22D3EE"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#visitorsAreaGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Daily Sales Chart */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Daily Verified Sales (14 Days)
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Confirmed Razorpay &amp; Gumroad orders
                </p>
              </div>
              <CreditCard className="h-4 w-4 text-violet-300" aria-hidden="true" />
            </div>

            <div className="mt-6 h-64 w-full">
              {!mounted ? (
                <div className="h-full w-full animate-pulse rounded-xl bg-white/[0.03]" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.dailySales}
                    margin={{ top: 10, right: 12, left: -18, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      dataKey="label"
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0b1120",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: "#F8FAFC"
                      }}
                    />
                    <Bar
                      dataKey="indiaOrders"
                      name="India (Razorpay)"
                      stackId="orders"
                      fill="#8B5CF6"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="internationalOrders"
                      name="International (Gumroad)"
                      stackId="orders"
                      fill="#22D3EE"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </section>

        {/* Breakdown & Funnel Row */}
        <section className="grid gap-6 lg:grid-cols-12">
          {/* India vs International Revenue Breakdown */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-5">
            <h2 className="text-base font-semibold text-white">
              India vs International Revenue Breakdown
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Native currency totals plus estimated share at ₹{data.usdToInrRate}/USD
            </p>

            <div className="mt-6 space-y-4">
              {data.marketBreakdown.map((item, idx) => (
                <div
                  key={item.market}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white">{item.market}</span>
                    <span className="font-mono text-xs text-slate-300">
                      {item.orders} {item.orders === 1 ? "order" : "orders"}
                    </span>
                  </div>

                  <div className="mt-2 flex items-baseline justify-between gap-2">
                    <span className="text-2xl font-bold text-white">
                      {item.nativeRevenueLabel}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      {item.sharePercent}% share (~{formatUSD(item.estimatedUsd)})
                    </span>
                  </div>

                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/[0.07]">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        idx === 0
                          ? "bg-gradient-to-r from-violet-500 to-indigo-400"
                          : "bg-gradient-to-r from-cyan-500 to-emerald-400"
                      )}
                      style={{ width: `${Math.max(item.sharePercent, item.orders > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Conversion Funnel
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Visitors → CTA Clicks → Checkout Starts → Verified Purchases
                </p>
              </div>
              <span className="font-mono text-xs text-cyan-300">
                Overall CVR: {formatPercent(metrics.conversionRate)}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {data.funnel.map((step, index) => {
                const maxCount = Math.max(
                  ...data.funnel.map((f) => f.count),
                  1
                );
                const barWidth = Math.round((step.count / maxCount) * 100);
                const colors = [
                  "from-slate-300 to-slate-400",
                  "from-violet-500 to-indigo-400",
                  "from-indigo-400 to-cyan-400",
                  "from-cyan-400 to-emerald-400"
                ];

                return (
                  <div key={step.stage} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-medium text-slate-200">{step.stage}</span>
                      <span className="font-mono text-slate-300">
                        {step.count.toLocaleString("en-US")}{" "}
                        <span className="text-slate-500">
                          ({formatPercent(step.percentageOfVisitors)} of visitors)
                        </span>
                      </span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className={cn(
                          "h-full rounded-full bg-gradient-to-r transition-all duration-500",
                          colors[index % colors.length]
                        )}
                        style={{ width: `${step.count > 0 ? Math.max(barWidth, 3) : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Recent Paid Orders Table */}
        <section className="glass-panel overflow-hidden rounded-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-6 py-5">
            <div>
              <h2 className="text-base font-semibold text-white">
                Recent Paid Orders
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Verified by Razorpay &amp; Gumroad webhook signatures (idempotent by order ID)
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-xs text-slate-300">
              Showing {data.recentOrders.length} latest
            </span>
          </div>

          {data.recentOrders.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-medium text-slate-200">
                No verified paid orders recorded yet.
              </p>
              <p className="mt-1.5 text-xs text-slate-400">
                Real orders appear here automatically as soon as Razorpay or Gumroad
                delivers a verified paid webhook. Placeholder or unverified orders are
                never inserted.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="border-b border-white/[0.08] bg-white/[0.02] font-mono text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-6 py-3.5">Order ID</th>
                    <th className="px-4 py-3.5">Provider</th>
                    <th className="px-4 py-3.5">Market</th>
                    <th className="px-4 py-3.5">Tier</th>
                    <th className="px-4 py-3.5">Amount</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Customer Email</th>
                    <th className="px-6 py-3.5 text-right">Paid At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-xs sm:text-sm">
                  {data.recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-slate-200">
                        {order.provider_order_id}
                      </td>
                      <td className="px-4 py-4 capitalize text-slate-200">
                        {order.provider}
                      </td>
                      <td className="px-4 py-4 capitalize text-slate-300">
                        {order.market}
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-2.5 py-0.5 font-mono text-[11px] capitalize text-violet-200">
                          {order.pricing_tier}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-semibold text-white">
                        {formatCurrency(order.amount, order.currency)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {order.customer_email ?? (
                          <span className="text-slate-500">Not supplied</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-xs text-slate-400">
                        {new Date(order.paid_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Admin Launch & Placeholder Content Notice */}
        <section className="rounded-2xl border border-amber-400/20 bg-amber-500/[0.06] p-5 text-xs leading-relaxed text-amber-100/90">
          <p className="font-semibold text-amber-200">
            Admin Pre-Launch Content &amp; Policy Reminder
          </p>
          <p className="mt-1">
            The testimonials section on the storefront currently displays clearly labeled{" "}
            <strong className="text-white">placeholder testimonial slots</strong> defined in{" "}
            <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono">
              lib/constants.ts
            </code>{" "}
            (
            <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono">
              PLACEHOLDER_TESTIMONIALS
            </code>
            ). Also verify{" "}
            <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono">
              LEGAL_TERMS
            </code>{" "}
            in{" "}
            <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono">
              lib/constants.ts
            </code>{" "}
            for your final refund policy and access duration wording before public launch.
          </p>
        </section>
      </main>
    </div>
  );
}

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px]",
        ok
          ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
          : "border-amber-400/25 bg-amber-500/10 text-amber-200"
      )}
    >
      {ok ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
      ) : (
        <XCircle className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
      )}
      <span>{label}</span>
    </span>
  );
}

function KpiCard({
  icon,
  label,
  value,
  sublabel,
  accent
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  accent: "emerald" | "violet" | "cyan" | "indigo" | "amber";
}) {
  const borderClass =
    accent === "emerald"
      ? "hover:border-emerald-400/30"
      : accent === "violet"
        ? "hover:border-violet-400/30"
        : accent === "cyan"
          ? "hover:border-cyan-400/30"
          : accent === "indigo"
            ? "hover:border-indigo-400/30"
            : "hover:border-amber-400/30";

  return (
    <div
      className={cn(
        "glass-panel rounded-2xl p-4 transition-colors",
        borderClass
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        {icon}
      </div>
      <div className="mt-2.5 text-lg font-bold tracking-tight text-white sm:text-xl">
        {value}
      </div>
      <div className="mt-1 text-[11px] text-slate-400">{sublabel}</div>
    </div>
  );
}
