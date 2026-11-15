import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { areFriends } from "./friends";
import { requireUserId } from "./users";

const MAX_EMOJI_LENGTH = 16;

export const react = mutation({
  args: { strip: v.id("strips"), emoji: v.string() },
  handler: async (ctx, { strip: stripId, emoji }) => {
    const userId = await requireUserId(ctx);
    const trimmed = emoji.trim();
    if (trimmed.length === 0 || trimmed.length > MAX_EMOJI_LENGTH) {
      throw new ConvexError("Invalid emoji");
    }
    const strip = await ctx.db.get("strips", stripId);
    if (strip === null) {
      throw new ConvexError("Strip not found");
    }
    if (strip.author !== userId) {
      if (!(await areFriends(ctx, userId, strip.author))) {
        throw new ConvexError("You can only react to your friends' strips");
      }
      const posted = await ctx.db
        .query("strips")
        .withIndex("by_author_and_day", (q) =>
          q.eq("author", userId).eq("day", strip.day),
        )
        .unique();
      if (posted === null) {
        throw new ConvexError("Post your own strip to unlock this one");
      }
    }
    const existing = await ctx.db
      .query("reactions")
      .withIndex("by_strip_and_user", (q) =>
        q.eq("strip", stripId).eq("user", userId),
      )
      .unique();
    if (existing === null) {
      await ctx.db.insert("reactions", { strip: stripId, user: userId, emoji: trimmed });
    } else if (existing.emoji === trimmed) {
      await ctx.db.delete("reactions", existing._id);
    } else {
      await ctx.db.patch("reactions", existing._id, { emoji: trimmed });
    }
    return null;
  },
});
