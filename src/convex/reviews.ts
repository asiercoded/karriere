import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const submitReview = mutation({
  args: {
    careerId: v.string(),
    quote: v.string(),
    label: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    const reviewId = await ctx.db.insert("careerReviews", {
      careerId: args.careerId,
      quote: args.quote,
      label: args.label,
      status: "pending",
      userId: userId ?? undefined,
      createdAt: Date.now(),
    });

    return reviewId;
  },
});

export const getApprovedReviews = query({
  args: {
    careerId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const reviews = await ctx.db
        .query("careerReviews")
        .filter((q) =>
          q.and(
            q.eq(q.field("careerId"), args.careerId),
            q.eq(q.field("status"), "approved"),
          ),
        )
        .collect();

      return reviews.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    } catch (err) {
      console.error("Error fetching approved reviews:", err);
      return [];
    }
  },
});

/** Admin: list all pending reviews, newest first. Requires auth. */
export const getPendingReviews = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;

    const reviews = await ctx.db
      .query("careerReviews")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    return reviews.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  },
});

/** Admin: approve or reject a single review. Requires auth. */
export const moderateReview = mutation({
  args: {
    reviewId: v.id("careerReviews"),
    status: v.union(v.literal("approved"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    await ctx.db.patch(args.reviewId, { status: args.status });
  },
});
