import { useCallback } from "react";

/**
 * Privacy-friendly analytics, client side.
 * Convex dependency removed. Logs locally or no-ops silently.
 */

export type AnalyticsEvent = "career_view" | "search" | "quiz_completed" | "compare_view";

const lastSent = new Map<string, number>();
const THROTTLE_MS = 5000;

export function useAnalytics() {
  return useCallback(
    (type: AnalyticsEvent, data: { careerId?: string; query?: string } = {}) => {
      const key = `${type}:${data.careerId ?? ""}:${data.query ?? ""}`;
      const now = Date.now();
      if (now - (lastSent.get(key) ?? 0) < THROTTLE_MS) return;
      lastSent.set(key, now);

      try {
        const events = JSON.parse(localStorage.getItem("karriere-analytics-events") || "[]");
        events.push({ type, careerId: data.careerId, query: data.query, timestamp: now });
        if (events.length > 100) events.shift();
        localStorage.setItem("karriere-analytics-events", JSON.stringify(events));
      } catch {
        // Analytics must never break the reading experience.
      }
    },
    [],
  );
}
