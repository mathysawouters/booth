import { defineSchema, defineTable } from "convex/server";
import { v, type Infer } from "convex/values";

export const skillValidator = v.union(
  v.literal("brave"),
  v.literal("kind"),
  v.literal("curious"),
  v.literal("money"),
  v.literal("helper"),
  v.literal("reader"),
);

export const modeValidator = v.union(v.literal("phone"), v.literal("real"));

export const categoryValidator = v.union(
  v.literal("bedtime"),
  v.literal("build"),
  v.literal("story"),
  v.literal("outside"),
  v.literal("kitchen"),
  v.literal("art"),
  v.literal("music"),
  v.literal("skills"),
  v.literal("calm"),
  v.literal("surprise"),
);

export const kindValidator = v.union(
  v.literal("story"),
  v.literal("adventure"),
  v.literal("skill"),
  v.literal("draw"),
  v.literal("quiz"),
  v.literal("sound"),
);

export const statusValidator = v.union(
  v.literal("open"),
  v.literal("done"),
  v.literal("skipped"),
);

export type Skill = Infer<typeof skillValidator>;
export type Mode = Infer<typeof modeValidator>;
export type Category = Infer<typeof categoryValidator>;
export type Kind = Infer<typeof kindValidator>;

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    familyCode: v.optional(v.string()),
    plus: v.optional(v.boolean()),
  }).index("by_familyCode", ["familyCode"]),

  friendships: defineTable({
    from: v.id("users"),
    to: v.id("users"),
  }).index("by_from_and_to", ["from", "to"]),

  kids: defineTable({
    parent: v.id("users"),
    name: v.string(),
    age: v.number(),
    interests: v.array(v.string()),
    note: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_parent", ["parent"]),

  legends: defineTable({
    kid: v.id("kids"),
    day: v.string(),
    mode: modeValidator,
    category: categoryValidator,
    minutes: v.number(),
    kind: kindValidator,
    title: v.string(),
    steps: v.array(v.string()),
    story: v.optional(v.array(v.string())),
    question: v.string(),
    skill: skillValidator,
    xp: v.number(),
    challenge: v.optional(v.string()),
    challengeImage: v.optional(v.id("_storage")),
    status: statusValidator,
    photo: v.optional(v.id("_storage")),
    quote: v.optional(v.string()),
    voice: v.optional(v.id("_storage")),
    reaction: v.optional(v.string()),
    levelUp: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    rerolled: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("by_kid_and_day", ["kid", "day"])
    .index("by_kid_and_status_and_day", ["kid", "status", "day"])
    .index("by_kid_and_status_and_completedAt", ["kid", "status", "completedAt"]),

  skills: defineTable({
    kid: v.id("kids"),
    skill: skillValidator,
    xp: v.number(),
  }).index("by_kid_and_skill", ["kid", "skill"]),

  cheers: defineTable({
    legend: v.id("legends"),
    user: v.id("users"),
    emoji: v.string(),
    createdAt: v.number(),
  }).index("by_legend_and_user", ["legend", "user"]),
});
