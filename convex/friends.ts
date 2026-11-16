import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query, type QueryCtx } from "./_generated/server";
import { displayName, normalizeFamilyCode, requireUserId } from "./users";

const MAX_FRIENDS = 500;

export async function friendIds(
  ctx: QueryCtx,
  userId: Id<"users">,
): Promise<Id<"users">[]> {
  const rows = await ctx.db
    .query("friendships")
    .withIndex("by_from_and_to", (q) => q.eq("from", userId))
    .take(MAX_FRIENDS);
  return rows.map((row) => row.to);
}

export async function areFriends(
  ctx: QueryCtx,
  from: Id<"users">,
  to: Id<"users">,
): Promise<boolean> {
  const row = await ctx.db
    .query("friendships")
    .withIndex("by_from_and_to", (q) => q.eq("from", from).eq("to", to))
    .unique();
  return row !== null;
}

export const joinFamily = mutation({
  args: { code: v.string() },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, { code }) => {
    const userId = await requireUserId(ctx);
    const normalized = normalizeFamilyCode(code);
    if (normalized === null) {
      throw new ConvexError("That doesn't look like a family code. It looks like STAR-4821");
    }
    const friend = await ctx.db
      .query("users")
      .withIndex("by_familyCode", (q) => q.eq("familyCode", normalized))
      .unique();
    if (friend === null) {
      throw new ConvexError("No family with that code. Check it and try again");
    }
    if (friend._id === userId) {
      throw new ConvexError("That's your own code. Share it with your family!");
    }
    if (!(await areFriends(ctx, userId, friend._id))) {
      await ctx.db.insert("friendships", { from: userId, to: friend._id });
    }
    if (!(await areFriends(ctx, friend._id, userId))) {
      await ctx.db.insert("friendships", { from: friend._id, to: userId });
    }
    return await displayName(ctx, friend._id);
  },
});

export const listFriends = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const ids = await friendIds(ctx, userId);
    return await Promise.all(
      ids.map(async (id) => ({ _id: id, name: await displayName(ctx, id) })),
    );
  },
});
