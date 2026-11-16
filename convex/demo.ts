import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { internalAction, internalMutation, internalQuery } from "./_generated/server";
import { openaiImage } from "./ai";
import { friendIds } from "./friends";
import { previousDay } from "./kids";
import { levelForXp, xpForMinutes } from "./levels";
import type { Category, Kind, Mode, Skill } from "./schema";

const DEFAULT_DAYS = 6;
const MAX_DAYS = 30;
const PACIFIC_UTC_OFFSET_HOURS = -8;
const MAX_CHEERING_MEMBERS = 3;
const CHEERS = ["🎉", "❤️", "👏", "🌟", "😂"];

type DemoActivity = {
  title: string;
  kind: Kind;
  category: Category;
  mode: Mode;
  skill: Skill;
  minutes: number;
  steps: string[];
  question: string;
  quote: string;
  reaction: string;
  scene: string;
  evening: { hour: number; minute: number };
};

const ACTIVITIES: DemoActivity[] = [
  {
    title: "Pillow Fort Dino Hideout",
    kind: "adventure",
    category: "build",
    mode: "real",
    skill: "brave",
    minutes: 15,
    steps: [
      "Grab every couch cushion, pillow and blanket you can find.",
      "Build a fort big enough for two people and one dinosaur.",
      "Turn off the big light and crawl inside with a flashlight.",
      "Take turns telling what you would do if a T-rex knocked on the fort.",
    ],
    question: "What is the bravest thing you did in the fort tonight?",
    quote: "The T-rex can't get us in here because T-rexes have tiny arms and can't open blankets.",
    reaction: "Your fort is SO strong. Mine was one pillow, and I was under it.",
    scene:
      "building a pillow fort out of couch cushions and blankets in the living room, the girl crawling inside with a flashlight and a toy dinosaur",
    evening: { hour: 18, minute: 42 },
  },
  {
    title: "Cardboard Box Race Car",
    kind: "adventure",
    category: "build",
    mode: "real",
    skill: "curious",
    minutes: 15,
    steps: [
      "Find the biggest cardboard box in the house.",
      "Draw wheels, headlights and a racing number on the sides.",
      "Give the car a dinosaur name and a dinosaur driver.",
      "Push it around the living room for one lap, then swap drivers.",
    ],
    question: "How could we make the car go even faster next time?",
    quote: "Vroom! My car is a Velociraptor car so it's the fastest one in the whole world.",
    reaction: "That car is faster than me! I only have legs. Very long, wobbly legs.",
    scene:
      "decorating a big cardboard box as a race car with markers and paper-plate wheels, the girl sitting inside it on the living room floor",
    evening: { hour: 18, minute: 15 },
  },
  {
    title: "Dino Snack Shop",
    kind: "skill",
    category: "kitchen",
    mode: "real",
    skill: "money",
    minutes: 10,
    steps: [
      "Put a few snacks in small bowls and give each one a price from 1 to 5 coins.",
      "Make pretend coins out of paper or use buttons.",
      "Your kid runs the shop while you and a toy dinosaur come to buy snacks.",
      "Count the coins together at the end and see how much the shop made.",
    ],
    question: "If you had ten coins, what would you buy at your shop?",
    quote: "That's three coins for a Dino Cracker. No wait, it's on sale, so it's two.",
    reaction: "I'd buy everything! I only have one coin though. It's a button.",
    scene:
      "playing dinosaur snack shop at the kitchen table with small bowls of crackers and fruit, handmade paper coins and toy dinosaurs lined up as customers",
    evening: { hour: 17, minute: 58 },
  },
  {
    title: "Backyard Dino Obstacle Course",
    kind: "adventure",
    category: "outside",
    mode: "real",
    skill: "brave",
    minutes: 10,
    steps: [
      "Set up four stations: a hoop to jump through, a rope to balance on, a cushion to leap over and a tree to tag.",
      "Pick a dinosaur to be for the whole course.",
      "Run it once slowly, then once as fast as you can while roaring.",
      "Let your kid design one new station for you to try.",
    ],
    question: "Which station was the hardest, and how did you do it anyway?",
    quote: "I was a Stegosaurus but my spikes got stuck in the hula hoop.",
    reaction: "You made it through! I'm still stuck in the hula hoop from last time.",
    scene:
      "a backyard obstacle course on the grass with a hula hoop, cushions and a jump rope, the girl jumping through the hoop while the parent cheers next to her",
    evening: { hour: 17, minute: 31 },
  },
  {
    title: "Paper Plate Dino Masks",
    kind: "draw",
    category: "art",
    mode: "real",
    skill: "kind",
    minutes: 10,
    steps: [
      "Take two paper plates, one for each of you.",
      "Each person makes a dinosaur mask for the other person.",
      "Cut eye holes, add spikes or horns, and color it in.",
      "Give each other your masks and do your best dinosaur roar.",
    ],
    question: "Why did you pick that dinosaur for me?",
    quote: "I made you a Triceratops so we can match. Now you have to roar too.",
    reaction: "Those masks are terrifying! In a good way. Mine looked like a sad pancake.",
    scene:
      "making paper plate dinosaur masks at the kitchen table with crayons, scissors and glue, a finished green triceratops mask lying on the table",
    evening: { hour: 18, minute: 27 },
  },
  {
    title: "Bedtime Story with Rexy",
    kind: "story",
    category: "bedtime",
    mode: "real",
    skill: "reader",
    minutes: 10,
    steps: [
      "Get cozy in bed with a favorite stuffed dinosaur.",
      "Read a picture book together, and let the dinosaur turn the pages.",
      "Your kid reads one word per page to the dinosaur.",
      "Whisper goodnight to the dinosaur and turn off the light.",
    ],
    question: "What do you think your dinosaur dreams about?",
    quote: "Rexy is scared of the dark so I have to hold him the whole night.",
    reaction: "Shh... Rexy looks so cozy. I fell asleep in the middle of my own story.",
    scene:
      "a bedtime story in a dim kid's bedroom, the parent reading a picture book on the edge of the bed, the girl tucked in hugging a stuffed green dinosaur, a small bedside lamp on",
    evening: { hour: 19, minute: 48 },
  },
  {
    title: "Sponge Stamp Dino Tracks",
    kind: "draw",
    category: "art",
    mode: "real",
    skill: "curious",
    minutes: 10,
    steps: [
      "Cut a kitchen sponge into a dinosaur footprint shape.",
      "Put a little paint on a plate and dip the sponge in.",
      "Stamp a trail of footprints across a big sheet of paper.",
      "Guess together which dinosaur made the tracks and where it was going.",
    ],
    question: "Where do you think the dinosaur was walking to?",
    quote: "Look, a dinosaur walked all over the paper and it was a green one.",
    reaction: "Dino footprints everywhere! My sponge just got stuck to my foot.",
    scene:
      "sponge stamp painting on a big sheet of paper on the kitchen table, sponges and paint plates, little green dinosaur footprints stamped across the paper",
    evening: { hour: 18, minute: 6 },
  },
];

