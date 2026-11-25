"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface LaunchCountdownProps {
  launchEndAt: string | null;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeRemaining(targetIso: string): TimeRemaining | null {
  const targetMs = Date.parse(targetIso);
  if (Number.isNaN(targetMs)) return null;
  const diff = targetMs - Date.now();
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Renders a real countdown ONLY when `LAUNCH_END_AT` is configured and in the future.
 * Otherwise renders nothing so only the legitimate buyer-limit urgency copy appears.
 */
export function LaunchCountdown({ launchEndAt }: LaunchCountdownProps) {
  const [remaining, setRemaining] = useState<TimeRemaining | null>(null);

  useEffect(() => {
    if (!launchEndAt) {
      setRemaining(null);
      return;
    }

    const update = () => {
      setRemaining(computeRemaining(launchEndAt));
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [launchEndAt]);

  if (!launchEndAt || !remaining) {
    return null;
  }

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3.5 py-1.5 font-mono text-xs text-cyan-200"
      aria-live="polite"
    >
      <Clock className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
      <span>Launch window closes in</span>
      <span className="font-semibold text-white">
        {remaining.days > 0 ? `${remaining.days}d ` : ""}
        {pad(remaining.hours)}h:{pad(remaining.minutes)}m:{pad(remaining.seconds)}s
      </span>
    </div>
  );
}
