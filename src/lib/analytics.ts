import { useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * Privacy-friendly analytics, client side.
 *
 * Fire-and-forget `track()` calls for the four signals that drive content
 * decisions (career views, searches, quiz completions, comparisons). Events are
 * anonymous — no user id, no cookies, no IP. Identical events are throttled to
 * one per 5s so React StrictMode double-mounts, back/forward re-renders and
 * rapid clicks don't flood the table, while genuinely separate events (a new
 * career, a new search) still get recorded.
 */

export type AnalyticsEvent = "career_view" | "search" | "quiz_completed" | "compare_view";

const lastSent = new Map<string, number>();
const THROTTLE_MS = 5000;

export function useAnalytics() {
  const record = useMutation(api.analytics.record);

  return useCallback(
    (type: AnalyticsEvent, data: { careerId?: string; query?: string } = {}) => {
      const key = `${type}:${data.careerId ?? ""}:${data.query ?? ""}`;
      const now = Date.now();
      if (now - (lastSent.get(key) ?? 0) < THROTTLE_MS) return;
      lastSent.set(key, now);
      void record({ type, careerId: data.careerId, query: data.query }).catch(() => {
        // Analytics must never break the reading experience.
      });
    },
    [record],
  );
}
