import { Handler } from "@netlify/functions";
import * as dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
// console.log("All Env:", process.env);
// console.log(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-11-20.acacia",
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { userId, email } = JSON.parse(event.body || "");

    if (!userId || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "User ID and email are required" }),
      };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 3000,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId,
        email,
        subscriptionType: "pro-monthly",
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
    };
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
    };
  }
};
