"use client";

import { useEffect, useRef } from "react";

const TRACK_URL = "/api/analytics/track";
const VISITOR_COOKIE = "iya_visitor_id";
const SESSION_COOKIE = "iya_session_id";
const CONSENT_KEY = "iya_cookie_consent";

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAgeDays: number): void {
  const maxAge = maxAgeDays * 86400;
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
}

function getVisitorId(): string {
  let id = getCookie(VISITOR_COOKIE);
  if (!id) {
    id = generateId();
    setCookie(VISITOR_COOKIE, id, 365);
  }
  return id;
}

function getSessionId(): string {
  let id = getCookie(SESSION_COOKIE);
  if (!id) {
    id = generateId();
  }
  // Refresh session cookie (30 min sliding window)
  setCookie(SESSION_COOKIE, id, 1 / 48); // ~30 minutes
  return id;
}

function getDeviceType(): string {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  return "Other";
}

function getOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Linux")) return "Linux";
  return "Other";
}

function getUTMParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
    const val = params.get(key);
    if (val) utm[key] = val;
  }
  return utm;
}

function sendEvent(data: Record<string, unknown>): void {
  try {
    const payload = JSON.stringify(data);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(TRACK_URL, new Blob([payload], { type: "application/json" }));
    } else {
      fetch(TRACK_URL, { method: "POST", body: payload, keepalive: true });
    }
  } catch {
    // Silent fail — tracking should never break the site
  }
}

export function Tracker() {
  const startTime = useRef<number>(Date.now());
  const maxScroll = useRef<number>(0);
  const lastPath = useRef<string>("");

  useEffect(() => {
    // Respect cookie consent
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === "declined") return;

    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const baseData = {
      visitor_id: visitorId,
      session_id: sessionId,
      device_type: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
      referrer: document.referrer || "",
      ...getUTMParams(),
    };

    // ── Pageview tracking ────────────────────────────────────
    function trackPageview() {
      // Send time_on_page for previous page
      if (lastPath.current && lastPath.current !== window.location.pathname) {
        sendEvent({
          ...baseData,
          event: "time_on_page",
          page_url: lastPath.current,
          time_on_page: Math.round((Date.now() - startTime.current) / 1000),
          scroll_depth: maxScroll.current,
        });
      }

      lastPath.current = window.location.pathname;
      startTime.current = Date.now();
      maxScroll.current = 0;

      sendEvent({
        ...baseData,
        event: "pageview",
        page_url: window.location.pathname + window.location.search,
      });
    }

    trackPageview();

    // ── Scroll depth ─────────────────────────────────────────
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const depth = Math.round((scrollTop / docHeight) * 100);
        if (depth > maxScroll.current) maxScroll.current = depth;
      }
    }

    // ── CTA click tracking ───────────────────────────────────
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "a[href], button, [data-track-click]"
      );
      if (!target) return;

      const label =
        target.getAttribute("data-track-label") ||
        target.getAttribute("aria-label") ||
        target.textContent?.trim().slice(0, 80) ||
        "";

      const isPhone = target.getAttribute("href")?.startsWith("tel:");
      const isCTA = target.tagName === "BUTTON" || target.hasAttribute("data-track-click");
      const isNavLink = target.closest("nav") !== null;

      let clickType = "link";
      if (isPhone) clickType = "phone";
      else if (isCTA) clickType = "cta";
      else if (isNavLink) clickType = "nav";

      sendEvent({
        ...baseData,
        event: "click",
        page_url: window.location.pathname,
        click_type: clickType,
        click_label: label,
      });
    }

    // ── Route change detection (App Router) ──────────────────
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      setTimeout(trackPageview, 0);
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      setTimeout(trackPageview, 0);
    };

    window.addEventListener("popstate", trackPageview);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleClick, { capture: true });

    // ── Cleanup on unmount + send final time ─────────────────
    function handleBeforeUnload() {
      sendEvent({
        ...baseData,
        event: "time_on_page",
        page_url: window.location.pathname,
        time_on_page: Math.round((Date.now() - startTime.current) / 1000),
        scroll_depth: maxScroll.current,
      });
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", trackPageview);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null;
}
