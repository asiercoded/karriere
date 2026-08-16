import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // one row per user × career, holding the indices of completed
    // "Before you commit" checklist items
    checklist: defineTable({
      userId: v.id("users"),
      careerId: v.string(),
      checked: v.array(v.number()),
    })
      .index("by_user_career", ["userId", "careerId"])
      .index("by_user", ["userId"]),

    // one vote per career page — "Was this page helpful?" (+ optional note)
    careerFeedback: defineTable({
      careerId: v.string(),
      userId: v.optional(v.id("users")),
      helpful: v.boolean(),
      note: v.optional(v.string()),
      createdAt: v.number(),
    })
      .index("by_career", ["careerId"])
      .index("by_user_career", ["userId", "careerId"]),

    // privacy-friendly analytics: anonymous, no cookies, no user ids, no IPs.
    // A row per event (career page opened, search typed, quiz finished, compare
    // viewed); the /admin page aggregates the last 30 days.
    analytics: defineTable({
      type: v.union(
        v.literal("career_view"),
        v.literal("search"),
        v.literal("quiz_completed"),
        v.literal("compare_view"),
      ),
      careerId: v.optional(v.string()),
      query: v.optional(v.string()),
    }).index("by_type", ["type"]),

    // add other tables here

    // tableName: defineTable({
    //   ...
    //   // table fields
    // }).index("by_field", ["field"])
  },
  {
    schemaValidation: false,
  },
);

export default schema;
