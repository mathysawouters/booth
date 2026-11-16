import { unwrapWebhook } from "@whop/sdk/helpers";
import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/whop",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const key = process.env.WHOP_WEBHOOK_SECRET;
    if (!key) {
      return new Response("Webhook secret not configured", { status: 503 });
    }
    const headers: Record<string, string> = {};
    request.headers.forEach((value, name) => {
      headers[name] = value;
    });
    let event: { type: string; data: { metadata?: Record<string, unknown> | null } };
    try {
      event = unwrapWebhook(await request.text(), { headers, key });
    } catch {
      return new Response("Invalid signature", { status: 401 });
    }
    const userId = event.data.metadata?.userId;
    if (event.type === "payment.succeeded" && typeof userId === "string") {
      await ctx.runMutation(internal.whop.markPlus, { userId });
    }
    return new Response("OK", { status: 200 });
  }),
});

export default http;
