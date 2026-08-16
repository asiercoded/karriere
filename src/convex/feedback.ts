import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Record a "Was this page helpful?" vote for a career.
 * Signed-in users get one vote per career (a new vote replaces the old);
 * signed-out votes are stored anonymously.
 */
export const record = mutation({
  args: {
    careerId: v.string(),
    helpful: v.boolean(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId !== null) {
      const existing = await ctx.db
        .query("careerFeedback")
        .withIndex("by_user_career", (q) => q.eq("userId", userId).eq("careerId", args.careerId))
        .first();
      if (existing) await ctx.db.delete(existing._id);
    }

    await ctx.db.insert("careerFeedback", {
      careerId: args.careerId,
      userId: userId ?? undefined,
      helpful: args.helpful,
      note: args.note,
      createdAt: Date.now(),
    });
    return true;
  },
});
