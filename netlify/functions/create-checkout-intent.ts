import { Handler } from "@netlify/functions";
import * as dotenv from "dotenv";
import { Plans } from "../../src/utils/Plans";
import Stripe from "stripe";
dotenv.config();
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
    const { userId, email, planId } = JSON.parse(event.body || "");

    if (!userId || !email || !planId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    if (Plans.Pro.priceId !== planId && Plans.Deluxe.priceId !== planId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid plan ID" }),
      };
    }

    // Step 1: Check if a customer exists, else create one
    let customer;
    const existingCustomers = await stripe.customers.list({ email });
    // console.log("existingCustomers", existingCustomers);
    if (existingCustomers.data.length) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email,
        metadata: { userId },
      });
    }
    // console.log(customer.invoice_settings);
    // Step 2: Create a subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: planId }], // Use the price_id here
      metadata: { userId },
      payment_behavior: "default_incomplete",
      currency: "gbp",
      expand: ["latest_invoice.payment_intent"], // Expand for client secret
    });

    // console.log("Subscription created:", subscription);

    // const paymentIntent = subscription.latest_invoice
    //   ?.payment_intent as Stripe.PaymentIntent;

    return {
      statusCode: 200,
      body: JSON.stringify({
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice?.payment_intent.client_secret,
      }),
    };

    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: 3000,
    //   currency: "usd",
    //   automatic_payment_methods: {
    //     enabled: true,
    //   },
    //   description: "Pro Monthly Subscription",
    //   metadata: {
    //     userId,
    //     email,
    //     subscriptionType: "pro-monthly",
    //   },
    // });

    // return {
    //   statusCode: 200,
    //   body: JSON.stringify({
    //     clientSecret: paymentIntent.client_secret,
    //     paymentIntentId: paymentIntent.id,
    //   }),
    // };
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

/*     let hasMore = true;
    while (hasMore) {
      const customers = await stripe.customers.list({ limit: 100 });
      for (const customer of customers.data) {
        await stripe.customers.del(customer.id);
        console.log(`Deleted customer: ${customer.id}`);
      }
      hasMore = customers.has_more;
    } */
