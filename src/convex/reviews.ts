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
    const reviews = await ctx.db
      .query("careerReviews")
      .filter((q) => q.and(
        q.eq(q.field("careerId"), args.careerId),
        q.eq(q.field("status"), "approved")
      ))
      .collect();
      
    // Sort descending by createdAt
    return reviews.sort((a, b) => b.createdAt - a.createdAt);
  },
});
