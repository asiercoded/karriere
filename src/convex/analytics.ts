import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Privacy-friendly analytics.
 *
 * The frontend calls `record` (fire-and-forget) for the four signals that drive
 * content and ordering decisions: which career pages get opened, what students
 * actually search, how often the quiz is finished, and which comparisons get
 * viewed. Events are anonymous — no user id, no IP, no cookies — and the
 * client helper throttles repeats so bots/refresh-hammers don't flood the
 * table.
 *
 * `overview` powers the /admin page (any signed-in user; tighten to an admin
 * role later if the team grows).
 */

const EVENT_TYPES = v.union(
  v.literal("career_view"),
  v.literal("search"),
  v.literal("quiz_completed"),
  v.literal("compare_view"),
);

const WINDOW_MS = 30 * 24 * 60 * 60 * 1000; // last 30 days
const TREND_DAYS = 14;

export const record = mutation({
  args: {
    type: EVENT_TYPES,
    careerId: v.optional(v.string()),
    query: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Sanitize before it touches the table.
    const careerId = args.careerId?.trim().slice(0, 40) || undefined;
    const query = args.query?.trim().replace(/\s+/g, " ").slice(0, 80) || undefined;
    // career_view must have a careerId; search must have a query.
    // quiz_completed and compare_view are valid with no payload.
    if (args.type === "career_view" && !careerId) return;
    if (args.type === "search" && !query) return;

    await ctx.db.insert("analytics", {
      type: args.type,
      careerId,
      query: args.type === "search" ? query : undefined,
    });
  },
});

export const overview = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;

    const cutoff = Date.now() - WINDOW_MS;
    const events = await ctx.db
      .query("analytics")
      .withIndex("by_creation_time", (q) => q.gte("_creationTime", cutoff))
      .collect();

    const totals = { careerViews: 0, searches: 0, quizCompletions: 0, compares: 0, all: events.length };

    const careerCounts = new Map<string, number>();
    const searchCounts = new Map<string, number>();
    const dayCounts = new Map<string, number>();
    const trendStart = Date.now() - (TREND_DAYS - 1) * 24 * 60 * 60 * 1000;

    for (const e of events) {
      switch (e.type) {
        case "career_view":
          totals.careerViews++;
          if (e.careerId) careerCounts.set(e.careerId, (careerCounts.get(e.careerId) ?? 0) + 1);
          break;
        case "search":
          totals.searches++;
          if (e.query) searchCounts.set(e.query.toLowerCase(), (searchCounts.get(e.query.toLowerCase()) ?? 0) + 1);
          break;
        case "quiz_completed":
          totals.quizCompletions++;
          break;
        case "compare_view":
          totals.compares++;
          break;
      }
      if (e._creationTime >= trendStart) {
        const day = new Date(e._creationTime).toISOString().slice(0, 10);
        dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1);
      }
    }

    const byCount = (m: Map<string, number>) =>
      [...m.entries()]
        .map(([key, count]) => ({ key, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);

    // Fill every day of the trend window so the chart is gap-free.
    const daily: { date: string; count: number }[] = [];
    for (let i = 0; i < TREND_DAYS; i++) {
      const d = new Date(trendStart + i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      daily.push({ date: d, count: dayCounts.get(d) ?? 0 });
    }

    return {
      totals,
      topCareers: byCount(careerCounts),
      topSearches: byCount(searchCounts),
      daily,
    };
  },
});
