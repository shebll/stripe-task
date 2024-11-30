import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise && import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export const STRIPE_CONFIG = {
  successUrl: `${window.location.origin}/payment-success`,
  cancelUrl: `${window.location.origin}/pro`,
  productName: 'HealthChat Pro Subscription',
  productDescription: 'Monthly subscription to HealthChat Pro',
  currency: 'usd',
  amount: 3000, // $30.00
};