const DEMO_TITLES = new Set(ACTIVITIES.map((activity) => activity.title));

function activityFor(offset: number): DemoActivity {
  return ACTIVITIES[(ACTIVITIES.length - (offset % ACTIVITIES.length)) % ACTIVITIES.length];
}

function eveningOf(day: string, { hour, minute }: DemoActivity["evening"]): number {
  return (
    Date.parse(`${day}T00:00:00Z`) +
    (hour - PACIFIC_UTC_OFFSET_HOURS) * 3_600_000 +
    minute * 60_000
  );
}

function photoPrompt(activity: DemoActivity): string {
  return [
    `A candid, natural smartphone photo of a parent and a young girl, about 7 years old, ${activity.scene}, at home.`,
    "Warm evening light. Slightly imperfect like a real phone picture: a little grain, casual off-center framing, everyday clutter in the background.",
    "Shot from the side or from behind so their faces are not the focus.",
    "No text, no logos.",
  ].join(" ");
}

type PlannedDay = { day: string; offset: number };

export const plan = internalQuery({
  args: { kid: v.id("kids"), days: v.number() },
  handler: async (ctx, { kid: kidId, days }) => {
    const kid = await ctx.db.get("kids", kidId);
    if (kid === null) {
      throw new ConvexError("Kid not found");
    }
    let anchor: string | null = null;
    for await (const legend of ctx.db
      .query("legends")
      .withIndex("by_kid_and_day", (q) => q.eq("kid", kidId))) {
      if (!DEMO_TITLES.has(legend.title)) {
        anchor = legend.day;
        break;
      }
    }
    if (anchor === null) {
      throw new ConvexError("This kid has no legends yet. Open today's legend in the app first");
    }
    const missing: PlannedDay[] = [];
    const skipped: string[] = [];
    let day = anchor;
    for (let offset = 1; offset <= days; offset++) {
      day = previousDay(day);
      const existing = await ctx.db
        .query("legends")
        .withIndex("by_kid_and_day", (q) => q.eq("kid", kidId).eq("day", day))
        .first();
      if (existing === null) {
        missing.push({ day, offset });
      } else {
        skipped.push(day);
      }
    }
    return { missing, skipped };
  },
});

