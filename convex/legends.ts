import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
  type QueryCtx,
} from "./_generated/server";
import { openaiImage, openaiJson, openaiText } from "./ai";
import { assertDay, previousDay, requireFamilyOf, requireParentOf } from "./kids";
import { levelForXp, xpForMinutes } from "./levels";
import {
  chooseKindAndSkill,
  FIRST_CHALLENGE,
  LEGGY_REACTIONS,
  pickFromLibrary,
  rollChallenge,
  type LegendDraft,
  type RecentLegend,
} from "./library";
import { searchMemories } from "./memory";
import {
  categoryValidator,
  kindValidator,
  modeValidator,
  skillValidator,
  type Category,
  type Kind,
  type Mode,
  type Skill,
} from "./schema";

const LEGENDS_PER_DAY = 50;
const RECENT_LEGENDS = 14;
const MEMORY_BOOK_SIZE = 100;
const MAX_QUOTE_LENGTH = 500;
const MAX_REASON_LENGTH = 300;

const LEGGY =
  "Leggy, the Little Legends mascot: a small, round, friendly green creature with very long wobbly legs, big curious eyes and a tiny smile";

export async function withUrls(ctx: QueryCtx, legend: Doc<"legends">) {
  const url = (id: Id<"_storage"> | undefined) => (id ? ctx.storage.getUrl(id) : null);
  const [photoUrl, challengeImageUrl, voiceUrl] = await Promise.all([
    url(legend.photo),
    url(legend.challengeImage),
    url(legend.voice),
  ]);
  return { ...legend, photoUrl, challengeImageUrl, voiceUrl };
}

export type LegendWithUrls = Awaited<ReturnType<typeof withUrls>>;

async function legendsOnDay(ctx: QueryCtx, kid: Id<"kids">, day: string) {
  return await ctx.db
    .query("legends")
    .withIndex("by_kid_and_day", (q) => q.eq("kid", kid).eq("day", day))
    .order("desc")
    .take(LEGENDS_PER_DAY);
}

async function requireOwnLegend(ctx: QueryCtx, legendId: Id<"legends">) {
  const legend = await ctx.db.get("legends", legendId);
  if (legend === null) {
    throw new ConvexError("Legend not found");
  }
  const kid = await requireParentOf(ctx, legend.kid);
  return { legend, kid };
}

async function requireOpenLegend(ctx: QueryCtx, legendId: Id<"legends">) {
  const { legend } = await requireOwnLegend(ctx, legendId);
  if (legend.status !== "open") {
    throw new ConvexError("This legend is already finished");
  }
  return legend;
}

async function loadPlan(
  ctx: QueryCtx,
  args: { kid: Id<"kids">; day: string; mode: Mode; category: Category },
) {
  const kid = await requireParentOf(ctx, args.kid);
  const today = await legendsOnDay(ctx, args.kid, args.day);
  const existing = today.find(
    (legend) =>
      legend.status === "open" && legend.mode === args.mode && legend.category === args.category,
  );
  const recent = await ctx.db
    .query("legends")
    .withIndex("by_kid_and_day", (q) => q.eq("kid", args.kid).lte("day", args.day))
    .order("desc")
    .take(RECENT_LEGENDS);
  return {
    kid,
    existing: existing ? await withUrls(ctx, existing) : null,
    rerollUsed: today.some((legend) => legend.rerolled === true),
    recent: recent.map(
      (legend): RecentLegend => ({
        day: legend.day,
        kind: legend.kind,
        skill: legend.skill,
        title: legend.title,
        challenge: legend.challenge !== undefined,
      }),
    ),
  };
}

type Plan = Awaited<ReturnType<typeof loadPlan>>;

export const planContext = internalQuery({
  args: { kid: v.id("kids"), day: v.string(), mode: modeValidator, category: categoryValidator },
  handler: loadPlan,
});

export const getWithUrls = internalQuery({
  args: { legend: v.id("legends") },
  handler: async (ctx, { legend: legendId }) => {
    const legend = await ctx.db.get("legends", legendId);
    return legend ? await withUrls(ctx, legend) : null;
  },
});

export const pictureContext = internalQuery({
  args: { legend: v.id("legends") },
  handler: async (ctx, { legend: legendId }) => {
    const legend = await ctx.db.get("legends", legendId);
    const kid = legend && (await ctx.db.get("kids", legend.kid));
    return legend && kid ? { legend, age: kid.age } : null;
  },
});

export const memoryContext = internalQuery({
  args: { legend: v.id("legends") },
  handler: async (ctx, { legend: legendId }) => {
    const legend = await ctx.db.get("legends", legendId);
    if (legend === null) {
      return null;
    }
    const kid = await ctx.db.get("kids", legend.kid);
    return kid ? { legend, kid } : null;
  },
});

