export type AnalyticsEventName = "page_view" | "cta_click" | "checkout_start";
export type MarketType = "india" | "international";

export interface AnalyticsPayload {
  event_name: AnalyticsEventName;
  session_id: string;
  path: string;
  market?: MarketType;
  cta_location?: string;
  referrer_domain?: string;
}

const SESSION_STORAGE_KEY = "vd_anon_session_id";
const PAGEVIEW_TRACKED_KEY = "vd_pv_recorded";

function createAnonymousId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const randomPart = Math.random().toString(36).slice(2, 12);
  return `vd-${Date.now().toString(36)}-${randomPart}`;
}

export function getOrCreateAnonymousSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    let existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!existing || existing.length < 8) {
      existing = createAnonymousId();
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, existing);
    }
    return existing;
  } catch {
    return createAnonymousId();
  }
}

function getSafeReferrerDomain(): string | undefined {
  if (typeof document === "undefined" || !document.referrer) return undefined;
  try {
    const url = new URL(document.referrer);
    if (url.hostname && url.hostname !== window.location.hostname) {
      return url.hostname.slice(0, 120);
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export function sendAnalyticsEvent(payload: Omit<AnalyticsPayload, "session_id" | "path"> & { path?: string }): void {
  if (typeof window === "undefined") return;
  const sessionId = getOrCreateAnonymousSessionId();
  if (!sessionId) return;

  const body: AnalyticsPayload = {
    event_name: payload.event_name,
    session_id: sessionId,
    path: payload.path ?? window.location.pathname ?? "/",
    market: payload.market,
    cta_location: payload.cta_location,
    referrer_domain: payload.referrer_domain ?? getSafeReferrerDomain()
  };

  const json = JSON.stringify(body);

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([json], { type: "application/json" });
      const queued = navigator.sendBeacon("/api/events", blob);
      if (queued) return;
    }

    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json,
      keepalive: true
    });
  } catch {
    // Analytics must never interrupt user conversion flows
  }
}

export function trackPageViewOnce(path = "/"): void {
  if (typeof window === "undefined") return;
  try {
    if (window.sessionStorage.getItem(PAGEVIEW_TRACKED_KEY) === "1") {
      return;
    }
    window.sessionStorage.setItem(PAGEVIEW_TRACKED_KEY, "1");
  } catch {
    // Proceed cleanly even if sessionStorage is restricted
  }

  sendAnalyticsEvent({
    event_name: "page_view",
    path
  });
}

export function trackCtaClick(ctaLocation: string, market?: MarketType): void {
  sendAnalyticsEvent({
    event_name: "cta_click",
    cta_location: ctaLocation,
    market
  });
}

export function trackCheckoutStart(market: MarketType, ctaLocation: string): void {
  sendAnalyticsEvent({
    event_name: "checkout_start",
    market,
    cta_location: ctaLocation
  });
}
