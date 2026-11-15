import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { mutation, query, type QueryCtx } from "./_generated/server";
import { friendIds } from "./friends";
import { getUsername, requireUserId } from "./users";

const PHOTOS_PER_STRIP = 4;
const MAX_CAPTION_LENGTH = 200;
const MAX_REACTIONS = 200;

const dayValidator = v.string();

function assertDay(day: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || Number.isNaN(Date.parse(day))) {
    throw new ConvexError("day must be a valid YYYY-MM-DD date");
  }
}

async function stripForDay(ctx: QueryCtx, author: Id<"users">, day: string) {
  return await ctx.db
    .query("strips")
    .withIndex("by_author_and_day", (q) => q.eq("author", author).eq("day", day))
    .unique();
}

async function withDetails(ctx: QueryCtx, strip: Doc<"strips">) {
  const [photoUrls, reactions, authorUsername] = await Promise.all([
    Promise.all(strip.photos.map((id) => ctx.storage.getUrl(id))),
    ctx.db
      .query("reactions")
      .withIndex("by_strip_and_user", (q) => q.eq("strip", strip._id))
      .take(MAX_REACTIONS),
    getUsername(ctx, strip.author),
  ]);
  return {
    ...strip,
    authorUsername,
    photoUrls,
    reactions: reactions.map(({ user, emoji }) => ({ user, emoji })),
  };
}

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUserId(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const createStrip = mutation({
  args: {
    day: dayValidator,
    photos: v.array(v.id("_storage")),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, { day, photos, caption }) => {
    const userId = await requireUserId(ctx);
    assertDay(day);
    if (photos.length !== PHOTOS_PER_STRIP) {
      throw new ConvexError(`A strip needs exactly ${PHOTOS_PER_STRIP} photos`);
    }
    for (const id of photos) {
      if ((await ctx.db.system.get("_storage", id)) === null) {
        throw new ConvexError("Photo not found");
      }
    }
    const trimmedCaption = caption?.trim();
    if (trimmedCaption && trimmedCaption.length > MAX_CAPTION_LENGTH) {
      throw new ConvexError(
        `Caption must be at most ${MAX_CAPTION_LENGTH} characters`,
      );
    }
    if ((await stripForDay(ctx, userId, day)) !== null) {
      throw new ConvexError("You already posted a strip today");
    }
    return await ctx.db.insert("strips", {
      author: userId,
      day,
      photos,
      caption: trimmedCaption || undefined,
      createdAt: Date.now(),
    });
  },
});

export const myStrips = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const userId = await requireUserId(ctx);
    const result = await ctx.db
      .query("strips")
      .withIndex("by_author_and_day", (q) => q.eq("author", userId))
      .order("desc")
      .paginate(paginationOpts);
    return {
      ...result,
      page: await Promise.all(result.page.map((strip) => withDetails(ctx, strip))),
    };
  },
});

export const friendsStripsToday = query({
  args: { day: dayValidator },
  handler: async (ctx, { day }) => {
    const userId = await requireUserId(ctx);
    assertDay(day);
    if ((await stripForDay(ctx, userId, day)) === null) {
      return { locked: true as const, strips: [] };
    }
    const friends = await friendIds(ctx, userId);
    const strips = (
      await Promise.all(friends.map((id) => stripForDay(ctx, id, day)))
    ).filter((strip) => strip !== null);
    strips.sort((a, b) => b.createdAt - a.createdAt);
    return {
      locked: false as const,
      strips: await Promise.all(strips.map((strip) => withDetails(ctx, strip))),
    };
  },
});
