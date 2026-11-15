import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({}),

  strips: defineTable({
    author: v.id("users"),
    day: v.string(),
    photos: v.array(v.id("_storage")),
    caption: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_author_and_day", ["author", "day"])
    .index("by_day", ["day"]),

  friendships: defineTable({
    from: v.id("users"),
    to: v.id("users"),
  }).index("by_from_and_to", ["from", "to"]),

  reactions: defineTable({
    strip: v.id("strips"),
    user: v.id("users"),
    emoji: v.string(),
  }).index("by_strip_and_user", ["strip", "user"]),
});
