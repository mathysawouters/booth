import { WhopClient, WhopEnvironment } from "@whop/sdk";
import { ConvexError, v } from "convex/values";
import { api } from "./_generated/api";
import { action, internalMutation } from "./_generated/server";

export const createPlusCheckout = action({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const me: { _id: string; plus: boolean } | null = await ctx.runQuery(api.users.me);
    if (me === null) {
      throw new ConvexError("Not signed in");
    }
    if (me.plus) {
      throw new ConvexError("You already have Little Legends Plus!");
    }
    const token = process.env.WHOP_API_KEY;
    const companyId = process.env.WHOP_COMPANY_ID;
    if (!token || !companyId) {
      throw new ConvexError("Little Legends Plus isn't open yet. Try again in a bit!");
    }
    const client = new WhopClient({
      token,
      environment:
        process.env.WHOP_ENVIRONMENT === "production" ? WhopEnvironment.Production : WhopEnvironment.Sandbox,
    });
    const checkout = await client.checkoutConfigurations.create({
      account_id: companyId,
      metadata: { userId: me._id },
      variant: {
        account_id: companyId,
        title: "Little Legends Plus",
        description: "Unlimited legends and stories, the pictures, family sharing and a printed book of the year.",
        billing_type: "renewal",
        initial_price: 49,
        renewal_price: 49,
        billing_period: 365,
        currency: "usd",
      },
    });
    if (!checkout.purchase_url) {
      throw new ConvexError("Couldn't open the checkout. Try again.");
    }
    return checkout.purchase_url;
  },
});

export const markPlus = internalMutation({
  args: { userId: v.string() },
  returns: v.null(),
  handler: async (ctx, { userId }) => {
    const id = ctx.db.normalizeId("users", userId);
    if (id === null || (await ctx.db.get("users", id)) === null) {
      console.warn(`Whop payment for unknown user ${userId}`);
      return null;
    }
    await ctx.db.patch("users", id, { plus: true });
    return null;
  },
});