export const reactionContext = internalQuery({
  args: { legend: v.id("legends") },
  handler: async (ctx, { legend: legendId }) => {
    const { legend, kid } = await requireOwnLegend(ctx, legendId);
    return { legend: await withUrls(ctx, legend), kid };
  },
});

export const insertLegend = internalMutation({
  args: {
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
    challenge: v.optional(v.string()),
    rerolled: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (!args.rerolled) {
      const existing = (await legendsOnDay(ctx, args.kid, args.day)).find(
        (legend) =>
          legend.status === "open" && legend.mode === args.mode && legend.category === args.category,
      );
      if (existing) {
        return existing._id;
      }
    }
    const legendId = await ctx.db.insert("legends", {
      ...args,
      rerolled: args.rerolled || undefined,
      xp: xpForMinutes(args.minutes),
      status: "open",
      createdAt: Date.now(),
    });
    await ctx.scheduler.runAfter(0, internal.legends.drawTonightPicture, { legend: legendId });
    return legendId;
  },
});

export const attachChallengeImage = internalMutation({
  args: { legend: v.id("legends"), image: v.id("_storage") },
  handler: async (ctx, { legend: legendId, image }) => {
    const legend = await ctx.db.get("legends", legendId);
    if (legend === null || legend.challengeImage !== undefined) {
      await ctx.storage.delete(image);
      return null;
    }
    await ctx.db.patch("legends", legendId, { challengeImage: image });
    return null;
  },
});

export const saveReaction = internalMutation({
  args: { legend: v.id("legends"), reaction: v.string() },
  handler: async (ctx, { legend, reaction }) => {
    await ctx.db.patch("legends", legend, { reaction });
    return null;
  },
});

const LEGEND_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "steps", "story", "question", "challenge"],
  properties: {
    title: { type: "string", description: "Short, fun title, at most 6 words" },
    steps: {
      type: "array",
      items: { type: "string" },
      description: "3 to 6 short steps the parent reads out, one sentence each",
    },
    story: {
      type: "array",
      items: { type: "string" },
      description: "4 to 6 story pages for kind story, otherwise an empty array",
    },
    question: { type: "string", description: "One question the parent asks the kid at the end" },
    challenge: {
      type: "string",
      description: "Leggy's one-line challenge when asked for, otherwise an empty string",
    },
  },
};

const MODE_TEXT: Record<Mode, string> = {
  phone:
    "Mode phone: parent and kid do it together on the parent's phone, side by side. Story kind is read together on screen; draw kind is a draw-together prompt on paper while looking at the phone; quiz kind is a spoken voice quiz the parent reads out; sound kind is guess-the-sound with sounds they make or record.",
  real: "Mode real: off the phone. The parent reads the steps once, then puts the phone away and they do it in the real world.",
};

const KIND_TEXT: Record<Kind, string> = {
  story:
    "Kind story: write an original story of about 400 words over 4 to 6 pages starring the kid by name. Steps explain how to read it together.",
  adventure: "Kind adventure: a small playful mission or game with movement.",
  skill: "Kind skill: practice a real-life skill in a playful way.",
  draw: "Kind draw: draw or make something together.",
  quiz: "Kind quiz: a short spoken quiz or guessing game with 3 to 5 questions in the steps.",
  sound: "Kind sound: listening, making or guessing sounds.",
};

