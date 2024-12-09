import { Handler } from "@netlify/functions";
import stripe from "stripe";
import * as admin from "firebase-admin";
import dotenv from "dotenv";
import { Plans } from "../../src/utils/Plans";
dotenv.config();

const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Create Stripe webhook handler
export const handler: Handler = async (event) => {
  const sig = event.headers["stripe-signature"] as string;
  // console.log("Headers:", event.headers);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const rawBody = event.body;

  // console.log("stripe webhook secret", endpointSecret);

  try {
    const eventReceived = stripeClient.webhooks.constructEvent(
      rawBody!,
      sig,
      endpointSecret
    );

    // console.log(eventReceived);

    switch (eventReceived.type) {
      case "payment_intent.created": {
        const paymentIntent = eventReceived.data.object;
        console.log("Payment Intent created:", paymentIntent.id);
        break;
      }

      case "checkout.session.completed": {
        try {
          // Retrieve session details with customer and line_items expanded
          const session = await stripeClient.checkout.sessions.retrieve(
            eventReceived.data.object.id,
            {
              expand: ["line_items"],
            }
          );

          // Extract necessary details
          const customerId = session.customer; // This is the Stripe customer ID
          const planId = session.line_items?.data[0]?.price?.id; // Plan price ID
          const userEmail = session.customer_details?.email; // Customer email

          console.log("Customer ID:", customerId);
          console.log("User Email:", userEmail);
          console.log("Plan ID:", planId);

          // Validate required fields
          if (!userEmail || !planId || !customerId) {
            console.log("Missing required fields.");
            break;
          }

          // Get the plan name using the plan ID
          const plan = getPlanNameByPriceId(planId);
          if (!plan) {
            console.log("Invalid plan ID.");
            break;
          }
          console.log("Plan:", plan);

          // Find the user in the database by email
          const userRef = db
            .collection("users")
            .where("email", "==", userEmail);
          const userSnapshot = await userRef.get();

          if (!userSnapshot.empty) {
            // Get the first matching user document
            const userDoc = userSnapshot.docs[0]; // DocumentReference

            // Check if the user already has a Stripe customer ID
            const existingStripeCustomerId = userDoc.data()?.stripeCustomerId;

            if (existingStripeCustomerId) {
              console.log(
                "Customer already exists in the database, updating subscription."
              );

              // Update the subscription details
              await userDoc.ref.update({
                subscriptionPlan: planId,
                isPro: plan === "Pro",
                isDeluxe: plan === "Deluxe",
              });
            } else {
              console.log(
                "Customer not found in the database, creating new Stripe customer."
              );

              // Create a new Stripe customer and store in the database
              await userDoc.ref.update({
                stripeCustomerId: customerId,
                subscriptionPlan: planId,
                isPro: plan === "Pro",
                isDeluxe: plan === "Deluxe",
              });
            }

            console.log("User updated successfully.");
          } else {
            console.log("User not found in the database.");
          }
        } catch (error) {
          console.error("Error handling checkout.session.completed:", error);
        }
        break;
      }

      // case "payment_intent.succeeded": {
      //   const session = eventReceived.data.object;
      //   const customerId = session.customer;

      //   if (!customerId) break;
      //   const subscriptions = await stripeClient.subscriptions.list({
      //     customer: customerId.toString(),
      //   });
      //   console.log("subscriptions", subscriptions);
      //   if (subscriptions.data.length > 0) {
      //     const subscription = subscriptions.data[0];
      //     const userId = subscription.metadata.userId;
      //     const planId = subscription.items.data[0].plan.id;
      //     console.log("userId", userId);
      //     console.log("planId", planId);

      //     if (!userId || !planId) break;

      //     if (Plans.Pro.priceId !== planId && Plans.Deluxe.priceId !== planId) {
      //       return {
      //         statusCode: 400,
      //         body: JSON.stringify({ error: "Invalid plan ID" }),
      //       };
      //     }

      //     const plan = getPlanNameByPriceId(planId);
      //     console.log("plan", plan);

      //     const userRef = db.collection("users").doc(userId);
      //     const userDoc = await userRef.get();

      //     if (userDoc.exists) {
      //       const stripeCustomerId = session.customer;
      //       const existingCustomer = userDoc.data()?.stripeCustomerId;
      //       console.log("existingCustomer", existingCustomer);
      //       if (existingCustomer) {
      //         const subscriptions = await stripeClient.subscriptions.list({
      //           customer: existingCustomer,
      //         });
      //         console.log("subscriptions", subscriptions);
      //         if (subscriptions.data.length > 0) {
      //           const currentSubscription = subscriptions.data[0];
      //           console.log("currentSubscription", currentSubscription);
      //           await stripeClient.subscriptions.update(
      //             currentSubscription.id,
      //             {
      //               items: [
      //                 {
      //                   id: currentSubscription.items.data[0].id,
      //                   price: planId,
      //                 },
      //               ],
      //             }
      //           );
      //           await userRef.update({
      //             stripeCustomerId,
      //             subscriptionPlan: planId,
      //             isPro: plan === "Pro",
      //             isDeluxe: plan === "Deluxe",
      //           });
      //         } else {
      //           console.log("userRef.update");
      //           console.log(plan === "Pro");
      //           console.log(plan === "Deluxe");
      //           await userRef.update({
      //             stripeCustomerId,
      //             subscriptionPlan: planId,
      //             isPro: plan === "Pro",
      //             isDeluxe: plan === "Deluxe",
      //           });
      //         }
      //       } else {
      //         console.log("User not found in database");
      //         break;
      //       }
      //       break;
      //     }
      //   }
      //   break;
      // }

      // case "customer.subscription.created": {
      //   const session = eventReceived.data.object;
      //   const userId = session.metadata.userId;
      //   const planId = session.items.data[0].plan.id; // e.g., "Pro" or "Deluxe"

      //   console.log("userId", userId);
      //   console.log("planId", planId);

      //   if (!userId || !planId) break;

      //   if (Plans.Pro.priceId !== planId && Plans.Deluxe.priceId !== planId) {
      //     return {
      //       statusCode: 400,
      //       body: JSON.stringify({ error: "Invalid plan ID" }),
      //     };
      //   }

      //   const plan = getPlanNameByPriceId(planId);
      //   console.log("plan", plan);

      //   const userRef = db.collection("users").doc(userId);
      //   const userDoc = await userRef.get();
      //   if (userDoc.exists) {
      //     const stripeCustomerId = session.customer;
      //     const existingCustomer = userDoc.data()?.stripeCustomerId;
      //     console.log("existingCustomer", existingCustomer);

      //     if (!existingCustomer) {
      //       await userRef.update({
      //         stripeCustomerId,
      //         subscriptionPlan: planId,
      //       });
      //     }
      //   } else {
      //     console.log("User not found in database");
      //   }
      //   break;
      // }

      case "customer.subscription.updated": {
        const subscription = eventReceived.data.object;
        const stripeCustomerId = subscription.customer;

        const usersRef = db.collection("users");
        const userQuery = await usersRef
          .where("stripeCustomerId", "==", stripeCustomerId)
          .get();

        if (!userQuery.empty) {
          const userDoc = userQuery.docs[0];
          const plan =
            subscription.items.data[0].price.id === Plans.Pro.priceId
              ? "Pro"
              : "Deluxe";

          await userDoc.ref.update({
            subscriptionPlan: plan,
            isPro: plan === "Pro",
            isDeluxe: plan === "Deluxe",
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = eventReceived.data.object;
        const userId = subscription.metadata.userId;

        if (!userId) break;

        const userRef = db.collection("users").doc(userId);
        await userRef.update({
          isPro: false,
          isDeluxe: false,
          subscriptionId: null,
        });

        console.log("Subscription canceled; user downgraded to free");
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

function getPlanNameByPriceId(priceId: string): string | null {
  for (const planKey in Plans) {
    const plan = Plans[planKey as keyof typeof Plans];
    if (plan.priceId === priceId) {
      return plan.name;
    }
  }
  return null; // Return null if priceId is not found
}
