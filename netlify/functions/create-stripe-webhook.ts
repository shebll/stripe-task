import { Handler } from "@netlify/functions";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const webhookEndpoint = await stripe.webhookEndpoints.create({
      url: "https://curious-cranachan-ab9992.netlify.app/.netlify/functions/webhook",
      enabled_events: [
        "payment_intent.succeeded",
        "charge.succeeded",
        "charge.updated",
        // Add other events you want to listen for
      ],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Webhook endpoint created successfully",
        webhookEndpoint,
      }),
    };
  } catch (error) {
    console.error("Error creating webhook endpoint:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to create webhook endpoint",
        details: error.message,
      }),
    };
  }
};