async function generateDraft(args: {
  kid: Doc<"kids">;
  mode: Mode;
  category: Category;
  minutes: number;
  kind: Kind;
  skill: Skill;
  wantChallenge: boolean;
  memories: string[];
  recent: RecentLegend[];
}): Promise<LegendDraft | null> {
  const { kid, mode, category, minutes, kind, skill, wantChallenge, memories, recent } = args;
  const instructions = [
    "You write one daily activity for Little Legends, an app where a parent spends about 10 fun minutes a day with their kid.",
    "The activity must be fun, safe, free, need only things found at home, and happen at home or nearby. Fit the kid's age, interests and the parent's note. Use simple, warm language the parent can read out loud.",
    `It must fit in ${minutes} minutes.`,
    MODE_TEXT[mode],
    KIND_TEXT[kind],
    category === "bedtime"
      ? "Category bedtime: calm, short, low energy, and it must end with the kid falling asleep."
      : category === "surprise"
        ? "Category surprise: pick any delightful theme."
        : `Category: ${category}.`,
    `The activity grows the skill "${skill}" (brave, kind, curious, money, helper or reader).`,
    wantChallenge
      ? `Also write challenge: one funny line from ${LEGGY}, who tried this activity first and did it badly, ending with a dare like "Can you do better?". Example: "I built a fort. It fell on me. Can you do better?"`
      : "Set challenge to an empty string.",
    kind === "story" ? "" : "Set story to an empty array.",
  ].join("\n");
  const input = [
    `Kid: ${kid.name}, age ${kid.age}.`,
    `Interests: ${kid.interests.join(", ") || "none given"}.`,
    kid.note ? `Parent's note: ${kid.note}` : "",
    memories.length > 0
      ? `What we remember about ${kid.name} (loved, said, skipped):\n- ${memories.join("\n- ")}`
      : "",
    recent.length > 0 ? `Recent activities to avoid repeating: ${recent.map((l) => l.title).join("; ")}.` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const data = (await openaiJson(instructions, input, "legend", LEGEND_SCHEMA)) as {
    title?: unknown;
    steps?: unknown;
    story?: unknown;
    question?: unknown;
    challenge?: unknown;
  } | null;
  if (data === null) {
    return null;
  }
  const strings = (value: unknown) =>
    Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      : [];
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const question = typeof data.question === "string" ? data.question.trim() : "";
  const steps = strings(data.steps).slice(0, 8);
  const story = strings(data.story).slice(0, 6);
  const challenge = typeof data.challenge === "string" ? data.challenge.trim() : "";
  if (!title || !question || steps.length < 2 || (kind === "story" && story.length < 4)) {
    return null;
  }
  return {
    kind,
    skill,
    title: title.slice(0, 80),
    steps,
    story: kind === "story" ? story : undefined,
    question,
    challenge: wantChallenge && challenge ? challenge.slice(0, 200) : undefined,
  };
}

export const drawTonightPicture = internalAction({
  args: { legend: v.id("legends") },
  handler: async (ctx, { legend: legendId }) => {
    const context: { legend: Doc<"legends">; age: number } | null = await ctx.runQuery(
      internal.legends.pictureContext,
      { legend: legendId },
    );
    if (context === null || context.legend.challengeImage !== undefined) {
      return null;
    }
    const { legend, age } = context;
    try {
      const image = await openaiImage(
        [
          `A candid, natural smartphone photo of a parent and a young kid, about ${age} years old, happily doing tonight's activity together at home or nearby: "${legend.title}". ${legend.steps.slice(0, 3).join(" ")}`,
          "Warm evening light. Slightly imperfect like a real phone picture: a little grain, casual off-center framing, everyday clutter in the background.",
          "Shot from the side or from behind so their faces are not the focus.",
          "No text, no logos.",
        ].join(" "),
        "medium",
      );
      if (image === null) {
        return null;
      }
      const stored = await ctx.storage.store(image);
      await ctx.runMutation(internal.legends.attachChallengeImage, {
        legend: legendId,
        image: stored,
      });
    } catch (error) {
      console.warn(`Tonight's picture failed: ${String(error)}`);
    }
    return null;
  },
});

export const todaysLegend = action({
  args: {
    kid: v.id("kids"),
    day: v.string(),
    mode: modeValidator,
    category: categoryValidator,
    minutes: v.number(),
    reroll: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<LegendWithUrls> => {
    assertDay(args.day);
    const minutes = Math.min(15, Math.max(5, Math.round(args.minutes)));
    const plan: Plan = await ctx.runQuery(internal.legends.planContext, {
      kid: args.kid,
      day: args.day,
      mode: args.mode,
      category: args.category,
    });
    if (plan.existing && !args.reroll) {
      return plan.existing;
    }
    const rerolled = plan.existing !== null;
    if (rerolled && plan.rerollUsed) {
      throw new ConvexError("You can only reroll once a day");
    }

    const { kid, recent } = plan;
    const yesterday = previousDay(args.day);
    const first = recent.length === 0;
    const wantChallenge =
      first ||
      rollChallenge(
        args.category,
        recent.some((legend) => legend.day === yesterday && legend.challenge),
      );
    const { kind, skill } = chooseKindAndSkill(args.mode, args.category, recent);
    const memories = await searchMemories(
      kid._id,
      `What ${kid.name} loved, said and skipped in past activities`,
    );
    const draft =
      (await generateDraft({
        kid,
        mode: args.mode,
        category: args.category,
        minutes,
        kind,
        skill,
        wantChallenge,
        memories,
        recent,
      })) ??
      pickFromLibrary({
        mode: args.mode,
        category: args.category,
        name: kid.name,
        recent,
        allowChallenge: wantChallenge,
      });
    if (first && !draft.challenge) {
      draft.challenge = FIRST_CHALLENGE;
    }
    const legendId: Id<"legends"> = await ctx.runMutation(internal.legends.insertLegend, {
      kid: kid._id,
      day: args.day,
      mode: args.mode,
      category: args.category,
      minutes,
      ...draft,
      rerolled,
    });
    const legend: LegendWithUrls | null = await ctx.runQuery(internal.legends.getWithUrls, {
      legend: legendId,
    });
    if (legend === null) {
      throw new ConvexError("Legend not found");
    }
    return legend;
  },
});

export const legendToday = query({
  args: { kid: v.id("kids"), day: v.string() },
  handler: async (ctx, { kid, day }) => {
    await requireFamilyOf(ctx, kid);
    assertDay(day);
    const legend = await ctx.db
      .query("legends")
      .withIndex("by_kid_and_day", (q) => q.eq("kid", kid).eq("day", day))
      .order("desc")
      .first();
    return legend ? await withUrls(ctx, legend) : null;
  },
});

export const completeLegend = mutation({
  args: {
    legend: v.id("legends"),
    photo: v.optional(v.id("_storage")),
    quote: v.optional(v.string()),
    voice: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const legend = await requireOpenLegend(ctx, args.legend);
    for (const id of [args.photo, args.voice]) {
      if (id && (await ctx.db.system.get("_storage", id)) === null) {
        throw new ConvexError("Upload not found");
      }
    }
    const quote = args.quote?.trim();
    if (quote && quote.length > MAX_QUOTE_LENGTH) {
      throw new ConvexError(`quote must be at most ${MAX_QUOTE_LENGTH} characters`);
    }

    const row = await ctx.db
      .query("skills")
      .withIndex("by_kid_and_skill", (q) => q.eq("kid", legend.kid).eq("skill", legend.skill))
      .unique();
    const before = levelForXp(row?.xp ?? 0).level;
    const total = (row?.xp ?? 0) + legend.xp;
    if (row === null) {
      await ctx.db.insert("skills", { kid: legend.kid, skill: legend.skill, xp: total });
    } else {
      await ctx.db.patch("skills", row._id, { xp: total });
    }
    const level = levelForXp(total).level;
    const leveledUp = level > before;

    await ctx.db.patch("legends", legend._id, {
      status: "done",
      photo: args.photo,
      voice: args.voice,
      quote: quote || undefined,
      levelUp: leveledUp ? level : undefined,
      completedAt: Date.now(),
    });
    await ctx.scheduler.runAfter(0, internal.memory.remember, { legend: legend._id });
    return { skill: legend.skill, xp: legend.xp, level, leveledUp };
  },
});

export const skipLegend = mutation({
  args: { legend: v.id("legends"), reason: v.optional(v.string()) },
  handler: async (ctx, { legend: legendId, reason }) => {
    const legend = await requireOpenLegend(ctx, legendId);
    await ctx.db.patch("legends", legend._id, { status: "skipped" });
    await ctx.scheduler.runAfter(0, internal.memory.remember, {
      legend: legend._id,
      reason: reason?.trim().slice(0, MAX_REASON_LENGTH) || undefined,
    });
    return null;
  },
});

export const reactToProof = action({
  args: { legend: v.id("legends") },
  handler: async (ctx, { legend: legendId }): Promise<string> => {
    const { legend, kid }: { legend: LegendWithUrls; kid: Doc<"kids"> } = await ctx.runQuery(
      internal.legends.reactionContext,
      { legend: legendId },
    );
    const reaction =
      (await openaiText(
        `You are ${LEGGY}. You tried this activity first and did it badly. Now a kid shows you their result. React in one or two short sentences (under 30 words): always impressed, funny, warm, self-deprecating about your own attempt, safe for young kids. Mention something specific you see. No emoji, no quotes around your answer.`,
        [
          {
            type: "input_text",
            text: [
              `Kid: ${kid.name}, age ${kid.age}.`,
              `Activity: ${legend.title}.`,
              legend.challenge ? `Your own failed attempt: ${legend.challenge}` : "",
              legend.quote ? `${kid.name} said: "${legend.quote}"` : "",
            ]
              .filter(Boolean)
              .join("\n"),
          },
          ...(legend.photoUrl ? [{ type: "input_image" as const, image_url: legend.photoUrl }] : []),
        ],
      )) ?? LEGGY_REACTIONS[Math.floor(Math.random() * LEGGY_REACTIONS.length)];
    await ctx.runMutation(internal.legends.saveReaction, { legend: legendId, reaction });
    return reaction;
  },
});

export const memoryBook = query({
  args: { kid: v.id("kids") },
  handler: async (ctx, { kid }) => {
    await requireFamilyOf(ctx, kid);
    const legends = await ctx.db
      .query("legends")
      .withIndex("by_kid_and_status_and_completedAt", (q) =>
        q.eq("kid", kid).eq("status", "done"),
      )
      .order("desc")
      .take(MEMORY_BOOK_SIZE);
    return await Promise.all(legends.map((legend) => withUrls(ctx, legend)));
  },
});
