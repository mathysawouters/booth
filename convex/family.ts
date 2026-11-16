import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { friendIds } from "./friends";
import { kidsOf, requireFamilyOf } from "./kids";
import { withUrls } from "./legends";
import { displayName, requireUserId } from "./users";

const FEED_SIZE = 50;
const MAX_CHEERS = 100;
const MAX_EMOJI_LENGTH = 16;

export const familyFeed = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const parents = [userId, ...(await friendIds(ctx, userId))];
    const kids = (await Promise.all(parents.map((parent) => kidsOf(ctx, parent)))).flat();
    const legends = (
      await Promise.all(
        kids.map((kid) =>
          ctx.db
            .query("legends")
            .withIndex("by_kid_and_status_and_completedAt", (q) =>
              q.eq("kid", kid._id).eq("status", "done"),
            )
            .order("desc")
            .take(FEED_SIZE),
        ),
      )
    )
      .flat()
      .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))
      .slice(0, FEED_SIZE);

    const names = new Map<Id<"users">, Promise<string | null>>();
    const nameOf = (id: Id<"users">) => {
      let name = names.get(id);
      if (name === undefined) {
        name = displayName(ctx, id);
        names.set(id, name);
      }
      return name;
    };

    return await Promise.all(
      legends.map(async (legend) => {
        const kid = kids.find((k) => k._id === legend.kid)!;
        const cheers = await ctx.db
          .query("cheers")
          .withIndex("by_legend_and_user", (q) => q.eq("legend", legend._id))
          .take(MAX_CHEERS);
        return {
          ...(await withUrls(ctx, legend)),
          kidName: kid.name,
          parentName: await nameOf(kid.parent),
          cheers: await Promise.all(
            cheers.map(async (cheer) => ({
              emoji: cheer.emoji,
              userName: await nameOf(cheer.user),
              mine: cheer.user === userId,
            })),
          ),
        };
      }),
    );
  },
});

export const cheer = mutation({
  args: { legend: v.id("legends"), emoji: v.string() },
  handler: async (ctx, { legend: legendId, emoji }) => {
    const userId = await requireUserId(ctx);
    const trimmed = emoji.trim();
    if (trimmed.length === 0 || trimmed.length > MAX_EMOJI_LENGTH) {
      throw new ConvexError("Invalid emoji");
    }
    const legend = await ctx.db.get("legends", legendId);
    if (legend === null) {
      throw new ConvexError("Legend not found");
    }
    await requireFamilyOf(ctx, legend.kid);
    const existing = await ctx.db
      .query("cheers")
      .withIndex("by_legend_and_user", (q) =>
        q.eq("legend", legendId).eq("user", userId),
      )
      .unique();
    if (existing === null) {
      await ctx.db.insert("cheers", {
        legend: legendId,
        user: userId,
        emoji: trimmed,
        createdAt: Date.now(),
      });
    } else if (existing.emoji === trimmed) {
      await ctx.db.delete("cheers", existing._id);
    } else {
      await ctx.db.patch("cheers", existing._id, { emoji: trimmed, createdAt: Date.now() });
    }
    return null;
  },
});
