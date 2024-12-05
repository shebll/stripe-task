import { Handler } from "@netlify/functions";
import stripe from "stripe";
import * as admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});
console.log("web hook", process.env.STRIPE_SECRET_KEY!);

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("web hook serviceAccount", serviceAccount);
console.log(
  "web hook STRIPE_WEBHOOK_SECRET",
  process.env.STRIPE_WEBHOOK_SECRET!
);
const db = admin.firestore();

// Create Stripe webhook handler
export const handler: Handler = async (event) => {
  const sig = event.headers["stripe-signature"] as string;
  console.log("Headers:", event.headers);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const rawBody = event.body;

  console.log("stripe webhook secret", endpointSecret);

  try {
    const eventReceived = stripeClient.webhooks.constructEvent(
      rawBody!,
      sig,
      endpointSecret
    );

    console.log(eventReceived);

    switch (eventReceived.type) {
      case "payment_intent.created": {
        const paymentIntent = eventReceived.data.object;
        console.log("Payment Intent created:", paymentIntent.id);
        break;
      }

      case "charge.succeeded": {
        const session = eventReceived.data.object;
        const userId = session.metadata.userId;
        if (!userId) break;

        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
          await userRef.update({
            isPro: true,
            stripeCustomerId: session.customer || null,
            paymentIntentId: session.payment_intent,
          });
          console.log("User profile updated to Pro");
        } else {
          console.log("User not found in database");
        }
        break;
      }

      case "charge.updated": {
        const session = eventReceived.data.object;
        console.log("Checkout session completed:", session);
        break;
      }

      default:
        console.log(`Unhandled event type ${eventReceived.type}`);
    }

    return {
      statusCode: 200,
      body: "Webhook handled successfully",
    };
  } catch (err) {
    console.error("Webhook Error:", err);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err}`,
    };
  }
};
