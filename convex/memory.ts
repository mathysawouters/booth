import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { internalAction } from "./_generated/server";

const SUPERMEMORY_URL = "https://api.supermemory.ai";

async function callSupermemory(path: string, body: object): Promise<unknown> {
  const key = process.env.SUPERMEMORY_API_KEY;
  if (!key) {
    return null;
  }
  try {
    const response = await fetch(`${SUPERMEMORY_URL}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      console.warn(`Supermemory ${path} failed with status ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn(`Supermemory ${path} failed: ${String(error)}`);
    return null;
  }
}

function namespaceFor(kid: Id<"kids">) {
  return `kid_${kid}`;
}

export async function searchMemories(kid: Id<"kids">, query: string): Promise<string[]> {
  const data = await callSupermemory(`/ns/${namespaceFor(kid)}/search`, {
    query,
    searchMode: "hybrid",
    limit: 8,
  });
  const results = (data as { results?: { memory?: unknown; chunk?: unknown }[] } | null)?.results;
  if (!Array.isArray(results)) {
    return [];
  }
  return results
    .map((result) => result.memory ?? result.chunk)
    .filter((text): text is string => typeof text === "string" && text.length > 0);
}

export const remember = internalAction({
  args: { legend: v.id("legends"), reason: v.optional(v.string()) },
  handler: async (ctx, { legend: legendId, reason }) => {
    if (!process.env.SUPERMEMORY_API_KEY) {
      return null;
    }
    const data = await ctx.runQuery(internal.legends.memoryContext, { legend: legendId });
    if (data === null) {
      return null;
    }
    const { legend, kid } = data;
    const lines =
      legend.status === "done"
        ? [
            `On ${legend.day}, ${kid.name} (age ${kid.age}) finished the ${legend.category} activity "${legend.title}" (${legend.kind}, ${legend.mode === "phone" ? "on the phone" : "off the phone"}, ${legend.minutes} minutes, skill ${legend.skill}).`,
            legend.quote ? `${kid.name} said: "${legend.quote}"` : null,
          ]
        : [
            `On ${legend.day}, ${kid.name} (age ${kid.age}) skipped the ${legend.category} activity "${legend.title}" (${legend.kind}, skill ${legend.skill}).`,
            reason ? `Reason for skipping: ${reason}` : null,
          ];
    await callSupermemory(`/ns/${namespaceFor(kid._id)}/document`, {
      content: lines.filter((line) => line !== null).join("\n"),
      id: `legend_${legend._id}`,
      metadata: {
        type: "legend",
        status: legend.status,
        category: legend.category,
        kind: legend.kind,
        skill: legend.skill,
        day: legend.day,
      },
    });
    return null;
  },
});
