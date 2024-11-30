import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  priceId: import.meta.env.VITE_STRIPE_PRICE_ID,
  successUrl: `${window.location.origin}/payment-success`,
  cancelUrl: `${window.location.origin}/pro`,
  productName: 'HealthChat Pro Subscription',
  productDescription: 'Monthly subscription to HealthChat Pro',
  currency: 'usd',
  amount: 3000, // $30.00
};

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise && STRIPE_CONFIG.publishableKey) {
    stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);
  }
  return stripePromise;
};

export { STRIPE_CONFIG };