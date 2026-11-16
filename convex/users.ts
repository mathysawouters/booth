import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { components } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { internalMutation, mutation, query, type QueryCtx } from "./_generated/server";

export const DEVICE_USERNAME_PREFIX = "device-";
const MAX_NAME_LENGTH = 60;

const CODE_WORDS = [
  "ACORN", "APPLE", "BEAR", "BEE", "BIRD", "BOAT", "BUNNY", "CAKE", "CLOUD", "COMET",
  "CORAL", "CROWN", "DAISY", "DINO", "DRUM", "DUCK", "EAGLE", "FERN", "FOX", "FROG",
  "GIANT", "GRAPE", "HONEY", "JELLY", "KITE", "KOALA", "LAMB", "LEAF", "LEMON", "LION",
  "LLAMA", "MANGO", "MAPLE", "MOON", "MOOSE", "NEST", "OCEAN", "OTTER", "OWL", "PANDA",
  "PEACH", "PEARL", "PIANO", "PLUM", "PONY", "QUEEN", "RAIN", "ROBIN", "ROCKET", "SEAL",
  "SHELL", "SNOW", "SPARK", "STAR", "SUN", "SWAN", "TIGER", "TRAIN", "TULIP", "TURTLE",
  "WAVE", "WHALE", "WOLF", "ZEBRA",
];

export const createUser = internalMutation({
  args: {
    method: v.object({
      name: v.literal("usernamePassword"),
      profile: v.object({}),
    }),
  },
  returns: v.id("users"),
  handler: async (ctx) => {
    return await ctx.db.insert("users", {});
  },
});

export async function requireUserId(ctx: QueryCtx): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new ConvexError("Not signed in");
  }
  return userId;
}

export async function displayName(
  ctx: QueryCtx,
  userId: Id<"users">,
): Promise<string | null> {
  const user = await ctx.db.get("users", userId);
  if (user?.name !== undefined) {
    return user.name;
  }
  const username: string | null = await ctx.runQuery(
    components.authUsername.public.getUsername,
    { userId },
  );
  return username === null || username.startsWith(DEVICE_USERNAME_PREFIX) ? null : username;
}

export function cleanName(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_NAME_LENGTH) {
    throw new ConvexError(`Your name must be 1 to ${MAX_NAME_LENGTH} characters`);
  }
  return trimmed;
}

export function normalizeFamilyCode(code: string): string | null {
  const match = /^([A-Z]+)(\d{4})$/.exec(code.toUpperCase().replace(/[^A-Z0-9]/g, ""));
  return match === null ? null : `${match[1]}-${match[2]}`;
}

export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const user = await ctx.db.get("users", userId);
    return {
      _id: userId,
      name: await displayName(ctx, userId),
      familyCode: user?.familyCode ?? null,
    };
  },
});

export const ensureFamilyCode = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const user = await ctx.db.get("users", userId);
    if (user === null) {
      throw new ConvexError("User not found");
    }
    if (user.familyCode !== undefined) {
      return user.familyCode;
    }
    for (let attempt = 0; attempt < 20; attempt++) {
      const word = CODE_WORDS[Math.floor(Math.random() * CODE_WORDS.length)];
      const digits = String(1000 + Math.floor(Math.random() * 9000));
      const code = `${word}-${digits}`;
      const taken = await ctx.db
        .query("users")
        .withIndex("by_familyCode", (q) => q.eq("familyCode", code))
        .first();
      if (taken === null) {
        await ctx.db.patch("users", userId, { familyCode: code });
        return code;
      }
    }
    throw new ConvexError("Couldn't make a family code. Try again");
  },
});
