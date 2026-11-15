import { ConvexError, v } from "convex/values";
import { components } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { mutation, query, type QueryCtx } from "./_generated/server";
import { getUsername, requireUserId } from "./users";

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

export const addFriend = mutation({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    const userId = await requireUserId(ctx);
    const friendId = (await ctx.runQuery(
      components.authUsername.public.getUserIdByUsername,
      { username: username.trim() },
    )) as Id<"users"> | null;
    if (friendId === null) {
      throw new ConvexError("No user with that username");
    }
    if (friendId === userId) {
      throw new ConvexError("You can't add yourself");
    }
    if (!(await areFriends(ctx, userId, friendId))) {
      await ctx.db.insert("friendships", { from: userId, to: friendId });
    }
    if (!(await areFriends(ctx, friendId, userId))) {
      await ctx.db.insert("friendships", { from: friendId, to: userId });
    }
    return friendId;
  },
});

export const listFriends = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const ids = await friendIds(ctx, userId);
    return await Promise.all(
      ids.map(async (id) => ({ _id: id, username: await getUsername(ctx, id) })),
    );
  },
});
