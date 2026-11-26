"use client";

import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";

// Target: December 20, 2026, at 11:59:59 PM IST (Asia/Kolkata UTC+05:30)
const DEFAULT_DEC_20_DEADLINE = "2026-12-20T23:59:59+05:30";

interface LaunchCountdownProps {
  launchEndAt?: string | null;
  variant?: "badge" | "block";
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function computeRemaining(targetIso: string): TimeRemaining {
  const targetMs = Date.parse(targetIso);
  if (Number.isNaN(targetMs)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const diff = targetMs - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isExpired: false };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function LaunchCountdown({
  launchEndAt = DEFAULT_DEC_20_DEADLINE,
  variant = "badge"
}: LaunchCountdownProps) {
  const deadline = launchEndAt || DEFAULT_DEC_20_DEADLINE;
  const [mounted, setMounted] = useState(false);
  const [remaining, setRemaining] = useState<TimeRemaining>(() =>
    computeRemaining(deadline)
  );

  useEffect(() => {
    setMounted(true);
    const update = () => {
      setRemaining(computeRemaining(deadline));
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [deadline]);

  if (!mounted) {
    // Avoid hydration mismatch while SSR loads
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3.5 py-1.5 font-mono text-xs text-cyan-200">
        <Clock className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
        <span>Offer ends December 20, 2026 (IST)</span>
      </div>
    );
  }

  if (remaining.isExpired) {
    return (
      <div
        className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 font-mono text-xs text-amber-200"
        role="status"
        aria-live="polite"
      >
        <AlertTriangle className="h-4 w-4 text-amber-300" aria-hidden="true" />
        <span>Launch offer closed on December 20, 2026</span>
      </div>
    );
  }

  if (variant === "block") {
    return (
      <div
        className="flex flex-col items-center gap-2"
        role="timer"
        aria-live="polite"
      >
        <div className="flex items-center gap-1.5 font-mono text-xs text-cyan-300 mb-1">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Launch window closes Dec 20, 2026 (11:59 PM IST)</span>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
          <div className="flex flex-col rounded-xl border border-white/10 bg-black/40 px-3 py-2 sm:px-4 sm:py-2.5 min-w-[56px] sm:min-w-[68px]">
            <span className="font-mono text-xl sm:text-2xl font-bold text-white">
              {pad(remaining.days)}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400">
              Days
            </span>
          </div>

          <div className="flex flex-col rounded-xl border border-white/10 bg-black/40 px-3 py-2 sm:px-4 sm:py-2.5 min-w-[56px] sm:min-w-[68px]">
            <span className="font-mono text-xl sm:text-2xl font-bold text-white">
              {pad(remaining.hours)}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400">
              Hours
            </span>
          </div>

          <div className="flex flex-col rounded-xl border border-white/10 bg-black/40 px-3 py-2 sm:px-4 sm:py-2.5 min-w-[56px] sm:min-w-[68px]">
            <span className="font-mono text-xl sm:text-2xl font-bold text-white">
              {pad(remaining.minutes)}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400">
              Mins
            </span>
          </div>

          <div className="flex flex-col rounded-xl border border-white/10 bg-black/40 px-3 py-2 sm:px-4 sm:py-2.5 min-w-[56px] sm:min-w-[68px]">
            <span className="font-mono text-xl sm:text-2xl font-bold text-cyan-300">
              {pad(remaining.seconds)}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400">
              Secs
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3.5 py-1.5 font-mono text-xs text-cyan-200"
      aria-live="polite"
    >
      <Clock className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
      <span>Offer ends Dec 20:</span>
      <span className="font-semibold text-white">
        {remaining.days > 0 ? `${remaining.days}d ` : ""}
        {pad(remaining.hours)}h:{pad(remaining.minutes)}m:{pad(remaining.seconds)}s
      </span>
    </div>
  );
}
