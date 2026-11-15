import { ConvexError, v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { mutation, query, type QueryCtx } from "./_generated/server";
import { areFriends } from "./friends";
import { levelForXp, SKILLS } from "./levels";
import { requireUserId } from "./users";

const MAX_KIDS = 20;
const MAX_INTERESTS = 10;
const STREAK_LOOKBACK = 400;

export function assertDay(day: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || Number.isNaN(Date.parse(day))) {
    throw new ConvexError("day must be a valid YYYY-MM-DD date");
  }
}

export function previousDay(day: string): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

export async function requireParentOf(
  ctx: QueryCtx,
  kidId: Id<"kids">,
): Promise<Doc<"kids">> {
  const userId = await requireUserId(ctx);
  const kid = await ctx.db.get("kids", kidId);
  if (kid === null) {
    throw new ConvexError("Kid not found");
  }
  if (kid.parent !== userId) {
    throw new ConvexError("Only this kid's parent can do that");
  }
  return kid;
}

export async function requireFamilyOf(
  ctx: QueryCtx,
  kidId: Id<"kids">,
): Promise<Doc<"kids">> {
  const userId = await requireUserId(ctx);
  const kid = await ctx.db.get("kids", kidId);
  if (kid === null) {
    throw new ConvexError("Kid not found");
  }
  if (kid.parent !== userId && !(await areFriends(ctx, userId, kid.parent))) {
    throw new ConvexError("Only this kid's family can see that");
  }
  return kid;
}

export async function kidsOf(ctx: QueryCtx, parent: Id<"users">) {
  return await ctx.db
    .query("kids")
    .withIndex("by_parent", (q) => q.eq("parent", parent))
    .take(MAX_KIDS);
}

function cleanText(value: string, label: string, max: number): string {
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > max) {
    throw new ConvexError(`${label} must be 1 to ${max} characters`);
  }
  return trimmed;
}

export const addKid = mutation({
  args: {
    name: v.string(),
    age: v.number(),
    interests: v.array(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { name, age, interests, note }) => {
    const userId = await requireUserId(ctx);
    if (!Number.isInteger(age) || age < 1 || age > 17) {
      throw new ConvexError("age must be a whole number from 1 to 17");
    }
    if (interests.length > MAX_INTERESTS) {
      throw new ConvexError(`Pick at most ${MAX_INTERESTS} interests`);
    }
    if ((await kidsOf(ctx, userId)).length >= MAX_KIDS) {
      throw new ConvexError("That's a lot of kids! You've reached the limit");
    }
    const trimmedNote = note?.trim();
    if (trimmedNote && trimmedNote.length > 300) {
      throw new ConvexError("note must be at most 300 characters");
    }
    return await ctx.db.insert("kids", {
      parent: userId,
      name: cleanText(name, "name", 40),
      age,
      interests: interests.map((interest) => cleanText(interest, "interest", 40)),
      note: trimmedNote || undefined,
      createdAt: Date.now(),
    });
  },
});

export const myKids = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return await kidsOf(ctx, userId);
  },
});

export const kidSkills = query({
  args: { kid: v.id("kids") },
  handler: async (ctx, { kid }) => {
    await requireFamilyOf(ctx, kid);
    const rows = await ctx.db
      .query("skills")
      .withIndex("by_kid_and_skill", (q) => q.eq("kid", kid))
      .take(SKILLS.length);
    return SKILLS.map((skill) => {
      const xp = rows.find((row) => row.skill === skill)?.xp ?? 0;
      return { skill, xp, ...levelForXp(xp) };
    });
  },
});

export const streak = query({
  args: { kid: v.id("kids"), day: v.string() },
  handler: async (ctx, { kid, day }) => {
    await requireFamilyOf(ctx, kid);
    assertDay(day);
    const done = await ctx.db
      .query("legends")
      .withIndex("by_kid_and_status_and_day", (q) =>
        q.eq("kid", kid).eq("status", "done").lte("day", day),
      )
      .order("desc")
      .take(STREAK_LOOKBACK);
    const days = new Set(done.map((legend) => legend.day));
    let cursor = days.has(day) ? day : previousDay(day);
    let count = 0;
    while (days.has(cursor)) {
      count += 1;
      cursor = previousDay(cursor);
    }
    return count;
  },
});
