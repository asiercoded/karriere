import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Checked indices for one career. Returns null when the user is signed out —
 * the frontend falls back to local storage in that case.
 */
export const getByCareer = query({
  args: { careerId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const row = await ctx.db
      .query("checklist")
      .withIndex("by_user_career", (q) => q.eq("userId", userId).eq("careerId", args.careerId))
      .first();
    return row?.checked ?? [];
  },
});

/** Progress across every career — used by the Saved page's dashboard. */
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const rows = await ctx.db.query("checklist").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
    return rows
      .filter((r) => r.checked.length > 0)
      .map((r) => ({ careerId: r.careerId, checked: r.checked }));
  },
});

/** Toggle one checklist item for the current user. */
export const toggleItem = mutation({
  args: { careerId: v.string(), index: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Sign in to track checklist progress");

    const existing = await ctx.db
      .query("checklist")
      .withIndex("by_user_career", (q) => q.eq("userId", userId).eq("careerId", args.careerId))
      .first();

    if (existing) {
      const next = existing.checked.includes(args.index)
        ? existing.checked.filter((i) => i !== args.index)
        : [...existing.checked, args.index].sort((a, b) => a - b);
      if (next.length === 0) {
        await ctx.db.delete(existing._id);
      } else {
        await ctx.db.patch(existing._id, { checked: next });
      }
    } else {
      await ctx.db.insert("checklist", {
        userId,
        careerId: args.careerId,
        checked: [args.index],
      });
    }
  },
});

/** Clear all progress for a career. */
export const reset = mutation({
  args: { careerId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Sign in to track checklist progress");
    const existing = await ctx.db
      .query("checklist")
      .withIndex("by_user_career", (q) => q.eq("userId", userId).eq("careerId", args.careerId))
      .first();
    if (existing) await ctx.db.delete(existing._id);
  },
});
