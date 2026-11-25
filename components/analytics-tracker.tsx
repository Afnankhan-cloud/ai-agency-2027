"use client";

import { useEffect } from "react";
import { trackPageViewOnce } from "@/lib/analytics";

export function AnalyticsTracker() {
  useEffect(() => {
    trackPageViewOnce("/");
  }, []);

  return null;
}