export const insertDays = internalMutation({
  args: {
    kid: v.id("kids"),
    entries: v.array(
      v.object({ day: v.string(), offset: v.number(), photo: v.optional(v.id("_storage")) }),
    ),
  },
  handler: async (ctx, { kid: kidId, entries }) => {
    const kid = await ctx.db.get("kids", kidId);
    if (kid === null) {
      throw new ConvexError("Kid not found");
    }
    const members = (await friendIds(ctx, kid.parent)).slice(0, MAX_CHEERING_MEMBERS);
    const seeded: string[] = [];
    const skipped: string[] = [];
    for (const { day, offset, photo } of [...entries].sort((a, b) => a.day.localeCompare(b.day))) {
      const existing = await ctx.db
        .query("legends")
        .withIndex("by_kid_and_day", (q) => q.eq("kid", kidId).eq("day", day))
        .first();
      if (existing !== null) {
        if (photo) {
          await ctx.storage.delete(photo);
        }
        skipped.push(day);
        continue;
      }

      const activity = activityFor(offset);
      const xp = xpForMinutes(activity.minutes);
      const row = await ctx.db
        .query("skills")
        .withIndex("by_kid_and_skill", (q) => q.eq("kid", kidId).eq("skill", activity.skill))
        .unique();
      const before = levelForXp(row?.xp ?? 0).level;
      const total = (row?.xp ?? 0) + xp;
      if (row === null) {
        await ctx.db.insert("skills", { kid: kidId, skill: activity.skill, xp: total });
      } else {
        await ctx.db.patch("skills", row._id, { xp: total });
      }
      const level = levelForXp(total).level;

      const completedAt = eveningOf(day, activity.evening);
      const legendId = await ctx.db.insert("legends", {
        kid: kidId,
        day,
        mode: activity.mode,
        category: activity.category,
        minutes: activity.minutes,
        kind: activity.kind,
        title: activity.title,
        steps: activity.steps,
        question: activity.question,
        skill: activity.skill,
        xp,
        status: "done",
        photo,
        quote: activity.quote,
        reaction: activity.reaction,
        levelUp: level > before ? level : undefined,
        completedAt,
        createdAt: completedAt - (activity.minutes + 4) * 60_000,
      });

      for (const [index, member] of members.entries()) {
        if ((offset + index) % 3 === 2) {
          continue;
        }
        await ctx.db.insert("cheers", {
          legend: legendId,
          user: member,
          emoji: CHEERS[(offset + index) % CHEERS.length],
          createdAt: completedAt + (12 + 25 * index) * 60_000,
        });
      }
      await ctx.scheduler.runAfter(0, internal.memory.remember, { legend: legendId });
      seeded.push(day);
    }
    return { seeded, skipped };
  },
});

export const seedWeek = internalAction({
  args: { kid: v.id("kids"), days: v.optional(v.number()) },
  handler: async (
    ctx,
    args,
  ): Promise<{ seeded: string[]; skipped: string[]; withoutPhoto: string[] }> => {
    const days = args.days ?? DEFAULT_DAYS;
    if (!Number.isInteger(days) || days < 1 || days > MAX_DAYS) {
      throw new ConvexError(`days must be a whole number from 1 to ${MAX_DAYS}`);
    }
    const { missing, skipped }: { missing: PlannedDay[]; skipped: string[] } = await ctx.runQuery(
      internal.demo.plan,
      { kid: args.kid, days },
    );
    const entries = await Promise.all(
      missing.map(async ({ day, offset }) => {
        let photo: Id<"_storage"> | undefined;
        try {
          const image = await openaiImage(photoPrompt(activityFor(offset)));
          photo = image ? await ctx.storage.store(image) : undefined;
        } catch (error) {
          console.warn(`Demo photo for ${day} failed: ${String(error)}`);
        }
        return { day, offset, photo };
      }),
    );
    const result: { seeded: string[]; skipped: string[] } = await ctx.runMutation(
      internal.demo.insertDays,
      { kid: args.kid, entries },
    );
    return {
      seeded: result.seeded,
      skipped: [...skipped, ...result.skipped].sort(),
      withoutPhoto: entries.filter((entry) => !entry.photo).map((entry) => entry.day),
    };
  },
});
