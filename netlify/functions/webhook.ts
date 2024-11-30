import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20',
});

const firebaseConfig = {
  apiKey: "AIzaSyABPX0xWonNWN4wUkkzpAtrhJHhBI3B1s8",
  authDomain: "patient-chat-814e6.firebaseapp.com",
  projectId: "patient-chat-814e6",
  storageBucket: "patient-chat-814e6.firebasestorage.app",
  messagingSenderId: "974352497199",
  appId: "1:974352497199:web:c32834deed4d80a63724da",
  measurementId: "G-0R5KYR6NEL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return { statusCode: 400, body: 'Missing signature or webhook secret' };
  }

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body || '',
      sig,
      webhookSecret
    );

    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;

      if (userId) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          isPro: true,
          stripeCustomerId: session.customer,
          subscriptionId: session.subscription,
        });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Webhook error' }),
    };
  }
};