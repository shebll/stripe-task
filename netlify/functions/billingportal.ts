import { Handler } from "@netlify/functions";
import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config();
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});
export const handler: Handler = async (event) => {
  const { customerId } = JSON.parse(event.body || "{}");

  try {
    const session = await stripeClient.billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.VITE_API_URL,
    });

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (error) {
    console.error("Error creating billing portal session:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to cancel subscription" }),
    };
  }
};
